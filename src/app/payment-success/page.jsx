"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import {
  CheckCircle2,
  BookOpen,
  ArrowRight,
  Sparkles,
  CreditCard,
  Mail,
  Receipt,
  Library,
  BookX,
  Loader2,
  Download,
  ShieldCheck,
  Calendar,
  ExternalLink,
  ChevronRight,
  BookmarkCheck,
} from "lucide-react";
import { getEBookById } from "@/lib/actions/eBooks";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const ebookIdParam = searchParams.get("ebook_id") || searchParams.get("ebookId");

  const [loading, setLoading] = useState(true);
  const [sessionDetails, setSessionDetails] = useState(null);
  const [ebookDetails, setEbookDetails] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function verifyAndFetch() {
      if (!sessionId) {
        setLoading(false);
        setError("No payment session ID found.");
        return;
      }

      try {
        const verifyRes = await fetch(
          `/api/checkout_sessions/verify?session_id=${encodeURIComponent(sessionId)}`
        );
        const verifyData = await verifyRes.json();

        if (verifyData.success && verifyData.paid) {
          setSessionDetails(verifyData);

          const targetEbookId = verifyData.ebookId || ebookIdParam;
          if (targetEbookId) {
            const ebookRes = await getEBookById(targetEbookId);
            if (ebookRes?.success && ebookRes?.data) {
              setEbookDetails(ebookRes.data);
            }
          }
        } else {
          setError(verifyData.message || "Payment verification failed or session unpaid.");
        }
      } catch (err) {
        console.error("Payment success verification error:", err);
        setError("Failed to verify payment session.");
      } finally {
        setLoading(false);
      }
    }

    verifyAndFetch();
  }, [sessionId, ebookIdParam]);

  // Loading State UI
  if (loading) {
    return (
      <div className="min-h-[85vh] w-full flex items-center justify-center p-6 bg-[#0a0a0c]">
        <div className="flex flex-col items-center text-center p-10 rounded-3xl bg-[#121216]/80 border border-zinc-800/80 shadow-2xl backdrop-blur-2xl max-w-md w-full space-y-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
            <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300 animate-ping" />
          </div>
          <h3 className="text-xl font-serif font-semibold text-zinc-100">
            Confirming Payment...
          </h3>
          <p className="text-xs text-zinc-400 leading-relaxed max-w-xs">
            Securing transaction authorization with Stripe. Your e-book will be ready in a moment.
          </p>
        </div>
      </div>
    );
  }

  // Error / Unverified State UI
  if (error || !sessionDetails) {
    return (
      <div className="min-h-[85vh] w-full flex items-center justify-center p-6 bg-[#0a0a0c]">
        <div className="max-w-lg w-full text-center flex flex-col items-center p-8 sm:p-10 rounded-3xl bg-[#121216]/80 border border-zinc-800/80 shadow-2xl backdrop-blur-2xl space-y-5">
          <div className="w-20 h-20 rounded-3xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 shadow-xl shadow-rose-500/5">
            <BookX className="w-10 h-10" />
          </div>
          
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider bg-rose-500/10 text-rose-400 rounded-full border border-rose-500/20">
              Payment Unverified
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-zinc-100">
              Unable to Confirm Order
            </h2>
            <p className="text-xs text-zinc-400 leading-relaxed max-w-md mx-auto">
              {error || "We could not verify your purchase session. If funds were deducted, don't worry—your order has been logged."}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full pt-4 border-t border-zinc-800/60">
            <Link
              href="/e-books"
              className="flex-1 py-3 px-4 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 text-zinc-200 font-medium text-xs text-center border border-zinc-700/80 transition-all"
            >
              Browse E-Books
            </Link>
            <Link
              href="/dashboard/reader/purchased-ebooks"
              className="flex-1 py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-medium text-xs text-center shadow-lg shadow-rose-600/20 transition-all"
            >
              Check My Library
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const finalEbookId = sessionDetails.ebookId || ebookIdParam;
  const bookTitle = ebookDetails?.title || "Digital E-Book";
  const coverImage = ebookDetails?.coverImage || ebookDetails?.image;
  const authorName = ebookDetails?.writerName || ebookDetails?.author || "Fable Author";
  const genre = ebookDetails?.genre || ebookDetails?.category || "E-Book";
  const pricePaid = sessionDetails.amountTotal || "0.00";
  const formattedDate = sessionDetails.createdAt
    ? new Date(sessionDetails.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "Just now";

  return (
    <div className="min-h-[85vh] w-full flex items-center justify-center py-14 px-4 bg-[#0a0a0c] relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[350px] h-[350px] bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-2xl w-full flex flex-col items-center relative z-10">
        {/* Main Success Container */}
        <div className="w-full rounded-3xl bg-[#121216]/80 border border-zinc-800/80 shadow-2xl p-6 sm:p-10 backdrop-blur-2xl space-y-8">
          
          {/* Header Banner & Animated Badge */}
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="relative">
              {/* Outer pulsing ring */}
              <div className="absolute -inset-2 rounded-full bg-linear-to-r from-emerald-500/30 to-teal-500/30 blur-md animate-pulse" />
              <div className="w-20 h-20 rounded-full bg-linear-to-tr from-emerald-600 to-teal-500 border border-emerald-400/40 flex items-center justify-center text-white shadow-2xl shadow-emerald-500/30 relative">
                <CheckCircle2 className="w-10 h-10 text-white stroke-[2.5]" />
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold tracking-wider uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <ShieldCheck className="w-3.5 h-3.5" /> Order Verified
              </span>
              <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
                Payment Successful!
              </h1>
              <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto leading-relaxed">
                Thank you for your purchase. Your digital e-book has been unlocked and added to your personal library.
              </p>
            </div>
          </div>

          {/* E-Book Access Highlight Card */}
          {ebookDetails ? (
            <div className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800 flex flex-col sm:flex-row items-center gap-5 relative overflow-hidden group hover:border-zinc-700/80 transition-all">
              <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full blur-2xl pointer-events-none" />
              
              {/* Cover Image */}
              {coverImage ? (
                <div className="relative w-24 h-32 shrink-0 rounded-xl bg-zinc-950 border border-zinc-800 overflow-hidden shadow-lg group-hover:scale-105 transition-transform duration-300">
                  <Image
                    src={coverImage}
                    alt={bookTitle}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-24 h-32 shrink-0 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-zinc-600 shadow-lg">
                  <BookOpen className="w-10 h-10" />
                </div>
              )}

              {/* Book Details */}
              <div className="flex-1 min-w-0 text-center sm:text-left space-y-2">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-rose-500/10 text-rose-400 border border-rose-500/20">
                    {genre}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400">
                    <BookmarkCheck className="w-3.5 h-3.5" /> Full Access Unlocked
                  </span>
                </div>

                <h3 className="text-lg font-serif font-bold text-white line-clamp-1">
                  {bookTitle}
                </h3>
                <p className="text-xs text-zinc-400">
                  By <span className="text-zinc-200 font-medium">{authorName}</span>
                </p>

                <div className="pt-1 flex items-center justify-center sm:justify-start gap-3 text-xs text-zinc-400 font-mono">
                  <span className="text-zinc-300 font-semibold">${pricePaid} USD</span>
                  <span>•</span>
                  <span>{formattedDate}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 flex items-center gap-3 text-xs text-emerald-400">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span>Your e-book purchase has been registered and associated with your account.</span>
            </div>
          )}

          {/* Detailed Payment Breakdown */}
          <div className="rounded-2xl bg-zinc-950/60 border border-zinc-800/80 p-5 space-y-3.5">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80 text-xs">
              <span className="text-zinc-400 flex items-center gap-2">
                <Receipt className="w-4 h-4 text-zinc-500" /> Amount Paid
              </span>
              <span className="font-mono font-bold text-emerald-400 text-sm">
                ${sessionDetails.amountTotal} <span className="text-zinc-500 text-xs">{sessionDetails.currency}</span>
              </span>
            </div>

            {sessionDetails.customerEmail && (
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80 text-xs">
                <span className="text-zinc-400 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-zinc-500" /> Customer Email
                </span>
                <span className="text-zinc-200 font-mono text-xs truncate max-w-[200px]">
                  {sessionDetails.customerEmail}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80 text-xs">
              <span className="text-zinc-400 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-zinc-500" /> Payment Method
              </span>
              <span className="text-zinc-300 font-medium capitalize flex items-center gap-1.5">
                Stripe ({sessionDetails.paymentMethod || "card"})
              </span>
            </div>

            <div className="flex items-center justify-between text-xs pt-0.5">
              <span className="text-zinc-400 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-zinc-500" /> Transaction Ref
              </span>
              <span className="text-zinc-500 font-mono text-[11px] truncate max-w-[180px]" title={sessionDetails.sessionId}>
                {sessionDetails.sessionId}
              </span>
            </div>
          </div>

          {/* Action Navigation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {finalEbookId && (
              <Link
                href={`/e-books/${finalEbookId}?success=true&session_id=${sessionDetails.sessionId}`}
                className="py-3.5 px-6 rounded-xl bg-linear-to-r from-rose-600 via-rose-500 to-pink-500 hover:from-rose-500 hover:to-pink-400 text-white font-semibold text-xs shadow-xl shadow-rose-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
              >
                <BookOpen className="w-4 h-4" />
                <span>Read E-Book Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}

            <Link
              href="/dashboard/reader/purchased-ebooks"
              className="py-3.5 px-6 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700/80 text-zinc-200 font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
            >
              <Library className="w-4 h-4 text-zinc-400" />
              <span>My Purchased Library</span>
            </Link>
          </div>
        </div>

        {/* Footer Navigation Link */}
        <div className="mt-8 text-center">
          <Link
            href="/e-books"
            className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-200 transition-colors group"
          >
            <span>Explore More E-Books</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[85vh] w-full flex items-center justify-center p-6 bg-[#0a0a0c]">
          <div className="flex flex-col items-center gap-4 p-8 rounded-3xl bg-[#121216]/80 border border-zinc-800/80 text-center max-w-sm w-full backdrop-blur-2xl">
            <Loader2 className="w-10 h-10 animate-spin text-emerald-500" />
            <h3 className="text-lg font-bold text-zinc-100 font-serif">Loading Confirmation...</h3>
          </div>
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}
