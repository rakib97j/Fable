import React from "react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function Loading() {
  return (
    <div className="min-h-[75vh] w-full flex flex-col items-center justify-center py-16 px-4">
      <div className="relative p-10 rounded-3xl bg-white/80 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800/60 backdrop-blur-xl shadow-2xl flex flex-col items-center gap-6 max-w-md w-full text-center">
        {/* Soft background glow matching Fable theme */}
        <div className="absolute -top-12 -bottom-12 -left-12 -right-12 bg-gradient-to-tr from-rose-600/15 via-pink-600/10 to-rose-400/15 rounded-full blur-3xl -z-10" />

        <LoadingSpinner size="lg" />

        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight">
            Opening your story...
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Fetching books, authors, and reader collections
          </p>
        </div>
      </div>
    </div>
  );
}
