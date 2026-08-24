import React from "react";
import { BookOpen } from "lucide-react";

export default function DashboardLoading() {
  return (
    <div className="w-full min-h-[75vh] flex flex-col items-center justify-center space-y-4 font-sans text-white select-none">
      {/* Outer Glowing Spinner & Logo Center */}
      <div className="relative flex items-center justify-center">
        {/* Outer Spinning Ring */}
        <div className="w-16 h-16 rounded-full border-4 border-rose-500/20 border-t-rose-500 animate-spin shadow-lg shadow-rose-500/10" />

        {/* Center Fable Icon */}
        <div className="absolute inset-0 flex items-center justify-center text-rose-500 animate-pulse">
          <BookOpen className="w-6 h-6" />
        </div>
      </div>

      {/* Loading Text */}
      <div className="text-center space-y-1">
        <p className="text-sm font-semibold tracking-wider text-zinc-200 uppercase">
          Loading Dashboard
        </p>
        <p className="text-xs text-zinc-500 animate-pulse">
          Please wait a moment...
        </p>
      </div>
    </div>
  );
}
