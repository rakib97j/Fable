"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@heroui/react";
import {
  Mail,
  MessageSquare,
  HelpCircle,
  Clock,
  Send,
  CheckCircle,
  ChevronDown,
  Sparkles,
  BookOpen,
  Feather,
  CreditCard,
  ShieldCheck,
} from "lucide-react";

export default function ContactClient() {
  const [formData, setFormData] = useState({
    category: "reader",
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const categories = [
    { id: "reader", label: "Reader Support", icon: BookOpen },
    { id: "author", label: "Author Publishing", icon: Feather },
    { id: "billing", label: "Billing & Sales", icon: CreditCard },
    { id: "legal", label: "Copyright / Legal", icon: ShieldCheck },
  ];

  const supportChannels = [
    {
      icon: Mail,
      title: "Direct Email",
      value: "support@fable-app.com",
      description: "Send us a message anytime. Average response within 12 hours.",
      color: "from-rose-500 to-pink-500",
    },
    {
      icon: MessageSquare,
      title: "Community Discord",
      value: "discord.gg/fable-readers",
      description: "Join our active community of 15,000+ readers & writers.",
      color: "from-purple-500 to-indigo-500",
    },
    {
      icon: Clock,
      title: "Support SLA",
      value: "24/7 Monitoring",
      description: "Critical payment & reading service issues monitored non-stop.",
      color: "from-emerald-500 to-teal-500",
    },
  ];

  const faqs = [
    {
      q: "How do I publish my e-book on Fable?",
      a: "Simply sign up or switch your account to an Author profile, navigate to the Dashboard -> Add E-Book section, upload your manuscript, fill in metadata, set your price, and publish instantly!",
    },
    {
      q: "How do author royalty payouts work?",
      a: "Authors earn royalties on every sale, processed directly through Stripe. Payouts can be scheduled weekly or monthly from your writer dashboard.",
    },
    {
      q: "Can I read purchased e-books on mobile devices?",
      a: "Yes! Fable features a responsive in-browser e-book reader optimized for smartphones, tablets, and desktop computers. Your reading progress automatically syncs across device sessions.",
    },
    {
      q: "What is your refund policy for purchased e-books?",
      a: "If you encounter technical issues accessing a purchased e-book or were accidentally double-billed, contact support within 14 days for assistance or a full refund.",
    },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.email || !formData.message) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({
        category: "reader",
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    }, 1200);
  };

  return (
    <div className="relative bg-zinc-50 dark:bg-[#0d0d0f] text-zinc-900 dark:text-zinc-100 min-h-screen py-12 lg:py-16">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[450px] bg-linear-to-b from-rose-500/10 via-pink-500/5 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-rose-500/10 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/20">
            <Mail className="w-3.5 h-3.5" /> We&apos;re Here to Help
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold font-serif tracking-tight">
            Get in Touch with Fable
          </h1>

          <p className="text-zinc-600 dark:text-zinc-400 text-sm sm:text-base">
            Have questions about reading, publishing, or partner opportunities? Reach out to our dedicated support team.
          </p>
        </div>

        {/* Support Channels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {supportChannels.map((channel, i) => {
            const Icon = channel.icon;
            return (
              <div
                key={i}
                className="p-6 rounded-2xl bg-white dark:bg-[#131317] border border-zinc-200/80 dark:border-zinc-800/80 shadow-xs space-y-3 hover:border-rose-500/30 transition-all"
              >
                <div className={`w-12 h-12 rounded-xl bg-linear-to-tr ${channel.color} flex items-center justify-center text-white shadow-md`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-serif font-bold text-lg text-zinc-900 dark:text-zinc-100">
                  {channel.title}
                </h3>
                <p className="text-rose-600 dark:text-rose-400 text-sm font-semibold">
                  {channel.value}
                </p>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {channel.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Main Form & Info Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Contact Form */}
          <div className="lg:col-span-7 bg-white dark:bg-[#131317] p-6 sm:p-10 rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-lg space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-serif font-bold text-zinc-900 dark:text-zinc-100">
                Send Us a Message
              </h2>
              <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
                Select your topic and fill out the details below.
              </p>
            </div>

            {/* Success Banner */}
            <AnimatePresence>
              {isSubmitted && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center gap-3 text-sm"
                >
                  <CheckCircle className="w-5 h-5 shrink-0" />
                  <span>
                    Thank you! Your message has been received. We will respond shortly.
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Category selector */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
                  Inquiry Topic
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {categories.map((cat) => {
                    const Icon = cat.icon;
                    const selected = formData.category === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, category: cat.id })}
                        className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-medium transition-all gap-1.5 ${
                          selected
                            ? "border-rose-500 bg-rose-500/10 text-rose-600 dark:text-rose-400 shadow-xs"
                            : "border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="truncate">{cat.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Name & Email inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Jane Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#0d0d0f] text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/50 transition"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="jane@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#0d0d0f] text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/50 transition"
                  />
                </div>
              </div>

              {/* Subject */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Subject
                </label>
                <input
                  type="text"
                  required
                  placeholder="How can we help?"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#0d0d0f] text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/50 transition"
                />
              </div>

              {/* Message */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Message Details
                </label>
                <textarea
                  rows={5}
                  required
                  placeholder="Please describe your request in detail..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#0d0d0f] text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/50 transition resize-none"
                />
              </div>

              <Button
                type="submit"
                isLoading={isSubmitting}
                size="lg"
                className="w-full bg-linear-to-r from-rose-600 to-pink-600 text-white font-semibold rounded-xl shadow-lg shadow-rose-600/25 hover:shadow-rose-600/40 transition"
              >
                {!isSubmitting && <Send className="w-4 h-4 mr-2" />}
                Send Message
              </Button>
            </form>
          </div>

          {/* FAQ Accordion Sidebar */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-2">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400">
                <HelpCircle className="w-3.5 h-3.5" /> FAQ
              </span>
              <h2 className="text-2xl font-serif font-bold text-zinc-900 dark:text-zinc-100">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div
                    key={idx}
                    className="rounded-2xl bg-white dark:bg-[#131317] border border-zinc-200/80 dark:border-zinc-800/80 overflow-hidden shadow-xs"
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full p-4 text-left flex items-center justify-between gap-3 font-semibold text-sm text-zinc-900 dark:text-zinc-100 hover:text-rose-500 transition"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-rose-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="px-4 pb-4 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed border-t border-zinc-100 dark:border-zinc-800/60 pt-3"
                        >
                          {faq.a}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
