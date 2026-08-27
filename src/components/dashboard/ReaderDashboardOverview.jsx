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
  Clock,
  Star,
  CheckCircle2,
  Library,
  Flame,
} from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { getUserPurchases, getUserBookmarks, getRandomEBooks } from "@/lib/actions/eBooks";

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
      {/* Welcome Banner */}
      <div className="relative rounded-none bg-linear-to-r from-[#141419] via-[#121216] to-[#1a131b] border border-zinc-800/80 p-6 sm:p-8 shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/10 rounded-none blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-[11px] font-bold tracking-[0.2em] text-rose-500 uppercase flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Reader Dashboard
            </span>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
              Welcome back, <span className="text-rose-400">{userName}</span>! 👋
            </h1>
            <p className="text-sm text-zinc-400 max-w-lg">
              Here is your personal reading sanctuary. Track your acquired library, saved bookmarks, and explore new recommendations.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/e-books"
              className="px-5 py-3 rounded-none bg-linear-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-semibold text-xs uppercase tracking-wider shadow-lg shadow-rose-600/25 transition-all flex items-center gap-2 cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>Browse Catalog</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Stat 1: Purchased Ebooks */}
        <Link
          href="/dashboard/reader/purchased-ebooks"
          className="group p-5 rounded-none bg-[#121216]/90 border border-zinc-800/80 hover:border-rose-500/50 hover:bg-[#16161d] shadow-md transition-all duration-200 block space-y-2 cursor-pointer"
        >
          <div className="flex items-center justify-between text-zinc-400 group-hover:text-rose-300 text-xs font-medium uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              Purchased Ebooks
              <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-rose-400" />
            </span>
            <div className="p-2 rounded-none bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <Library className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-serif font-bold text-white group-hover:text-rose-100 transition-colors">
            {purchasedBooks.length}
          </p>
          <p className="text-xs text-zinc-500">Acquired in your collection &rarr;</p>
        </Link>

        {/* Stat 2: Bookmarks */}
        <Link
          href="/dashboard/reader/bookmarks"
          className="group p-5 rounded-none bg-[#121216]/90 border border-zinc-800/80 hover:border-amber-500/50 hover:bg-[#16161d] shadow-md transition-all duration-200 block space-y-2 cursor-pointer"
        >
          <div className="flex items-center justify-between text-zinc-400 group-hover:text-amber-300 text-xs font-medium uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              Saved Bookmarks
              <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-amber-400" />
            </span>
            <div className="p-2 rounded-none bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Bookmark className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-serif font-bold text-white group-hover:text-amber-100 transition-colors">
            {bookmarks.length}
          </p>
          <p className="text-xs text-zinc-500">Saved in reading list &rarr;</p>
        </Link>

        {/* Stat 3: Total Transactions */}
        <Link
          href="/dashboard/reader/purchase-history"
          className="group p-5 rounded-none bg-[#121216]/90 border border-zinc-800/80 hover:border-emerald-500/50 hover:bg-[#16161d] shadow-md transition-all duration-200 block space-y-2 cursor-pointer"
        >
          <div className="flex items-center justify-between text-zinc-400 group-hover:text-emerald-300 text-xs font-medium uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              Order History
              <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-emerald-400" />
            </span>
            <div className="p-2 rounded-none bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-serif font-bold text-white group-hover:text-emerald-100 transition-colors">
            {purchasedBooks.length}
          </p>
          <p className="text-xs text-zinc-500">Completed orders & receipts &rarr;</p>
        </Link>
      </div>

      {/* Main Overview Split Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Recent Purchases & Reading List */}
        <div className="lg:col-span-7 space-y-8">
          {/* Section: Continue Reading / Recent Purchases */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-serif font-semibold text-white flex items-center gap-2">
                <Library className="w-5 h-5 text-rose-500" />
                Recent Purchased Books
              </h2>
              <Link
                href="/dashboard/reader/purchased-ebooks"
                className="text-xs text-rose-400 hover:text-rose-300 font-medium inline-flex items-center gap-1"
              >
                View all ({purchasedBooks.length}) <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {loading ? (
              <div className="p-8 text-center border border-zinc-800/80 bg-[#121216]/60 text-xs text-zinc-500 font-mono">
                Loading your library...
              </div>
            ) : recentPurchased.length === 0 ? (
              <div className="p-8 text-center border border-zinc-800/80 bg-[#121216]/60 rounded-none space-y-3">
                <BookOpen className="w-8 h-8 text-zinc-600 mx-auto stroke-[1.5]" />
                <p className="text-xs text-zinc-400">You haven't purchased any ebooks yet.</p>
                <Link
                  href="/e-books"
                  className="inline-block px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-medium rounded-none"
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
                      className="group flex items-center justify-between p-4 bg-[#121216] border border-zinc-800/80 hover:border-rose-500/40 rounded-none transition-all"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="relative w-11 h-14 shrink-0 bg-zinc-900 overflow-hidden border border-zinc-800 rounded-none">
                          {item.coverImage ? (
                            <Image
                              src={item.coverImage}
                              alt={item.title || "Cover"}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform"
                              unoptimized
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-zinc-700">
                              <BookOpen className="w-5 h-5" />
                            </div>
                          )}
                        </div>
                        <div>
                          <h3 className="text-sm font-serif font-semibold text-white group-hover:text-rose-400 transition-colors line-clamp-1">
                            {item.title || "Untitled Ebook"}
                          </h3>
                          <p className="text-xs text-zinc-400">by {item.writerName || "Writer"}</p>
                          <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-mono mt-1">
                            <CheckCircle2 className="w-3 h-3" /> Full Lifetime Access
                          </span>
                        </div>
                      </div>

                      <span className="px-3 py-1 text-xs font-medium text-rose-400 group-hover:bg-rose-500/10 border border-rose-500/20 transition-colors rounded-none">
                        Read Now &rarr;
                      </span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Section: Bookmarks List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-serif font-semibold text-white flex items-center gap-2">
                <Bookmark className="w-5 h-5 text-amber-500 fill-amber-500/20" />
                Saved Bookmarks
              </h2>
              <Link
                href="/dashboard/reader/bookmarks"
                className="text-xs text-amber-400 hover:text-amber-300 font-medium inline-flex items-center gap-1"
              >
                View all ({bookmarks.length}) <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {loading ? (
              <div className="p-8 text-center border border-zinc-800/80 bg-[#121216]/60 text-xs text-zinc-500 font-mono">
                Loading saved bookmarks...
              </div>
            ) : recentBookmarks.length === 0 ? (
              <div className="p-8 text-center border border-zinc-800/80 bg-[#121216]/60 rounded-none space-y-2">
                <p className="text-xs text-zinc-400">No bookmarks saved yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-3">
                {recentBookmarks.map((bm) => (
                  <Link
                    key={bm._id || bm.bookId}
                    href={`/e-books/${bm.bookId}`}
                    className="group bg-[#121216] border border-zinc-800/80 hover:border-amber-500/40 p-3 rounded-none space-y-2 transition-all block"
                  >
                    <div className="relative aspect-4/5 w-full bg-zinc-900 overflow-hidden border border-zinc-800/60 rounded-none">
                      {bm.coverImage ? (
                        <Image
                          src={bm.coverImage}
                          alt={bm.title || "Cover"}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform"
                          unoptimized
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-zinc-700">
                          <BookOpen className="w-5 h-5" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="text-xs font-serif font-semibold text-white group-hover:text-amber-300 line-clamp-1">
                        {bm.title}
                      </h4>
                      <p className="text-[11px] text-zinc-400 line-clamp-1">by {bm.writerName}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Recommendations & Discover */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-serif font-semibold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-rose-400" />
              Recommended Ebooks
            </h2>
            <Link
              href="/e-books"
              className="text-xs text-zinc-400 hover:text-white font-medium inline-flex items-center gap-1"
            >
              Browse all <ArrowRight className="w-3 h-3" />
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
                  className="group flex items-center justify-between p-3.5 bg-[#121216] border border-zinc-800/80 hover:border-rose-500/40 rounded-none transition-all block"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-13 shrink-0 bg-zinc-900 overflow-hidden border border-zinc-800 rounded-none">
                      {b.coverImage ? (
                        <Image
                          src={b.coverImage}
                          alt={b.title || "Cover"}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform"
                          unoptimized
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-zinc-700">
                          <BookOpen className="w-4 h-4" />
                        </div>
                      )}
                    </div>

                    <div>
                      <h3 className="text-xs font-serif font-semibold text-white group-hover:text-rose-400 transition-colors line-clamp-1">
                        {b.title}
                      </h3>
                      <p className="text-[11px] text-zinc-400 line-clamp-1">
                        by {b.writerName || b.author || "Unknown"}
                      </p>
                      <div className="flex items-center gap-1 text-[10px] text-amber-400 mt-1">
                        <Star className="w-3 h-3 fill-amber-400" />
                        <span>{b.rating || "4.8"}</span>
                      </div>
                    </div>
                  </div>

                  <span className="text-xs font-mono font-bold text-zinc-200 group-hover:text-rose-400 transition-colors">
                    {isFree ? "Free" : `$${priceVal.toFixed(2)}`}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
