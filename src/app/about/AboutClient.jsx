"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@heroui/react";
import {
  BookOpen,
  Sparkles,
  Feather,
  Users,
  ShieldCheck,
  TrendingUp,
  Globe,
  Award,
  Zap,
  ArrowRight,
  Heart,
  CheckCircle2,
} from "lucide-react";

export default function AboutClient() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const stats = [
    { label: "Active Readers", value: "50,000+", icon: Users },
    { label: "E-Books Published", value: "12,500+", icon: BookOpen },
    { label: "Author Earnings", value: "$2.5M+", icon: TrendingUp },
    { label: "Global Reach", value: "140+ Countries", icon: Globe },
  ];

  const values = [
    {
      icon: Feather,
      title: "Author First & Creator Freedom",
      description:
        "We put writers in control. Seamlessly format, publish, and monetize your work without gatekeepers or restrictive contracts.",
      color: "from-rose-500 to-pink-500",
    },
    {
      icon: BookOpen,
      title: "Immersive Reading Canvas",
      description:
        "Engineered for bookworms. Enjoy distraction-free typography, dark mode optimization, and seamless syncing across devices.",
      color: "from-purple-500 to-indigo-500",
    },
    {
      icon: ShieldCheck,
      title: "Transparent & Direct Monetization",
      description:
        "Authors keep the lion's share of sales. Powered by Stripe for instant payouts and transparent real-time revenue analytics.",
      color: "from-emerald-500 to-teal-500",
    },
    {
      icon: Heart,
      title: "Passionate Community",
      description:
        "Building lasting connections between storytellers and avid readers through interactive reviews, bookmarks, and discovery tools.",
      color: "from-amber-500 to-orange-500",
    },
  ];

  const features = [
    "Instant in-browser e-book reader with custom typography",
    "Real-time analytics dashboard for sales & reader metrics",
    "Multi-format publishing support with instant metadata setup",
    "Role-based security powered by modern authentication",
  ];

  return (
    <div className="relative overflow-hidden bg-zinc-50 dark:bg-[#0d0d0f] text-zinc-900 dark:text-zinc-100 min-h-screen py-12 lg:py-20">
      {/* Background Decorative Glow Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-linear-to-b from-rose-500/10 via-pink-500/5 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/3 -right-48 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 -left-48 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
        {/* HERO SECTION */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="text-center max-w-4xl mx-auto space-y-6 pt-4"
        >
          <motion.div variants={itemVariants} className="inline-block">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide bg-rose-500/10 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/20 shadow-sm">
              <Sparkles className="w-3.5 h-3.5" /> Reimagining Digital Storytelling
            </span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold font-serif tracking-tight leading-tight"
          >
            Where Stories Come Alive &{" "}
            <span className="bg-linear-to-r from-rose-600 via-rose-500 to-pink-500 bg-clip-text text-transparent">
              Authors Thrive
            </span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-lg sm:text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans max-w-2xl mx-auto"
          >
            Fable is an end-to-end digital reading & publishing ecosystem built to bridge the gap between creative storytellers and avid readers across the globe.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-wrap items-center justify-center gap-4 pt-4"
          >
            <Link href="/e-books">
              <Button
                size="lg"
                className="bg-linear-to-r from-rose-600 to-pink-600 text-white font-semibold shadow-lg shadow-rose-600/25 hover:shadow-rose-600/40 transition-all duration-300 rounded-xl px-8"
              >
                <BookOpen className="w-4 h-4 mr-2" /> Explore E-Books
              </Button>
            </Link>
            <Link href="/writers">
              <Button
                size="lg"
                variant="bordered"
                className="border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-semibold rounded-xl px-8"
              >
                <Feather className="w-4 h-4 mr-2" /> Meet Writers
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* STATS SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white/70 dark:bg-[#131317]/70 backdrop-blur-md border border-zinc-200/80 dark:border-zinc-800/80 shadow-xs hover:shadow-md hover:border-rose-500/30 transition-all duration-300 flex flex-col items-center text-center space-y-2 group"
              >
                <div className="p-3 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-3xl font-bold font-serif text-zinc-900 dark:text-zinc-100">
                  {stat.value}
                </span>
                <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  {stat.label}
                </span>
              </div>
            );
          })}
        </motion.div>

        {/* OUR STORY & MISSION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400">
              <Award className="w-3.5 h-3.5" /> Our Mission
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold font-serif tracking-tight leading-snug">
              Democratizing Publishing for Independent Voices
            </h2>

            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Traditional publishing has long kept remarkable stories locked behind bureaucratic gatekeepers. Fable was created with a simple premise: any writer with a story worth telling should have direct access to readers, paired with world-class reading technology.
            </p>

            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              From dark-fantasy epics to intimate memoirs and tech guides, Fable provides an intuitive suite of manuscript publishing tools, automated royalties, and customizable reader themes.
            </p>

            <div className="space-y-3 pt-2">
              {features.map((feat, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-rose-500 shrink-0" />
                  <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    {feat}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6"
          >
            <div className="relative rounded-3xl p-8 bg-linear-to-br from-rose-900/20 via-zinc-900/40 to-pink-900/20 border border-zinc-200/80 dark:border-zinc-800/80 shadow-2xl overflow-hidden backdrop-blur-xl">
              <div className="space-y-6 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-rose-600 text-white shadow-md shadow-rose-600/30">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-xl text-zinc-900 dark:text-zinc-100">
                      The Fable Standard
                    </h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      Crafted for storytellers & bibliophiles
                    </p>
                  </div>
                </div>

                <blockquote className="italic text-zinc-700 dark:text-zinc-300 border-l-2 border-rose-500 pl-4 py-1 text-sm sm:text-base leading-relaxed">
                  &ldquo;A story isn&apos;t just words on a page — it&apos;s a shared portal between human minds. Fable ensures that portal opens instantly, beautifully, and effortlessly.&rdquo;
                </blockquote>

                <div className="pt-4 border-t border-zinc-200/60 dark:border-zinc-800/60 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
                  <span className="font-medium">Fable Platform Architecture</span>
                  <span className="text-rose-500 font-semibold">Next.js 16 • React 19</span>
                </div>
              </div>

              {/* Aesthetic subtle background patterns */}
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-rose-500/20 rounded-full blur-2xl pointer-events-none" />
            </div>
          </motion.div>
        </div>

        {/* CORE VALUES */}
        <div className="space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400">
              <Zap className="w-3.5 h-3.5" /> What Guides Us
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold font-serif tracking-tight">
              Our Core Principles
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm sm:text-base">
              Every feature we build and every update we roll out is grounded in these four fundamental pillars.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((val, idx) => {
              const Icon = val.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  className="p-6 rounded-2xl bg-white dark:bg-[#131317] border border-zinc-200/80 dark:border-zinc-800/80 shadow-xs hover:border-rose-500/40 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-4">
                    <div
                      className={`w-12 h-12 rounded-xl bg-linear-to-tr ${val.color} flex items-center justify-center text-white shadow-md`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold font-serif text-zinc-900 dark:text-zinc-100">
                      {val.title}
                    </h3>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      {val.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* CALL TO ACTION */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative rounded-3xl p-8 sm:p-12 lg:p-16 bg-linear-to-r from-rose-600 via-rose-500 to-pink-600 text-white shadow-2xl shadow-rose-600/20 overflow-hidden text-center space-y-6"
        >
          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold tracking-tight leading-tight">
              Ready to Begin Your Next Literary Chapter?
            </h2>
            <p className="text-rose-100 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
              Whether you are looking to discover your next favorite book or publish your own manuscript to thousands of readers worldwide, Fable is here for you.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link href="/e-books">
                <Button
                  size="lg"
                  className="bg-white text-rose-600 hover:bg-zinc-100 font-bold rounded-xl px-8 shadow-md"
                >
                  Browse E-Book Store <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button
                  size="lg"
                  variant="bordered"
                  className="border-white/40 hover:bg-white/10 text-white font-bold rounded-xl px-8"
                >
                  Go to Dashboard
                </Button>
              </Link>
            </div>
          </div>

          {/* Decorative glow circles inside CTA */}
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-black/10 rounded-full blur-2xl pointer-events-none" />
        </motion.div>
      </div>
    </div>
  );
}
