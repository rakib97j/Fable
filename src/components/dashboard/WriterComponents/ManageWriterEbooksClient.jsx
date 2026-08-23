"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Edit, Trash2, Eye, EyeOff, BookOpen, Loader2 } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { getEBooksByWriter } from "@/lib/actions/eBooks";

export default function ManageWriterEbooksClient() {
  const { data: session, isPending: sessionLoading } = useSession();
  const user = session?.user;
  const writerId = user?.id || user?._id;

  const [ebooks, setEbooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWriterEbooks() {
      if (!writerId) {
        if (!sessionLoading) {
          setLoading(false);
        }
        return;
      }

      setLoading(true);
      try {
        const res = await getEBooksByWriter(writerId);
        if (res?.success && Array.isArray(res.data)) {
          setEbooks(res.data);
        }
      } catch (err) {
        console.error("Failed to load writer ebooks:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchWriterEbooks();
  }, [writerId, sessionLoading]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-serif font-semibold tracking-tight text-zinc-100">
            Manage Ebooks ({ebooks.length})
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Publish, edit, or unpublish your works.
          </p>
        </div>

        <Link
          href="/dashboard/writer/add-ebook"
          className="inline-flex items-center gap-2 px-4 py-2.5 font-medium text-xs text-white bg-linear-to-r from-rose-500 to-pink-600 hover:opacity-90 transition-all shadow-md shadow-rose-600/20 w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>New Ebook</span>
        </Link>
      </div>

      {/* Table Container */}
      <div className="rounded-none border border-zinc-800/80 bg-[#121216]/60 overflow-hidden shadow-xl">
        {/* Table Header */}
        <div className="hidden sm:grid grid-cols-12 gap-4 px-6 py-3.5 border-b border-zinc-800/80 text-[11px] font-semibold tracking-wider text-zinc-400 uppercase">
          <span className="col-span-5">TITLE</span>
          <span className="col-span-2">PRICE</span>
          <span className="col-span-2">STATUS</span>
          <span className="col-span-3 text-right">ACTIONS</span>
        </div>

        {/* Loading State */}
        {loading || sessionLoading ? (
          <div className="p-16 flex flex-col items-center justify-center text-zinc-500 gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-rose-500" />
            <span className="text-xs">Loading your ebooks...</span>
          </div>
        ) : ebooks.length === 0 ? (
          /* Empty State */
          <div className="p-16 text-center text-sm text-zinc-500 flex flex-col items-center justify-center gap-3">
            <BookOpen className="w-10 h-10 text-zinc-600 stroke-[1.5]" />
            <p>No ebooks yet. Publish your first!</p>
            <Link
              href="/dashboard/writer/add-ebook"
              className="mt-2 text-xs font-medium text-rose-400 hover:text-rose-300 underline underline-offset-4"
            >
              Add New Ebook
            </Link>
          </div>
        ) : (
          /* Ebooks List Table */
          <div className="divide-y divide-zinc-800/60">
            {ebooks.map((ebook) => {
              const priceVal = typeof ebook.price === "number" ? ebook.price : parseFloat(ebook.price) || 0;
              const isFree = ebook.isFree || priceVal === 0;
              const isPublished = ebook.status === "unpublished" ? false : true; // Default to published unless status is explicit

              return (
                <div
                  key={ebook._id || ebook.id}
                  className="grid grid-cols-1 sm:grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-zinc-900/40 transition-colors"
                >
                  {/* Title & Cover Thumbnail */}
                  <div className="sm:col-span-5 flex items-center gap-3.5">
                    <div className="relative w-10 h-13 shrink-0 bg-zinc-800 overflow-hidden border border-zinc-700/60">
                      {ebook.coverImage ? (
                        <Image
                          src={ebook.coverImage}
                          alt={ebook.title || "Cover"}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-zinc-600">
                          <BookOpen className="w-5 h-5 stroke-[1.5]" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-medium text-zinc-100 truncate">
                        {ebook.title}
                      </h3>
                      <span className="text-xs text-zinc-500 font-mono">
                        {ebook.genre || "General"}
                      </span>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="sm:col-span-2 text-xs font-mono font-medium text-zinc-200">
                    {isFree ? (
                      <span className="text-emerald-400 font-semibold">FREE</span>
                    ) : (
                      `$${priceVal.toFixed(2)}`
                    )}
                  </div>

                  {/* Status Badge */}
                  <div className="sm:col-span-2">
                    {isPublished ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium text-emerald-400 bg-emerald-950/40 border border-emerald-800/50">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        Published
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium text-amber-400 bg-amber-950/40 border border-amber-800/50">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                        Unpublished
                      </span>
                    )}
                  </div>

                  {/* Actions (UI only, non-functional) */}
                  <div className="sm:col-span-3 flex items-center justify-end gap-2">
                    {/* Publish / Unpublish Toggle */}
                    <button
                      type="button"
                      className="px-2.5 py-1.5 text-xs text-zinc-300 hover:text-white bg-zinc-800/80 hover:bg-zinc-700 border border-zinc-700/60 transition-colors flex items-center gap-1 cursor-pointer"
                      title={isPublished ? "Unpublish Ebook" : "Publish Ebook"}
                    >
                      {isPublished ? (
                        <>
                          <EyeOff className="w-3.5 h-3.5 text-zinc-400" />
                          <span className="hidden md:inline">Unpublish</span>
                        </>
                      ) : (
                        <>
                          <Eye className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="hidden md:inline">Publish</span>
                        </>
                      )}
                    </button>

                    {/* Edit Button */}
                    <button
                      type="button"
                      className="p-1.5 text-zinc-400 hover:text-zinc-100 bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700/50 transition-colors cursor-pointer"
                      title="Edit Ebook"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>

                    {/* Delete Button */}
                    <button
                      type="button"
                      className="p-1.5 text-zinc-400 hover:text-rose-400 bg-zinc-800/50 hover:bg-rose-950/40 border border-zinc-700/50 hover:border-rose-800/60 transition-colors cursor-pointer"
                      title="Delete Ebook"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
