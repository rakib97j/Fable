"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Star, BookOpen } from "lucide-react";
import { getRandomEBooks } from "@/lib/actions/eBooks";

export default function FeaturedEbooks() {
  const [ebooks, setEbooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeaturedEbooks() {
      try {
        setLoading(true);
        const res = await getRandomEBooks();
        if (res?.success && Array.isArray(res.data)) {
          setEbooks(res.data);
        } else {
          // Fallback direct client fetch to /api/e-books/random
          const rawRes = await fetch("/api/e-books/random", { cache: "no-store" });
          if (rawRes.ok) {
            const rawData = await rawRes.json();
            const list = Array.isArray(rawData)
              ? rawData
              : Array.isArray(rawData?.data)
              ? rawData.data
              : [];
            setEbooks(list);
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
    <section className="w-full py-12 md:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10">
        <div>
          <span className="text-xs font-semibold tracking-[0.2em] uppercase text-zinc-400 block mb-2 font-mono">
            CURATED FOR YOU
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-white font-normal tracking-tight">
            Featured Ebooks
          </h2>
        </div>

        <Link
          href="/e-books"
          className="group inline-flex items-center gap-1.5 text-sm font-medium text-zinc-400 hover:text-white transition-colors duration-200"
        >
          View all
          <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
        </Link>
      </div>

      {/* Content Grid */}
      {loading ? (
        /* Loading Skeleton */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((n) => (
            <div
              key={n}
              className="bg-[#121215] border border-zinc-800/60 p-4 space-y-4 animate-pulse rounded-sm"
            >
              <div className="aspect-3/4 bg-zinc-800/50 w-full rounded-sm" />
              <div className="h-4 bg-zinc-800/60 rounded w-3/4" />
              <div className="h-3 bg-zinc-800/40 rounded w-1/2" />
              <div className="h-4 bg-zinc-800/60 rounded w-1/3 pt-2" />
            </div>
          ))}
        </div>
      ) : ebooks.length === 0 ? (
        /* Empty State */
        <div className="text-center py-12 border border-zinc-800/60 bg-[#121216]/50 rounded-sm">
          <BookOpen className="w-10 h-10 text-zinc-600 mx-auto mb-3 stroke-[1.5]" />
          <p className="text-sm text-zinc-400">No featured ebooks available at the moment.</p>
        </div>
      ) : (
        /* Grid of Dynamic Ebooks */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {ebooks.map((ebook) => {
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
              <div
                key={ebook._id || ebook.id}
                className="group relative bg-[#121215] border border-zinc-800/80 overflow-hidden hover:border-zinc-700 transition-all duration-300 flex flex-col justify-between"
              >
                {/* Cover Image Container */}
                <div>
                  <div className="relative aspect-3/4 w-full overflow-hidden bg-zinc-900">
                    {ebook.coverImage ? (
                      <Image
                        src={ebook.coverImage}
                        alt={ebook.title || "Ebook Cover"}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-zinc-700 bg-zinc-900/80 p-4">
                        <BookOpen className="w-12 h-12 mb-2 stroke-[1.5]" />
                        <span className="text-xs font-mono">FABLE EBOOK</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-linear-to-t from-[#121215] via-transparent to-transparent opacity-60" />
                    
                    {/* Genre Badge */}
                    {ebook.genre && (
                      <span className="absolute top-3 left-3 bg-zinc-900/80 backdrop-blur-md border border-zinc-700/60 text-zinc-300 text-[11px] font-medium px-2.5 py-1 uppercase tracking-wider">
                        {ebook.genre}
                      </span>
                    )}

                    {/* Free Badge */}
                    {isFreeBook && (
                      <span className="absolute top-3 right-3 bg-emerald-950/90 backdrop-blur-md border border-emerald-700/60 text-emerald-400 text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider">
                        FREE
                      </span>
                    )}
                  </div>

                  {/* Book Info */}
                  <div className="p-5 flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-serif font-medium text-white group-hover:text-rose-400 transition-colors duration-200 line-clamp-1 mb-1">
                        {ebook.title}
                      </h3>
                      <p className="text-xs text-zinc-400 mb-3">
                        by <span className="text-zinc-300">{ebook.writerName || ebook.author || "Anonymous"}</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Footer Info */}
                <div className="px-5 pb-5 pt-3 border-t border-zinc-800/60 flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-1 text-xs text-amber-400">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span className="font-semibold text-zinc-200">
                      {ebook.rating || "4.8"}
                    </span>
                    <span className="text-zinc-500">
                      ({ebook.reviewsCount || 0})
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-white font-mono">
                    {formattedPrice}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

