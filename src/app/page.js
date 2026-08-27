"use client";

import { motion } from "framer-motion";
import HeroSlider from "@/components/Home/HeroSlider";
import PlatformFeatures from "@/components/Home/PlatformFeatures";
import FeaturedEbooks from "@/components/Home/FeaturedEbooks";
import EbookGenres from "@/components/Home/EbookGenres";
import TopWriters from "@/components/Home/TopWriters";
import TestimonialsSection from "@/components/Home/TestimonialsSection";
import PublishBanner from "@/components/Home/PublishBanner";
import FaqSection from "@/components/Home/FaqSection";

export default function Home() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1.0] }}
      className="w-full bg-zinc-50 dark:bg-[#0d0d0f] transition-colors duration-200"
    >
      <HeroSlider />
      <PlatformFeatures />
      <FeaturedEbooks />
      <EbookGenres />
      <TopWriters />
      <TestimonialsSection />
      <PublishBanner />
      <FaqSection />
    </motion.div>
  );
}
