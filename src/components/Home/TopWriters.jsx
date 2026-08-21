"use client";

import React from "react";
import Image from "next/image";
import { Feather } from "lucide-react";

/**
 * TopWriters Component
 * 
 * NOTE: Below is dummy data for Top Writers.
 * Replace `topWritersData` with your dynamic data fetched from API/database.
 */

// ====================================================================
// DYNAMIC DATA PLACEHOLDER: Replace this dummy array with dynamic API/DB data
// ====================================================================
const topWritersData = [
  {
    id: "1",
    rank: "#01",
    role: "WRITER",
    name: "Emerging Voice",
    publishedCount: 0,
    salesCount: 0,
    avatar: null, // Set image URL or null to use default gradient avatar
  },
  {
    id: "2",
    rank: "#02",
    role: "WRITER",
    name: "Emerging Voice",
    publishedCount: 0,
    salesCount: 0,
    avatar: null,
  },
  {
    id: "3",
    rank: "#03",
    role: "WRITER",
    name: "Emerging Voice",
    publishedCount: 0,
    salesCount: 0,
    avatar: null,
  },
];

export default function TopWriters() {
  // If you pass props from a parent component or fetch data dynamically:
  // const writers = props.writers || topWritersData;
  const writers = topWritersData;

  return (
    <section className="w-full py-10 md:py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header with Feather Icon & Title */}
      <div className="flex items-center gap-3 mb-8">
        <div className="text-[#f83b60]">
          <Feather className="w-7 h-7 sm:w-8 sm:h-8 stroke-[1.8] -rotate-45" />
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-4xl font-serif text-white tracking-tight font-normal">
          Top Writers
        </h2>
      </div>

      {/* Grid of Writer Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* DYNAMIC DATA MAP: Replace `writers` with dynamic array */}
        {writers.map((writer) => {
          return (
            <div
              key={writer.id}
              className="group relative bg-[#121215] p-7 sm:p-8 border border-zinc-800/80 hover:border-rose-600/60 hover:shadow-[0_10px_30px_-10px_rgba(248,59,96,0.25)] transition-all duration-300 flex flex-col justify-between min-h-[220px]"
            >
              {/* Top Row: Avatar / Gradient Circle */}
              <div className="mb-6">
                {writer.avatar ? (
                  <div className="relative w-16 h-16 rounded-full overflow-hidden border border-zinc-700">
                    <Image
                      src={writer.avatar}
                      alt={writer.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-pink-400 via-rose-400 to-cyan-400 shadow-md group-hover:scale-105 transition-transform duration-300" />
                )}
              </div>

              {/* Writer Information */}
              <div>
                {/* Rank & Role Tag */}
                <div className="text-xs font-mono font-medium text-zinc-500 tracking-wider uppercase mb-2">
                  {writer.rank} · {writer.role}
                </div>

                {/* Writer Name */}
                <h3 className="text-2xl font-serif font-normal text-white group-hover:text-rose-400 transition-colors duration-200 mb-2 tracking-tight">
                  {writer.name}
                </h3>

                {/* Published & Sales Stats */}
                <p className="text-sm text-zinc-400 font-normal">
                  {writer.publishedCount} published · {writer.salesCount} sales
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
