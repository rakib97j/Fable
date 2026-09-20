"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1.0],
    },
  },
};

/**
 * Dynamic Ebook Genres Component
 * Clicking any genre card dynamically navigates to /e-books with the selected genre filter query parameter.
 */
export default function EbookGenres() {
  const genres = [
    {
      id: "fiction",
      title: "Fiction",
      query: "Fiction",
      tag: "EXPLORE",
      image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1000&auto=format&fit=crop",
      bgGradient: "from-amber-950/90 to-transparent",
      accentTag: "text-amber-400",
    },
    {
      id: "mystery",
      title: "Mystery",
      query: "Mystery",
      tag: "EXPLORE",
      image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=1000&auto=format&fit=crop",
      bgGradient: "from-emerald-950/90 to-transparent",
      accentTag: "text-emerald-400",
    },
    {
      id: "romance",
      title: "Romance",
      query: "Romance",
      tag: "EXPLORE",
      image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1000&auto=format&fit=crop",
      bgGradient: "from-rose-950/90 to-transparent",
      accentTag: "text-rose-400",
    },
    {
      id: "space",
      title: "Sci-Fi & Space",
      query: "Science Fiction",
      tag: "EXPLORE",
      image: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=1000&auto=format&fit=crop",
      bgGradient: "from-blue-950/90 to-transparent",
      accentTag: "text-blue-400",
    },
    {
      id: "fantasy",
      title: "Fantasy",
      query: "Fantasy",
      tag: "EXPLORE",
      image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=1000&auto=format&fit=crop",
      bgGradient: "from-violet-950/90 to-transparent",
      accentTag: "text-violet-400",
    },
    {
      id: "horror",
      title: "Horror",
      query: "Horror",
      tag: "EXPLORE",
      image: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=1000&auto=format&fit=crop",
      bgGradient: "from-red-950/90 to-transparent",
      accentTag: "text-red-500",
    },
  ];

  return (
    <section 
      aria-label="Browse Ebook Genres" 
      className="w-full py-12 md:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto font-sans"
    >
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6 }}
        className="flex items-center justify-between mb-8"
      >
        <div className="flex items-center gap-2.5">
          <Sparkles className="w-5 h-5 text-rose-600 dark:text-rose-400" aria-hidden="true" />
          <h2 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Ebook Genres
          </h2>
        </div>

        <Link
          href="/e-books"
          className="group inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-rose-400 hover:text-rose-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 rounded-md px-2 py-1"
        >
          <span>View All Categories</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
        </Link>
      </motion.div>

      {/* Dynamic Staggered Grid Container */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="grid grid-cols-1 md:grid-cols-12 gap-4"
      >
        {/* Fiction Card (Large Left Feature) */}
        <motion.div variants={itemVariants} className="md:col-span-6 flex">
          <Link
            href={`/e-books?genre=${encodeURIComponent(genres[0].query)}`}
            aria-label={`Explore ${genres[0].title} Ebooks`}
            className="group relative w-full h-[400px] md:h-full min-h-[420px] overflow-hidden bg-zinc-900 border-2 border-zinc-800/80 hover:border-amber-500/60 shadow-xl transition-all duration-300 rounded-2xl cursor-pointer block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
          >
            <Image
              src={genres[0].image}
              alt={`Illustration for ${genres[0].title} category`}
              fill
              className="object-cover opacity-85 group-hover:scale-105 group-hover:opacity-95 transition-all duration-500"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
            <div className={`absolute inset-0 bg-gradient-to-t ${genres[0].bgGradient}`} />
            <div className="absolute bottom-5 left-5 right-5 flex flex-col items-start">
              <span className={`text-[10px] font-mono font-bold tracking-widest uppercase mb-1 ${genres[0].accentTag} bg-zinc-950/70 backdrop-blur-md px-2.5 py-1 rounded-md border border-zinc-800`}>
                {genres[0].tag}
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-wide group-hover:text-amber-300 transition-colors flex items-center gap-2">
                {genres[0].title}
                <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" aria-hidden="true" />
              </h3>
            </div>
          </Link>
        </motion.div>

        {/* Right Grid Column: Mystery, Romance, Sci-Fi */}
        <div className="md:col-span-6 flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Mystery */}
            <motion.div variants={itemVariants}>
              <Link
                href={`/e-books?genre=${encodeURIComponent(genres[1].query)}`}
                aria-label={`Explore ${genres[1].title} Ebooks`}
                className="group relative w-full h-[195px] overflow-hidden bg-zinc-900 border-2 border-zinc-800/80 hover:border-emerald-500/60 shadow-lg transition-all duration-300 rounded-2xl cursor-pointer block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
              >
                <Image
                  src={genres[1].image}
                  alt={`Illustration for ${genres[1].title} category`}
                  fill
                  className="object-cover opacity-85 group-hover:scale-105 group-hover:opacity-95 transition-all duration-500"
                  sizes="(max-width: 640px) 100vw, 25vw"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${genres[1].bgGradient}`} />
                <div className="absolute bottom-4 left-4 right-4 flex flex-col items-start">
                  <span className={`text-[10px] font-mono font-bold tracking-widest uppercase mb-0.5 ${genres[1].accentTag} bg-zinc-950/70 backdrop-blur-md px-2 py-0.5 rounded-md border border-zinc-800`}>
                    {genres[1].tag}
                  </span>
                  <h3 className="text-xl font-serif font-bold text-white tracking-wide group-hover:text-emerald-300 transition-colors flex items-center gap-1.5">
                    {genres[1].title}
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all -translate-x-1 group-hover:translate-x-0" aria-hidden="true" />
                  </h3>
                </div>
              </Link>
            </motion.div>

            {/* Romance */}
            <motion.div variants={itemVariants}>
              <Link
                href={`/e-books?genre=${encodeURIComponent(genres[2].query)}`}
                aria-label={`Explore ${genres[2].title} Ebooks`}
                className="group relative w-full h-[195px] overflow-hidden bg-zinc-900 border-2 border-zinc-800/80 hover:border-rose-500/60 shadow-lg transition-all duration-300 rounded-2xl cursor-pointer block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
              >
                <Image
                  src={genres[2].image}
                  alt={`Illustration for ${genres[2].title} category`}
                  fill
                  className="object-cover opacity-85 group-hover:scale-105 group-hover:opacity-95 transition-all duration-500"
                  sizes="(max-width: 640px) 100vw, 25vw"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${genres[2].bgGradient}`} />
                <div className="absolute bottom-4 left-4 right-4 flex flex-col items-start">
                  <span className={`text-[10px] font-mono font-bold tracking-widest uppercase mb-0.5 ${genres[2].accentTag} bg-zinc-950/70 backdrop-blur-md px-2 py-0.5 rounded-md border border-zinc-800`}>
                    {genres[2].tag}
                  </span>
                  <h3 className="text-xl font-serif font-bold text-white tracking-wide group-hover:text-rose-300 transition-colors flex items-center gap-1.5">
                    {genres[2].title}
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all -translate-x-1 group-hover:translate-x-0" aria-hidden="true" />
                  </h3>
                </div>
              </Link>
            </motion.div>
          </div>

          {/* Sci-Fi & Space (Wide Card) */}
          <motion.div variants={itemVariants}>
            <Link
              href={`/e-books?genre=${encodeURIComponent(genres[3].query)}`}
              aria-label={`Explore ${genres[3].title} Ebooks`}
              className="group relative w-full h-[210px] overflow-hidden bg-zinc-900 border-2 border-zinc-800/80 hover:border-blue-500/60 shadow-lg transition-all duration-300 rounded-2xl cursor-pointer block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
            >
              <Image
                src={genres[3].image}
                alt={`Illustration for ${genres[3].title} category`}
                fill
                className="object-cover opacity-85 group-hover:scale-105 group-hover:opacity-95 transition-all duration-500"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className={`absolute inset-0 bg-gradient-to-t ${genres[3].bgGradient}`} />
              <div className="absolute bottom-4 left-4 right-4 flex flex-col items-start">
                <span className={`text-[10px] font-mono font-bold tracking-widest uppercase mb-0.5 ${genres[3].accentTag} bg-zinc-950/70 backdrop-blur-md px-2 py-0.5 rounded-md border border-zinc-800`}>
                  {genres[3].tag}
                </span>
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-wide group-hover:text-blue-300 transition-colors flex items-center gap-2">
                  {genres[3].title}
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all -translate-x-1 group-hover:translate-x-0" aria-hidden="true" />
                </h3>
              </div>
            </Link>
          </motion.div>
        </div>

        {/* Bottom Grid Column: Fantasy & Horror */}
        <div className="md:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Fantasy */}
          <motion.div variants={itemVariants}>
            <Link
              href={`/e-books?genre=${encodeURIComponent(genres[4].query)}`}
              aria-label={`Explore ${genres[4].title} Ebooks`}
              className="group relative w-full h-[195px] overflow-hidden bg-zinc-900 border-2 border-zinc-800/80 hover:border-violet-500/60 shadow-lg transition-all duration-300 rounded-2xl cursor-pointer block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
            >
              <Image
                src={genres[4].image}
                alt={`Illustration for ${genres[4].title} category`}
                fill
                className="object-cover opacity-85 group-hover:scale-105 group-hover:opacity-95 transition-all duration-500"
                sizes="(max-width: 640px) 100vw, 25vw"
              />
              <div className={`absolute inset-0 bg-gradient-to-t ${genres[4].bgGradient}`} />
              <div className="absolute bottom-4 left-4 right-4 flex flex-col items-start">
                <span className={`text-[10px] font-mono font-bold tracking-widest uppercase mb-0.5 ${genres[4].accentTag} bg-zinc-950/70 backdrop-blur-md px-2 py-0.5 rounded-md border border-zinc-800`}>
                  {genres[4].tag}
                </span>
                <h3 className="text-xl font-serif font-bold text-white tracking-wide group-hover:text-violet-300 transition-colors flex items-center gap-1.5">
                  {genres[4].title}
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all -translate-x-1 group-hover:translate-x-0" aria-hidden="true" />
                </h3>
              </div>
            </Link>
          </motion.div>

          {/* Horror */}
          <motion.div variants={itemVariants}>
            <Link
              href={`/e-books?genre=${encodeURIComponent(genres[5].query)}`}
              aria-label={`Explore ${genres[5].title} Ebooks`}
              className="group relative w-full h-[195px] overflow-hidden bg-zinc-900 border-2 border-zinc-800/80 hover:border-red-500/60 shadow-lg transition-all duration-300 rounded-2xl cursor-pointer block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
            >
              <Image
                src={genres[5].image}
                alt={`Illustration for ${genres[5].title} category`}
                fill
                className="object-cover opacity-85 group-hover:scale-105 group-hover:opacity-95 transition-all duration-500"
                sizes="(max-width: 640px) 100vw, 25vw"
              />
              <div className={`absolute inset-0 bg-gradient-to-t ${genres[5].bgGradient}`} />
              <div className="absolute bottom-4 left-4 right-4 flex flex-col items-start">
                <span className={`text-[10px] font-mono font-bold tracking-widest uppercase mb-0.5 ${genres[5].accentTag} bg-zinc-950/70 backdrop-blur-md px-2 py-0.5 rounded-md border border-zinc-800`}>
                  {genres[5].tag}
                </span>
                <h3 className="text-xl font-serif font-bold text-white tracking-wide group-hover:text-red-400 transition-colors flex items-center gap-1.5">
                  {genres[5].title}
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all -translate-x-1 group-hover:translate-x-0" aria-hidden="true" />
                </h3>
              </div>
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

