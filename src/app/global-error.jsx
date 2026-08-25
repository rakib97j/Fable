"use client";

import React from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

export default function GlobalError({ error, reset }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#0d0d0f] text-zinc-100 flex items-center justify-center p-4 font-sans">
        <div className="max-w-md w-full text-center flex flex-col items-center p-8 rounded-3xl bg-zinc-900/90 border border-rose-500/30 shadow-2xl backdrop-blur-xl">
          <div className="w-16 h-16 mb-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
            <AlertTriangle className="w-8 h-8 animate-pulse" />
          </div>

          <h2 className="text-2xl font-bold font-serif text-white mb-2">
            Critical Application Error
          </h2>

          <p className="text-sm text-zinc-400 mb-6">
            A critical error occurred while loading the application shell.
          </p>

          <button
            onClick={() => reset()}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-linear-to-tr from-rose-600 via-rose-500 to-pink-500 hover:from-rose-500 hover:to-pink-400 text-white font-medium text-sm shadow-lg shadow-rose-600/25 transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" /> Reload Application
          </button>
        </div>
      </body>
    </html>
  );
}
