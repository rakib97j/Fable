"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import { motion, AnimatePresence } from "framer-motion";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

import { 
  BookOpen, 
  Sparkles,
  ArrowRight,
  Compass,
  Feather,
  Bookmark
} from "lucide-react";

const HERO_SLIDES = [
  {
    id: "hero-1",
    subheading: "EXPLORE ORIGINAL STORIES & DIGITAL MASTERCLASSES",
    titlePrefix: "Discover & Read",
    highlightText: "Original Ebooks",
    description: "Immerse yourself in thousands of original ebooks, exclusive fiction sagas, and expert-authored guides available for instant digital reading.",
    bgImage: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=1920&auto=format&fit=crop",
    accentColor: "from-rose-400 via-pink-500 to-amber-300",
    badgeColor: "bg-rose-500/20 text-rose-300 border-rose-500/40",
    primaryCta: "Browse Ebooks",
    primaryLink: "/e-books",
    secondaryCta: "Publish Your Work",
    secondaryLink: "/dashboard/writer"
  },
  {
    id: "hero-2",
    subheading: "CURATED LITERARY SANCTUARY",
    titlePrefix: "Unleash Imagination with",
    highlightText: "Indie Authors",
    description: "Connect directly with independent writers, unearth underground literary masterpieces, and support passionate creators worldwide.",
    bgImage: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=1920&auto=format&fit=crop",
    accentColor: "from-amber-400 via-rose-500 to-pink-400",
    badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/40",
    primaryCta: "Explore Catalog",
    primaryLink: "/e-books",
    secondaryCta: "Top Writers",
    secondaryLink: "/dashboard/writer"
  },
  {
    id: "hero-3",
    subheading: "UNLIMITED DIGITAL ACCESS",
    titlePrefix: "Build Your Personal",
    highlightText: "Digital Library",
    description: "Enjoy rich typography, interactive bookmarks, cross-device syncing, and lifetime access to your acquired collection.",
    bgImage: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=1920&auto=format&fit=crop",
    accentColor: "from-indigo-400 via-purple-400 to-rose-400",
    badgeColor: "bg-indigo-500/20 text-indigo-300 border-indigo-500/40",
    primaryCta: "Browse Collection",
    primaryLink: "/e-books",
    secondaryCta: "Reader Dashboard",
    secondaryLink: "/dashboard/reader"
  },
  {
    id: "hero-4",
    subheading: "PUBLISH & DISTRIBUTE GLOBALLY",
    titlePrefix: "Share Your Voice with",
    highlightText: "Global Readers",
    description: "Are you an author? Join Fable's publishing platform to publish original ebooks, reach a global audience, and monetize your work.",
    bgImage: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?q=80&w=1920&auto=format&fit=crop",
    accentColor: "from-pink-400 via-rose-500 to-amber-400",
    badgeColor: "bg-pink-500/20 text-pink-300 border-pink-500/40",
    primaryCta: "Start Publishing",
    primaryLink: "/dashboard/writer/add-ebook",
    secondaryCta: "Writer Studio",
    secondaryLink: "/dashboard/writer"
  }
];

export default function HeroSlider({ slides = HERO_SLIDES, autoPlayInterval = 5000 }) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!slides || slides.length === 0) return null;

  return (
    <section className="relative w-full h-[calc(100vh-4rem)] min-h-[550px] max-h-[850px] overflow-hidden select-none bg-zinc-950 font-sans">
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        speed={900}
        loop={true}
        autoplay={{
          delay: autoPlayInterval,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        pagination={{
          clickable: true,
          el: ".hero-pagination",
          bulletActiveClass: "!bg-rose-500 !w-8 !rounded-none",
          bulletClass: "inline-block w-2.5 h-2.5 bg-zinc-600 transition-all duration-300 mx-1 cursor-pointer hover:bg-zinc-400 rounded-none",
        }}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        className="w-full h-full hero-swiper"
      >
        {slides.map((slide, index) => {
          const isActive = activeIndex === index;

          return (
            <SwiperSlide key={slide.id} className="relative w-full h-full">
              {/* Full-width Background Image Container */}
              <div className="absolute inset-0 z-0">
                <Image
                  src={slide.bgImage}
                  alt="Slider Background"
                  fill
                  priority
                  className="object-cover object-center w-full h-full scale-105 filter brightness-75 transition-transform duration-10000 ease-out"
                  sizes="100vw"
                  unoptimized
                />
                {/* Dark Aesthetic Overlays */}
                <div className="absolute inset-0 bg-linear-to-t from-[#0a0a0c] via-[#0a0a0c]/70 to-[#0a0a0c]/50" />
                <div className="absolute inset-0 bg-linear-to-r from-[#0a0a0c] via-[#0a0a0c]/80 to-transparent" />
              </div>

              {/* Banner Slide Content with Framer Motion Fade-In Animations */}
              <div className="relative z-10 w-full h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center py-16">
                <div className="max-w-3xl space-y-6 text-left">
                  
                  {/* Subheading Badge */}
                  <motion.div
                    key={`badge-${slide.id}-${isActive}`}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="flex items-center gap-2"
                  >
                    <span className={`inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-mono font-semibold uppercase tracking-widest rounded-none border ${slide.badgeColor} backdrop-blur-md shadow-sm`}>
                      <Sparkles className="w-3.5 h-3.5" />
                      {slide.subheading}
                    </span>
                  </motion.div>

                  {/* Dynamic Main Large Banner Tagline Fade-In */}
                  <motion.h1
                    key={`title-${slide.id}-${isActive}`}
                    initial={{ opacity: 0, y: 25 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-white tracking-tight leading-[1.1] drop-shadow-lg"
                  >
                    {slide.titlePrefix}{" "}
                    <span className={`text-transparent bg-clip-text bg-linear-to-r ${slide.accentColor}`}>
                      {slide.highlightText}
                    </span>
                  </motion.h1>

                  {/* Subtitle Description Fade-In */}
                  <motion.p
                    key={`desc-${slide.id}-${isActive}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.35 }}
                    className="text-base sm:text-lg text-zinc-300 max-w-2xl font-normal leading-relaxed"
                  >
                    {slide.description}
                  </motion.p>

                  {/* Primary & Secondary CTA Buttons with Hover & Tap Scaling */}
                  <motion.div
                    key={`cta-${slide.id}-${isActive}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="flex items-center gap-4 pt-4 flex-wrap"
                  >
                    <motion.div
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                      <Link
                        href={slide.primaryLink || "/e-books"}
                        className="inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-none font-semibold text-sm text-white bg-linear-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 transition-all shadow-xl shadow-rose-600/25 cursor-pointer uppercase tracking-wider"
                      >
                        <BookOpen className="w-4 h-4" />
                        <span>{slide.primaryCta || "Browse Ebooks"}</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                      <Link
                        href={slide.secondaryLink || "/dashboard/writer"}
                        className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-none font-medium text-sm text-zinc-200 bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-700/80 transition-all cursor-pointer backdrop-blur-md uppercase tracking-wider"
                      >
                        <Compass className="w-4 h-4 text-rose-400" />
                        <span>{slide.secondaryCta || "Publish Your Work"}</span>
                      </Link>
                    </motion.div>
                  </motion.div>

                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>

      {/* Custom Pagination Container */}
      <div className="hero-pagination absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2" />
    </section>
  );
}
