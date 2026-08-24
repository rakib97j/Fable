import React from "react";
import { Skeleton } from "@/components/ui/Skeleton";

export default function ProfileSkeleton() {
  return (
    <div className="space-y-8 max-w-4xl animate-pulse">
      {/* Header / Hero Skeleton */}
      <div className="relative rounded-2xl bg-zinc-900/60 border border-zinc-800 p-6 sm:p-8 overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <Skeleton className="w-24 h-24 rounded-full border-2 border-zinc-700/50" />
          <div className="space-y-3 text-center sm:text-left flex-1 w-full">
            <Skeleton className="h-8 w-48 mx-auto sm:mx-0" />
            <Skeleton className="h-4 w-64 mx-auto sm:mx-0" />
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-2">
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="h-6 w-32 rounded-full" />
            </div>
          </div>
          <Skeleton className="h-10 w-32 rounded-lg" />
        </div>
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-5 rounded-xl bg-zinc-900/40 border border-zinc-800/80 space-y-3">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-8 rounded-lg" />
            </div>
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-3 w-32" />
          </div>
        ))}
      </div>

      {/* Profile Details Form Skeleton */}
      <div className="rounded-2xl bg-zinc-900/40 border border-zinc-800/80 p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <div className="space-y-2">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-60" />
          </div>
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-11 w-full rounded-lg" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-11 w-full rounded-lg" />
          </div>
        </div>

        <div className="space-y-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-24 w-full rounded-lg" />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
          <Skeleton className="h-10 w-28 rounded-lg" />
          <Skeleton className="h-10 w-36 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
