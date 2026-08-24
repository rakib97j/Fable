import React from "react";
import { Skeleton } from "@/components/ui/Skeleton";

export default function BrowseEbooksLoading() {
  return (
    <div className="min-h-screen bg-[#0a0a0c] text-zinc-100 py-10 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto space-y-8 animate-pulse font-sans">
      {/* Header Section Skeleton */}
      <div className="space-y-3">
        <Skeleton className="h-4 w-32 bg-zinc-800/80" />
        <Skeleton className="h-10 w-64 bg-zinc-800/80" />
        <Skeleton className="h-4 w-96 bg-zinc-800/60" />
      </div>

      {/* Filter Bar Skeleton */}
      <div className="bg-[#121216]/90 border border-zinc-800/80 p-4 rounded-sm">
        <div className="flex flex-wrap items-center gap-3">
          <Skeleton className="h-10 flex-1 min-w-55 bg-zinc-800/70" />
          <Skeleton className="h-10 w-32 bg-zinc-800/70" />
          <Skeleton className="h-10 w-24 bg-zinc-800/70" />
          <Skeleton className="h-10 w-24 bg-zinc-800/70" />
          <Skeleton className="h-10 w-28 bg-zinc-800/70" />
          <Skeleton className="h-10 w-36 bg-zinc-800/70" />
        </div>
      </div>

      {/* Ebooks Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
          <div
            key={n}
            className="bg-[#121215] border border-zinc-800/80 p-4 space-y-4 rounded-sm flex flex-col justify-between"
          >
            <div className="space-y-4">
              <Skeleton className="aspect-3/4 w-full bg-zinc-800/60 rounded-none" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-3/4 bg-zinc-800/80" />
                <Skeleton className="h-3.5 w-1/2 bg-zinc-800/60" />
                <Skeleton className="h-3 w-5/6 bg-zinc-800/40" />
              </div>
            </div>
            <div className="pt-3 border-t border-zinc-800/60 flex justify-between items-center">
              <Skeleton className="h-4 w-16 bg-zinc-800/60" />
              <Skeleton className="h-5 w-12 bg-zinc-800/80" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
