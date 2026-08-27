"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { BookOpen, ArrowRight, Loader2, Library, ChevronLeft, ChevronRight } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { getUserPurchases } from "@/lib/actions/eBooks";

const ITEMS_PER_PAGE = 10;

export default function PurchasedEbooksClientComponent() {
  const { data: session, isPending: sessionLoading } = useSession();
  const user = session?.user;
  const userIdStr = user?.id || user?._id;

  const [purchasedBooks, setPurchasedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    async function fetchPurchasedEbooks() {
      if (!userIdStr) {
        if (!sessionLoading) setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const res = await getUserPurchases(userIdStr);
        if (res?.success && Array.isArray(res.data)) {
          setPurchasedBooks(res.data);
        }
      } catch (err) {
        console.error("Failed to load purchased ebooks:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchPurchasedEbooks();
  }, [userIdStr, sessionLoading]);

  const totalPages = Math.ceil(purchasedBooks.length / ITEMS_PER_PAGE) || 1;

  const currentPurchasedBooks = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return purchasedBooks.slice(start, start + ITEMS_PER_PAGE);
  }, [purchasedBooks, currentPage]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto font-sans">
      <div>
        <h1 className="text-3xl sm:text-4xl font-serif font-semibold text-zinc-100 flex items-center gap-2.5">
          <Library className="w-7 h-7 text-rose-500" />
          Purchased Ebooks ({purchasedBooks.length})
        </h1>
        <p className="text-sm text-zinc-400 mt-1">Your collection of acquired books.</p>
      </div>

      {loading || sessionLoading ? (
        <div className="p-16 flex flex-col items-center justify-center text-zinc-500 gap-3 border border-zinc-800/80 bg-[#121216]/60">
          <Loader2 className="w-6 h-6 animate-spin text-rose-500" />
          <span className="text-xs font-mono">Loading your library...</span>
        </div>
      ) : purchasedBooks.length === 0 ? (
        <div className="p-16 text-center border border-zinc-800/80 bg-[#121216]/60 flex flex-col items-center justify-center gap-3">
          <BookOpen className="w-12 h-12 text-zinc-600 stroke-[1.5]" />
          <h3 className="text-base font-serif font-medium text-zinc-200">No purchased ebooks yet</h3>
          <p className="text-xs text-zinc-500 max-w-sm">
            Browse our library and acquire your favorite ebooks to start reading.
          </p>
          <Link
            href="/e-books"
            className="mt-2 inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-white bg-rose-600 hover:bg-rose-500 transition-colors"
          >
            Explore E-books <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {currentPurchasedBooks.map((item) => {
              const ebookId = item.ebookId || item._id;
              return (
                <Link
                  key={item._id || item.sessionId}
                  href={`/e-books/${ebookId}`}
                  className="group relative bg-[#121215] border border-zinc-800/80 overflow-hidden hover:border-rose-500/50 transition-all flex flex-col justify-between cursor-pointer shadow-lg hover:shadow-rose-950/20"
                >
                  <div>
                    <div className="relative aspect-4/5 w-full bg-zinc-900 overflow-hidden">
                      {item.coverImage ? (
                        <Image
                          src={item.coverImage}
                          alt={item.title || "Book Cover"}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          unoptimized
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-zinc-700 bg-zinc-900 p-2">
                          <BookOpen className="w-8 h-8 mb-1 stroke-[1.5]" />
                        </div>
                      )}
                    </div>

                    <div className="p-3 space-y-1">
                      <h3 className="text-xs font-serif font-medium text-white line-clamp-1 group-hover:text-rose-400 transition-colors">
                        {item.title || "Untitled Book"}
                      </h3>
                      <p className="text-[11px] text-zinc-400 line-clamp-1">
                        by <span className="text-zinc-300">{item.writerName || "Writer"}</span>
                      </p>
                    </div>
                  </div>

                  <div className="p-3 pt-1.5 border-t border-zinc-800/60 flex items-center justify-between mt-auto">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 border border-emerald-500/20">
                      Owned
                    </span>

                    <span className="text-[11px] text-rose-400 group-hover:text-rose-300 font-medium inline-flex items-center gap-0.5">
                      View Details <ArrowRight className="w-2.5 h-2.5" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 border-t border-zinc-800/60 text-xs font-mono text-zinc-400">
              <span>
                Showing page <span className="text-zinc-200 font-bold">{currentPage}</span> of{" "}
                <span className="text-zinc-200 font-bold">{totalPages}</span> ({purchasedBooks.length} total)
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  className="px-3 py-1.5 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed text-zinc-300 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" /> Prev
                </button>
                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  className="px-3 py-1.5 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed text-zinc-300 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  Next <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
