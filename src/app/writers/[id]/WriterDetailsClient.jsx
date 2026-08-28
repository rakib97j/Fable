"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  
  User,
  BookOpen,
  ArrowLeft,
  Mail,
  
  BookMarked,
  
  ArrowRight,
} from "lucide-react";
import { getWriterDetails } from "@/lib/actions/userAction";
import { getEBooksByWriter, getEBooks } from "@/lib/actions/eBooks";

export default function WriterDetailsClient({ writerId }) {
  const [writer, setWriter] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadWriter() {
      if (!writerId) return;
      setIsLoading(true);
      try {
        const [res, writerBooksRes, allEbooksRes] = await Promise.all([
          getWriterDetails(writerId),
          getEBooksByWriter(writerId),
          getEBooks()
        ]);

        if (res?.success && res.data) {
          const writerData = res.data;
          const initialBooks = Array.isArray(writerData.publishedBooks) ? writerData.publishedBooks : [];
          
          const writerBooks = writerBooksRes?.success && Array.isArray(writerBooksRes.data) ? writerBooksRes.data : [];
          const allEbooks = allEbooksRes?.success && Array.isArray(allEbooksRes.data) ? allEbooksRes.data : [];

          const wId = String(writerData._id || writerData.id || writerId || "");
          const wEmail = (writerData.email || "").toLowerCase();
          const wName = (writerData.name || "").toLowerCase();

          const matchingAllEbooks = allEbooks.filter((b) => {
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

          // Merge all published books avoiding duplicates
          const booksMap = new Map();
          [...initialBooks, ...writerBooks, ...matchingAllEbooks].forEach((book) => {
            const status = (book.status || "published").toLowerCase();
            if (status !== "pending" && status !== "unpublished") {
              const bKey = String(book._id || book.id || book.title);
              if (!booksMap.has(bKey)) {
                booksMap.set(bKey, book);
              }
            }
          });

          setWriter({
            ...writerData,
            publishedBooks: Array.from(booksMap.values())
          });
        } else {
          setError(res?.message || "Writer not found.");
        }
      } catch (err) {
        console.error("Error loading writer details:", err);
        setError("Failed to load writer profile.");
      } finally {
        setIsLoading(false);
      }
    }
    loadWriter();
  }, [writerId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0c] text-white py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium text-zinc-400">Loading writer profile...</p>
        </div>
      </div>
    );
  }

  if (error || !writer) {
    return (
      <div className="min-h-screen bg-[#0a0a0c] text-white py-16 px-4 sm:px-6 lg:px-8 font-sans">
        <div className="max-w-2xl mx-auto text-center space-y-6 bg-[#121216] p-10 rounded-2xl border border-zinc-800/80">
          <User className="w-16 h-16 text-zinc-600 mx-auto" />
          <h1 className="text-2xl sm:text-3xl font-serif text-zinc-200">Writer Not Found</h1>
          <p className="text-zinc-400 text-sm">{error || "The author profile you are looking for does not exist."}</p>
          <Link
            href="/writers"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-sm font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>View All Writers</span>
          </Link>
        </div>
      </div>
    );
  }

  const avatarUrl = writer.image || writer.avatar;
  const writerName = writer.name || "Emerging Author";
  const publishedBooks = Array.isArray(writer.publishedBooks) ? writer.publishedBooks : [];

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white py-12 px-4 sm:px-6 lg:px-8 font-sans selection:bg-rose-500 selection:text-white">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Back Navigation */}
        <Link
          href="/writers"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-rose-500 hover:text-rose-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Writers</span>
        </Link>

        {/* Writer Header Banner */}
        <div className="relative bg-[#121216] border border-zinc-800/80 rounded-none p-8 sm:p-10 overflow-hidden shadow-2xl">
          {/* Subtle Accent Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-rose-600/10 rounded-none blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8 text-center md:text-left">
            {/* Writer Avatar */}
            {avatarUrl ? (
              <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-none overflow-hidden border-2 border-rose-500/40 shadow-2xl shrink-0">
                <Image
                  src={avatarUrl}
                  alt={writerName}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            ) : (
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-none bg-linear-to-tr from-pink-500 via-rose-500 to-amber-400 shadow-2xl flex items-center justify-center text-white shrink-0">
                <User className="w-16 h-16 opacity-90" />
              </div>
            )}

            {/* Writer Meta Details */}
            <div className="space-y-4 flex-1">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                <span className="text-xs font-semibold px-3 py-1 rounded-none bg-rose-500/10 text-rose-400 border border-rose-500/20 uppercase tracking-wider">
                  Official Writer
                </span>
                <span className="text-xs text-zinc-500 font-mono">
                  ID: {String(writer._id || writer.id || "").slice(0, 12)}...
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-semibold tracking-tight text-white">
                {writerName}
              </h1>

              {writer.email && (
                <div className="flex items-center justify-center md:justify-start gap-2 text-sm text-zinc-400">
                  <Mail className="w-4 h-4 text-rose-400" />
                  <span>{writer.email}</span>
                </div>
              )}

              {/* Stats Bar */}
              <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-6 border-t border-zinc-800/80">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-rose-500" />
                  <span className="text-sm text-zinc-300 font-medium">
                    <strong className="text-white text-base font-semibold mr-1">
                      {publishedBooks.length}
                    </strong>
                    Published E-Books
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section: Published E-Books by Writer */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
            <div className="flex items-center gap-3">
              <BookMarked className="w-6 h-6 text-rose-500" />
              <h2 className="text-2xl sm:text-3xl font-serif text-white tracking-tight">
                Published Books by {writerName}
              </h2>
            </div>
            <span className="text-xs font-mono text-zinc-500">
              {publishedBooks.length} Total
            </span>
          </div>

          {publishedBooks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {publishedBooks.map((book) => {
                const bookId = String(book._id || book.id || "");
                const cover = book.coverImage || book.image || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=600";
                const priceVal = typeof book.price === "number" ? book.price : parseFloat(book.price) || 0;

                return (
                  <div
                    key={bookId}
                    className="group bg-[#121216] border border-zinc-800/80 hover:border-rose-500/60 rounded-none overflow-hidden hover:shadow-[0_10px_30px_-10px_rgba(248,59,96,0.25)] transition-all duration-300 flex flex-col justify-between"
                  >
                    {/* Book Cover Image */}
                    <div className="relative w-full h-64 bg-zinc-900 overflow-hidden">
                      <Image
                        src={cover}
                        alt={book.title || "Book Cover"}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-[#121216] via-transparent to-transparent opacity-80" />

                      {book.genre && (
                        <span className="absolute top-3 left-3 bg-zinc-950/80 backdrop-blur-md border border-zinc-700 text-rose-400 text-[11px] font-semibold px-2.5 py-1 rounded-none uppercase tracking-wider">
                          {book.genre}
                        </span>
                      )}
                    </div>

                    {/* Book Meta & Footer Link */}
                    <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                      <div className="space-y-2">
                        <h3 className="text-lg font-serif font-medium text-white group-hover:text-rose-400 transition-colors line-clamp-1">
                          {book.title || "Untitled Story"}
                        </h3>
                        {book.description && (
                          <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                            {book.description}
                          </p>
                        )}
                      </div>

                      <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between">
                        <span className="text-sm font-semibold text-white">
                          {priceVal === 0 ? (
                            <span className="text-emerald-400 font-mono">FREE</span>
                          ) : (
                            <span className="font-mono text-rose-400">${priceVal.toFixed(2)}</span>
                          )}
                        </span>

                        <Link
                          href={`/e-books/${bookId}`}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-400 hover:text-rose-300 transition-colors"
                        >
                          <span>View Details</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 bg-[#121216] border border-zinc-800/80 rounded-none space-y-3">
              <BookOpen className="w-12 h-12 text-zinc-600 mx-auto" />
              <h3 className="text-lg font-serif text-zinc-300">No Published Books Yet</h3>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                {writerName} has not published any e-books on Fable yet. Check back soon for new releases!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
