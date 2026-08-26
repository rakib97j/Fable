"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession, updateUser } from "@/lib/auth-client";
import ProfileSkeleton from "./ProfileSkeleton";
import {
  User,
  Mail,
  Camera,
  BookOpen,
  Bookmark,
  Flame,
  Sparkles,
  CheckCircle2,
  Save,
  Upload,
  Heart,
  AlertCircle,
  ArrowUpRight,
} from "lucide-react";

import { getUserBookmarks } from "@/lib/actions/eBooks";

export default function ReaderProfile() {
  const { data: session, isPending: sessionLoading } = useSession();
  const user = session?.user;
  const userIdStr = user?.id || user?._id;

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("general"); // 'general' | 'preferences'
  const [bookmarkCount, setBookmarkCount] = useState(0);
  
  const [saveSuccess, setSaveSuccess] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Form Data State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    image: "",
    bio: "",
    favoriteGenres: ["Fantasy", "Sci-Fi", "Mystery"],
    monthlyGoal: 4,
  });

  const availableGenres = [
    "Fantasy",
    "Sci-Fi",
    "Mystery",
    "Thriller",
    "Romance",
    "Historical Fiction",
    "Non-Fiction",
    "Self-Help",
    "Biography",
    "Cyberpunk",
  ];

  // Populate form data from session & localStorage for extra preferences
  useEffect(() => {
    if (!sessionLoading) {
      const userObj = session?.user;
      
      let localPrefs = {};
      try {
        const stored = localStorage.getItem("fable_reader_preferences");
        if (stored) localPrefs = JSON.parse(stored);
      } catch (e) {
        console.error("Error reading saved preferences", e);
      }

      setFormData((prev) => ({
        ...prev,
        name: userObj?.name || "Reader Member",
        email: userObj?.email || "reader@fable.com",
        image: userObj?.image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop",
        bio: localPrefs.bio || "Avid book lover, mystery fanatic, and collector of digital ebooks on Fable.",
        favoriteGenres: localPrefs.favoriteGenres || ["Fantasy", "Sci-Fi", "Mystery"],
        monthlyGoal: localPrefs.monthlyGoal || 4,
      }));

      const timer = setTimeout(() => setIsLoading(false), 400);
      return () => clearTimeout(timer);
    }
  }, [session, sessionLoading]);

  // Fetch real bookmark count for user
  useEffect(() => {
    async function loadBookmarkCount() {
      if (!userIdStr) return;
      try {
        const res = await getUserBookmarks(userIdStr);
        if (res?.success && Array.isArray(res.data)) {
          setBookmarkCount(res.data.length);
        }
      } catch (err) {
        console.error("Error loading bookmark count:", err);
      }
    }
    loadBookmarkCount();
  }, [userIdStr]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (saveSuccess) setSaveSuccess("");
    if (errorMessage) setErrorMessage("");
  };

  const handleImageFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleGenre = (genre) => {
    setFormData((prev) => {
      const exists = prev.favoriteGenres.includes(genre);
      const updated = exists
        ? prev.favoriteGenres.filter((g) => g !== genre)
        : [...prev.favoriteGenres, genre];
      return { ...prev, favoriteGenres: updated };
    });
  };

  // Submit Profile Update
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSaveSuccess("");
    setErrorMessage("");

    try {
      const { data, error } = await updateUser({
        name: formData.name,
        image: formData.image,
      });

      if (error) {
        setErrorMessage(error.message || "Failed to update profile.");
      } else {
        localStorage.setItem(
          "fable_reader_preferences",
          JSON.stringify({
            bio: formData.bio,
            favoriteGenres: formData.favoriteGenres,
            monthlyGoal: formData.monthlyGoal,
          })
        );
        setSaveSuccess("Profile updated successfully!");
        setTimeout(() => setSaveSuccess(""), 4000);
      }
    } catch (err) {
      setErrorMessage(err.message || "An unexpected error occurred while updating profile.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || sessionLoading) {
    return <ProfileSkeleton />;
  }

  return (
    <div className="space-y-8 max-w-4xl font-sans text-zinc-100 selection:bg-rose-500 selection:text-white">
      
      {/* Header Banner */}
      <div>
        <span className="text-[11px] font-bold tracking-[0.2em] text-rose-500 uppercase flex items-center gap-1.5 mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          Reader Settings
        </span>
        <h1 className="text-3xl font-serif font-bold tracking-tight text-white">
          User Profile
        </h1>
        <p className="text-sm text-zinc-400 mt-1">
          Manage your avatar, personal info, and reading preferences.
        </p>
      </div>

      {/* User Hero Avatar Card */}
      <div className="relative rounded-2xl bg-linear-to-r from-[#141419] via-[#121216] to-[#181820] border border-zinc-800/90 p-6 sm:p-8 shadow-xl overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
          
          {/* Avatar with Upload Hover Button */}
          <div className="relative group shrink-0">
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-rose-500/40 bg-zinc-900 shadow-lg relative">
              {formData.image ? (
                <Image
                  src={formData.image}
                  alt={formData.name || "Profile Avatar"}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-rose-500/10 text-rose-400">
                  <User className="w-10 h-10" />
                </div>
              )}
            </div>

            <label
              htmlFor="avatar-file-input"
              className="absolute inset-0 bg-black/60 rounded-full flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-xs font-medium"
            >
              <Camera className="w-5 h-5 mb-1 text-rose-400" />
              <span>Change</span>
            </label>
            <input
              id="avatar-file-input"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageFileChange}
            />
          </div>

          {/* User Details Header info */}
          <div className="space-y-2 text-center sm:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
              <h2 className="text-2xl font-serif font-bold text-white">
                {formData.name || "Reader Member"}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/15 border border-rose-500/30 text-rose-400 uppercase tracking-wider">
                {session?.user?.role || "Reader"}
              </span>
            </div>
            <p className="text-sm text-zinc-400 flex items-center justify-center sm:justify-start gap-2">
              <Mail className="w-4 h-4 text-zinc-500" />
              <span>{formData.email}</span>
            </p>
            <p className="text-xs text-zinc-500 italic max-w-lg line-clamp-2">
              &ldquo;{formData.bio}&rdquo;
            </p>
          </div>
        </div>
      </div>

      {/* Reader Quick Stats Links Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* LINK 1: Purchased Ebooks */}
        <Link
          href="/dashboard/reader/purchased-ebooks"
          className="group p-5 rounded-xl bg-[#121216]/90 border border-zinc-800/80 hover:border-rose-500/50 hover:bg-[#16161d] shadow-md transition-all duration-200 block cursor-pointer space-y-2"
        >
          <div className="flex items-center justify-between text-zinc-400 group-hover:text-rose-300 text-xs font-medium uppercase tracking-wider transition-colors">
            <span className="flex items-center gap-1.5">
              Purchased Ebooks
              <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-rose-400" />
            </span>
            <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20 group-hover:bg-rose-500/20 transition-colors">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-serif font-bold text-white group-hover:text-rose-100 transition-colors">12</p>
          <p className="text-xs text-zinc-500 group-hover:text-zinc-400 transition-colors">Active in library &rarr;</p>
        </Link>

        {/* LINK 2: Saved Bookmarks */}
        <Link
          href="/dashboard/reader/bookmarks"
          className="group p-5 rounded-xl bg-[#121216]/90 border border-zinc-800/80 hover:border-amber-500/50 hover:bg-[#16161d] shadow-md transition-all duration-200 block cursor-pointer space-y-2"
        >
          <div className="flex items-center justify-between text-zinc-400 group-hover:text-amber-300 text-xs font-medium uppercase tracking-wider transition-colors">
            <span className="flex items-center gap-1.5">
              Saved Bookmarks
              <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-amber-400" />
            </span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 group-hover:bg-amber-500/20 transition-colors">
              <Bookmark className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-serif font-bold text-white group-hover:text-amber-100 transition-colors">{bookmarkCount}</p>
          <p className="text-xs text-zinc-500 group-hover:text-zinc-400 transition-colors">Saved in reading list &rarr;</p>
        </Link>

        {/* Reading Streak Stat */}
        <div className="p-5 rounded-xl bg-[#121216]/90 border border-zinc-800/80 shadow-md space-y-2">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-medium uppercase tracking-wider">
            <span>Reading Streak</span>
            <div className="p-2 rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/20">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-serif font-bold text-white">14 Days</p>
          <p className="text-xs text-zinc-500">Daily target achieved</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center border-b border-zinc-800 gap-2 sm:gap-6 overflow-x-auto">
        <button
          onClick={() => setActiveTab("general")}
          className={`py-3 px-4 text-xs font-semibold tracking-wider uppercase border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "general"
              ? "border-rose-500 text-rose-400 bg-rose-500/5"
              : "border-transparent text-zinc-400 hover:text-zinc-200"
          }`}
        >
          General Info
        </button>
        <button
          onClick={() => setActiveTab("preferences")}
          className={`py-3 px-4 text-xs font-semibold tracking-wider uppercase border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "preferences"
              ? "border-rose-500 text-rose-400 bg-rose-500/5"
              : "border-transparent text-zinc-400 hover:text-zinc-200"
          }`}
        >
          Reading Preferences
        </button>
      </div>

      {/* Alerts */}
      {saveSuccess && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-medium flex items-center gap-3 animate-in fade-in duration-200">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{saveSuccess}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm font-medium flex items-center gap-3 animate-in fade-in duration-200">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* TAB 1: GENERAL INFO */}
      {activeTab === "general" && (
        <form onSubmit={handleProfileSubmit} className="rounded-2xl bg-[#121216]/90 border border-zinc-800/80 p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="space-y-1">
            <h3 className="text-lg font-serif font-semibold text-white">Personal Information</h3>
            <p className="text-xs text-zinc-400">Update your public profile details and profile picture.</p>
          </div>

          {/* Profile Image URL Field with Upload option */}
          <div className="space-y-2">
            <label className="text-xs font-semibold tracking-wider text-zinc-400 uppercase">
              Profile Image URL / File Upload
            </label>
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
              <div className="relative flex-1">
                <input
                  type="text"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  placeholder="https://example.com/avatar.jpg"
                  className="w-full bg-[#0a0a0c] border border-zinc-800 px-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-rose-500/80 focus:ring-1 focus:ring-rose-500/20"
                />
              </div>
              <label
                htmlFor="avatar-url-file"
                className="px-4 py-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-semibold text-zinc-200 rounded-lg flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <Upload className="w-4 h-4 text-rose-400" />
                <span>Upload File</span>
              </label>
              <input
                id="avatar-url-file"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageFileChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Full Name */}
            <div className="space-y-2">
              <label htmlFor="name" className="text-xs font-semibold tracking-wider text-zinc-400 uppercase">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleInputChange}
                className="w-full bg-[#0a0a0c] border border-zinc-800 px-4 py-3 text-sm text-zinc-100 focus:outline-none focus:border-rose-500/80 focus:ring-1 focus:ring-rose-500/20"
              />
            </div>

            {/* Email Address */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-xs font-semibold tracking-wider text-zinc-400 uppercase">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                disabled
                value={formData.email}
                title="Email is managed by authentication provider"
                className="w-full bg-[#0a0a0c]/60 border border-zinc-800/60 px-4 py-3 text-sm text-zinc-500 cursor-not-allowed"
              />
            </div>
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <label htmlFor="bio" className="text-xs font-semibold tracking-wider text-zinc-400 uppercase">
              About / Reader Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              rows={3}
              value={formData.bio}
              onChange={handleInputChange}
              placeholder="Tell other readers about your favorite literary genres, authors, or reading goals..."
              className="w-full bg-[#0a0a0c] border border-zinc-800 px-4 py-3 text-sm text-zinc-100 focus:outline-none focus:border-rose-500/80 focus:ring-1 focus:ring-rose-500/20 resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end pt-4 border-t border-zinc-800/80">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-linear-to-r from-rose-500 via-rose-600 to-pink-600 hover:opacity-95 text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-rose-600/20 cursor-pointer transition-all active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Update Profile</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* TAB 2: READING PREFERENCES */}
      {activeTab === "preferences" && (
        <form onSubmit={handleProfileSubmit} className="rounded-2xl bg-[#121216]/90 border border-zinc-800/80 p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="space-y-1">
            <h3 className="text-lg font-serif font-semibold text-white">Reading Preferences</h3>
            <p className="text-xs text-zinc-400">Personalize book recommendations based on your favorite genres.</p>
          </div>

          {/* Favorite Genres Selection */}
          <div className="space-y-3">
            <label className="text-xs font-semibold tracking-wider text-zinc-400 uppercase flex items-center gap-2">
              <Heart className="w-3.5 h-3.5 text-rose-500" />
              Favorite Book Genres
            </label>
            <div className="flex flex-wrap gap-2.5">
              {availableGenres.map((genre) => {
                const selected = formData.favoriteGenres.includes(genre);
                return (
                  <button
                    key={genre}
                    type="button"
                    onClick={() => toggleGenre(genre)}
                    className={`px-3.5 py-2 text-xs font-medium rounded-lg border transition-all cursor-pointer ${
                      selected
                        ? "bg-rose-500/20 border-rose-500/60 text-rose-300 ring-1 ring-rose-500/30"
                        : "bg-[#0a0a0c] border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
                    }`}
                  >
                    {genre} {selected && "✓"}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Monthly Reading Goal */}
          <div className="space-y-2 max-w-xs pt-2">
            <label htmlFor="monthlyGoal" className="text-xs font-semibold tracking-wider text-zinc-400 uppercase">
              Monthly Reading Goal (Ebooks / Month)
            </label>
            <input
              id="monthlyGoal"
              name="monthlyGoal"
              type="number"
              min="1"
              max="50"
              value={formData.monthlyGoal}
              onChange={handleInputChange}
              className="w-full bg-[#0a0a0c] border border-zinc-800 px-4 py-3 text-sm text-zinc-100 focus:outline-none focus:border-rose-500/80 focus:ring-1 focus:ring-rose-500/20"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end pt-4 border-t border-zinc-800/80">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-linear-to-r from-rose-500 via-rose-600 to-pink-600 hover:opacity-95 text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-rose-600/20 cursor-pointer transition-all active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Preferences</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}

    </div>
  );
}
