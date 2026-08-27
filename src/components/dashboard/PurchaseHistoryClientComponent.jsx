"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { BookOpen, ShoppingBag, ArrowRight, Loader2, CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { getUserPurchases } from "@/lib/actions/eBooks";

const ITEMS_PER_PAGE = 5;

export default function PurchaseHistoryClientComponent() {
  const { data: session, isPending: sessionLoading } = useSession();
  const user = session?.user;
  const userIdStr = user?.id || user?._id;

  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    async function fetchPurchases() {
      if (!userIdStr) {
        if (!sessionLoading) setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const res = await getUserPurchases(userIdStr);
        if (res?.success && Array.isArray(res.data)) {
          setPurchases(res.data);
        }
      } catch (err) {
        console.error("Failed to load purchase history:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchPurchases();
  }, [userIdStr, sessionLoading]);

  const totalPages = Math.ceil(purchases.length / ITEMS_PER_PAGE) || 1;

  const currentPurchases = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return purchases.slice(start, start + ITEMS_PER_PAGE);
  }, [purchases, currentPage]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto font-sans">
      <div>
        <h1 className="text-3xl sm:text-4xl font-serif font-semibold text-zinc-100 flex items-center gap-2.5">
          <ShoppingBag className="w-7 h-7 text-emerald-500" />
          Purchase History
        </h1>
        <p className="text-sm text-zinc-400 mt-1">View all past transactions and receipts.</p>
      </div>

      {loading || sessionLoading ? (
        <div className="p-16 flex flex-col items-center justify-center text-zinc-500 gap-3 border border-zinc-800/80 bg-[#121216]/60">
          <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
          <span className="text-xs font-mono">Loading purchase history...</span>
        </div>
      ) : purchases.length === 0 ? (
        <div className="p-16 text-center border border-zinc-800/80 bg-[#121216]/60 flex flex-col items-center justify-center gap-3">
          <BookOpen className="w-12 h-12 text-zinc-600 stroke-[1.5]" />
          <h3 className="text-base font-serif font-medium text-zinc-200">No transactions found</h3>
          <p className="text-xs text-zinc-500 max-w-sm">
            You haven't purchased any ebooks yet. Explore our collection to find your next great read.
          </p>
          <Link
            href="/e-books"
            className="mt-2 inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-500 transition-colors"
          >
            Explore E-books <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="border border-zinc-800/80 bg-[#121216]/60 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-zinc-800 bg-zinc-900/50 text-zinc-400 uppercase font-mono text-[11px]">
                  <tr>
                    <th scope="col" className="px-5 py-3.5">Ebook</th>
                    <th scope="col" className="px-5 py-3.5">Writer</th>
                    <th scope="col" className="px-5 py-3.5">Price</th>
                    <th scope="col" className="px-5 py-3.5">Purchase Date</th>
                    <th scope="col" className="px-5 py-3.5 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                  {currentPurchases.map((item) => {
                    const ebookId = item.ebookId || item._id;
                    return (
                      <tr key={item._id || item.sessionId} className="hover:bg-zinc-900/40 transition-colors group">
                        <td className="px-5 py-4 font-medium">
                          <Link href={`/e-books/${ebookId}`} className="flex items-center gap-3 group-hover:text-emerald-400 transition-colors">
                            {item.coverImage ? (
                              <div className="relative w-9 h-12 shrink-0 bg-zinc-900 border border-zinc-800 overflow-hidden">
                                <Image
                                  src={item.coverImage}
                                  alt={item.title || "Cover"}
                                  fill
                                  className="object-cover"
                                  unoptimized
                                />
                              </div>
                            ) : (
                              <div className="w-9 h-12 shrink-0 bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-600">
                                <BookOpen className="w-4 h-4" />
                              </div>
                            )}
                            <div>
                              <span className="font-serif text-sm font-semibold text-zinc-100 group-hover:text-emerald-400 transition-colors line-clamp-1">
                                {item.title || "Untitled Book"}
                              </span>
                              {item.genre && (
                                <span className="text-[10px] text-zinc-500 font-mono inline-block mt-0.5">
                                  {item.genre}
                                </span>
                              )}
                            </div>
                          </Link>
                        </td>
                        <td className="px-5 py-4 text-zinc-400">
                          <span className="font-medium text-zinc-300">{item.writerName || "N/A"}</span>
                          {item.writerEmail && (
                            <div className="text-[10px] text-zinc-500 font-mono">{item.writerEmail}</div>
                          )}
                        </td>
                        <td className="px-5 py-4 font-mono font-semibold text-zinc-200">
                          {item.isFree || item.price === 0
                            ? "Free"
                            : `$${parseFloat(item.price ?? item.amount ?? 0).toFixed(2)}`}
                        </td>
                        <td className="px-5 py-4 text-zinc-400 font-mono text-[11px]">
                          {formatDate(item.createdAt)}
                        </td>
                        <td className="px-5 py-4 text-right">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-mono font-medium rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 uppercase tracking-wider">
                            <CheckCircle2 className="w-3 h-3" />
                            {item.status || "Paid"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-2 text-xs font-mono text-zinc-400">
              <span>
                Showing page <span className="text-zinc-200 font-bold">{currentPage}</span> of{" "}
                <span className="text-zinc-200 font-bold">{totalPages}</span> ({purchases.length} total)
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
