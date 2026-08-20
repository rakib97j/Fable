"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";

import { 
  ChevronLeft, 
  ChevronRight, 
  BookOpen, 
  Star, 
  Clock, 
  Sparkles,
  ArrowRight,
  Bookmark
} from "lucide-react";

// Default Dynamic Ebook Learning Platform Slider Data
const DEFAULT_SLIDES = [
  {
    id: "slide-1",
    tag: "FEATURED COURSE & E-BOOK",
    category: "Computer Science",
    title: "Mastering Modern System Design & Scalability",
    author: "Dr. Aris Thorne",
    authorTitle: "Senior Principal Architect",
    rating: 4.9,
    reviewsCount: "1,240",
    readTime: "12h Read + Interactive Labs",
    description: "Build ultra-resilient distributed systems, microservices, and cloud infrastructure with hands-on architectural blueprints.",
    coverImage: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1200&auto=format&fit=crop",
    bgGradient: "from-blue-950/90 via-slate-900/95 to-zinc-950",
    accentColor: "from-blue-500 to-indigo-600",
    badgeColor: "bg-blue-500/20 text-blue-300 border-blue-500/40",
    primaryCta: "Start Reading Now",
    secondaryCta: "Preview Chapter 1"
  },
  {
    id: "slide-2",
    tag: "MINDSET & PRODUCTIVITY",
    category: "Psychology & Learning",
    title: "The Art of Deep Focus & Mindful Knowledge Retention",
    author: "Elena Rostova",
    authorTitle: "Cognitive Neuroscientist",
    rating: 4.8,
    reviewsCount: "980",
    readTime: "6h Read + Audio Companion",
    description: "Unlock rapid learning techniques, combat digital fatigue, and build high-efficiency study habits grounded in neuroscience.",
    coverImage: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=1200&auto=format&fit=crop",
    bgGradient: "from-emerald-950/90 via-zinc-900/95 to-zinc-950",
    accentColor: "from-emerald-500 to-teal-600",
    badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
    primaryCta: "Begin Masterclass",
    secondaryCta: "Listen Sample"
  },
  {
    id: "slide-3",
    tag: "ADVANCED SCI-TECH",
    category: "Physics & Artificial Intelligence",
    title: "Quantum Computing: Fundamentals & Quantum AI",
    author: "Prof. Marcus Vance",
    authorTitle: "Quantum Researcher at CERN",
    rating: 4.95,
    reviewsCount: "2,410",
    readTime: "15h Read + Python Demos",
    description: "Demystify qubits, superposition, quantum algorithms, and next-generation machine learning with practical code examples.",
    coverImage: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=1200&auto=format&fit=crop",
    bgGradient: "from-violet-950/90 via-purple-900/95 to-zinc-950",
    accentColor: "from-violet-500 to-purple-600",
    badgeColor: "bg-violet-500/20 text-violet-300 border-violet-500/40",
    primaryCta: "Explore Interactive Book",
    secondaryCta: "View Syllabus"
  },
  {
    id: "slide-4",
    tag: "FINANCE & WEALTH",
    category: "Economics & Strategy",
    title: "Financial Freedom in the Digital Economy",
    author: "Sarah Lin, CFA",
    authorTitle: "Portfolio Strategist",
    rating: 4.87,
    reviewsCount: "1,850",
    readTime: "8h Read + Wealth Calculators",
    description: "A comprehensive handbook on global markets, risk management, asset allocation, and passive income architecture.",
    coverImage: "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=1200&auto=format&fit=crop",
    bgGradient: "from-amber-950/90 via-zinc-900/95 to-zinc-950",
    accentColor: "from-amber-500 to-orange-600",
    badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/40",
    primaryCta: "Read Free Preview",
    secondaryCta: "Bookmark Book"
  },
  {
    id: "slide-5",
    tag: "CREATIVE & DESIGN",
    category: "UI/UX & Product Design",
    title: "Design Systems: Crafting Enterprise Products",
    author: "Alex Mercer",
    authorTitle: "Design Director",
    rating: 4.92,
    reviewsCount: "3,120",
    readTime: "10h Read + Figma UI Kit",
    description: "Learn how modern tech giants architect scalable design systems, component libraries, and cohesive user experiences.",
    coverImage: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop",
    bgGradient: "from-rose-950/90 via-pink-950/90 to-zinc-950",
    accentColor: "from-rose-500 to-pink-600",
    badgeColor: "bg-rose-500/20 text-rose-300 border-rose-500/40",
    primaryCta: "Start Learning",
    secondaryCta: "View Resources"
  }
];

export default function HeroSlider({ slides = DEFAULT_SLIDES, autoPlayInterval = 5000 }) {
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  if (!slides || slides.length === 0) return null;

  return (
    <section className="relative w-full h-[calc(100vh-4rem)] min-h-137.5 overflow-hidden select-none bg-zinc-950">
      <Swiper
        modules={[Autoplay, Pagination, Navigation, EffectFade]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        speed={800}
        loop={true}
        autoplay={{
          delay: autoPlayInterval,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        navigation={{
          prevEl: prevRef.current,
          nextEl: nextRef.current,
        }}
        onBeforeInit={(swiper) => {
          swiper.params.navigation.prevEl = prevRef.current;
          swiper.params.navigation.nextEl = nextRef.current;
        }}
        className="w-full h-full hero-swiper"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id} className="relative w-full h-full">
            {/* Slide Background Container */}
            <div className="absolute inset-0 z-0">
              <Image
                src={slide.coverImage}
                alt={slide.title}
                fill
                priority
                className="object-cover opacity-30 scale-105 filter blur-lg"
                sizes="100vw"
              />
              <div className={`absolute inset-0 bg-linear-to-r ${slide.bgGradient}`} />
              <div className="absolute inset-0 bg-zinc-950/40 backdrop-brightness-90" />
            </div>

            {/* Slide Content */}
            <div className="relative z-10 w-full h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center py-10">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                
                {/* Left Info Column */}
                <div className="md:col-span-7 flex flex-col items-start space-y-4 text-left">
                  
                  {/* Category & Tag */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-full border ${slide.badgeColor} backdrop-blur-md`}>
                      <Sparkles className="w-3.5 h-3.5" />
                      {slide.tag}
                    </span>
                    <span className="text-xs text-zinc-300 font-medium px-2.5 py-1 rounded-full bg-zinc-800/60 border border-zinc-700/50">
                      {slide.category}
                    </span>
                  </div>

                  {/* Rating & Read Time Meta */}
                  <div className="flex items-center gap-4 text-xs sm:text-sm text-zinc-300 pt-1">
                    <div className="flex items-center gap-1 text-amber-400 font-semibold">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span>{slide.rating}</span>
                      <span className="text-zinc-400 font-normal">({slide.reviewsCount})</span>
                    </div>
                    <span className="text-zinc-600">•</span>
                    <div className="flex items-center gap-1.5 text-zinc-300 font-medium">
                      <Clock className="w-4 h-4 text-blue-400" />
                      <span>{slide.readTime}</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-white leading-tight drop-shadow-md">
                    {slide.title}
                  </h1>

                  {/* Author Info */}
                  <div className="flex items-center gap-2 text-sm text-zinc-300">
                    <span className="text-zinc-400">By</span>
                    <span className="font-semibold text-white">{slide.author}</span>
                    <span className="text-zinc-500">•</span>
                    <span className="text-xs text-zinc-400 italic">{slide.authorTitle}</span>
                  </div>

                  {/* Description */}
                  <p className="text-sm sm:text-base text-zinc-300 line-clamp-3 md:line-clamp-none max-w-2xl font-normal leading-relaxed">
                    {slide.description}
                  </p>

                  {/* CTA Action Buttons */}
                  <div className="flex items-center gap-3 pt-3 w-full sm:w-auto flex-wrap">
                    <button className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm text-white bg-linear-to-r ${slide.accentColor} hover:opacity-95 shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all duration-200 cursor-pointer`}>
                      <BookOpen className="w-4 h-4" />
                      <span>{slide.primaryCta}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <button className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-medium text-sm text-zinc-200 bg-zinc-800/80 hover:bg-zinc-700/80 border border-zinc-700/60 active:scale-[0.98] transition-all duration-200 cursor-pointer backdrop-blur-md">
                      <Bookmark className="w-4 h-4 text-zinc-400" />
                      <span>{slide.secondaryCta}</span>
                    </button>
                  </div>
                </div>

                {/* Right Book Cover Column */}
                <div className="md:col-span-5 flex justify-center md:justify-end">
                  <div className="relative group w-44 sm:w-56 md:w-64 lg:w-72 aspect-3/4 rounded-2xl overflow-hidden shadow-2xl border-2 border-zinc-700/50 bg-zinc-800/80 transition-transform duration-500 hover:scale-105">
                    <Image
                      src={slide.coverImage}
                      alt={slide.title}
                      fill
                      sizes="(max-width: 640px) 176px, (max-width: 768px) 224px, 288px"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-linear-to-tr from-zinc-950/80 via-transparent to-white/10 opacity-70" />
                  </div>
                </div>

              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

     
    </section>
  );
}

