"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { BookOpen, Bookmark, Trash2, ArrowRight, Loader2, AlertTriangle, X } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { getUserBookmarks, removeBookmark } from "@/lib/actions/eBooks";

export default function BookmarksClientComponent() {
  const { data: session, isPending: sessionLoading } = useSession();
  const user = session?.user;
  const userIdStr = user?.id || user?._id;

  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Confirmation Modal State
  const [deletingBookmark, setDeletingBookmark] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchBookmarks = async () => {
    if (!userIdStr) {
      if (!sessionLoading) setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await getUserBookmarks(userIdStr);
      if (res?.success && Array.isArray(res.data)) {
        setBookmarks(res.data);
      }
    } catch (err) {
      console.error("Failed to load bookmarks:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, [userIdStr, sessionLoading]);

  // Open confirmation modal
  const handleOpenDeleteModal = (bm) => {
    setDeletingBookmark(bm);
  };

  // Close modal
  const handleCloseDeleteModal = () => {
    if (isDeleting) return;
    setDeletingBookmark(null);
  };

  // Confirm removal action
  const handleConfirmRemove = async () => {
    if (!userIdStr || !deletingBookmark) return;
    const targetBookId = deletingBookmark.bookId;

    setIsDeleting(true);

    // Optimistic UI update
    setBookmarks((prev) => prev.filter((b) => String(b.bookId) !== String(targetBookId)));

    try {
      await removeBookmark(userIdStr, targetBookId);
    } catch (err) {
      console.error("Failed to remove bookmark:", err);
      fetchBookmarks();
    } finally {
      setIsDeleting(false);
      setDeletingBookmark(null);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto font-sans">
      <div>
        <h1 className="text-3xl sm:text-4xl font-serif font-semibold text-zinc-100 flex items-center gap-2.5">
          <Bookmark className="w-7 h-7 text-rose-500 fill-rose-500/20" />
          My Bookmarks ({bookmarks.length})
        </h1>
        <p className="text-sm text-zinc-400 mt-1">Your saved books and reading list.</p>
      </div>

      {loading || sessionLoading ? (
        <div className="p-16 flex flex-col items-center justify-center text-zinc-500 gap-3 border border-zinc-800/80 bg-[#121216]/60">
          <Loader2 className="w-6 h-6 animate-spin text-rose-500" />
          <span className="text-xs font-mono">Loading saved bookmarks...</span>
        </div>
      ) : bookmarks.length === 0 ? (
        <div className="p-16 text-center border border-zinc-800/80 bg-[#121216]/60 flex flex-col items-center justify-center gap-3">
          <BookOpen className="w-12 h-12 text-zinc-600 stroke-[1.5]" />
          <h3 className="text-base font-serif font-medium text-zinc-200">No bookmarked books yet</h3>
          <p className="text-xs text-zinc-500 max-w-sm">
            Browse our collection and click the Bookmark button to save books to your reading list.
          </p>
          <Link
            href="/e-books"
            className="mt-2 inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-white bg-rose-600 hover:bg-rose-500 transition-colors"
          >
            Explore E-books <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {bookmarks.map((bm) => {
            const isFree = bm.isFree || bm.price === 0;

            return (
              <div
                key={bm._id || bm.bookId}
                className="group relative bg-[#121215] border border-zinc-800/80 overflow-hidden hover:border-zinc-700 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-4/5 w-full bg-zinc-900 overflow-hidden">
                    {bm.coverImage ? (
                      <Image
                        src={bm.coverImage}
                        alt={bm.title || "Book Cover"}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-zinc-700 bg-zinc-900 p-2">
                        <BookOpen className="w-8 h-8 mb-1 stroke-[1.5]" />
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => handleOpenDeleteModal(bm)}
                      className="absolute top-2 right-2 p-1.5 bg-black/80 backdrop-blur-md border border-zinc-700/60 text-zinc-400 hover:text-rose-400 transition-colors cursor-pointer"
                      title="Remove Bookmark"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="p-3 space-y-1">
                    <h3 className="text-xs font-serif font-medium text-white line-clamp-1">
                      {bm.title}
                    </h3>
                    <p className="text-[11px] text-zinc-400 line-clamp-1">
                      by <span className="text-zinc-300">{bm.writerName}</span>
                    </p>
                  </div>
                </div>

                <div className="p-3 pt-1.5 border-t border-zinc-800/60 flex items-center justify-between mt-auto">
                  <span className="text-[11px] font-mono font-semibold text-zinc-200">
                    {isFree ? "Free" : `$${parseFloat(bm.price || 0).toFixed(2)}`}
                  </span>

                  <Link
                    href={`/e-books/${bm.bookId}`}
                    className="text-[11px] text-rose-400 hover:text-rose-300 font-medium inline-flex items-center gap-0.5"
                  >
                    View <ArrowRight className="w-2.5 h-2.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CONFIRMATION DIALOG MODAL */}
      {deletingBookmark && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-[#121216] border border-rose-900/60 shadow-2xl overflow-hidden p-6 space-y-5">
            <button
              type="button"
              onClick={handleCloseDeleteModal}
              disabled={isDeleting}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 text-rose-500">
              <div className="p-3 bg-rose-950/60 border border-rose-800/60 rounded-none">
                <AlertTriangle className="w-6 h-6 text-rose-400" />
              </div>
              <div>
                <h3 className="text-lg font-serif font-semibold text-zinc-100">
                  Remove Bookmark?
                </h3>
                <p className="text-xs text-zinc-400">
                  Are you sure you want to remove this book from your saved reading list?
                </p>
              </div>
            </div>

            <div className="p-3.5 bg-zinc-900/80 border border-zinc-800 space-y-1">
              <span className="text-xs font-serif font-bold text-zinc-200 block truncate">
                {deletingBookmark.title}
              </span>
              <span className="text-[11px] text-zinc-400 block font-mono">
                by {deletingBookmark.writerName}
              </span>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={handleCloseDeleteModal}
                disabled={isDeleting}
                className="px-4 py-2 text-xs font-medium text-zinc-300 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 transition-colors cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmRemove}
                disabled={isDeleting}
                className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 border border-rose-500 transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Removing...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove Bookmark</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
