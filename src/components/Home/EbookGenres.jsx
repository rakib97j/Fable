"use client";

import React from "react";
import Image from "next/image";
import { Sparkles } from "lucide-react";

export default function EbookGenres() {
  const genres = [
    {
  id: "fiction",
  title: "Fiction",
  tag: "GENRE",
  image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1000&auto=format&fit=crop",
  bgGradient: "from-amber-950/90  to-transparent",
  accentTag: "text-amber-400",
},
{
  id: "mystery",
  title: "Mystery",
  tag: "GENRE",
  image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=1000&auto=format&fit=crop",
  bgGradient: "from-emerald-950/90  to-transparent",
  accentTag: "text-emerald-400",
},
{
  id: "romance",
  title: "Romance",
  tag: "GENRE",
  image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1000&auto=format&fit=crop",
  bgGradient: "from-rose-950/90  to-transparent",
  accentTag: "text-rose-400",
},
{
  id: "Space",
  title: "Space",
  tag: "GENRE",
  image: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=1000&auto=format&fit=crop",
  bgGradient: "from-blue-950/90  to-transparent",
  accentTag: "text-blue-400",
},
{
  id: "fantasy",
  title: "Fantasy",
  tag: "GENRE",
  image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=1000&auto=format&fit=crop",
  bgGradient: "from-violet-950/90  to-transparent",
  accentTag: "text-violet-400",
},
{
  id: "horror",
  title: "Horror",
  tag: "GENRE",
  image: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=1000&auto=format&fit=crop",
  bgGradient: "from-red-950/90  to-transparent",
  accentTag: "text-red-500",
},
  ];

  return (
    <section className="w-full py-12 md:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Title Header */}
      <div className="flex items-center gap-2.5 mb-6">
        <Sparkles className="w-5 h-5 text-rose-600 dark:text-rose-400" />
        <h2 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Ebook Genres
        </h2>
      </div>

      {/* Grid container mirroring reference layout with dynamic genre background overlays */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
        
        {/* Left Column: Fiction card */}
        <div className="md:col-span-6 flex">
          <div
            className="group relative w-full h-[400px] md:h-full min-h-[420px]  overflow-hidden bg-zinc-900 border-2 border-zinc-200/20 dark:border-zinc-800/60 shadow-lg hover:shadow-2xl transition-all duration-300"
          >
            <Image
              src={genres[0].image}
              alt={genres[0].title}
              fill
              className="object-cover opacity-85 group-hover:scale-105 group-hover:opacity-95 transition-all duration-500"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
            {/* Dynamic Background Overlay */}
            <div className={`absolute inset-0 bg-linear-to-t ${genres[0].bgGradient}`} />
            <div className="absolute bottom-5 left-5 right-5 flex flex-col items-start">
              <span className={`text-[10px] font-extrabold tracking-widest uppercase mb-1 ${genres[0].accentTag}`}>
                {genres[0].tag}
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-wide">
                {genres[0].title}
              </h3>
            </div>
          </div>
        </div>

        {/* Right Column: Upper Row (Mystery + Romance) + Lower Row (Sci-Fi) */}
        <div className="md:col-span-6 flex flex-col gap-3.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Mystery */}
            <div
              
              className="group relative w-full h-[190px]  overflow-hidden bg-zinc-900 border-2 border-zinc-200/20 dark:border-zinc-800/60 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Image
                src={genres[1].image}
                alt={genres[1].title}
                fill
                className="object-cover opacity-85 group-hover:scale-105 group-hover:opacity-95 transition-all duration-500"
                sizes="(max-width: 640px) 100vw, 25vw"
              />
              <div className={`absolute inset-0 bg-linear-to-t ${genres[1].bgGradient}`} />
              <div className="absolute bottom-4 left-4 right-4 flex flex-col items-start">
                <span className={`text-[10px] font-extrabold tracking-widest uppercase mb-0.5 ${genres[1].accentTag}`}>
                  {genres[1].tag}
                </span>
                <h3 className="text-xl font-serif font-bold text-white tracking-wide">
                  {genres[1].title}
                </h3>
              </div>
            </div>

            {/* Romance */}
            <div
              
              className="group relative w-full h-[190px]  overflow-hidden bg-zinc-900 border-2 border-zinc-200/20 dark:border-zinc-800/60 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Image
                src={genres[2].image}
                alt={genres[2].title}
                fill
                className="object-cover opacity-85 group-hover:scale-105 group-hover:opacity-95 transition-all duration-500"
                sizes="(max-width: 640px) 100vw, 25vw"
              />
              <div className={`absolute inset-0 bg-linear-to-t ${genres[2].bgGradient}`} />
              <div className="absolute bottom-4 left-4 right-4 flex flex-col items-start">
                <span className={`text-[10px] font-extrabold tracking-widest uppercase mb-0.5 ${genres[2].accentTag}`}>
                  {genres[2].tag}
                </span>
                <h3 className="text-xl font-serif font-bold text-white tracking-wide">
                  {genres[2].title}
                </h3>
              </div>
            </div>
          </div>

          {/* Sci-Fi (Wide) */}
          <div
            className="group relative w-full h-[216px]  overflow-hidden bg-zinc-900 border-2 border-zinc-200/20 dark:border-zinc-800/60 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Image
              src={genres[3].image}
              alt={genres[3].title}
              fill
              className="object-cover opacity-85 group-hover:scale-105 group-hover:opacity-95 transition-all duration-500"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className={`absolute inset-0 bg-linear-to-t ${genres[3].bgGradient}`} />
            <div className="absolute bottom-4 left-4 right-4 flex flex-col items-start">
              <span className={`text-[10px] font-extrabold tracking-widest uppercase mb-0.5 ${genres[3].accentTag}`}>
                {genres[3].tag}
              </span>
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-wide">
                {genres[3].title}
              </h3>
            </div>
          </div>
        </div>

        {/* Bottom Row Left: Fantasy & Horror */}
        <div className="md:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Fantasy */}
          <div
            className="group relative w-full h-[190px]  overflow-hidden bg-zinc-900 border-2 border-zinc-200/20 dark:border-zinc-800/60 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Image
              src={genres[4].image}
              alt={genres[4].title}
              fill
              className="object-cover opacity-85 group-hover:scale-105 group-hover:opacity-95 transition-all duration-500"
              sizes="(max-width: 640px) 100vw, 25vw"
            />
            <div className={`absolute inset-0 bg-linear-to-t ${genres[4].bgGradient}`} />
            <div className="absolute bottom-4 left-4 right-4 flex flex-col items-start">
              <span className={`text-[10px] font-extrabold tracking-widest uppercase mb-0.5 ${genres[4].accentTag}`}>
                {genres[4].tag}
              </span>
              <h3 className="text-xl font-serif font-bold text-white tracking-wide">
                {genres[4].title}
              </h3>
            </div>
          </div>

          {/* Horror */}
          <div
            className="group relative w-full h-[190px]  overflow-hidden bg-zinc-900 border-2 border-zinc-200/20 dark:border-zinc-800/60 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Image
              src={genres[5].image}
              alt={genres[5].title}
              fill
              className="object-cover opacity-85 group-hover:scale-105 group-hover:opacity-95 transition-all duration-500"
              sizes="(max-width: 640px) 100vw, 25vw"
            />
            <div className={`absolute inset-0 bg-linear-to-t ${genres[5].bgGradient}`} />
            <div className="absolute bottom-4 left-4 right-4 flex flex-col items-start">
              <span className={`text-[10px] font-extrabold tracking-widest uppercase mb-0.5 ${genres[5].accentTag}`}>
                {genres[5].tag}
              </span>
              <h3 className="text-xl font-serif font-bold text-white tracking-wide">
                {genres[5].title}
              </h3>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
