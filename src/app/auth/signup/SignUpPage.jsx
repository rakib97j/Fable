"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { signUp } from "@/lib/auth-client";
import { BookOpen, Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";

export default function SignUpPage() {
  const router = useRouter();
  const [role, setRole] = useState("reader"); 
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const { data, error: authError } = await signUp.email({
        email: formData.email,
        password: formData.password,
        name: formData.fullName,
        role: role,
        callbackURL: "/",
      });

      if (authError) {
        setError(authError.message || "Failed to create account. Please try again.");
      } else {
        router.push("/");
      }
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <div className="min-h-screen w-full bg-[#0a0a0c] text-white flex flex-col lg:flex-row font-sans selection:bg-rose-500 selection:text-white">
      {/* Left Column - Form Section */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between px-6 sm:px-12 lg:px-16 xl:px-24 py-10 lg:py-12 min-h-screen z-10">
        
       
        

        {/* Main Content Form */}
        <div className="max-w-md w-full mx-auto my-auto py-8">
          
          {/* Subheading Tagline */}
          <div className="space-y-2 mb-8">
            <p className="text-xs font-semibold tracking-[0.2em] text-rose-500 uppercase flex items-center gap-2">
              <span className="w-2 h-0.5 bg-rose-500 inline-block" />
              BEGIN YOUR CHAPTER WITH FABLE
            </p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-semibold tracking-tight text-zinc-100">
              Create your account
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3.5  bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium">
                {error}
              </div>
            )}
            
            {/* FULL NAME */}
            <div className="space-y-2">
              <label htmlFor="fullName" className="text-xs font-semibold tracking-wider text-zinc-400 uppercase">
                FULL NAME
              </label>
              <div className="relative">
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full bg-[#121216] border border-zinc-800/90  px-4 py-3.5 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-rose-500/80 focus:ring-2 focus:ring-rose-500/20 transition-all"
                />
              </div>
            </div>

            {/* EMAIL */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-xs font-semibold tracking-wider text-zinc-400 uppercase">
                EMAIL
              </label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full bg-[#121216] border border-zinc-800/90  px-4 py-3.5 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-rose-500/80 focus:ring-2 focus:ring-rose-500/20 transition-all"
                />
              </div>
            </div>

            {/* PASSWORD & CONFIRM PASSWORD */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="password" className="text-xs font-semibold tracking-wider text-zinc-400 uppercase">
                  PASSWORD
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full bg-[#121216] border border-zinc-800/90  px-4 py-3.5 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-rose-500/80 focus:ring-2 focus:ring-rose-500/20 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-xs font-semibold tracking-wider text-zinc-400 uppercase">
                  CONFIRM
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full bg-[#121216] border border-zinc-800/90  px-4 py-3.5 text-sm text-zinc-100  focus:outline-none focus:border-rose-500/80 focus:ring-2 focus:ring-rose-500/20 transition-all"
                />
              </div>
            </div>

            {/* I AM A... ROLE SELECTOR */}
            <div className="space-y-2.5 pt-1">
              <label className="text-xs font-semibold tracking-wider text-zinc-400 uppercase">
                I AM A...
              </label>
              
              <div className="grid grid-cols-2 gap-3.5">
                {/* Reader Role */}
                <button
                  type="button"
                  onClick={() => setRole("reader")}
                  className={`relative text-left p-4  border transition-all duration-200 cursor-pointer ${
                    role === "reader"
                      ? "border-rose-500/90 bg-rose-500/10 ring-1 ring-rose-500/50"
                      : "border-zinc-800/80 bg-[#121216] hover:border-zinc-700/80"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="font-serif font-medium text-lg text-zinc-100">Reader</span>
                    {role === "reader" && <CheckCircle2 className="w-4 h-4 text-rose-500" />}
                  </div>
                  <p className="text-xs text-zinc-400 mt-1 font-normal">
                    Discover & collect ebooks
                  </p>
                </button>

                {/* Writer Role */}
                <button
                  type="button"
                  onClick={() => setRole("writer")}
                  className={`relative text-left p-4  border transition-all duration-200 cursor-pointer ${
                    role === "writer"
                      ? "border-rose-500/90 bg-rose-500/10 ring-1 ring-rose-500/50"
                      : "border-zinc-800/80 bg-[#121216] hover:border-zinc-700/80"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="font-serif font-medium text-lg text-zinc-100">Writer</span>
                    {role === "writer" && <CheckCircle2 className="w-4 h-4 text-rose-500" />}
                  </div>
                  <p className="text-xs text-zinc-400 mt-1 font-normal">
                    Publish original stories
                  </p>
                </button>
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-6 py-4 px-6  font-semibold text-sm text-white bg-linear-to-r from-rose-500 via-rose-600 to-pink-600 hover:opacity-95 shadow-xl shadow-rose-600/25 active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Create account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* FOOTER LINK */}
          <div className="mt-8 text-sm text-zinc-400">
            Already a member?{" "}
            <Link href="/auth/signin" className="text-rose-500 hover:text-rose-400 font-semibold underline underline-offset-4 transition-colors">
              Sign in
            </Link>
          </div>

        </div>

        
      </div>

      {/* Right Column - Visual Image Artwork Banner */}
      <div className="hidden lg:block lg:w-1/2 relative min-h-screen bg-zinc-950 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1400&auto=format&fit=crop"
          alt="Hands reading an open book"
          fill
          priority
          className="object-cover object-center scale-105 transition-transform duration-1000"
          sizes="50vw"
        />
        {/* Subtle Dark Vignette & Edge Shadow Gradient */}
        <div className="absolute inset-0 bg-linear-to-t from-[#0a0a0c] via-transparent to-black/30" />
        <div className="absolute inset-0 bg-linear-to-r from-[#0a0a0c] via-transparent to-transparent opacity-80" />

        {/* Floating Highlight Badge (Extra Special Detail) */}
        <div className="absolute bottom-12 left-12 right-12 z-20 backdrop-blur-xl bg-zinc-950/60 border border-zinc-800/80 p-6 rounded-2xl shadow-2xl max-w-lg">
          <div className="flex items-center gap-2 text-rose-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-4 h-4" />
            <span>Join 50,000+ Readers & Authors</span>
          </div>
          <p className="text-zinc-200 text-sm font-serif italic leading-relaxed">
            &ldquo;Fable has completely redefined how I discover original books and connect directly with independent authors.&rdquo;
          </p>
          <div className="mt-3 flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-rose-600/30 border border-rose-500/40 flex items-center justify-center text-xs font-bold text-rose-300">
              A
            </div>
            <span className="text-xs text-zinc-400 font-medium">Admin — Rakib Hassan</span>
          </div>
        </div>
      </div>
    </div>
  );
}