import React from "react";
import { BookOpen } from "lucide-react";

export function LoadingSpinner({
  size = "md",
  message = "",
  fullPage = false,
  className = "",
}) {
  const sizeClasses = {
    sm: "w-6 h-6 border-2",
    md: "w-10 h-10 border-3",
    lg: "w-16 h-16 border-4",
    xl: "w-24 h-24 border-4",
  };

  const iconSizes = {
    sm: 12,
    md: 20,
    lg: 28,
    xl: 40,
  };

  const spinnerContent = (
    <div className={`flex flex-col items-center justify-center gap-4 ${className}`}>
      <div className="relative flex items-center justify-center">
        {/* Outer glowing ambient effect matching Fable rose theme */}
        <div className="absolute inset-0 rounded-full bg-rose-500/20 blur-xl animate-pulse" />
        
        {/* Outer spinning gradient ring */}
        <div
          className={`${
            sizeClasses[size] || sizeClasses.md
          } rounded-full border-t-rose-500 border-r-pink-400 border-b-rose-600/30 border-l-transparent animate-spin`}
        />

        {/* Inner reverse spinning ring */}
        <div
          className={`absolute rounded-full border-t-transparent border-r-pink-500 border-b-rose-600 border-l-transparent animate-spin [animation-duration:1.5s] [animation-direction:reverse] ${
            size === "sm"
              ? "w-4 h-4 border"
              : size === "md"
              ? "w-6 h-6 border-2"
              : size === "lg"
              ? "w-10 h-10 border-2"
              : "w-14 h-14 border-3"
          }`}
        />

        {/* Center glowing book icon */}
        <div className="absolute flex items-center justify-center text-rose-500 dark:text-rose-400 animate-pulse">
          <BookOpen size={iconSizes[size] || iconSizes.md} className="opacity-90" />
        </div>
      </div>

      {message && (
        <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 tracking-wide animate-pulse">
          {message}
        </p>
      )}
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/70 backdrop-blur-md transition-all duration-300">
        <div className="p-8 rounded-3xl bg-zinc-900/80 border border-zinc-800/80 shadow-2xl flex flex-col items-center">
          {spinnerContent}
        </div>
      </div>
    );
  }

  return spinnerContent;
}

export default LoadingSpinner;
