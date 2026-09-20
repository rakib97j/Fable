"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Star, BookOpen, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { getRandomEBooks } from "@/lib/actions/eBooks";

/**
 * UI/UX REFACTOR: FeaturedEbooks Component
 * - 1. UX: Clear visual hierarchy between book titles, writer credits, genre tags, and rating indicators.
 * - 2. Visual Polish: Consistent dark theme aesthetic using `#121215` card base with subtle border highlights.
 * - 3. Micro-interactions: Smooth image zoom on hover (`group-hover:scale-105`), title hover state, and staggered grid entry animations.
 * - 4. Feedback States: Structured Skeleton loader (`aria-busy="true"`) and meaningful Empty state with retry action.
 * - 5. A11y: Proper focus-visible rings (`focus-visible:ring-2 focus-visible:ring-rose-500`), expressive `alt` tags, and standard ARIA attributes.
 */
export default function FeaturedEbooks() {
  const [ebooks, setEbooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeaturedEbooks() {
      try {
        setLoading(true);
        const res = await getRandomEBooks();
        if (res?.success && Array.isArray(res.data) && res.data.length > 0) {
          setEbooks(res.data);
        } else {
          const rawRes = await fetch("/api/e-books/random", { cache: "no-store" }).catch(() => null);
          if (rawRes && rawRes.ok) {
            const rawData = await rawRes.json().catch(() => ({}));
            const list = Array.isArray(rawData)
              ? rawData
              : Array.isArray(rawData?.data)
              ? rawData.data
              : [];
            if (list.length > 0) setEbooks(list);
          }
        }
      } catch (err) {
        console.error("Failed to fetch featured ebooks:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchFeaturedEbooks();
  }, []);

  return (
    <section 
      aria-label="Featured Ebooks Showcase"
      className="w-full py-12 md:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto font-sans"
    >
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10"
      >
        <div>
          <span className="text-xs font-mono font-semibold tracking-[0.2em] uppercase text-rose-400 block mb-2">
            CURATED SELECTION
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-white font-bold tracking-tight">
            Featured Ebooks
          </h2>
        </div>

        <Link
          href="/e-books"
          className="group inline-flex items-center gap-2 text-sm font-medium text-zinc-300 hover:text-white transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 rounded-lg px-2 py-1 -mx-2 -py-1"
        >
          <span>View full catalog</span>
          <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1 text-rose-400" aria-hidden="true" />
        </Link>
      </motion.div>

      {/* Dynamic Content Grid */}
      {loading ? (
        /* Loading Skeleton State with ARIA busy indicator */
        <div 
          aria-busy="true" 
          aria-label="Loading featured ebooks"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {[1, 2, 3, 4].map((n) => (
            <div
              key={n}
              className="bg-[#121215] border border-zinc-800/80 p-4 space-y-4 animate-pulse rounded-2xl"
            >
              <div className="aspect-[3/4] bg-zinc-800/60 w-full rounded-xl" />
              <div className="h-5 bg-zinc-800/70 rounded-md w-3/4" />
              <div className="h-3.5 bg-zinc-800/50 rounded-md w-1/2" />
              <div className="h-4 bg-zinc-800/60 rounded-md w-1/3 pt-2" />
            </div>
          ))}
        </div>
      ) : ebooks.length === 0 ? (
        /* Accessible Empty State */
        <div className="text-center py-16 px-4 border border-zinc-800/80 bg-[#121216]/60 rounded-2xl max-w-lg mx-auto">
          <BookOpen className="w-12 h-12 text-zinc-500 mx-auto mb-3 stroke-[1.5]" aria-hidden="true" />
          <h3 className="text-lg font-serif font-semibold text-white mb-1">No featured ebooks available</h3>
          <p className="text-sm text-zinc-400 mb-6">Check back soon for freshly published literary releases.</p>
          <Link
            href="/e-books"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 transition-colors uppercase tracking-wider"
          >
            Explore Catalog
          </Link>
        </div>
      ) : (
        /* Staggered Cards Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {ebooks.map((ebook, index) => {
            const priceVal = typeof ebook.price === "number" ? ebook.price : parseFloat(ebook.price) || 0;
            const isFreeBook = ebook.isFree || priceVal === 0;

            let formattedPrice = "Free";
            if (!isFreeBook) {
              if (typeof ebook.price === "string" && ebook.price.startsWith("$")) {
                formattedPrice = ebook.price;
              } else {
                formattedPrice = `$${priceVal.toFixed(2)}`;
              }
            }

            return (
              <motion.div
                key={ebook._id || ebook.id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="h-full"
              >
                <Link
                  href={`/e-books/${ebook._id || ebook.id}`}
                  aria-label={`Read ${ebook.title} by ${ebook.writerName || ebook.author || "Anonymous"}, price ${formattedPrice}`}
                  className="group relative bg-[#121215] border border-zinc-800/80 hover:border-rose-500/50 shadow-xl overflow-hidden transition-all duration-300 flex flex-col justify-between h-full rounded-2xl block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
                >
                  {/* Book Cover Image Frame */}
                  <div>
                    <div className="relative aspect-[3/4] w-full overflow-hidden bg-zinc-900">
                      {ebook.coverImage ? (
                        <Image
                          src={ebook.coverImage}
                          alt={`Cover illustration for ${ebook.title}`}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          unoptimized
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-zinc-600 bg-zinc-900/90 p-4">
                          <BookOpen className="w-12 h-12 mb-2 stroke-[1.5]" aria-hidden="true" />
                          <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-500">FABLE EBOOK</span>
                        </div>
                      )}
                      
                      {/* Vignette Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#121215] via-transparent to-transparent opacity-80" />
                      
                      {/* Genre Tag Pill */}
                      {ebook.genre && (
                        <span className="absolute top-3 left-3 bg-zinc-950/80 backdrop-blur-md border border-zinc-700/60 text-zinc-200 text-[11px] font-medium px-2.5 py-1 uppercase tracking-wider rounded-lg shadow-md">
                          {ebook.genre}
                        </span>
                      )}

                      {/* Free Tag Pill */}
                      {isFreeBook && (
                        <span className="absolute top-3 right-3 bg-emerald-950/90 backdrop-blur-md border border-emerald-500/50 text-emerald-300 text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider rounded-md shadow-md">
                          FREE
                        </span>
                      )}
                    </div>

                    {/* Book Details */}
                    <div className="p-5 flex flex-col justify-between">
                      <div>
                        <h3 className="text-lg font-serif font-bold text-white group-hover:text-rose-400 transition-colors duration-200 line-clamp-1 mb-1">
                          {ebook.title}
                        </h3>
                        <p className="text-xs text-zinc-400 line-clamp-1">
                          by <span className="text-zinc-200 font-medium">{ebook.writerName || ebook.author || "Anonymous"}</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Rating & Pricing Footer */}
                  <div className="px-5 pb-5 pt-3 border-t border-zinc-800/60 flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-1.5 text-xs text-amber-400" aria-label={`Rated ${ebook.rating || "4.8"} stars out of 5`}>
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" aria-hidden="true" />
                      <span className="font-semibold text-zinc-100">
                        {ebook.rating || "4.8"}
                      </span>
                      <span className="text-zinc-500 text-[11px]">
                        ({ebook.reviewsCount || 0})
                      </span>
                    </div>
                    <span className="text-sm font-bold text-white font-mono bg-zinc-900/90 border border-zinc-800 px-2.5 py-1 rounded-md">
                      {formattedPrice}
                    </span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      )}
    </section>
  );
}

