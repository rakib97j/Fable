"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Lock,
  EyeOff,
  Database,
  Cookie,
  UserCheck,
  ChevronRight,
  Sparkles,
  FileCheck2,
} from "lucide-react";

export default function PrivacyClient() {
  const [activeSection, setActiveSection] = useState("collection");

  const privacyPillars = [
    {
      icon: Lock,
      title: "Encrypted Data",
      description: "All transactions and sessions are protected by industry-standard TLS & AES-256 encryption.",
      color: "text-emerald-500 bg-emerald-500/10",
    },
    {
      icon: EyeOff,
      title: "No Selling of Data",
      description: "We never sell your reading habits, personal email, or payment information to third-party advertisers.",
      color: "text-rose-500 bg-rose-500/10",
    },
    {
      icon: UserCheck,
      title: "GDPR & CCPA Compliant",
      description: "Full control over your personal data with instant export and account deletion rights.",
      color: "text-purple-500 bg-purple-500/10",
    },
  ];

  const sections = [
    { id: "collection", title: "1. Information We Collect", icon: Database },
    { id: "usage", title: "2. How We Use Your Data", icon: ShieldCheck },
    { id: "payments", title: "3. Payment & Security", icon: Lock },
    { id: "cookies", title: "4. Cookies & Storage", icon: Cookie },
    { id: "rights", title: "5. Your Privacy Rights", icon: FileCheck2 },
  ];

  const scrollToSection = (id) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="relative bg-zinc-50 dark:bg-[#0d0d0f] text-zinc-900 dark:text-zinc-100 min-h-screen py-12 lg:py-16">
      {/* Glow background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[400px] bg-linear-to-b from-rose-500/10 via-pink-500/5 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-rose-500/10 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/20">
            <ShieldCheck className="w-3.5 h-3.5" /> Your Privacy Matters
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold font-serif tracking-tight">
            Privacy Policy
          </h1>

          <p className="text-zinc-600 dark:text-zinc-400 text-sm sm:text-base">
            At Fable, we believe privacy is a fundamental human right. Learn how we handle your data with transparency and care.
          </p>

          <p className="text-xs font-medium text-zinc-500 dark:text-zinc-500">
            Last Updated: January 15, 2026 • Version 2.0
          </p>
        </div>

        {/* Highlight Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {privacyPillars.map((p, i) => {
            const Icon = p.icon;
            return (
              <div
                key={i}
                className="p-6 rounded-2xl bg-white dark:bg-[#131317] border border-zinc-200/80 dark:border-zinc-800/80 shadow-xs space-y-3"
              >
                <div className={`w-10 h-10 rounded-xl ${p.color} flex items-center justify-center`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-serif font-bold text-lg text-zinc-900 dark:text-zinc-100">
                  {p.title}
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {p.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Content & Sidebar Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Sidebar */}
          <div className="lg:col-span-4 sticky top-24 space-y-4 bg-white/80 dark:bg-[#131317]/80 backdrop-blur-md p-6 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 px-3">
              Policy Sections
            </h3>
            <nav className="space-y-1">
              {sections.map((sec) => {
                const Icon = sec.icon;
                const isActive = activeSection === sec.id;
                return (
                  <button
                    key={sec.id}
                    onClick={() => scrollToSection(sec.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 font-semibold"
                        : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/60"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4 text-rose-500 shrink-0" />
                      <span className="truncate">{sec.title}</span>
                    </div>
                    <ChevronRight className={`w-4 h-4 transition-transform ${isActive ? "rotate-90 text-rose-500" : "text-zinc-400"}`} />
                  </button>
                );
              })}
            </nav>

            <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 text-xs text-zinc-500 space-y-2">
              <p>Data Protection Officer</p>
              <a href="mailto:privacy@fable-app.com" className="text-rose-500 font-semibold hover:underline">
                privacy@fable-app.com
              </a>
            </div>
          </div>

          {/* Main Legal Content */}
          <div className="lg:col-span-8 bg-white dark:bg-[#131317] p-6 sm:p-10 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-xs space-y-10">
            {/* Section 1 */}
            <section id="collection" className="scroll-mt-28 space-y-4">
              <h2 className="text-2xl font-serif font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-3">
                <Database className="w-6 h-6 text-rose-500" />
                1. Information We Collect
              </h2>
              <div className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed space-y-3">
                <p>
                  We collect information to provide better services to all our users. The types of data we collect include:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>Account Information</strong>: Name, email address, password hash, and profile details.</li>
                  <li><strong>Reading & Interaction Data</strong>: Bookmarks, reading progress, reviews, and purchased e-books.</li>
                  <li><strong>Author Data</strong>: Published manuscript files, cover imagery, payout preferences, and earnings.</li>
                </ul>
              </div>
            </section>

            <hr className="border-zinc-200 dark:border-zinc-800" />

            {/* Section 2 */}
            <section id="usage" className="scroll-mt-28 space-y-4">
              <h2 className="text-2xl font-serif font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-rose-500" />
                2. How We Use Your Data
              </h2>
              <div className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed space-y-3">
                <p>
                  Your information is used strictly to deliver, optimize, and secure Fable services:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Syncing your reading progress and bookmarks seamlessly across devices.</li>
                  <li>Processing e-book purchases and delivering earnings to authors.</li>
                  <li>Preventing fraud, bot abuse, and unauthorized access to accounts.</li>
                </ul>
              </div>
            </section>

            <hr className="border-zinc-200 dark:border-zinc-800" />

            {/* Section 3 */}
            <section id="payments" className="scroll-mt-28 space-y-4">
              <h2 className="text-2xl font-serif font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-3">
                <Lock className="w-6 h-6 text-rose-500" />
                3. Payment Processing & Third Parties
              </h2>
              <div className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed space-y-3">
                <p>
                  All payment transactions are handled securely by <strong>Stripe</strong>. Fable does not store your full credit card number or CVV code on our servers.
                </p>
                <p>
                  We share data only with necessary infrastructure providers (e.g. MongoDB for database storage, Vercel for hosting) under strict confidentiality agreements.
                </p>
              </div>
            </section>

            <hr className="border-zinc-200 dark:border-zinc-800" />

            {/* Section 4 */}
            <section id="cookies" className="scroll-mt-28 space-y-4">
              <h2 className="text-2xl font-serif font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-3">
                <Cookie className="w-6 h-6 text-rose-500" />
                4. Cookies & Local Storage
              </h2>
              <div className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed space-y-3">
                <p>
                  We use essential cookies and browser local storage to maintain session login states, theme preferences (light/dark mode), and reader settings. We do not use third-party tracking cookies for targeted advertising.
                </p>
              </div>
            </section>

            <hr className="border-zinc-200 dark:border-zinc-800" />

            {/* Section 5 */}
            <section id="rights" className="scroll-mt-28 space-y-4">
              <h2 className="text-2xl font-serif font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-3">
                <FileCheck2 className="w-6 h-6 text-rose-500" />
                5. Your Privacy Rights
              </h2>
              <div className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed space-y-3">
                <p>
                  Under applicable laws (including GDPR and CCPA), you have the right to:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Request a copy of all personal data associated with your account.</li>
                  <li>Request account deletion and permanent removal of personal information.</li>
                  <li>Opt out of any marketing emails at any time.</li>
                </ul>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
