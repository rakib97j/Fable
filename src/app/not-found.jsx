import React from "react";
import Link from "next/link";
import { BookX, Home, Library, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="relative min-h-[82vh] w-full flex items-center justify-center py-16 px-4 overflow-hidden">
      {/* Dynamic Background Decorative Glows matching Fable theme */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-tr from-rose-600/15 via-rose-500/15 to-pink-500/15 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-10 left-1/3 w-72 h-72 bg-rose-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-2xl w-full text-center flex flex-col items-center">
        {/* Animated Graphic Badge */}
        <div className="relative mb-8 group">
          {/* Outer glowing ring */}
          <div className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-rose-600 via-rose-500 to-pink-500 opacity-30 blur-xl group-hover:opacity-50 transition duration-500" />
          
          <div className="relative flex items-center justify-center w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-white/90 dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 shadow-2xl backdrop-blur-xl">
            <div className="relative flex items-center justify-center">
              <BookX className="w-14 h-14 sm:w-16 sm:h-16 text-rose-500 dark:text-rose-400 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6" />
              <span className="absolute -top-1 -right-2 px-2 py-0.5 text-xs font-bold bg-rose-600 text-white rounded-full shadow-lg border border-rose-400/30">
                404
              </span>
            </div>
          </div>
        </div>

        {/* 404 Tag Banner */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-semibold tracking-wide uppercase mb-4">
          <Compass className="w-3.5 h-3.5" /> Page Not Found
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-zinc-900 dark:text-zinc-50 tracking-tight leading-tight mb-4">
          Lost in the <span className="bg-gradient-to-r from-rose-500 via-rose-400 to-pink-500 bg-clip-text text-transparent">Pages?</span>
        </h1>

        <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-md mx-auto mb-8 font-light leading-relaxed">
          The story or chapter you are looking for has vanished into thin air, or never existed in our library.
        </p>

        {/* Navigation Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-sm sm:max-w-md">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-tr from-rose-600 via-rose-500 to-pink-500 hover:from-rose-500 hover:to-pink-400 text-white font-medium text-sm shadow-lg shadow-rose-600/25 hover:shadow-rose-500/35 transition-all duration-200 active:scale-[0.98]"
          >
            <Home className="w-4 h-4" /> Return to Home
          </Link>

          <Link
            href="/e-books"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/80 dark:bg-zinc-900/80 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700/60 font-medium text-sm backdrop-blur-md transition-all duration-200 active:scale-[0.98]"
          >
            <Library className="w-4 h-4 text-rose-500 dark:text-rose-400" /> Explore E-books
          </Link>
        </div>

        {/* Quick Links Footer Suggestions */}
        <div className="mt-12 pt-8 border-t border-zinc-200/80 dark:border-zinc-800/60 w-full max-w-md flex items-center justify-center gap-6 text-xs text-zinc-500 dark:text-zinc-400">
          <span>Popular destinations:</span>
          <Link href="/e-books" className="hover:text-rose-500 dark:hover:text-rose-400 transition-colors">
            All E-books
          </Link>
          <span>•</span>
          <Link href="/dashboard" className="hover:text-rose-500 dark:hover:text-rose-400 transition-colors">
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
