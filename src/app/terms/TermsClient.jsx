"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FileText,
  ShieldAlert,
  BookOpen,
  UserCheck,
  CreditCard,
  Lock,
  Scale,
  ChevronRight,
  Sparkles,
} from "lucide-react";

export default function TermsClient() {
  const [activeSection, setActiveSection] = useState("acceptance");

  const sections = [
    { id: "acceptance", title: "1. Acceptance of Terms", icon: UserCheck },
    { id: "accounts", title: "2. Accounts & Registration", icon: Lock },
    { id: "publishing", title: "3. Author Rights & Publishing", icon: BookOpen },
    { id: "purchases", title: "4. Digital Purchases & Payments", icon: CreditCard },
    { id: "conduct", title: "5. Content Policy & Conduct", icon: ShieldAlert },
    { id: "liability", title: "6. Limitation of Liability", icon: Scale },
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
      {/* Glow ambient background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[400px] bg-linear-to-b from-rose-500/10 via-pink-500/5 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-rose-500/10 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/20">
            <FileText className="w-3.5 h-3.5" /> Legal Documentation
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold font-serif tracking-tight">
            Terms of Service
          </h1>

          <p className="text-zinc-600 dark:text-zinc-400 text-sm sm:text-base">
            Please read these terms carefully before using Fable. By creating an account or reading e-books on our platform, you agree to be bound by these terms.
          </p>

          <p className="text-xs font-medium text-zinc-500 dark:text-zinc-500">
            Last Updated: January 15, 2026 • Version 2.4
          </p>
        </div>

        {/* Mobile Horizontal Quick Navigation Bar */}
        <div className="block lg:hidden sticky top-16 z-30 bg-white/95 dark:bg-[#0d0d0f]/95 backdrop-blur-md py-3 -mx-4 px-4 sm:-mx-6 sm:px-6 border-b border-zinc-200/80 dark:border-zinc-800/80 shadow-xs">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth py-1">
            {sections.map((sec) => {
              const Icon = sec.icon;
              const isActive = activeSection === sec.id;
              return (
                <button
                  key={sec.id}
                  onClick={() => scrollToSection(sec.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-all ${
                    isActive
                      ? "bg-rose-600 text-white shadow-md shadow-rose-600/20"
                      : "bg-zinc-100 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{sec.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content & Sidebar Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Sticky Sidebar Navigation (Desktop) */}
          <div className="hidden lg:block lg:col-span-4 sticky top-24 space-y-4 bg-white/80 dark:bg-[#131317]/80 backdrop-blur-md p-6 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 px-3">
              Table of Contents
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
              <p>Questions regarding our terms?</p>
              <Link href="/contact" className="text-rose-500 font-semibold hover:underline inline-flex items-center gap-1">
                Contact Support <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Main Legal Content */}
          <div className="lg:col-span-8 bg-white dark:bg-[#131317] p-4 sm:p-8 lg:p-10 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-xs space-y-8 sm:space-y-10">
            {/* Section 1 */}
            <section id="acceptance" className="scroll-mt-32 lg:scroll-mt-28 space-y-4">
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2.5 sm:gap-3">
                <UserCheck className="w-5 h-5 sm:w-6 sm:h-6 text-rose-500 shrink-0" />
                1. Acceptance of Terms
              </h2>
              <div className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed space-y-3">
                <p>
                  By accessing or using Fable (&ldquo;Platform&rdquo;, &ldquo;We&rdquo;, &ldquo;Us&rdquo;), including browsing our e-book catalog, purchasing digital works, or publishing manuscripts as an author, you agree to comply with and be bound by these Terms of Service.
                </p>
                <p>
                  If you do not agree to these terms, you may not access or use any services provided by Fable. We reserve the right to modify these terms at any time with prior notice provided on our website.
                </p>
              </div>
            </section>

            <hr className="border-zinc-200 dark:border-zinc-800" />

            {/* Section 2 */}
            <section id="accounts" className="scroll-mt-32 lg:scroll-mt-28 space-y-4">
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2.5 sm:gap-3">
                <Lock className="w-5 h-5 sm:w-6 sm:h-6 text-rose-500 shrink-0" />
                2. User Accounts & Account Security
              </h2>
              <div className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed space-y-3">
                <p>
                  To unlock full platform features such as purchasing e-books or publishing manuscripts, you must register for an account. You are responsible for maintaining the confidentiality of your login credentials and for all activities that occur under your account.
                </p>
                <ul className="list-disc pl-5 space-y-1 text-zinc-600 dark:text-zinc-400">
                  <li>You must provide accurate, complete, and updated information during registration.</li>
                  <li>Account sharing or transferring account credentials to third parties is strictly prohibited.</li>
                  <li>You must immediately notify us of any unauthorized use or security breaches.</li>
                </ul>
              </div>
            </section>

            <hr className="border-zinc-200 dark:border-zinc-800" />

            {/* Section 3 */}
            <section id="publishing" className="scroll-mt-32 lg:scroll-mt-28 space-y-4">
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2.5 sm:gap-3">
                <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-rose-500 shrink-0" />
                3. Author Rights & Intellectual Property
              </h2>
              <div className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed space-y-3">
                <p>
                  Authors retain <strong>100% full copyright ownership</strong> of all original manuscripts, covers, and written content uploaded to Fable. By uploading content, authors grant Fable a non-exclusive, worldwide license to host, display, format, and distribute the e-book to readers on our platform.
                </p>
                <p>
                  Authors represent and warrant that uploaded manuscripts do not infringe upon any third-party copyrights, trademarks, or proprietary rights.
                </p>
              </div>
            </section>

            <hr className="border-zinc-200 dark:border-zinc-800" />

            {/* Section 4 */}
            <section id="purchases" className="scroll-mt-32 lg:scroll-mt-28 space-y-4">
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2.5 sm:gap-3">
                <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 text-rose-500 shrink-0" />
                4. Digital Purchases, Royalties & Refunds
              </h2>
              <div className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed space-y-3">
                <p>
                  All purchases of digital e-books on Fable are processed securely via Stripe. Upon completion of a purchase, readers receive a non-transferable, personal license to read the e-book online.
                </p>
                <p>
                  Due to the immediate digital nature of e-book access, sales are generally final. If you experience technical defects or double billing, refund requests submitted within 14 days will be reviewed by support.
                </p>
              </div>
            </section>

            <hr className="border-zinc-200 dark:border-zinc-800" />

            {/* Section 5 */}
            <section id="conduct" className="scroll-mt-32 lg:scroll-mt-28 space-y-4">
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2.5 sm:gap-3">
                <ShieldAlert className="w-5 h-5 sm:w-6 sm:h-6 text-rose-500 shrink-0" />
                5. Content Policy & Acceptable Conduct
              </h2>
              <div className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed space-y-3">
                <p>
                  We are committed to maintaining a safe, respectful environment for authors and readers alike. Users agree not to post or publish:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Plagiarized content or material violating third-party IP rights.</li>
                  <li>Hate speech, harassment, or malicious content targeting individuals.</li>
                  <li>Spam, automated bots, or malicious scripts.</li>
                </ul>
              </div>
            </section>

            <hr className="border-zinc-200 dark:border-zinc-800" />

            {/* Section 6 */}
            <section id="liability" className="scroll-mt-32 lg:scroll-mt-28 space-y-4">
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2.5 sm:gap-3">
                <Scale className="w-5 h-5 sm:w-6 sm:h-6 text-rose-500 shrink-0" />
                6. Limitation of Liability
              </h2>
              <div className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed space-y-3">
                <p>
                  Fable is provided on an &ldquo;AS IS&rdquo; and &ldquo;AS AVAILABLE&rdquo; basis. In no event shall Fable or its parent entities be liable for indirect, incidental, or consequential damages resulting from platform downtime or loss of data.
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
