"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Plus,
  BookOpen,
  BookMarked,
  DollarSign,
  TrendingUp,
  ShoppingBag,
  Clock,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Edit,
  ArrowRight,
  Sparkles,
  Loader2,
  RefreshCw,
  User,
  Calendar,
  CreditCard,
} from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { getEBooksByWriter } from "@/lib/actions/eBooks";
import { getWriterSalesHistory } from "@/lib/actions/salesAction";

export default function WriterDashboardOverview() {
  const { data: session, isPending: sessionLoading } = useSession();
  const user = session?.user;
  const writerId = user?.id || user?._id;

  const [ebooks, setEbooks] = useState([]);
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchWriterData = async (showRefreshSpinner = false) => {
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
      const [ebooksRes, salesRes] = await Promise.all([
        getEBooksByWriter(writerId),
        getWriterSalesHistory(writerId),
      ]);

      if (ebooksRes?.success && Array.isArray(ebooksRes.data)) {
        setEbooks(ebooksRes.data);
      } else {
        setEbooks([]);
      }

      if (salesRes?.success && Array.isArray(salesRes.data)) {
        setSales(salesRes.data);
      } else {
        setSales([]);
      }
    } catch (err) {
      console.error("Error loading writer overview data:", err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchWriterData();
  }, [writerId, sessionLoading]);

  const userName = user?.name || "Writer";

  // Calculate Writer Metrics
  const stats = useMemo(() => {
    const totalEbooks = ebooks.length;
    const publishedCount = ebooks.filter(
      (b) => (b.status || "").toLowerCase() === "published"
    ).length;
    const pendingCount = ebooks.filter(
      (b) => (b.status || "").toLowerCase() === "pending"
    ).length;

    const totalSalesCount = sales.length;
    const totalRevenue = sales.reduce(
      (sum, item) => sum + (parseFloat(item.amount) || 0),
      0
    );

    return {
      totalEbooks,
      publishedCount,
      pendingCount,
      totalSalesCount,
      totalRevenue,
    };
  }, [ebooks, sales]);

  const recentEbooks = ebooks.slice(0, 5);
  const recentSales = sales.slice(0, 5);

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

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto font-sans selection:bg-rose-500 selection:text-white">
      {/* Welcome Hero Banner */}
      <div className="relative rounded-none bg-linear-to-r from-[#141419] via-[#121216] to-[#1e1319] border border-zinc-800/80 p-6 sm:p-8 shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/10 rounded-none blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-[11px] font-bold tracking-[0.2em] text-rose-500 uppercase flex items-center gap-1.5 font-mono">
              <Sparkles className="w-3.5 h-3.5" />
              Writer Portal &amp; Studio
            </span>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
              Welcome back, <span className="text-rose-400">{userName}</span>! ✍️
            </h1>
            <p className="text-sm text-zinc-400 max-w-lg">
              Manage your published e-books, track readers' purchases, and analyze overall earnings performance.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/dashboard/writer/add-ebook"
              className="px-5 py-2.5 rounded-none bg-linear-to-r from-rose-500 to-pink-600 hover:opacity-90 text-white font-medium text-xs shadow-md shadow-rose-600/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Publish New Ebook</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total E-Books */}
        <Link
          href="/dashboard/writer/manage-ebooks"
          className="group p-5 rounded-none bg-[#121216]/90 border border-zinc-800/80 hover:border-rose-500/50 hover:bg-[#16161d] shadow-md transition-all duration-200 block space-y-2 cursor-pointer"
        >
          <div className="flex items-center justify-between text-zinc-400 group-hover:text-rose-300 text-xs font-medium uppercase tracking-wider font-mono">
            <span>Total E-Books</span>
            <div className="p-2 rounded-none bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <BookMarked className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-serif font-bold text-white group-hover:text-rose-100 transition-colors font-mono">
            {loading || sessionLoading ? "..." : stats.totalEbooks}
          </p>
          <div className="flex items-center justify-between text-xs text-zinc-500 pt-1">
            <span>{stats.publishedCount} Published</span>
            {stats.pendingCount > 0 && (
              <span className="text-amber-400 font-mono">({stats.pendingCount} Pending)</span>
            )}
          </div>
        </Link>

        {/* Total Copies Sold */}
        <Link
          href="/dashboard/writer/sales-history"
          className="group p-5 rounded-none bg-[#121216]/90 border border-zinc-800/80 hover:border-indigo-500/50 hover:bg-[#16161d] shadow-md transition-all duration-200 block space-y-2 cursor-pointer"
        >
          <div className="flex items-center justify-between text-zinc-400 group-hover:text-indigo-300 text-xs font-medium uppercase tracking-wider font-mono">
            <span>Copies Sold</span>
            <div className="p-2 rounded-none bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-serif font-bold text-white group-hover:text-indigo-100 transition-colors font-mono">
            {loading || sessionLoading ? "..." : stats.totalSalesCount}
          </p>
          <p className="text-xs text-zinc-500">Completed purchases &rarr;</p>
        </Link>

        {/* Total Earnings */}
        <Link
          href="/dashboard/writer/sales-history"
          className="group p-5 rounded-none bg-[#121216]/90 border border-zinc-800/80 hover:border-emerald-500/50 hover:bg-[#16161d] shadow-md transition-all duration-200 block space-y-2 cursor-pointer"
        >
          <div className="flex items-center justify-between text-zinc-400 group-hover:text-emerald-300 text-xs font-medium uppercase tracking-wider font-mono">
            <span>Total Earnings</span>
            <div className="p-2 rounded-none bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-serif font-bold text-emerald-400 group-hover:text-emerald-300 transition-colors">
            {loading || sessionLoading ? "..." : formatCurrency(stats.totalRevenue)}
          </p>
          <p className="text-xs text-zinc-500">Gross revenue &rarr;</p>
        </Link>

        {/* Studio Status */}
        <div className="p-5 rounded-none bg-[#121216]/90 border border-zinc-800/80 shadow-md space-y-2">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-medium uppercase tracking-wider font-mono">
            <span>Author Status</span>
            <div className="p-2 rounded-none bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-center gap-2 pt-1">
            <span className="w-2.5 h-2.5 rounded-none bg-emerald-500 animate-pulse" />
            <span className="text-sm font-semibold text-zinc-100 font-mono">Active Writer</span>
          </div>
          <p className="text-xs text-zinc-500">Fable Publishing Partner</p>
        </div>
      </div>

      {/* Main Split Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Recent Ebooks (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-serif font-semibold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-rose-500" />
              Your Published E-Books
            </h2>
            <Link
              href="/dashboard/writer/manage-ebooks"
              className="text-xs text-rose-400 hover:text-rose-300 font-medium inline-flex items-center gap-1"
            >
              Manage All ({ebooks.length}) <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="rounded-none border border-zinc-800/80 bg-[#121216]/60 overflow-hidden shadow-xl">
            {loading || sessionLoading ? (
              <div className="p-12 text-center text-zinc-500 text-xs font-mono flex flex-col items-center justify-center gap-3">
                <Loader2 className="w-6 h-6 animate-spin text-rose-500" />
                <span>Loading your e-books...</span>
              </div>
            ) : ebooks.length === 0 ? (
              <div className="p-12 text-center text-zinc-500 text-xs space-y-3 flex flex-col items-center justify-center">
                <BookOpen className="w-10 h-10 text-zinc-600 stroke-[1.5]" />
                <p className="text-zinc-300 font-serif text-sm">No e-books published yet.</p>
                <Link
                  href="/dashboard/writer/add-ebook"
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-rose-600 hover:bg-rose-500 transition-colors rounded-none"
                >
                  <Plus className="w-3.5 h-3.5" /> Publish Your First Book
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-zinc-800/60">
                {recentEbooks.map((book) => {
                  const bookId = book._id || book.id;
                  const priceVal = typeof book.price === "number" ? book.price : parseFloat(book.price) || 0;
                  const isFree = book.isFree || priceVal === 0;
                  const status = (book.status || "pending").toLowerCase();
                  const isPublished = status === "published";
                  const isPending = status === "pending";

                  return (
                    <div
                      key={bookId}
                      className="p-4 flex items-center justify-between gap-4 hover:bg-zinc-900/40 transition-colors"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="relative w-10 h-14 shrink-0 bg-zinc-900 border border-zinc-800 overflow-hidden rounded-none">
                          {book.coverImage ? (
                            <Image
                              src={book.coverImage}
                              alt={book.title || "Cover"}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-zinc-700">
                              <BookOpen className="w-5 h-5" />
                            </div>
                          )}
                        </div>

                        <div className="min-w-0">
                          <h3 className="text-sm font-serif font-semibold text-white truncate">
                            {book.title || "Untitled Book"}
                          </h3>
                          <div className="flex items-center gap-2 text-xs text-zinc-400 mt-0.5 font-mono">
                            <span>{book.genre || "General"}</span>
                            <span>•</span>
                            <span className="text-zinc-200 font-semibold">
                              {isFree ? "FREE" : `$${priceVal.toFixed(2)}`}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        {/* Status badge */}
                        {isPublished ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-mono font-medium text-emerald-400 bg-emerald-950/40 border border-emerald-800/50 rounded-none">
                            <span className="w-1.5 h-1.5 bg-emerald-400" />
                            Published
                          </span>
                        ) : isPending ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-mono font-medium text-amber-400 bg-amber-950/40 border border-amber-800/50 rounded-none">
                            <span className="w-1.5 h-1.5 bg-amber-400 animate-pulse" />
                            Pending
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-mono font-medium text-rose-400 bg-rose-950/40 border border-rose-800/50 rounded-none">
                            <span className="w-1.5 h-1.5 bg-rose-400" />
                            Unpublished
                          </span>
                        )}

                        <Link
                          href="/dashboard/writer/manage-ebooks"
                          className="p-1.5 text-zinc-400 hover:text-white bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700/50 transition-colors"
                          title="Edit in Manage Ebooks"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Recent Sales Activity Stream (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-serif font-semibold text-white flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-indigo-400" />
              Recent Book Sales
            </h2>
            <Link
              href="/dashboard/writer/sales-history"
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium inline-flex items-center gap-1"
            >
              View History ({sales.length}) <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="rounded-none border border-zinc-800/80 bg-[#121216]/60 overflow-hidden shadow-xl">
            {loading || sessionLoading ? (
              <div className="p-12 text-center text-zinc-500 text-xs font-mono flex flex-col items-center justify-center gap-3">
                <Loader2 className="w-6 h-6 animate-spin text-indigo-400" />
                <span>Loading sales stream...</span>
              </div>
            ) : recentSales.length === 0 ? (
              <div className="p-12 text-center text-zinc-500 text-xs space-y-2 flex flex-col items-center justify-center">
                <CreditCard className="w-9 h-9 text-zinc-600 stroke-[1.5]" />
                <p className="text-zinc-300 font-serif text-sm">No sales recorded yet.</p>
                <p className="text-xs text-zinc-500 max-w-xs">
                  Sales will automatically display here when readers acquire your books.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-zinc-800/60">
                {recentSales.map((sale, idx) => {
                  const saleId = sale._id || `${sale.ebookId}-${idx}`;
                  const isPaid = (sale.status || "paid").toLowerCase() === "paid";

                  return (
                    <div
                      key={saleId}
                      className="p-4 flex items-center justify-between gap-3 hover:bg-zinc-900/40 transition-colors"
                    >
                      <div className="space-y-1 min-w-0">
                        <h4 className="text-xs font-serif font-semibold text-white truncate">
                          {sale.ebookTitle || "Untitled Book"}
                        </h4>
                        <div className="flex items-center gap-2 text-[11px] text-zinc-400 font-mono">
                          <span className="flex items-center gap-1 text-zinc-300 truncate max-w-35">
                            <User className="w-3 h-3 text-zinc-500 shrink-0" />
                            {sale.buyerName ? sale.buyerName.trim() : "Reader"}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1 text-zinc-500">
                            <Calendar className="w-3 h-3 text-zinc-600 shrink-0" />
                            {formatDate(sale.purchaseDate || sale.createdAt)}
                          </span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-xs font-mono font-bold text-emerald-400">
                          {formatCurrency(sale.amount, sale.currency)}
                        </div>
                        <span className="text-[10px] font-mono text-zinc-500 uppercase">
                          {isPaid ? "Paid" : sale.status || "Completed"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
