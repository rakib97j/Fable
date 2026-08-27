"use client";

import React from "react";
import Image from "next/image";
import { Star, Quote, MessageSquareQuote } from "lucide-react";
import { motion } from "framer-motion";

const TESTIMONIALS = [
  {
    quote: "Fable has transformed how I read indie ebooks. The typography, bookmarking, and instant access make it my favorite reading sanctuary.",
    name: "Clara Vance",
    role: "Avid Reader & Collector",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
    rating: 5,
  },
  {
    quote: "Publishing my fantasy novella on Fable was seamless. Tracking real-time sales history and connecting directly with my readers has been incredible.",
    name: "Julian Thorne",
    role: "Fantasy Author",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
    rating: 5,
  },
  {
    quote: "The clean dark aesthetic and sharp layout are stunning. It feels like a high-end digital gallery for books and authors.",
    name: "Elena Rostova",
    role: "Technical Writer & Critic",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=200&auto=format&fit=crop",
    rating: 5,
  },
];

export default function TestimonialsSection() {
  return (
    <section className="w-full py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12"
      >
        <div>
          <span className="text-xs font-mono font-semibold tracking-[0.2em] uppercase text-zinc-400 block mb-2">
            COMMUNITY VOICES
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-white font-normal tracking-tight flex items-center gap-3">
            <MessageSquareQuote className="w-8 h-8 text-rose-500" />
            Loved by Readers &amp; Authors
          </h2>
        </div>

        <p className="text-xs sm:text-sm text-zinc-400 max-w-md">
          Hear what our community has to say about their experience reading and publishing on Fable.
        </p>
      </motion.div>

      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {TESTIMONIALS.map((t, idx) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.12 }}
            className="p-7 bg-[#121215] border border-zinc-800/80 hover:border-rose-500/40 transition-colors duration-200 rounded-none flex flex-col justify-between space-y-6 group"
          >
            <div className="space-y-4">
              {/* Star Rating */}
              <div className="flex items-center gap-1 text-amber-400">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>

              {/* Quote Text */}
              <p className="text-sm sm:text-base text-zinc-300 font-serif italic leading-relaxed">
                "{t.quote}"
              </p>
            </div>

            {/* Author / Reader Info */}
            <div className="flex items-center gap-3 pt-4 border-t border-zinc-800/60">
              <div className="relative w-11 h-11 rounded-full overflow-hidden border border-zinc-700 shrink-0">
                <Image
                  src={t.avatar}
                  alt={t.name}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white group-hover:text-rose-400 transition-colors">
                  {t.name}
                </h4>
                <p className="text-xs text-zinc-400 font-mono">{t.role}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
