"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Star, BookOpen, RotateCcw, Filter } from "lucide-react";
import { getEBooks } from "@/lib/actions/eBooks";
import { Skeleton } from "@/components/ui/Skeleton";

const GENRES = [
  "All",
  "Fantasy",
  "Science Fiction",
  "Romance",
  "Mystery & Thriller",
  "Non-Fiction",
  "Literary Fiction",
  "Horror",
  "Biography & Memoir",
  "Self-Help",
  "Poetry",
  "Young Adult",
  "Historical Fiction",
];

export default function EBooksClientPage({ initialData = [] }) {
  const [ebooks, setEbooks] = useState(initialData);
  const [loading, setLoading] = useState(initialData.length === 0);

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [availability, setAvailability] = useState("Any"); // Any | Free | Paid
  const [sortBy, setSortBy] = useState("Newest"); // Newest | PriceLowHigh | PriceHighLow | Rating | Title

  useEffect(() => {
    async function loadData() {
      if (initialData && initialData.length > 0) {
        setEbooks(initialData);
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const res = await getEBooks();
        if (res?.success && Array.isArray(res.data)) {
          setEbooks(res.data);
        }
      } catch (err) {
        console.error("Failed to load ebooks:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [initialData]);

  // Static client-side search, filtering and sorting
  const filteredEBooks = useMemo(() => {
    return ebooks
      .filter((book) => {
        // Search Filter (title or writerName)
        const searchLower = searchTerm.toLowerCase().trim();
        const titleMatch = (book.title || "").toLowerCase().includes(searchLower);
        const writerMatch = (book.writerName || book.author || "")
          .toLowerCase()
          .includes(searchLower);
        if (searchLower && !titleMatch && !writerMatch) return false;

        // Genre Filter
        if (selectedGenre !== "All" && book.genre !== selectedGenre) {
          return false;
        }

        // Price Filter
        const price = typeof book.price === "number" ? book.price : parseFloat(book.price) || 0;
        if (minPrice !== "" && !isNaN(parseFloat(minPrice))) {
          if (price < parseFloat(minPrice)) return false;
        }
        if (maxPrice !== "" && !isNaN(parseFloat(maxPrice))) {
          if (price > parseFloat(maxPrice)) return false;
        }

        // Availability Filter
        if (availability === "Free") {
          if (!book.isFree && price > 0) return false;
        } else if (availability === "Paid") {
          if (book.isFree || price === 0) return false;
        }

        return true;
      })
      .sort((a, b) => {
        const priceA = typeof a.price === "number" ? a.price : parseFloat(a.price) || 0;
        const priceB = typeof b.price === "number" ? b.price : parseFloat(b.price) || 0;
        const ratingA = parseFloat(a.rating) || 0;
        const ratingB = parseFloat(b.rating) || 0;

        if (sortBy === "PriceLowHigh") {
          return priceA - priceB;
        }
        if (sortBy === "PriceHighLow") {
          return priceB - priceA;
        }
        if (sortBy === "Rating") {
          return ratingB - ratingA;
        }
        if (sortBy === "Title") {
          return (a.title || "").localeCompare(b.title || "");
        }
        // Default: Newest
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
  }, [ebooks, searchTerm, selectedGenre, minPrice, maxPrice, availability, sortBy]);

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedGenre("All");
    setMinPrice("");
    setMaxPrice("");
    setAvailability("Any");
    setSortBy("Newest");
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-zinc-100 py-10 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto font-sans selection:bg-rose-500 selection:text-white">
      {/* Header Section */}
      <div className="mb-8">
        <span className="text-xs font-semibold tracking-[0.25em] uppercase text-rose-500 block mb-2 font-mono">
          THE COLLECTION
        </span>
        <h1 className="text-4xl sm:text-5xl font-serif font-normal text-white tracking-tight mb-3">
          Browse Ebooks
        </h1>
        <p className="text-zinc-400 text-sm sm:text-base max-w-2xl">
          Search titles, filter by genre, price and availability. Every ebook here is original.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-[#121216]/90 border border-zinc-800/80 p-3 sm:p-4 mb-10 shadow-xl rounded-sm space-y-3 md:space-y-0">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1 min-w-55">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search title or writer..."
              className="w-full bg-[#18181f] border border-zinc-800 text-zinc-200 placeholder-zinc-500 text-sm pl-9 pr-3 py-2 focus:outline-none focus:border-zinc-700 transition-colors"
            />
          </div>

          {/* Genre Dropdown */}
          <div className="w-full sm:w-auto">
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="w-full sm:w-auto bg-[#18181f] border border-zinc-800 text-zinc-300 text-sm px-3 py-2 focus:outline-none focus:border-zinc-700 cursor-pointer"
            >
              {GENRES.map((genre) => (
                <option key={genre} value={genre} className="bg-[#18181f] text-zinc-200">
                  {genre}
                </option>
              ))}
            </select>
          </div>

          {/* Min Price Input */}
          <div className="w-24">
            <input
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              placeholder="Min $"
              className="w-full bg-[#18181f] border border-zinc-800 text-zinc-300 placeholder-zinc-500 text-sm px-3 py-2 focus:outline-none focus:border-zinc-700 font-mono"
            />
          </div>

          {/* Max Price Input */}
          <div className="w-24">
            <input
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="Max $"
              className="w-full bg-[#18181f] border border-zinc-800 text-zinc-300 placeholder-zinc-500 text-sm px-3 py-2 focus:outline-none focus:border-zinc-700 font-mono"
            />
          </div>

          {/* Availability Dropdown */}
          <div className="w-full sm:w-auto">
            <select
              value={availability}
              onChange={(e) => setAvailability(e.target.value)}
              className="w-full sm:w-auto bg-[#18181f] border border-zinc-800 text-zinc-300 text-sm px-3 py-2 focus:outline-none focus:border-zinc-700 cursor-pointer"
            >
              <option value="Any" className="bg-[#18181f]">Any</option>
              <option value="Free" className="bg-[#18181f]">Free</option>
              <option value="Paid" className="bg-[#18181f]">Paid</option>
            </select>
          </div>

          {/* Sort Dropdown */}
          <div className="w-full sm:w-auto">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full sm:w-auto bg-[#18181f] border border-rose-600/80 text-zinc-100 text-sm px-3.5 py-2 focus:outline-none focus:border-rose-500 cursor-pointer shadow-sm shadow-rose-950/20 font-medium"
            >
              <option value="Newest" className="bg-[#18181f]">Newest</option>
              <option value="PriceLowHigh" className="bg-[#18181f]">Price: Low to High</option>
              <option value="PriceHighLow" className="bg-[#18181f]">Price: High to Low</option>
              <option value="Rating" className="bg-[#18181f]">Highest Rated</option>
              <option value="Title" className="bg-[#18181f]">Title A-Z</option>
            </select>
          </div>

          {/* Reset Filters button */}
          {(searchTerm || selectedGenre !== "All" || minPrice || maxPrice || availability !== "Any" || sortBy !== "Newest") && (
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-rose-400 hover:text-rose-300 bg-rose-950/30 border border-rose-800/40 transition-colors"
              title="Reset Filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Cards Grid */}
      {loading ? (
        /* Skeleton Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <div
              key={n}
              className="bg-[#121215] border border-zinc-800/80 p-4 space-y-4 rounded-sm animate-pulse flex flex-col justify-between"
            >
              <div className="space-y-4">
                <Skeleton className="aspect-3/4 w-full bg-zinc-800/60 rounded-none" />
                <div className="space-y-2">
                  <Skeleton className="h-5 w-3/4 bg-zinc-800/80" />
                  <Skeleton className="h-3.5 w-1/2 bg-zinc-800/60" />
                  <Skeleton className="h-3 w-5/6 bg-zinc-800/40" />
                </div>
              </div>
              <div className="pt-3 border-t border-zinc-800/60 flex justify-between items-center">
                <Skeleton className="h-4 w-16 bg-zinc-800/60" />
                <Skeleton className="h-5 w-12 bg-zinc-800/80" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredEBooks.length === 0 ? (
        /* Empty State */
        <div className="text-center py-16 border border-zinc-800/60 bg-[#121216]/50 rounded-sm">
          <BookOpen className="w-12 h-12 text-zinc-600 mx-auto mb-3 stroke-[1.5]" />
          <h3 className="text-lg font-serif text-zinc-200 mb-1">No eBooks found</h3>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto mb-5">
            We couldn t find any ebook matching your filters. Try adjusting your search query or price range.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 text-xs font-medium text-white bg-rose-600 hover:bg-rose-500 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        /* Dynamic Cards Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredEBooks.map((ebook) => {
            const priceVal = typeof ebook.price === "number" ? ebook.price : parseFloat(ebook.price) || 0;
            const isFreeBook = ebook.isFree || priceVal === 0;

            return (
              <Link href={`/e-books/${ebook._id || ebook.id}`}
                key={ebook._id || ebook.id}
                className="group relative bg-[#121215] border border-zinc-800/80 overflow-hidden hover:border-zinc-700 transition-all duration-300 flex flex-col justify-between"
              >
                {/* Cover Image Container */}
                <div>
                  <div className="relative aspect-3/4 w-full overflow-hidden bg-zinc-900">
                    {ebook.coverImage ? (
                      <Image
                        src={ebook.coverImage}
                        alt={ebook.title || "EBook Cover"}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-zinc-700 bg-zinc-900/80 p-4">
                        <BookOpen className="w-12 h-12 mb-2 stroke-[1.5]" />
                        <span className="text-xs font-mono">FABLE EBOOK</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-linear-to-t from-[#121215] via-transparent to-transparent opacity-60" />

                    {/* Genre Tag */}
                    {ebook.genre && (
                      <span className="absolute top-3 left-3 bg-zinc-950/80 backdrop-blur-md border border-zinc-700/60 text-zinc-300 text-[10px] font-semibold px-2.5 py-1 uppercase tracking-wider">
                        {ebook.genre}
                      </span>
                    )}

                    {/* Free Tag */}
                    {isFreeBook && (
                      <span className="absolute top-3 right-3 bg-emerald-950/90 backdrop-blur-md border border-emerald-700/60 text-emerald-400 text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider">
                        FREE
                      </span>
                    )}
                  </div>

                  {/* Info Section */}
                  <div className="p-5 space-y-2">
                    <h3 className="text-lg font-serif font-medium text-white group-hover:text-rose-400 transition-colors duration-200 line-clamp-1">
                      {ebook.title}
                    </h3>
                    <p className="text-xs text-zinc-400">
                      by <span className="text-zinc-300 font-medium">{ebook.writerName || ebook.author || "Anonymous"}</span>
                    </p>
                    
                  </div>
                </div>

                {/* Footer Section: Rating & Price */}
                <div className="px-5 pb-5 pt-3 border-t border-zinc-800/60 flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-1 text-xs text-amber-400">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span className="font-semibold text-zinc-200">
                      {ebook.rating || "4.8"}
                    </span>
                    <span className="text-zinc-500">
                      ({ebook.reviewsCount || 45})
                    </span>
                  </div>

                  <span className="text-sm font-semibold text-white font-mono">
                    {isFreeBook ? "Free" : `$${priceVal.toFixed(2)}`}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
