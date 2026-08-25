"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw, Home, Sparkles } from "lucide-react";

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log the error to an error reporting service if needed
    console.error("Unhandled Application Error:", error);
  }, [error]);

  return (
    <div className="relative min-h-[80vh] w-full flex items-center justify-center py-16 px-4 overflow-hidden">
      {/* Ambient background glow matching Fable rose theme */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-linear-to-tr from-rose-600/15 via-pink-600/10 to-amber-600/15 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-12 right-1/4 w-72 h-72 bg-rose-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-xl w-full text-center flex flex-col items-center">
        {/* Animated Error Badge */}
        <div className="relative mb-8 group">
          <div className="absolute -inset-2 rounded-3xl bg-linear-to-r from-rose-600 via-rose-500 to-pink-500 opacity-30 blur-xl group-hover:opacity-50 transition duration-500" />
          
          <div className="relative flex items-center justify-center w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-white/90 dark:bg-zinc-900/90 border border-rose-500/30 dark:border-rose-500/30 shadow-2xl backdrop-blur-xl">
            <AlertTriangle className="w-12 h-12 sm:w-14 sm:h-14 text-rose-500 dark:text-rose-400 animate-pulse" />
          </div>
        </div>

        {/* Tag Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-semibold tracking-wide uppercase mb-4">
          <Sparkles className="w-3.5 h-3.5" /> Something went wrong
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-zinc-900 dark:text-zinc-50 tracking-tight leading-tight mb-4">
          Unexpected <span className="bg-linear-to-r from-rose-500 via-rose-400 to-pink-500 bg-clip-text text-transparent">Plot Twist!</span>
        </h1>

        <p className="text-base text-zinc-600 dark:text-zinc-400 max-w-md mx-auto mb-6 font-light leading-relaxed">
          We encountered an issue while loading this page. You can try refreshing the view or returning home.
        </p>

        {/* Error Detail Snippet (collapsible / preview) */}
        {error?.message && (
          <div className="mb-8 p-3.5 rounded-xl bg-rose-500/5 dark:bg-rose-950/20 border border-rose-500/20 max-w-md w-full text-xs text-rose-700 dark:text-rose-300 text-center font-mono overflow-hidden text-ellipsis whitespace-nowrap">
            {error.message}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-sm">
          {reset && (
            <button
              onClick={() => reset()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-linear-to-tr from-rose-600 via-rose-500 to-pink-500 hover:from-rose-500 hover:to-pink-400 text-white font-medium text-sm shadow-lg shadow-rose-600/25 hover:shadow-rose-500/35 transition-all duration-200 active:scale-[0.98] cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" /> Try Again
            </button>
          )}

          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/80 dark:bg-zinc-900/80 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700/60 font-medium text-sm backdrop-blur-md transition-all duration-200 active:scale-[0.98]"
          >
            <Home className="w-4 h-4 text-rose-500 dark:text-rose-400" /> Go to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
