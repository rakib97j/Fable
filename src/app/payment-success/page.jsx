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

  if (loading) {
    return (
      <div className="min-h-[80vh] w-full flex items-center justify-center p-4 bg-[#0a0a0c]">
        <div className="flex flex-col items-center gap-4 p-8 rounded-none bg-[#121216] border border-zinc-800 text-center max-w-sm w-full">
          <Loader2 className="w-10 h-10 animate-spin text-emerald-500" />
          <h3 className="text-lg font-bold text-zinc-100 font-serif">Verifying Payment...</h3>
          <p className="text-xs text-zinc-400">Please wait while we confirm your Stripe checkout session.</p>
        </div>
      </div>
    );
  }

  if (error || !sessionDetails) {
    return (
      <div className="min-h-[80vh] w-full flex items-center justify-center p-4 bg-[#0a0a0c]">
        <div className="max-w-md w-full text-center flex flex-col items-center p-8 rounded-none bg-[#121216] border border-zinc-800 shadow-2xl">
          <div className="w-16 h-16 mb-4 rounded-none bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
            <BookX className="w-8 h-8" />
          </div>
          <span className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider bg-rose-500/10 text-rose-400 mb-3 border border-rose-500/20">
            Payment Unverified
          </span>
          <h2 className="text-2xl font-serif font-bold text-zinc-100 mb-2">
            Unable to Verify Payment
          </h2>
          <p className="text-xs text-zinc-400 mb-6 leading-relaxed">
            {error || "We could not confirm your purchase. If you were charged, please check your email or contact support."}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <Link
              href="/e-books"
              className="flex-1 py-3 px-4 rounded-none bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-medium text-xs text-center border border-zinc-700 transition-all"
            >
              Browse E-books
            </Link>
            <Link
              href="/dashboard/reader/purchased-ebooks"
              className="flex-1 py-3 px-4 rounded-none bg-rose-600 hover:bg-rose-500 text-white font-medium text-xs text-center shadow-lg transition-all"
            >
              My Library
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const finalEbookId = sessionDetails.ebookId || ebookIdParam;
  const bookTitle = ebookDetails?.title || "Digital E-book";
  const coverImage = ebookDetails?.coverImage || ebookDetails?.image;
  const authorName = ebookDetails?.writerName || ebookDetails?.author || "Fable Author";

  return (
    <div className="min-h-[85vh] w-full flex items-center justify-center py-12 px-4 bg-[#0a0a0c]">
      <div className="max-w-xl w-full flex flex-col items-center">
        {/* Main Success Glass Card */}
        <div className="w-full rounded-none bg-[#121216] border border-zinc-800/90 shadow-2xl p-6 sm:p-10 relative overflow-hidden backdrop-blur-xl">
          {/* Subtle Accent Glow */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Success Badge Icon */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="relative mb-4">
              <div className="w-20 h-20 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-xl shadow-emerald-500/10">
                <CheckCircle2 className="w-10 h-10 text-emerald-400" />
              </div>
              <div className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300 animate-pulse">
                <Sparkles className="w-4 h-4" />
              </div>
            </div>

            <span className="px-3.5 py-1 text-[11px] font-bold uppercase tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-2">
              Payment Successful
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
              Thank You for Your Order!
            </h1>
            <p className="text-xs text-zinc-400 mt-2 max-w-md leading-relaxed">
              Your payment has been processed successfully. Your e-book is now unlocked and added to your personal library.
            </p>
          </div>

          {/* E-Book Purchased Card */}
          {ebookDetails && (
            <div className="mb-6 p-4 rounded-none bg-[#0a0a0c] border border-zinc-800 flex items-center gap-4">
              {coverImage ? (
                <div className="relative w-16 h-22 shrink-0 bg-zinc-900 border border-zinc-800 overflow-hidden shadow-md">
                  <Image
                    src={coverImage}
                    alt={bookTitle}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-16 h-22 shrink-0 bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-600">
                  <BookOpen className="w-8 h-8" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-semibold text-rose-400 uppercase tracking-wider block">
                  Unlocked E-book
                </span>
                <h3 className="text-base font-serif font-bold text-white truncate">
                  {bookTitle}
                </h3>
                <p className="text-xs text-zinc-400 truncate">
                  By {authorName}
                </p>
                <div className="mt-2 inline-flex items-center gap-1.5 text-[11px] text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Full Access Granted
                </div>
              </div>
            </div>
          )}

          {/* Receipt Breakdown */}
          <div className="mb-8 p-4 rounded-none bg-[#0a0a0c]/60 border border-zinc-800/80 space-y-3">
            <div className="flex items-center justify-between text-xs pb-2.5 border-b border-zinc-800/80">
              <span className="text-zinc-400 flex items-center gap-1.5">
                <Receipt className="w-3.5 h-3.5 text-zinc-500" /> Amount Paid
              </span>
              <span className="font-serif font-bold text-white text-sm">
                ${sessionDetails.amountTotal} {sessionDetails.currency}
              </span>
            </div>

            {sessionDetails.customerEmail && (
              <div className="flex items-center justify-between text-xs pb-2.5 border-b border-zinc-800/80">
                <span className="text-zinc-400 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-zinc-500" /> Customer Email
                </span>
                <span className="text-zinc-200 font-mono text-[11px] truncate max-w-50">
                  {sessionDetails.customerEmail}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between text-xs pb-2.5 border-b border-zinc-800/80">
              <span className="text-zinc-400 flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-zinc-500" /> Payment Method
              </span>
              <span className="text-zinc-300 font-medium capitalize">
                Stripe ({sessionDetails.paymentMethod})
              </span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-400">Transaction Ref</span>
              <span className="text-zinc-500 font-mono text-[10px] truncate max-w-45" title={sessionDetails.sessionId}>
                {sessionDetails.sessionId}
              </span>
            </div>
          </div>

          {/* Action Navigation */}
          <div className="flex flex-col sm:flex-row gap-3">
            {finalEbookId && (
              <Link
                href={`/e-books/${finalEbookId}?success=true&session_id=${sessionDetails.sessionId}`}
                className="flex-1 py-3.5 px-6 rounded-none bg-linear-to-tr from-rose-600 via-rose-500 to-pink-500 hover:from-rose-500 hover:to-pink-400 text-white font-semibold text-xs shadow-lg shadow-rose-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
              >
                <BookOpen className="w-4 h-4" />
                <span>Read E-Book Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}

            <Link
              href="/dashboard/reader/purchased-ebooks"
              className="py-3.5 px-5 rounded-none bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-200 font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Library className="w-4 h-4 text-zinc-400" />
              <span>My Purchased Library</span>
            </Link>
          </div>
        </div>

        {/* Back link */}
        <div className="mt-6">
          <Link
            href="/e-books"
            className="text-xs text-zinc-400 hover:text-white transition-colors flex items-center gap-1.5"
          >
            <span>Browse More E-Books</span>
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
        <div className="min-h-[80vh] w-full flex items-center justify-center p-4 bg-[#0a0a0c]">
          <div className="flex flex-col items-center gap-4 p-8 rounded-none bg-[#121216] border border-zinc-800 text-center max-w-sm w-full">
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
