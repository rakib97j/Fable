"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Feather, User, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { getRandomWriters } from "@/lib/actions/userAction";

export default function TopWriters() {
  const [writers, setWriters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchTopWriters() {
      try {
        setIsLoading(true);
        const res = await getRandomWriters();
        if (res?.success && Array.isArray(res.data) && res.data.length > 0) {
          setWriters(res.data);
        }
      } catch (err) {
        console.error("Error fetching top writers:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchTopWriters();
  }, []);

  return (
    <section className="w-full py-10 md:py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto font-sans">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="flex items-center justify-between mb-8"
      >
        <div className="flex items-center gap-3">
          <div className="text-[#f83b60]">
            <Feather className="w-7 h-7 sm:w-8 sm:h-8 stroke-[1.8] -rotate-45" />
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-4xl font-serif text-white tracking-tight font-normal">
            Top Writers
          </h2>
        </div>

        <Link
          href="/writers"
          className="group flex items-center gap-2 text-sm font-medium text-rose-500 hover:text-rose-400 transition-colors"
        >
          <span>View All Writers</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </motion.div>

      {/* Grid of Writer Cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((idx) => (
            <div
              key={idx}
              className="bg-[#121215] p-7 sm:p-8 border border-zinc-800/80 rounded-none animate-pulse min-h-55 flex flex-col justify-between"
            >
              <div className="w-16 h-16 rounded-full bg-zinc-800 mb-6" />
              <div className="space-y-3">
                <div className="h-3 bg-zinc-800 rounded-none w-1/3" />
                <div className="h-6 bg-zinc-800 rounded-none w-2/3" />
                <div className="h-4 bg-zinc-800 rounded-none w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : writers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {writers.map((writer, index) => {
            const avatarUrl = writer.image || writer.avatar;
            const rankStr = `#0${index + 1}`;
            const writerName = writer.name || "Emerging Writer";
            const writerId = writer._id || writer.id;

            return (
              <motion.div
                key={writerId || index}
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: index * 0.12 }}
                whileHover={{ y: -4 }}
              >
                <Link
                  href={writerId ? `/writers/${writerId}` : "/writers"}
                  className="group relative bg-[#121215] p-7 sm:p-8 border border-zinc-800/80 hover:border-rose-600/60 hover:shadow-[0_10px_30px_-10px_rgba(248,59,96,0.25)] transition-all duration-300 flex flex-col justify-between min-h-55 rounded-none block h-full"
                >
                  {/* Top Row: Avatar / Image */}
                  <div className="mb-6">
                    {avatarUrl ? (
                      <div className="relative w-16 h-16 rounded-full overflow-hidden border border-zinc-700 shadow-md group-hover:scale-105 transition-transform duration-300">
                        <Image
                          src={avatarUrl}
                          alt={writerName}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-linear-to-tr from-pink-400 via-rose-500 to-amber-400 shadow-md flex items-center justify-center text-white group-hover:scale-105 transition-transform duration-300">
                        <User className="w-8 h-8 opacity-90" />
                      </div>
                    )}
                  </div>

                  {/* Writer Information */}
                  <div>
                    {/* Rank & Role Tag */}
                    <div className="text-xs font-mono font-medium text-zinc-500 tracking-wider uppercase mb-2">
                      {rankStr} · WRITER
                    </div>

                    {/* Writer Name */}
                    <h3 className="text-2xl font-serif font-normal text-white group-hover:text-rose-400 transition-colors duration-200 mb-2 tracking-tight">
                      {writerName}
                    </h3>

                    {/* Dynamic Published Count */}
                    <p className="text-sm text-zinc-400 font-normal">
                      {writer.publishedCount || 0} published
                    </p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8 text-zinc-500">
          No writers found.
        </div>
      )}
    </section>
  );
}
