"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  BookOpen,
  ShoppingBag,
  Bookmark,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Star,
  CheckCircle2,
  Library,
} from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { getUserPurchases, getUserBookmarks, getRandomEBooks } from "@/lib/actions/eBooks";

/**
 * UI/UX REFACTOR: ReaderDashboardOverview Component
 * - 1. UX: Streamlined reader dashboard layout displaying actionable user stats, recent library acquisitions, saved bookmarks, and AI/Curated recommendations.
 * - 2. Visual Design: Modern dark glass aesthetic (`#121216`), glowing welcome gradient banner, and color-coded metric badges.
 * - 3. Spacing & Grid: Consistent 8px-grid structure with 2xl rounded cards, uniform inner padding, and responsive grid columns (`lg:grid-cols-12`).
 * - 4. Micro-interactions: Smooth hover elevation on stats cards, arrow slide indicators, and cover zoom effects (`group-hover:scale-105`).
 * - 5. Feedback States: Shimmer loading skeletons (`aria-busy="true"`) and encouraging empty states with clear CTAs.
 * - 6. A11y: Keyboard navigation support (`focus-visible:ring-2 focus-visible:ring-rose-500`), explicit image `alt` tags, and semantic section headings.
 */
export default function ReaderDashboardOverview() {
  const { data: session, isPending: sessionLoading } = useSession();
  const user = session?.user;
  const userIdStr = user?.id || user?._id;

  const [purchasedBooks, setPurchasedBooks] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [recommendedBooks, setRecommendedBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      if (!userIdStr) {
        if (!sessionLoading) setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const [purRes, bmRes, recRes] = await Promise.all([
          getUserPurchases(userIdStr),
          getUserBookmarks(userIdStr),
          getRandomEBooks(),
        ]);

        if (purRes?.success && Array.isArray(purRes.data)) {
          setPurchasedBooks(purRes.data);
        }
        if (bmRes?.success && Array.isArray(bmRes.data)) {
          setBookmarks(bmRes.data);
        }
        if (recRes?.success && Array.isArray(recRes.data)) {
          setRecommendedBooks(recRes.data.slice(0, 4));
        }
      } catch (err) {
        console.error("Error loading reader dashboard overview:", err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, [userIdStr, sessionLoading]);

  const userName = user?.name || "Reader";
  const recentPurchased = purchasedBooks.slice(0, 3);
  const recentBookmarks = bookmarks.slice(0, 3);

  return (
    <div className="space-y-8 max-w-6xl mx-auto font-sans selection:bg-rose-500 selection:text-white">
      {/* Hero Welcome Banner */}
      <section 
        aria-label="Welcome Banner"
        className="relative rounded-2xl bg-gradient-to-r from-[#141419] via-[#121216] to-[#1a131b] border border-zinc-800/80 p-6 sm:p-8 shadow-2xl overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-[11px] font-bold tracking-[0.2em] text-rose-500 uppercase flex items-center gap-1.5 font-mono">
              <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
              Reader Dashboard
            </span>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
              Welcome back, <span className="text-rose-400">{userName}</span>! 👋
            </h1>
            <p className="text-sm text-zinc-300 max-w-lg leading-relaxed">
              Here is your personal reading sanctuary. Track your acquired library, saved bookmarks, and explore new recommendations.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/e-books"
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-semibold text-xs uppercase tracking-wider shadow-lg shadow-rose-600/25 transition-all flex items-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
            >
              <BookOpen className="w-4 h-4" aria-hidden="true" />
              <span>Browse Catalog</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Metrics & Actions Grid */}
      <section aria-label="Reader Quick Metrics" className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        {/* Metric 1: Purchased Ebooks */}
        <Link
          href="/dashboard/reader/purchased-ebooks"
          aria-label={`View your ${purchasedBooks.length} purchased ebooks`}
          className="group p-5 rounded-2xl bg-[#121216]/90 border border-zinc-800/80 hover:border-rose-500/50 hover:bg-[#16161d] shadow-lg transition-all duration-200 block space-y-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
        >
          <div className="flex items-center justify-between text-zinc-400 group-hover:text-rose-300 text-xs font-semibold uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              Purchased Books
              <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-rose-400" aria-hidden="true" />
            </span>
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <Library className="w-4 h-4" aria-hidden="true" />
            </div>
          </div>
          <p className="text-3xl font-serif font-bold text-white group-hover:text-rose-100 transition-colors">
            {loading ? "..." : purchasedBooks.length}
          </p>
          <p className="text-xs text-zinc-400">Acquired in your library &rarr;</p>
        </Link>

        {/* Metric 2: Bookmarks */}
        <Link
          href="/dashboard/reader/bookmarks"
          aria-label={`View your ${bookmarks.length} saved bookmarks`}
          className="group p-5 rounded-2xl bg-[#121216]/90 border border-zinc-800/80 hover:border-amber-500/50 hover:bg-[#16161d] shadow-lg transition-all duration-200 block space-y-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
        >
          <div className="flex items-center justify-between text-zinc-400 group-hover:text-amber-300 text-xs font-semibold uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              Saved Bookmarks
              <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-amber-400" aria-hidden="true" />
            </span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Bookmark className="w-4 h-4" aria-hidden="true" />
            </div>
          </div>
          <p className="text-3xl font-serif font-bold text-white group-hover:text-amber-100 transition-colors">
            {loading ? "..." : bookmarks.length}
          </p>
          <p className="text-xs text-zinc-400">Saved in reading list &rarr;</p>
        </Link>

        {/* Metric 3: Order History */}
        <Link
          href="/dashboard/reader/purchase-history"
          aria-label={`View purchase history with ${purchasedBooks.length} completed transactions`}
          className="group p-5 rounded-2xl bg-[#121216]/90 border border-zinc-800/80 hover:border-emerald-500/50 hover:bg-[#16161d] shadow-lg transition-all duration-200 block space-y-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
        >
          <div className="flex items-center justify-between text-zinc-400 group-hover:text-emerald-300 text-xs font-semibold uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              Order History
              <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-emerald-400" aria-hidden="true" />
            </span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <ShoppingBag className="w-4 h-4" aria-hidden="true" />
            </div>
          </div>
          <p className="text-3xl font-serif font-bold text-white group-hover:text-emerald-100 transition-colors">
            {loading ? "..." : purchasedBooks.length}
          </p>
          <p className="text-xs text-zinc-400">Completed receipts & history &rarr;</p>
        </Link>
      </section>

      {/* Main Dashboard Grid Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Recent Purchases & Reading List */}
        <div className="lg:col-span-7 space-y-8">
          {/* Recent Purchases Section */}
          <section aria-label="Recent Purchases" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-serif font-bold text-white flex items-center gap-2">
                <Library className="w-5 h-5 text-rose-500" aria-hidden="true" />
                Recent Purchased Books
              </h2>
              <Link
                href="/dashboard/reader/purchased-ebooks"
                className="text-xs text-rose-400 hover:text-rose-300 font-semibold inline-flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 rounded-md px-1"
              >
                View all ({purchasedBooks.length}) <ArrowRight className="w-3 h-3" aria-hidden="true" />
              </Link>
            </div>

            {loading ? (
              <div aria-busy="true" className="space-y-3">
                {[1, 2].map((n) => (
                  <div key={n} className="p-4 bg-[#121216] border border-zinc-800/80 rounded-2xl animate-pulse flex items-center justify-between">
                    <div className="flex items-center gap-3.5">
                      <div className="w-11 h-14 bg-zinc-800 rounded-lg" />
                      <div className="space-y-2">
                        <div className="h-4 bg-zinc-800 rounded-md w-36" />
                        <div className="h-3 bg-zinc-800/60 rounded-md w-24" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : recentPurchased.length === 0 ? (
              <div className="p-8 text-center border border-zinc-800/80 bg-[#121216]/60 rounded-2xl space-y-3">
                <BookOpen className="w-10 h-10 text-zinc-500 mx-auto stroke-[1.5]" aria-hidden="true" />
                <p className="text-sm text-zinc-300">You haven&apos;t acquired any ebooks yet.</p>
                <Link
                  href="/e-books"
                  className="inline-block px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-xl uppercase tracking-wider transition-colors"
                >
                  Explore Ebooks
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {recentPurchased.map((item) => {
                  const ebookId = item.ebookId || item._id;
                  return (
                    <Link
                      key={item._id || item.sessionId}
                      href={`/e-books/${ebookId}`}
                      aria-label={`Read ${item.title || "Untitled Ebook"} by ${item.writerName || "Writer"}`}
                      className="group flex items-center justify-between p-4 bg-[#121216] border border-zinc-800/80 hover:border-rose-500/50 rounded-2xl transition-all shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="relative w-11 h-14 shrink-0 bg-zinc-900 overflow-hidden border border-zinc-800 rounded-lg">
                          {item.coverImage ? (
                            <Image
                              src={item.coverImage}
                              alt={`Cover for ${item.title}`}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform"
                              unoptimized
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-zinc-600">
                              <BookOpen className="w-5 h-5" aria-hidden="true" />
                            </div>
                          )}
                        </div>
                        <div>
                          <h3 className="text-sm font-serif font-bold text-white group-hover:text-rose-400 transition-colors line-clamp-1">
                            {item.title || "Untitled Ebook"}
                          </h3>
                          <p className="text-xs text-zinc-400">by {item.writerName || "Writer"}</p>
                          <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-mono mt-1 font-semibold">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" aria-hidden="true" /> Full Access
                          </span>
                        </div>
                      </div>

                      <span className="px-3.5 py-1.5 text-xs font-semibold text-rose-400 group-hover:bg-rose-500/10 border border-rose-500/30 transition-colors rounded-xl flex items-center gap-1">
                        Read Now &rarr;
                      </span>
                    </Link>
                  );
                })}
              </div>
            )}
          </section>

          {/* Bookmarks Section */}
          <section aria-label="Saved Bookmarks" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-serif font-bold text-white flex items-center gap-2">
                <Bookmark className="w-5 h-5 text-amber-500 fill-amber-500/20" aria-hidden="true" />
                Saved Bookmarks
              </h2>
              <Link
                href="/dashboard/reader/bookmarks"
                className="text-xs text-amber-400 hover:text-amber-300 font-semibold inline-flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-md px-1"
              >
                View all ({bookmarks.length}) <ArrowRight className="w-3 h-3" aria-hidden="true" />
              </Link>
            </div>

            {loading ? (
              <div aria-busy="true" className="grid grid-cols-3 gap-3">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="bg-[#121216] border border-zinc-800/80 p-3 rounded-2xl space-y-2 animate-pulse">
                    <div className="aspect-[4/5] bg-zinc-800 rounded-xl" />
                    <div className="h-3 bg-zinc-800 rounded-md w-3/4" />
                  </div>
                ))}
              </div>
            ) : recentBookmarks.length === 0 ? (
              <div className="p-8 text-center border border-zinc-800/80 bg-[#121216]/60 rounded-2xl space-y-2">
                <p className="text-xs text-zinc-400">No bookmarks saved yet in your reading list.</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-3">
                {recentBookmarks.map((bm) => (
                  <Link
                    key={bm._id || bm.bookId}
                    href={`/e-books/${bm.bookId}`}
                    aria-label={`Open bookmarked title ${bm.title} by ${bm.writerName}`}
                    className="group bg-[#121216] border border-zinc-800/80 hover:border-amber-500/40 p-3 rounded-2xl space-y-2 transition-all block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                  >
                    <div className="relative aspect-[4/5] w-full bg-zinc-900 overflow-hidden border border-zinc-800/60 rounded-xl">
                      {bm.coverImage ? (
                        <Image
                          src={bm.coverImage}
                          alt={`Cover thumbnail for ${bm.title}`}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform"
                          unoptimized
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-zinc-600">
                          <BookOpen className="w-5 h-5" aria-hidden="true" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="text-xs font-serif font-bold text-white group-hover:text-amber-300 line-clamp-1">
                        {bm.title}
                      </h4>
                      <p className="text-[11px] text-zinc-400 line-clamp-1">by {bm.writerName}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Right Column: Recommendations */}
        <section aria-label="Recommended Reading" className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-serif font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-rose-400" aria-hidden="true" />
              Recommended Ebooks
            </h2>
            <Link
              href="/e-books"
              className="text-xs text-zinc-400 hover:text-white font-medium inline-flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 rounded-md px-1"
            >
              Browse all <ArrowRight className="w-3 h-3" aria-hidden="true" />
            </Link>
          </div>

          <div className="space-y-3">
            {recommendedBooks.map((b) => {
              const bookId = b._id || b.id;
              const priceVal = typeof b.price === "number" ? b.price : parseFloat(b.price) || 0;
              const isFree = b.isFree || priceVal === 0;

              return (
                <Link
                  key={bookId}
                  href={`/e-books/${bookId}`}
                  aria-label={`Recommended title ${b.title} by ${b.writerName || b.author || "Unknown"}`}
                  className="group flex items-center justify-between p-3.5 bg-[#121216] border border-zinc-800/80 hover:border-rose-500/50 rounded-2xl transition-all block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-13 shrink-0 bg-zinc-900 overflow-hidden border border-zinc-800 rounded-lg">
                      {b.coverImage ? (
                        <Image
                          src={b.coverImage}
                          alt={`Cover image for ${b.title}`}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform"
                          unoptimized
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-zinc-600">
                          <BookOpen className="w-4 h-4" aria-hidden="true" />
                        </div>
                      )}
                    </div>

                    <div>
                      <h3 className="text-xs font-serif font-bold text-white group-hover:text-rose-400 transition-colors line-clamp-1">
                        {b.title}
                      </h3>
                      <p className="text-[11px] text-zinc-400 line-clamp-1">
                        by {b.writerName || b.author || "Unknown"}
                      </p>
                      <div className="flex items-center gap-1 text-[10px] text-amber-400 mt-1 font-semibold">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" aria-hidden="true" />
                        <span>{b.rating || "4.8"}</span>
                      </div>
                    </div>
                  </div>

                  <span className="text-xs font-mono font-bold text-white bg-zinc-900 border border-zinc-800 px-2 py-1 rounded-md group-hover:text-rose-400 transition-colors">
                    {isFree ? "Free" : `$${priceVal.toFixed(2)}`}
                  </span>
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}

