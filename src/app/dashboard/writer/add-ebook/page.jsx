import React from "react";
import AddEbookForm from "@/components/dashboard/WriterComponents/AddEbookForm";

export const metadata = {
  title: 'Writer || Add E-book',
  description: 'This is Fable writer dashboard add e-books Page',
};

export default function WriterAddEbookPage() {
  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-3xl font-serif font-semibold text-zinc-100">Add New Ebook</h1>
        <p className="text-sm text-zinc-400 mt-1">
          Publish a new e-book story to your Fable portfolio.
        </p>
      </div>

      <div className="p-6 md:p-8 border border-zinc-800/80 bg-[#121216]/60">
        <AddEbookForm />
      </div>
    </div>
  );
}

