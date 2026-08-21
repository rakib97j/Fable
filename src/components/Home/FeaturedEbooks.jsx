"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Star } from "lucide-react";

/**
 * FeaturedEbooks Component
 * 
 * NOTE: Below is dummy data for Featured Ebooks.
 * Replace `featuredEbooksData` with your dynamic data fetched from API/database.
 */

// ====================================================================
// DYNAMIC DATA PLACEHOLDER: Replace this dummy array with dynamic API/DB data
// ====================================================================
const featuredEbooksData = [
  {
    id: "1",
    title: "The Silent Echoes",
    author: "Elena Rostova",
    genre: "Mystery & Thriller",
    price: "$14.99",
    rating: 4.8,
    reviewsCount: 124,
    coverImage: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "2",
    title: "Beyond the Event Horizon",
    author: "Marcus Vance",
    genre: "Sci-Fi & Fantasy",
    price: "$18.50",
    rating: 4.9,
    reviewsCount: 89,
    coverImage: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "3",
    title: "Chronicles of Starlight",
    author: "Sophia Chen",
    genre: "Epic Fantasy",
    price: "$12.00",
    rating: 4.7,
    reviewsCount: 210,
    coverImage: "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "4",
    title: "Whispers of the Wind",
    author: "Julian Thorne",
    genre: "Literary Fiction",
    price: "$15.99",
    rating: 4.9,
    reviewsCount: 67,
    coverImage: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600&auto=format&fit=crop",
  },
];

export default function FeaturedEbooks() {
  // If you pass props from a parent component or fetch data dynamically:
  // const ebooks = props.ebooks || featuredEbooksData;
  const ebooks = featuredEbooksData;

  return (
    <section className="w-full py-12 md:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10">
        <div>
          <span className="text-xs font-semibold tracking-[0.2em] uppercase text-zinc-400 block mb-2">
            CURATED FOR YOU
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-white font-normal tracking-tight">
            Featured Ebooks
          </h2>
        </div>

        <Link
          href="/e-books"
          className="group inline-flex items-center gap-1.5 text-sm font-medium text-zinc-400 hover:text-white transition-colors duration-200"
        >
          View all
          <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
        </Link>
      </div>

      {/* Grid of Ebooks */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* DYNAMIC DATA MAP: Replace `ebooks` with dynamic array */}
        {ebooks.map((ebook) => (
          <div
            key={ebook.id}
            className="group relative bg-[#121215] border border-zinc-800/80 overflow-hidden hover:border-zinc-700 transition-all duration-300 flex flex-col"
          >
            {/* Cover Image Container */}
            <div className="relative aspect-[3/4] w-full overflow-hidden bg-zinc-900">
              <Image
                src={ebook.coverImage}
                alt={ebook.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#121215] via-transparent to-transparent opacity-60" />
              
              {/* Badge */}
              <span className="absolute top-3 left-3 bg-zinc-900/80 backdrop-blur-md border border-zinc-700/60 text-zinc-300 text-[11px] font-medium px-2.5 py-1 uppercase tracking-wider">
                {ebook.genre}
              </span>
            </div>

            {/* Book Info */}
            <div className="p-5 flex flex-col flex-1 justify-between">
              <div>
                <h3 className="text-lg font-serif font-medium text-white group-hover:text-rose-400 transition-colors duration-200 line-clamp-1 mb-1">
                  {ebook.title}
                </h3>
                <p className="text-xs text-zinc-400 mb-3">
                  by <span className="text-zinc-300">{ebook.author}</span>
                </p>
              </div>

              <div className="pt-3 border-t border-zinc-800/60 flex items-center justify-between">
                <div className="flex items-center gap-1 text-xs text-amber-400">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span className="font-semibold text-zinc-200">{ebook.rating}</span>
                  <span className="text-zinc-500">({ebook.reviewsCount})</span>
                </div>
                <span className="text-sm font-semibold text-white">
                  {ebook.price}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
