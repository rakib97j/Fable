import React from "react";

export function Skeleton({ className = "", ...props }) {
  return (
    <div
      className={`animate-pulse rounded-md bg-zinc-800/60 border border-zinc-700/30 ${className}`}
      {...props}
    />
  );
}

export default Skeleton;
