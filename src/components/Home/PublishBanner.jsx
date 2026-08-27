"use client";

import React from "react";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import { motion } from "framer-motion";

export default function PublishBanner() {
  return (
    <section className="w-full py-12 md:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto font-sans">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden bg-[#121215] border border-zinc-800/80 p-8 sm:p-10 md:p-12 shadow-2xl transition-all duration-300 rounded-none"
      >
        {/* Soft top-left red glow effect */}
        <div 
          className="absolute -top-20 -left-20 w-80 h-80 bg-rose-600/10 rounded-none blur-3xl pointer-events-none" 
          aria-hidden="true" 
        />
        <div 
          className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-rose-500/10 via-transparent to-transparent pointer-events-none" 
          aria-hidden="true" 
        />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 sm:gap-8">
          <div className="max-w-2xl">
            {/* Book Icon */}
            <div className="mb-4 text-[#f83b60]">
              <BookOpen className="w-8 h-8 stroke-[1.8]" />
            </div>

            {/* Title */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-white tracking-tight mb-3">
              Ready to publish your story?
            </h2>

            {/* Description */}
            <p className="text-zinc-400 text-sm sm:text-base md:text-lg leading-relaxed font-normal">
              Join Fable as a writer and reach readers across the globe. Your first draft awaits.
            </p>
          </div>

          {/* Action Button with Spring Hover & Tap Scaling */}
          <div className="shrink-0 pt-2 md:pt-0">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Link
                href="/dashboard/writer/add-ebook"
                className="inline-flex items-center justify-center px-6 py-3.5 bg-[#f83b60] hover:bg-[#e02e52] active:bg-[#c92444] text-white font-semibold text-sm transition-all duration-200 shadow-lg shadow-rose-950/30 rounded-none uppercase tracking-wider cursor-pointer"
              >
                Start Writing Today
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
