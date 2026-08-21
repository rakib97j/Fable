"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/auth-client";
import {  ArrowRight } from "lucide-react";

export default function SignInPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
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
    setIsLoading(true);
    setError("");

    try {
      const { data, error: authError } = await signIn.email({
        email: formData.email,
        password: formData.password,
        callbackURL: "/",
      });

      if (authError) {
        setError(authError.message || "Invalid email or password. Please try again.");
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
      
      {/* Left Column - Image Artwork Banner */}
      <div className="hidden lg:block lg:w-1/2 relative min-h-screen bg-zinc-950 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1400&auto=format&fit=crop"
          alt="Person reading an open book"
          fill
          priority
          className="object-cover object-center scale-105 transition-transform duration-1000"
          sizes="50vw"
        />
        {/* Subtle Dark Vignette & Gradient Overlays */}
        <div className="absolute inset-0 bg-linear-to-t from-[#0a0a0c] via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-linear-to-r from-transparent via-transparent to-[#0a0a0c] opacity-80" />

        {/* Quote Overlay at Bottom Left */}
        <div className="absolute bottom-16 left-12 right-12 z-20 max-w-lg">
          <p className="text-xs font-semibold tracking-[0.2em] text-rose-500 uppercase">
            FABLE
          </p>
          <blockquote className="text-2xl lg:text-3xl font-serif font-medium text-zinc-100 mt-2 leading-snug">
            &ldquo;A room without books is like a body without a soul.&rdquo;
          </blockquote>
        </div>
      </div>

      {/* Right Column - Form Section */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between px-6 sm:px-12 lg:px-16 xl:px-24 py-10 lg:py-10 min-h-screen z-10">
        
        

        {/* Main Content Form */}
        <div className="max-w-md w-full mx-auto my-auto py-8">
          
          {/* Subheading Tagline */}
          <div className="space-y-2 mb-8">
            <p className="text-xs font-semibold tracking-[0.2em] text-rose-500 uppercase flex items-center gap-2">
              <span className="w-2 h-0.5 bg-rose-500 inline-block" />
              WELCOME BACK
            </p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-semibold tracking-tight text-zinc-100">
              Sign in to Fable
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium">
                {error}
              </div>
            )}
            
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
                  // placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full bg-[#121216] border border-zinc-800/90  px-4 py-3.5 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-rose-500/80 focus:ring-2 focus:ring-rose-500/20 transition-all"
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-xs font-semibold tracking-wider text-zinc-400 uppercase">
                PASSWORD
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full bg-[#121216] border border-zinc-800/90 rounded-x px-4 py-3.5 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-rose-500/80 focus:ring-2 focus:ring-rose-500/20 transition-all"
                />
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
                  <span>Sign in</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* FOOTER LINK */}
          <div className="mt-8 text-sm text-zinc-400">
            New here?{" "}
            <Link href="/auth/signup" className="text-rose-500 hover:text-rose-400 font-semibold underline underline-offset-4 transition-colors">
              Create an account
            </Link>
          </div>

          {/* DEMO INFO BADGE */}
          <div className="mt-6 p-3  bg-[#121216] border border-zinc-800/70 text-xs font-mono text-zinc-400 flex items-center gap-2">
            <span className="text-rose-400 font-semibold">Admin demo:</span>
            <span>admin@fable.com / admin@fable.com</span>
          </div>

        </div>

       
      </div>
    </div>
  );
}
