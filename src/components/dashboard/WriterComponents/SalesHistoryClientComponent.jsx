"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { 
  DollarSign, 
  ShoppingBag, 
  TrendingUp, 
  Loader2, 
  CheckCircle2, 
  ChevronLeft, 
  ChevronRight, 
  BookOpen,
  Calendar,
  User,
  CreditCard,
  RefreshCw
} from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { getWriterSalesHistory } from "@/lib/actions/salesAction";

const ITEMS_PER_PAGE = 8;

export default function SalesHistoryClientComponent() {
  const { data: session, isPending: sessionLoading } = useSession();
  const user = session?.user;
  const writerId = user?.id || user?._id;

  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchSalesData = async (showRefreshSpinner = false) => {
    if (!writerId) {
      if (!sessionLoading) setLoading(false);
      return;
    }

    if (showRefreshSpinner) {
      setIsRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const res = await getWriterSalesHistory(writerId);
      if (res?.success && Array.isArray(res.data)) {
        setSales(res.data);
      } else {
        setSales([]);
      }
    } catch (err) {
      console.error("Failed to load writer sales history:", err);
      setSales([]);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSalesData();
  }, [writerId, sessionLoading]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalSalesCount = sales.length;
    const totalRevenue = sales.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
    const avgOrderValue = totalSalesCount > 0 ? totalRevenue / totalSalesCount : 0;
    return { totalSalesCount, totalRevenue, avgOrderValue };
  }, [sales]);

  // Pagination logic
  const totalPages = Math.ceil(sales.length / ITEMS_PER_PAGE) || 1;
  const currentSales = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return sales.slice(start, start + ITEMS_PER_PAGE);
  }, [sales, currentPage]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date);
    } catch {
      return dateString;
    }
  };

  // Format currency helper
  const formatCurrency = (amount, currency = "USD") => {
    const numericAmount = parseFloat(amount) || 0;
    try {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currency || "USD",
        minimumFractionDigits: 2,
      }).format(numericAmount);
    } catch {
      return `$${numericAmount.toFixed(2)}`;
    }
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-serif font-semibold tracking-tight text-zinc-100 flex items-center gap-3">
            Sales History
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Track book sales, buyer details, and earnings performance.
          </p>
        </div>
      </div>

      {/* Summary Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 border border-zinc-800/80 bg-[#121216]/80 rounded-none shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-mono font-medium text-zinc-400 uppercase tracking-wider">
              Total Revenue
            </p>
            <h3 className="text-2xl font-serif font-bold text-emerald-400 mt-1">
              {formatCurrency(stats.totalRevenue)}
            </h3>
          </div>
          <div className="p-3 bg-emerald-950/50 border border-emerald-800/40 rounded-none text-emerald-400">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 border border-zinc-800/80 bg-[#121216]/80 rounded-none shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-mono font-medium text-zinc-400 uppercase tracking-wider">
              Total Copies Sold
            </p>
            <h3 className="text-2xl font-serif font-bold text-zinc-100 mt-1 font-mono">
              {stats.totalSalesCount}
            </h3>
          </div>
          <div className="p-3 bg-rose-950/50 border border-rose-800/40 rounded-none text-rose-400">
            <ShoppingBag className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 border border-zinc-800/80 bg-[#121216]/80 rounded-none shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-mono font-medium text-zinc-400 uppercase tracking-wider">
              Avg. Sale Amount
            </p>
            <h3 className="text-2xl font-serif font-bold text-zinc-100 mt-1">
              {formatCurrency(stats.avgOrderValue)}
            </h3>
          </div>
          <div className="p-3 bg-indigo-950/50 border border-indigo-800/40 rounded-none text-indigo-400">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="rounded-none border border-zinc-800/80 bg-[#121216]/60 overflow-hidden shadow-xl space-y-0">
        {/* Loading State */}
        {loading || sessionLoading ? (
          <div className="p-16 flex flex-col items-center justify-center text-zinc-500 gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-rose-500" />
            <span className="text-xs font-mono">Loading sales history...</span>
          </div>
        ) : sales.length === 0 ? (
          /* Empty State */
          <div className="p-16 text-center text-sm text-zinc-500 flex flex-col items-center justify-center gap-3">
            <BookOpen className="w-10 h-10 text-zinc-600 stroke-[1.5]" />
            <p className="text-zinc-300 font-serif text-base">
              No sales recorded yet.
            </p>
            <p className="text-xs text-zinc-500 max-w-sm">
              Sales will automatically appear here once readers purchase your published e-books.
            </p>
          </div>
        ) : (
          /* Sales History Table */
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-zinc-800 bg-zinc-900/70 text-zinc-400 uppercase font-mono text-[11px] tracking-wider">
                <tr>
                  <th scope="col" className="px-6 py-3.5">Ebook Title</th>
                  <th scope="col" className="px-6 py-3.5">Buyer Name</th>
                  <th scope="col" className="px-6 py-3.5">Purchase Date</th>
                  <th scope="col" className="px-6 py-3.5">Amount</th>
                  <th scope="col" className="px-6 py-3.5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                {currentSales.map((item, idx) => {
                  const saleId = item._id || `${item.ebookId}-${idx}`;
                  const isPaid = (item.status || "paid").toLowerCase() === "paid";

                  return (
                    <tr
                      key={saleId}
                      className="hover:bg-zinc-900/40 transition-colors group"
                    >
                      {/* Ebook Title */}
                      <td className="px-6 py-4 font-medium">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 shrink-0 bg-rose-950/40 border border-rose-800/40 rounded-none flex items-center justify-center text-rose-400">
                            <BookOpen className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="font-serif text-sm font-semibold text-zinc-100 group-hover:text-rose-400 transition-colors line-clamp-1">
                              {item.ebookTitle || "Untitled Book"}
                            </span>
                            {item.ebookId && (
                              <span className="text-[10px] text-zinc-500 font-mono inline-block">
                                ID: {item.ebookId}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Buyer Name & Email */}
                      <td className="px-6 py-4">
                        <div className="space-y-0.5">
                          <div className="font-medium text-zinc-200 flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                            <span>{item.buyerName ? item.buyerName.trim() : "Anonymous Buyer"}</span>
                          </div>
                          {item.buyerEmail && (
                            <div className="text-[11px] text-zinc-500 font-mono pl-5">
                              {item.buyerEmail}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Purchase Date */}
                      <td className="px-6 py-4 text-zinc-400 font-mono text-[11px]">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                          <span>{formatDate(item.purchaseDate || item.createdAt)}</span>
                        </div>
                      </td>

                      {/* Amount */}
                      <td className="px-6 py-4 font-mono font-semibold text-zinc-100">
                        <div className="flex items-center gap-1">
                          <CreditCard className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          <span className="text-emerald-400 font-bold">
                            {formatCurrency(item.amount, item.currency)}
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4 text-right">
                        {isPaid ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-mono font-medium bg-emerald-950/40 border border-emerald-800/50 text-emerald-400 uppercase tracking-wider">
                            <CheckCircle2 className="w-3 h-3" />
                            {item.status || "Paid"}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-mono font-medium bg-amber-950/40 border border-amber-800/50 text-amber-400 uppercase tracking-wider">
                            {item.status || "Pending"}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar */}
        {!loading && sales.length > 0 && totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-zinc-800/80 bg-zinc-900/40 text-xs font-mono text-zinc-400">
            <span>
              Showing page <strong className="text-zinc-200">{currentPage}</strong> of{" "}
              <strong className="text-zinc-200">{totalPages}</strong> (
              <strong className="text-zinc-200">{sales.length}</strong> sales)
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
                className="px-3 py-1.5 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed text-zinc-300 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Prev
              </button>
              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
                className="px-3 py-1.5 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed text-zinc-300 transition-colors flex items-center gap-1 cursor-pointer"
              >
                Next <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
