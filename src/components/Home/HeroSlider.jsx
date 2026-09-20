"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import { motion } from "framer-motion";

// Swiper core & plugin styling
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

import { 
  BookOpen, 
  Sparkles,
  ArrowRight,
  Compass,
} from "lucide-react";

/**
 * Curated Slide Dataset for Fable Hero Banner Showcase.
 * Built with rich metadata, semantic action targets, and accessible labels.
 */
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

/**
 * UI/UX REFACTOR: HeroSlider Component
 * - 1. UX: Clear visual separation between Primary (high-contrast gradient CTA) & Secondary (subtle glass border CTA) buttons.
 * - 2. Typography: Clean hierarchy using font-mono for badges, font-serif for primary hero titles, and font-sans for descriptions.
 * - 3. Spacing: 8px-grid padding & responsive max height containment preventing layout shifts.
 * - 4. Micro-interactions: Framer motion entry animations, spring hover states, and smooth slide fade cross-transitions.
 * - 5. A11y: Standardized ARIA carousel region, explicit focus rings (`focus-visible:ring-2`), and slide indicators.
 */
export default function HeroSlider({ slides = HERO_SLIDES, autoPlayInterval = 5000 }) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!slides || slides.length === 0) return null;

  return (
    <section 
      aria-label="Featured Stories Showcase" 
      aria-roledescription="carousel"
      className="relative w-full h-[calc(100vh-4rem)] min-h-[560px] max-h-[850px] overflow-hidden select-none bg-zinc-950 font-sans"
    >
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
          bulletActiveClass: "!bg-rose-500 !w-8 !rounded-full",
          bulletClass: "inline-block w-2.5 h-2.5 bg-zinc-600 transition-all duration-300 mx-1 cursor-pointer hover:bg-zinc-300 rounded-full",
        }}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        className="w-full h-full hero-swiper"
      >
        {slides.map((slide, index) => {
          const isActive = activeIndex === index;

          return (
            <SwiperSlide 
              key={slide.id} 
              className="relative w-full h-full"
              aria-label={`Slide ${index + 1} of ${slides.length}: ${slide.titlePrefix} ${slide.highlightText}`}
            >
              {/* Responsive Hero Background Image with Subtle Gradient Overlays */}
              <div className="absolute inset-0 z-0 overflow-hidden">
                <Image
                  src={slide.bgImage}
                  alt={`Background illustration for ${slide.titlePrefix} ${slide.highlightText}`}
                  fill
                  priority={index === 0}
                  className="object-cover object-center w-full h-full scale-105 filter brightness-75 transition-transform duration-10000 ease-out"
                  sizes="100vw"
                  unoptimized
                />
                {/* High Contrast Multi-Stage Vignette Overlay for Text Legibility (WCAG AAA Contrast) */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-[#0a0a0c]/75 to-[#0a0a0c]/40" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0c] via-[#0a0a0c]/85 to-transparent sm:max-w-4xl" />
              </div>

              {/* Main Text Content & Interactive Actions Container */}
              <div className="relative z-10 w-full h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center py-16">
                <div className="max-w-3xl space-y-6 text-left">
                  
                  {/* Category / Subheading Badge */}
                  <motion.div
                    key={`badge-${slide.id}-${isActive}`}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="flex items-center gap-2"
                  >
                    <span className={`inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-mono font-semibold uppercase tracking-widest rounded-full border ${slide.badgeColor} backdrop-blur-md shadow-sm`}>
                      <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                      {slide.subheading}
                    </span>
                  </motion.div>

                  {/* Primary Heading Tagline */}
                  <motion.h1
                    key={`title-${slide.id}-${isActive}`}
                    initial={{ opacity: 0, y: 25 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-white tracking-tight leading-[1.1] drop-shadow-md"
                  >
                    {slide.titlePrefix}{" "}
                    <span className={`text-transparent bg-clip-text bg-gradient-to-r ${slide.accentColor}`}>
                      {slide.highlightText}
                    </span>
                  </motion.h1>

                  {/* Subtitle Body Description */}
                  <motion.p
                    key={`desc-${slide.id}-${isActive}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.35 }}
                    className="text-base sm:text-lg text-zinc-300 max-w-2xl font-normal leading-relaxed"
                  >
                    {slide.description}
                  </motion.p>

                  {/* Primary & Secondary Call to Action Controls */}
                  <motion.div
                    key={`cta-${slide.id}-${isActive}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="flex items-center gap-4 pt-4 flex-wrap"
                  >
                    {/* Primary Button */}
                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                      <Link
                        href={slide.primaryLink || "/e-books"}
                        className="inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 transition-all shadow-xl shadow-rose-600/30 cursor-pointer uppercase tracking-wider focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
                      >
                        <BookOpen className="w-4 h-4" aria-hidden="true" />
                        <span>{slide.primaryCta || "Browse Ebooks"}</span>
                        <ArrowRight className="w-4 h-4" aria-hidden="true" />
                      </Link>
                    </motion.div>

                    {/* Secondary Button */}
                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                      <Link
                        href={slide.secondaryLink || "/dashboard/writer"}
                        className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-medium text-sm text-zinc-200 bg-zinc-900/80 hover:bg-zinc-800/90 border border-zinc-700/80 hover:border-zinc-600 transition-all cursor-pointer backdrop-blur-md uppercase tracking-wider focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
                      >
                        <Compass className="w-4 h-4 text-rose-400" aria-hidden="true" />
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

      {/* Accessible Swiper Pagination Control Container */}
      <div 
        aria-label="Carousel pagination navigation"
        className="hero-pagination absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2" 
      />
    </section>
  );
}

