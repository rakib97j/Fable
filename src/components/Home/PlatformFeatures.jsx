"use client";

import React from "react";
import { BookOpen, Feather, Bookmark, ShieldCheck, Zap, Globe, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const FEATURES = [
  {
    icon: BookOpen,
    title: "Instant Digital Sanctuary",
    description: "Enjoy a distraction-free digital reading experience with customizable fonts, dark mode, and instant chapter navigation.",
    color: "text-rose-400",
    bgColor: "bg-rose-500/10 border-rose-500/20",
  },
  {
    icon: Feather,
    title: "Direct Author Empowerment",
    description: "Support independent authors directly. Writers keep maximum earnings with transparent sales tracking and direct payouts.",
    color: "text-amber-400",
    bgColor: "bg-amber-500/10 border-amber-500/20",
  },
  {
    icon: Bookmark,
    title: "Smart Bookmarks & Reading List",
    description: "Seamlessly save your favorite books, mark current reading positions, and organize your personal digital library.",
    color: "text-indigo-400",
    bgColor: "bg-indigo-500/10 border-indigo-500/20",
  },
  {
    icon: ShieldCheck,
    title: "Full Lifetime Access",
    description: "Once acquired, your e-books are permanently saved in your digital library with unlimited re-reads and full lifetime access.",
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10 border-emerald-500/20",
  },
];

export default function PlatformFeatures() {
  return (
    <section className="w-full py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-3xl mx-auto space-y-3 mb-12"
      >
        <span className="inline-flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-widest text-rose-400 bg-rose-500/10 px-3 py-1 border border-rose-500/20 rounded-none">
          <Sparkles className="w-3.5 h-3.5" />
          WHY CHOOSE FABLE
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white tracking-tight">
          Built for Readers &amp; Independent Writers
        </h2>
        <p className="text-sm sm:text-base text-zinc-400 font-normal">
          Fable connects passionate storytellers with dedicated readers through a sleek, modern digital publishing workspace.
        </p>
      </motion.div>

      {/* Grid of Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {FEATURES.map((feat, idx) => {
          const Icon = feat.icon;
          return (
            <motion.div
              key={feat.title}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="p-6 bg-[#121215] border border-zinc-800/80 hover:border-zinc-700 transition-colors duration-200 rounded-none space-y-4 group"
            >
              <div className={`p-3 rounded-none border ${feat.bgColor} ${feat.color} w-fit`}>
                <Icon className="w-6 h-6" />
              </div>

              <h3 className="text-xl font-serif font-semibold text-white group-hover:text-rose-400 transition-colors">
                {feat.title}
              </h3>

              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-normal">
                {feat.description}
              </p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
