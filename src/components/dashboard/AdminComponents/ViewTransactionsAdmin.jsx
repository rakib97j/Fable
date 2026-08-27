"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Receipt,
  Search,
  DollarSign,
  ArrowUpRight,
  Calendar,
  CreditCard,
  Mail,
  RefreshCw,
  Loader2,
  CheckCircle2,
  Clock,
  XCircle,
  Tag,
} from "lucide-react";
import { getAdminPayments } from "@/lib/actions/adminAction";

export default function ViewTransactionsAdmin() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState("all"); 

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const res = await getAdminPayments();
      if (res?.success && Array.isArray(res.data)) {
        setTransactions(res.data);
      } else {
        // Fallback fetch if action returns empty/failed
        const rawRes = await fetch("/api/admin/payments", { cache: "no-store" });
        if (rawRes.ok) {
          const data = await rawRes.json();
          const list = Array.isArray(data)
            ? data
            : Array.isArray(data?.data)
            ? data.data
            : [];
          setTransactions(list);
        } else {
          setTransactions([]);
        }
      }
    } catch (err) {
      console.error("Error fetching transactions:", err);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // Filter transactions by type
  const filteredTransactions = useMemo(() => {
    return transactions.filter((item) => {
      const typeStr = (item.type || item.paymentType || "purchase").toLowerCase();
      
      if (selectedType === "purchase") {
        return typeStr.includes("purchase") || typeStr.includes("ebook") || typeStr === "buy";
      }

      return true;
    });
  }, [transactions, selectedType]);

  // Statistics calculation
  const stats = useMemo(() => {
    let totalVolume = 0;
    let purchaseCount = 0;
    let feeCount = 0;

    transactions.forEach((tx) => {
      const amt = parseFloat(tx.amount || tx.amountTotal || 0);
      totalVolume += isNaN(amt) ? 0 : amt;

      const typeStr = (tx.type || tx.paymentType || "purchase").toLowerCase();
      if (typeStr.includes("publishing") || typeStr.includes("fee")) {
        feeCount++;
      } else {
        purchaseCount++;
      }
    });

    return {
      totalVolume: totalVolume.toFixed(2),
      totalCount: transactions.length,
      purchaseCount,
      feeCount,
    };
  }, [transactions]);

  // Helper for formatting transaction type badge
  const renderTypeBadge = (rawType) => {
    const typeStr = (rawType || "purchase").toLowerCase();
    if (typeStr.includes("publishing") || typeStr.includes("fee")) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-none text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
          <Tag className="w-3 h-3" /> Publishing Fee
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-none text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
        <ArrowUpRight className="w-3 h-3" /> E-Book Purchase
      </span>
    );
  };

  // Helper for formatting status
  const renderStatusBadge = (status) => {
    const statusStr = (status || "paid").toLowerCase();
    if (statusStr === "paid" || statusStr === "completed" || statusStr === "succeeded") {
      return (
        <span className="inline-flex items-center gap-1 text-xs text-emerald-400">
          <CheckCircle2 className="w-3.5 h-3.5" /> Paid
        </span>
      );
    }
    if (statusStr === "pending") {
      return (
        <span className="inline-flex items-center gap-1 text-xs text-amber-400">
          <Clock className="w-3.5 h-3.5" /> Pending
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-xs text-rose-400">
        <XCircle className="w-3.5 h-3.5" /> {status || "Failed"}
      </span>
    );
  };

  // Date formatting helper
  const formatDate = (dateVal) => {
    if (!dateVal) return "N/A";
    try {
      return new Date(dateVal).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return String(dateVal);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-semibold text-zinc-100 flex items-center gap-2.5">
            <Receipt className="w-7 h-7 text-amber-500" />
            View Transactions
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Track all platform payments, publishing fees, and reader e-book purchases.
          </p>
        </div>
        <button
          onClick={fetchTransactions}
          disabled={loading}
          className="self-start md:self-auto inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-none border border-zinc-800 bg-zinc-900/80 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors disabled:opacity-50 cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-none border border-zinc-800/80 bg-[#121216]/60 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400 font-medium">Total Revenue</span>
            <div className="p-2 rounded-none bg-emerald-500/10 text-emerald-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-semibold text-zinc-100 mt-2 font-mono">
            ${stats.totalVolume}
          </p>
          <span className="text-[11px] text-zinc-500 mt-1 block">Gross earnings across platform</span>
        </div>

        <div className="p-4 rounded-none border border-zinc-800/80 bg-[#121216]/60 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400 font-medium">Total Transactions</span>
            <div className="p-2 rounded-none bg-indigo-500/10 text-indigo-400">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-semibold text-zinc-100 mt-2 font-mono">
            {stats.totalCount}
          </p>
          <span className="text-[11px] text-zinc-500 mt-1 block">All completed transactions</span>
        </div>

        <div className="p-4 rounded-none border border-zinc-800/80 bg-[#121216]/60 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400 font-medium">E-Book Purchases</span>
            <div className="p-2 rounded-none bg-blue-500/10 text-blue-400">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-semibold text-zinc-100 mt-2 font-mono">
            {stats.purchaseCount}
          </p>
          <span className="text-[11px] text-zinc-500 mt-1 block">Reader purchases</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-none border border-zinc-800/80 bg-[#121216]/60 backdrop-blur-md flex items-center justify-between">
        {/* Type Filter Buttons */}
        <div className="flex items-center gap-1 bg-zinc-900/90 p-1 rounded-none border border-zinc-800 self-start">
          <button
            onClick={() => setSelectedType("all")}
            className={`px-3 py-1.5 text-xs font-medium rounded-none transition-colors cursor-pointer ${
              selectedType === "all"
                ? "bg-zinc-800 text-white shadow-sm"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            All Types ({transactions.length})
          </button>
          <button
            onClick={() => setSelectedType("purchase")}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              selectedType === "purchase"
                ? "bg-zinc-800 text-white shadow-sm"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Purchases
          </button>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="rounded-none border border-zinc-800/80 bg-[#121216]/60 backdrop-blur-md overflow-hidden">
        {loading ? (
          <div className="p-16 text-center space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-amber-500 mx-auto" />
            <p className="text-sm text-zinc-400">Loading transactions data...</p>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="p-16 text-center space-y-3">
            <Receipt className="w-10 h-10 text-zinc-600 mx-auto" />
            <p className="text-base font-medium text-zinc-300">No transactions found</p>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              {selectedType !== "all"
                ? "Try adjusting your filter tabs."
                : "No payment transactions recorded in the system yet."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-800/80 bg-zinc-900/40 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Transaction ID</th>
                  <th className="py-3.5 px-4">Type</th>
                  <th className="py-3.5 px-4">User / Writer Email</th>
                  <th className="py-3.5 px-4">Amount</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4 text-right">Status / Method</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50 text-xs text-zinc-300">
                {filteredTransactions.map((tx, idx) => {
                  const txId = tx._id || tx.sessionId || tx.transactionId || tx.id || `TX-${idx + 1}`;
                  const userEmail = tx.userEmail || tx.customerEmail || tx.email || tx.writerEmail || "N/A";
                  const amount = parseFloat(tx.amount || tx.amountTotal || 0).toFixed(2);
                  const currency = (tx.currency || "USD").toUpperCase();
                  const dateStr = formatDate(tx.createdAt || tx.date || tx.timestamp);
                  const paymentMethod = tx.paymentMethod || tx.method || "Stripe (card)";

                  return (
                    <tr
                      key={txId + idx}
                      className="hover:bg-zinc-800/30 transition-colors"
                    >
                      {/* Transaction ID */}
                      <td className="py-3.5 px-4 font-mono text-zinc-400 font-medium">
                        <span className="truncate max-w-35 block" title={txId}>
                          {txId.length > 18 ? `${txId.slice(0, 8)}...${txId.slice(-6)}` : txId}
                        </span>
                      </td>

                      {/* Type */}
                      <td className="py-3.5 px-4">
                        {renderTypeBadge(tx.type || tx.paymentType)}
                      </td>

                      {/* User/Writer Email */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <Mail className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                          <span className="text-zinc-200 font-medium truncate max-w-50" title={userEmail}>
                            {userEmail}
                          </span>
                        </div>
                      </td>

                      {/* Amount */}
                      <td className="py-3.5 px-4 font-mono font-semibold text-emerald-400 text-sm">
                        ${amount} <span className="text-[10px] text-zinc-500 font-normal">{currency}</span>
                      </td>

                      {/* Date */}
                      <td className="py-3.5 px-4 text-zinc-400 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                          <span>{dateStr}</span>
                        </div>
                      </td>

                      {/* Status / Method */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex flex-col items-end gap-1">
                          {renderStatusBadge(tx.status)}
                          <span className="text-[10px] text-zinc-500 flex items-center gap-1">
                            <CreditCard className="w-3 h-3 text-zinc-600" />
                            {paymentMethod}
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
