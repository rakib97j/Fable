import React from "react";
import { Skeleton } from "@/components/ui/Skeleton";

export default function LoadingEBookDetails() {
  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Breadcrumb Skeleton */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-20 bg-zinc-800/80 rounded-none" />
          <Skeleton className="h-4 w-4 bg-zinc-800/60 rounded-none" />
          <Skeleton className="h-4 w-32 bg-zinc-800/60 rounded-none" />
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column - Cover Image Skeleton */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="relative aspect-3/4 w-full max-w-sm sm:max-w-md rounded-none overflow-hidden border border-zinc-800/80 bg-zinc-900/50 p-2 shadow-2xl">
              <Skeleton className="w-full h-full rounded-none bg-zinc-800/70 animate-pulse" />
            </div>
          </div>

          {/* Right Column - Info Skeleton */}
          <div className="lg:col-span-7 space-y-6">
            {/* Genre & Status Tags */}
            <div className="flex items-center gap-3">
              <Skeleton className="h-6 w-24 rounded-none bg-rose-950/40" />
              <Skeleton className="h-6 w-20 rounded-none bg-zinc-800/60" />
            </div>

            {/* Title */}
            <Skeleton className="h-10 w-4/5 bg-zinc-800/80 rounded-none" />
            <Skeleton className="h-6 w-1/2 bg-zinc-800/60 rounded-none" />

            {/* Price & Uploaded Date */}
            <div className="flex items-center gap-6 py-4 border-y border-zinc-800/60">
              <Skeleton className="h-8 w-24 bg-zinc-800/80 rounded-none" />
              <Skeleton className="h-4 w-36 bg-zinc-800/60 rounded-none" />
            </div>

            {/* Action Buttons Skeleton */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Skeleton className="h-12 w-48 rounded-none bg-rose-900/40" />
              <Skeleton className="h-12 w-12 rounded-none bg-zinc-800/70" />
            </div>

            {/* Description Lines */}
            <div className="space-y-3 pt-6 border-t border-zinc-800/60">
              <Skeleton className="h-5 w-32 bg-zinc-800/80 rounded-none" />
              <Skeleton className="h-4 w-full bg-zinc-800/60 rounded-none" />
              <Skeleton className="h-4 w-5/6 bg-zinc-800/60 rounded-none" />
              <Skeleton className="h-4 w-4/6 bg-zinc-800/60 rounded-none" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
