import React from "react";
import Link from "next/link";
import { Plus } from "lucide-react";

export default function WriterManageEbooksPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-serif font-semibold tracking-tight text-zinc-100">
            Manage Ebooks
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Publish, edit, or unpublish your works.
          </p>
        </div>

        <Link
          href="/dashboard/writer/add-ebook"
          className="inline-flex items-center gap-2 px-4 py-2.5  font-medium text-xs text-white bg-linear-to-r from-rose-500 to-pink-600 hover:opacity-90 transition-all shadow-md shadow-rose-600/20 w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>New Ebook</span>
        </Link>
      </div>

      <div className="rounded-none border border-zinc-800/80 bg-[#121216]/60 overflow-hidden">
        <div className="grid grid-cols-6 gap-4 px-6 py-3.5 border-b border-zinc-800/80 text-[11px] font-semibold tracking-wider text-zinc-400 uppercase">
          <span>TITLE</span>
          <span>GENRE</span>
          <span>PRICE</span>
          <span>STATUS</span>
          <span>SALES</span>
          <span className="text-right">ACTIONS</span>
        </div>

        <div className="p-16 text-center text-sm text-zinc-500">
          No ebooks yet. Publish your first!
        </div>
      </div>
    </div>
  );
}
