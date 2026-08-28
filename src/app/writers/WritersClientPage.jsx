"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Feather, User, Search,  ArrowLeft } from "lucide-react";
import { getAllWriters } from "@/lib/actions/userAction";
import { getEBooks } from "@/lib/actions/eBooks";

export default function WritersClientPage() {
  const [writers, setWriters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function loadWriters() {
      try {
        const [writersRes, ebooksRes] = await Promise.all([
          getAllWriters(),
          getEBooks(),
        ]);

        const allEbooks =
          ebooksRes?.success && Array.isArray(ebooksRes.data)
            ? ebooksRes.data
            : [];

        if (writersRes?.success && Array.isArray(writersRes.data)) {
          const writersWithCount = writersRes.data.map((w) => {
            const wId = String(w._id || w.id || "");
            const wEmail = (w.email || "").toLowerCase();
            const wName = (w.name || "").toLowerCase();

            const matchingBooks = allEbooks.filter((b) => {
              const bStatus = (b.status || "published").toLowerCase();
              if (bStatus === "pending" || bStatus === "unpublished") return false;

              const bWriterId = String(b.writerId || b.authorId || "");
              const bWriterEmail = (b.writerEmail || "").toLowerCase();
              const bWriterName = (b.writerName || b.author || "").toLowerCase();

              const matchId = Boolean(wId && bWriterId && wId === bWriterId);
              const matchEmail = Boolean(wEmail && bWriterEmail && wEmail === bWriterEmail);
              const matchName = Boolean(wName && bWriterName && wName === bWriterName);

              return matchId || matchEmail || matchName;
            });

            const publishedCount = Math.max(
              w.publishedCount || 0,
              Array.isArray(w.publishedBooks) ? w.publishedBooks.length : 0,
              matchingBooks.length
            );

            return {
              ...w,
              publishedCount,
            };
          });

          setWriters(writersWithCount);
        }
      } catch (error) {
        console.error("Failed to load writers:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadWriters();
  }, []);

  const filteredWriters = writers.filter((w) => {
    const name = w.name || "";
    const email = w.email || "";
    const q = searchQuery.toLowerCase();
    return name.toLowerCase().includes(q) || email.toLowerCase().includes(q);
  });

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white py-12 px-4 sm:px-6 lg:px-8 font-sans selection:bg-rose-500 selection:text-white">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Back navigation & Header */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-rose-500 hover:text-rose-400 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>

              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-zinc-800/80">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-none bg-rose-500/10 text-rose-500 border border-rose-500/20">
                  <Feather className="w-6 h-6 stroke-[1.8] -rotate-45" />
                </div>
                <p className="text-xs font-semibold tracking-[0.2em] text-rose-500 uppercase">
                  MEET THE CREATORS
                </p>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-medium tracking-tight text-white">
                Fable Writers & Authors
              </h1>
              <p className="text-zinc-400 max-w-xl text-sm sm:text-base leading-relaxed">
                Discover independent authors, emerging storytellers, and creative minds sharing their original works on Fable.
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                placeholder="Search writers by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#121216] border border-zinc-800/90 pl-10 pr-4 py-3 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-rose-500/80 focus:ring-2 focus:ring-rose-500/20 transition-all rounded-none"
              />
            </div>
          </div>
        </div>

        {/* Grid of All Writers */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((idx) => (
              <div
                key={idx}
                className="bg-[#121216] p-8 border border-zinc-800/80 rounded-none animate-pulse min-h-60 flex flex-col justify-between"
              >
                <div className="w-16 h-16 rounded-none bg-zinc-800 mb-6" />
                <div className="space-y-3">
                  <div className="h-3 bg-zinc-800 rounded-none w-1/3" />
                  <div className="h-6 bg-zinc-800 rounded-none w-2/3" />
                  <div className="h-4 bg-zinc-800 rounded-none w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredWriters.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWriters.map((writer, index) => {
              const avatarUrl = writer.image || writer.avatar;
              const rankStr = `#0${index + 1}`;
              const writerName = writer.name || "Emerging Writer";
              const writerId = writer._id || writer.id;

              return (
                <Link
                  key={writerId || index}
                  href={writerId ? `/writers/${writerId}` : "/writers"}
                  className="group relative bg-[#121216] p-7 sm:p-8 rounded-none border border-zinc-800/80 hover:border-rose-500/60 hover:shadow-[0_12px_35px_-10px_rgba(248,59,96,0.2)] transition-all duration-300 flex flex-col justify-between min-h-60 "
                >
                  {/* Avatar / Photo */}
                  <div className="flex items-start justify-between mb-6">
                    {avatarUrl ? (
                      <div className="relative w-16 h-16 rounded-none overflow-hidden border border-zinc-700 shadow-md group-hover:scale-105 transition-transform duration-300">
                        <Image
                          src={avatarUrl}
                          alt={writerName}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded-none bg-linear-to-tr from-pink-500 via-rose-500 to-amber-400 shadow-md flex items-center justify-center text-white group-hover:scale-105 transition-transform duration-300">
                        <User className="w-8 h-8 opacity-90" />
                      </div>
                    )}

                    <span className="text-[10px] font-semibold px-2.5 py-1 rounded-none bg-rose-500/10 text-rose-400 border border-rose-500/20 uppercase tracking-wider">
                      Writer
                    </span>
                  </div>

                  {/* Information */}
                  <div>
                    <div className="text-xs font-mono font-medium text-zinc-500 tracking-wider uppercase mb-1.5">
                      {rankStr} AUTHOR
                    </div>

                    <h3 className="text-2xl font-serif font-normal text-zinc-100 group-hover:text-rose-400 transition-colors duration-200 mb-2 tracking-tight">
                      {writerName}
                    </h3>

                    {writer.email && (
                      <p className="text-xs text-zinc-500 truncate mb-3">
                        {writer.email}
                      </p>
                    )}

                    <p className="text-sm text-zinc-400 font-normal">
                      {writer.publishedCount || 0} published
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 bg-[#121216] border border-zinc-800/80 rounded-none">
            <User className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
            <h3 className="text-xl font-serif text-zinc-300 font-medium">No Writers Found</h3>
            <p className="text-sm text-zinc-500 mt-1 max-w-sm mx-auto">
              {searchQuery ? `No authors matching "${searchQuery}"` : "There are currently no registered writers available."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
