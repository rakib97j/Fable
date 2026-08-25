"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  BookOpen,
  Bookmark,
  BookmarkCheck,
  ShoppingCart,
  CheckCircle2,
  Calendar,
  Tag,
  User,
  ArrowLeft,
  BookX,
  Star,
  Eye,
  FileText,
  Lock,
  Sparkles,
  Share2,
} from "lucide-react";
import { useSession } from "@/lib/auth-client";

export default function EBookDetailsClient({ ebook }) {
  const [mounted, setMounted] = useState(false);
  const { data: session } = useSession();
  const currentUser = session?.user;

  // UI Interactive States
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isPurchased, setIsPurchased] = useState(false);
  const [activeTab, setActiveTab] = useState("overview"); // 'overview' | 'preview'
  const [toastMessage, setToastMessage] = useState("");

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  // Ebook not found state
  if (!ebook) {
    return (
      <div className="min-h-[80vh] w-full flex items-center justify-center py-16 px-4 bg-[#0a0a0c]">
        <div className="max-w-md w-full text-center flex flex-col items-center p-8 rounded-none bg-[#121216]/80 border border-zinc-800 shadow-2xl backdrop-blur-xl">
          <div className="w-20 h-20 mb-6 rounded-none bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
            <BookX className="w-10 h-10" />
          </div>

          <span className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider bg-rose-500/10 text-rose-400 rounded-none border border-rose-500/20 mb-3">
            404 — Not Found
          </span>

          <h2 className="text-2xl font-serif font-bold text-zinc-100 mb-2">
            E-book Not Found
          </h2>

          <p className="text-xs text-zinc-400 max-w-sm mx-auto mb-6 leading-relaxed">
            The e-book you are looking for does not exist, has been removed, or the link may be invalid.
          </p>

          <Link
            href="/e-books"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-none bg-linear-to-tr from-rose-600 via-rose-500 to-pink-500 hover:from-rose-500 hover:to-pink-400 text-white font-medium text-sm shadow-lg shadow-rose-600/25 transition-all active:scale-[0.98]"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Browse E-books
          </Link>
        </div>
      </div>
    );
  }

  // Extract properties with fallbacks
  const priceVal = typeof ebook.price === "number" ? ebook.price : parseFloat(ebook.price) || 0;
  const isFree = ebook.isFree || priceVal === 0;
  const writerName = ebook.writerName || ebook.author || "Unknown Author";

  // Check if current user is admin or author
  const isAdmin = Boolean(mounted && currentUser?.role?.toLowerCase() === "admin");

  // Check if current user is the writer/author (mounted check prevents hydration mismatch)
  const isAuthor = Boolean(
    mounted &&
      currentUser &&
      ((ebook.writerId && String(currentUser.id) === String(ebook.writerId)) ||
        (ebook.writerEmail && currentUser.email?.toLowerCase() === ebook.writerEmail?.toLowerCase()) ||
        (ebook.author && currentUser.name?.toLowerCase() === ebook.author?.toLowerCase()))
  );

  const hasFullAccess = isFree || isPurchased || isAuthor || isAdmin;

  // Status mapping (Available / Sold / Published / Pending)
  const statusText = ebook.status
    ? String(ebook.status).charAt(0).toUpperCase() + String(ebook.status).slice(1)
    : isFree
    ? "Available"
    : "Available";

  const formattedDate = ebook.createdAt
    ? new Date(ebook.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "Recently Added";

  // Bookmark Toggle Handler
  const handleBookmarkToggle = () => {
    setIsBookmarked((prev) => !prev);
    showToast(
      !isBookmarked
        ? "Saved to your bookmarks!"
        : "Removed from your bookmarks."
    );
  };

  // Purchase Button Click Handler (UI mock flow)
  const handlePurchaseClick = () => {
    if (isAuthor || isAdmin) return;
    if (isPurchased) {
      showToast("You already own this e-book!");
      setActiveTab("preview");
      return;
    }

    // Toggle purchased UI state for demonstration
    setIsPurchased(true);
    showToast("🎉 Purchase successful! Full content unlocked.");
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white py-10 px-4 sm:px-6 lg:px-8 selection:bg-rose-500 selection:text-white">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-none bg-zinc-900 border border-rose-500/40 text-rose-300 text-xs font-medium shadow-2xl flex items-center gap-2.5 animate-bounce">
          <Sparkles className="w-4 h-4 text-rose-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="max-w-6xl mx-auto space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            href="/e-books"
            className="inline-flex items-center gap-2 text-xs font-medium text-zinc-400 hover:text-rose-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to E-books
          </Link>

          <button
            onClick={() => {
              if (navigator.clipboard) {
                navigator.clipboard.writeText(window.location.href);
                showToast("Link copied to clipboard!");
              }
            }}
            className="p-2 rounded-none bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors text-xs flex items-center gap-1.5 cursor-pointer"
            title="Share this e-book"
          >
            <Share2 className="w-3.5 h-3.5" /> Share
          </button>
        </div>

        {/* Main Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: High Resolution Cover Image */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="relative group aspect-3/4 w-full max-w-sm sm:max-w-md rounded-none overflow-hidden border border-zinc-800 bg-zinc-900 shadow-2xl transition-all duration-500 hover:border-rose-500/40">
              {ebook.coverImage ? (
                <Image
                  src={ebook.coverImage}
                  alt={ebook.title || "E-book Cover"}
                  fill
                  priority
                  className="object-cover group-hover:scale-105 transition-transform duration-700 rounded-none"
                  sizes="(max-width: 768px) 100vw, 40vw"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-zinc-600 bg-zinc-900 p-8 text-center rounded-none">
                  <BookOpen className="w-16 h-16 mb-3 text-rose-500/60 stroke-[1.5]" />
                  <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest">
                    Fable Original
                  </span>
                </div>
              )}
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-linear-to-t from-[#0a0a0c] via-transparent to-transparent opacity-40 pointer-events-none" />

              {/* Status Badge Over Image */}
              <span
                className={`absolute top-4 left-4 px-3 py-1 text-[11px] font-bold uppercase tracking-wider rounded-none backdrop-blur-md border ${
                  statusText.toLowerCase() === "available" || isFree
                    ? "bg-emerald-950/80 text-emerald-400 border-emerald-500/40"
                    : statusText.toLowerCase() === "sold"
                    ? "bg-rose-950/80 text-rose-400 border-rose-500/40"
                    : "bg-amber-950/80 text-amber-400 border-amber-500/40"
                }`}
              >
                {statusText}
              </span>
            </div>
          </div>

          {/* Right Column: Ebook Metadata & Purchase Card */}
          <div className="lg:col-span-7 space-y-6">
            {/* Header & Badges */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                {ebook.genre && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-none bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium">
                    <Tag className="w-3 h-3" /> {ebook.genre}
                  </span>
                )}
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-none bg-zinc-900 border border-zinc-800 text-zinc-400 text-xs font-medium">
                  <Calendar className="w-3 h-3 text-zinc-500" /> {formattedDate}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-zinc-100 tracking-tight leading-tight">
                {ebook.title}
              </h1>

              {/* Writer Name */}
              <div className="flex items-center gap-2 text-sm text-zinc-400 pt-1">
                <User className="w-4 h-4 text-rose-500" />
                <span>Written by</span>
                <span className="text-zinc-200 font-semibold">{writerName}</span>
                {isAuthor && (
                  <span className="ml-2 px-2 py-0.5 text-[10px] font-bold bg-rose-600/30 text-rose-300 rounded-none border border-rose-500/30 uppercase">
                    You (Author)
                  </span>
                )}
                {isAdmin && (
                  <span className="ml-2 px-2 py-0.5 text-[10px] font-bold bg-amber-600/30 text-amber-300 rounded-none border border-amber-500/30 uppercase">
                    Admin Access
                  </span>
                )}
              </div>
            </div>

            {/* Rating & Pricing Block */}
            <div className="p-6 rounded-none bg-[#121216] border border-zinc-800/90 shadow-xl flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block mb-1">
                  PRICE
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-serif font-bold text-white">
                    {isFree ? "Free" : `$${priceVal.toFixed(2)}`}
                  </span>
                  {!isFree && (
                    <span className="text-xs text-zinc-500">USD</span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-none bg-zinc-900 border border-zinc-800 text-amber-400 text-sm">
                <Star className="w-4 h-4 fill-amber-400" />
                <span className="font-bold text-white">{ebook.rating || "4.9"}</span>
                <span className="text-xs text-zinc-500">({ebook.reviewsCount || 68} reviews)</span>
              </div>
            </div>

            {/* Primary Action Row: Purchase & Bookmark Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch gap-3">
              {/* Purchase / Owned / Admin Full Access Button */}
              {isAdmin ? (
                <button
                  onClick={() => setActiveTab("preview")}
                  className="flex-1 py-4 px-6 rounded-none bg-amber-600 hover:bg-amber-500 text-white font-semibold text-sm shadow-lg shadow-amber-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Admin Full Access — Read Content</span>
                </button>
              ) : isPurchased || isFree ? (
                <button
                  onClick={() => setActiveTab("preview")}
                  className="flex-1 py-4 px-6 rounded-none bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span>{isFree ? "Read Now (Free)" : "Already Purchased — Read"}</span>
                </button>
              ) : isAuthor ? (
                <button
                  disabled
                  className="flex-1 py-4 px-6 rounded-none bg-zinc-800/80 border border-zinc-700/60 text-zinc-400 font-semibold text-sm flex items-center justify-center gap-2 cursor-not-allowed opacity-80"
                  title="You cannot purchase your own e-book"
                >
                  <Lock className="w-4 h-4 text-zinc-500" />
                  <span>Buyer is the Writer (Disabled)</span>
                </button>
              ) : (
                <button
                  onClick={handlePurchaseClick}
                  className="flex-1 py-4 px-6 rounded-none bg-linear-to-tr from-rose-600 via-rose-500 to-pink-500 hover:from-rose-500 hover:to-pink-400 text-white font-semibold text-sm shadow-xl shadow-rose-600/25 active:scale-[0.99] transition-all flex items-center justify-center gap-2.5 cursor-pointer"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>Buy Now ({`$${priceVal.toFixed(2)}`})</span>
                </button>
              )}

              {/* Bookmark UI Button */}
              <button
                onClick={handleBookmarkToggle}
                className={`py-4 px-5 rounded-none border font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  isBookmarked
                    ? "bg-rose-500/15 border-rose-500/50 text-rose-400 shadow-md"
                    : "bg-[#121216] border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white"
                }`}
                title={isBookmarked ? "Remove Bookmark" : "Bookmark E-book"}
              >
                {isBookmarked ? (
                  <>
                    <BookmarkCheck className="w-5 h-5 text-rose-400 fill-rose-500/20" />
                    <span>Bookmarked</span>
                  </>
                ) : (
                  <>
                    <Bookmark className="w-5 h-5 text-zinc-400" />
                    <span>Bookmark</span>
                  </>
                )}
              </button>
            </div>

            {/* Content Tabs (Overview vs Reader Preview) */}
            <div className="pt-6 border-t border-zinc-800/80">
              <div className="flex border-b border-zinc-800 mb-4">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`pb-3 px-4 text-sm font-semibold transition-all relative cursor-pointer ${
                    activeTab === "overview"
                      ? "text-rose-500 dark:text-rose-400"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <FileText className="w-4 h-4" /> Description & Details
                  </span>
                  {activeTab === "overview" && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-rose-500 rounded-none" />
                  )}
                </button>

                <button
                  onClick={() => {
                    if (!hasFullAccess) {
                      showToast("🔒 Page preview is locked! Purchase this e-book to unlock full content.");
                      return;
                    }
                    setActiveTab("preview");
                  }}
                  className={`pb-3 px-4 text-sm font-semibold transition-all relative cursor-pointer ${
                    activeTab === "preview"
                      ? "text-rose-500 dark:text-rose-400"
                      : !hasFullAccess
                      ? "text-zinc-500 hover:text-zinc-400 opacity-80"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {!hasFullAccess ? (
                      <Lock className="w-4 h-4 text-rose-500/80" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )} 
                    Page Preview
                    {!hasFullAccess && (
                      <span className="ml-1 px-1.5 py-0.5 text-[10px] bg-rose-500/10 text-rose-400 border border-rose-500/20 font-mono uppercase">
                        Locked
                      </span>
                    )}
                  </span>
                  {activeTab === "preview" && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-rose-500 rounded-none" />
                  )}
                </button>
              </div>

              {/* Tab 1: Description & Details */}
              {activeTab === "overview" && (
                <div className="space-y-4 text-zinc-300 text-sm leading-relaxed">
                  <p className="whitespace-pre-line font-light">
                    {ebook.shortDescription ||
                      ebook.description ||
                      "No detailed description provided for this e-book. Discover the original work written by " +
                        writerName +
                        "."}
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t border-zinc-800/60 text-xs">
                    <div className="p-3 rounded-none bg-[#121216] border border-zinc-800">
                      <span className="text-zinc-500 block mb-1">Format</span>
                      <span className="font-semibold text-zinc-200">EPUB / PDF</span>
                    </div>
                    <div className="p-3  bg-[#121216] border border-zinc-800 rounded-none">
                      <span className="text-zinc-500 block mb-1">Language</span>
                      <span className="font-semibold text-zinc-200">English</span>
                    </div>
                    <div className="p-3  bg-[#121216] border border-zinc-800 rounded-none">
                      <span className="text-zinc-500 block mb-1">Publisher</span>
                      <span className="font-semibold text-zinc-200">Fable Publishing</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Page View Reader Preview */}
              {activeTab === "preview" && (
                <div className="p-6 rounded-none bg-[#121216] border border-zinc-800 text-zinc-300 space-y-4 font-serif leading-relaxed">
                  <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80">
                    <span className="text-xs font-mono text-rose-400 uppercase tracking-wider">
                      FULL E-BOOK CONTENT
                    </span>
                    <span className="text-xs text-zinc-500">Unlocked</span>
                  </div>

                  <h3 className="text-xl font-bold text-white">
                    {ebook.title}
                  </h3>

                  <p className="text-sm text-zinc-300 italic">
                    By {writerName}
                  </p>

                  <div className="space-y-3 pt-2 text-sm text-zinc-300 whitespace-pre-line font-sans">
                    {ebook.description ? ebook.description : "No content available for this e-book."}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
