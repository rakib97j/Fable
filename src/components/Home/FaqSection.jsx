"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const FAQS = [
  {
    question: "How do I purchase and read e-books on Fable?",
    answer: "Browse our catalog, click on any e-book details page, and complete the secure payment. Once purchased, your book will immediately appear in your Purchased Ebooks dashboard for instant reading.",
  },
  {
    question: "How can I publish my own e-books as an author?",
    answer: "Sign up or log into your account, switch to your Writer Dashboard, and click 'Publish New Ebook'. Fill in your title, genre, cover image URL, description, and price. Once submitted, your book enters review and will be published.",
  },
  {
    question: "Can I bookmark books to read later?",
    answer: "Yes! You can bookmark any e-book by clicking the bookmark icon. All your saved bookmarks are accessible anytime in your personal Reader Dashboard.",
  },
  {
    question: "Are there free e-books available on Fable?",
    answer: "Absolutely! Authors can choose to publish free e-books. Look for the green 'FREE' badge in our catalog to discover free reads.",
  },
  {
    question: "How do writers track their book sales and earnings?",
    answer: "Writers get full access to a dedicated Sales History dashboard showing detailed reader transaction history, total revenue, and copies sold.",
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFaq = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="w-full py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto font-sans">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-3 mb-12"
      >
        <span className="inline-flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-widest text-indigo-400 bg-indigo-500/10 px-3 py-1 border border-indigo-500/20 rounded-none">
          <HelpCircle className="w-3.5 h-3.5" />
          FREQUENTLY ASKED QUESTIONS
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white tracking-tight">
          Got Questions? We've Got Answers.
        </h2>
        <p className="text-sm sm:text-base text-zinc-400 font-normal max-w-xl mx-auto">
          Everything you need to know about reading, purchasing, and publishing on Fable.
        </p>
      </motion.div>

      {/* FAQ Accordion List */}
      <div className="space-y-3">
        {FAQS.map((faq, idx) => {
          const isOpen = openIndex === idx;

          return (
            <motion.div
              key={faq.question}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className="bg-[#121215] border border-zinc-800/80 rounded-none overflow-hidden transition-colors"
            >
              <button
                type="button"
                onClick={() => toggleFaq(idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 font-medium text-white hover:text-rose-400 transition-colors cursor-pointer select-none"
              >
                <span className="text-base sm:text-lg font-serif">{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-zinc-400 shrink-0 transition-transform duration-300 ${
                    isOpen ? "rotate-180 text-rose-400" : ""
                  }`}
                />
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 pt-1 text-sm text-zinc-400 leading-relaxed border-t border-zinc-800/50 font-normal">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
