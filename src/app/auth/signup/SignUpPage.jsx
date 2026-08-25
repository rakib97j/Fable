"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { signUp } from "@/lib/auth-client";
import { BookOpen, Sparkles, ArrowRight, CheckCircle2, Eye, EyeOff, Upload, Camera, User } from "lucide-react";

export default function SignUpPage() {
  const router = useRouter();
  const [role, setRole] = useState("reader"); 
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    image: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Password visibility toggles
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleImageFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, image: imageUrl }));
    }
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
        image: formData.image,
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

          {/* GOOGLE SIGN UP BUTTON (UI ONLY) */}
          <button
            type="button"
            onClick={() => {}}
            className="w-full py-3.5 px-4 mb-6 bg-[#121216] hover:bg-zinc-800/90 border border-zinc-800/90 rounded-xl text-sm font-medium text-zinc-200 hover:text-white transition-all flex items-center justify-center gap-3 cursor-pointer shadow-sm active:scale-[0.99]"
          >
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Sign up with Google</span>
          </button>

          {/* DIVIDER */}
          <div className="relative flex items-center justify-center my-6">
            <div className="w-full border-t border-zinc-800/80" />
            <span className="absolute bg-[#0a0a0c] px-3 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
              OR REGISTER WITH EMAIL
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium">
                {error}
              </div>
            )}

            {/* PROFILE IMAGE / AVATAR FIELD */}
            <div className="space-y-2">
              <label className="text-xs font-semibold tracking-wider text-zinc-400 uppercase">
                PROFILE PHOTO (OPTIONAL)
              </label>
              <div className="flex items-center gap-4 bg-[#121216] border border-zinc-800/90 p-3">
                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-zinc-900 border border-zinc-700 shrink-0">
                  {formData.image ? (
                    <Image
                      src={formData.image}
                      alt="Avatar preview"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-500">
                      <User className="w-6 h-6" />
                    </div>
                  )}
                </div>
                <div className="flex-1 space-y-1">
                  <input
                    type="text"
                    name="image"
                    value={formData.image}
                    onChange={handleInputChange}
                    placeholder="Enter image URL..."
                    className="w-full bg-[#0a0a0c] border border-zinc-800/80 px-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-rose-500/80"
                  />
                  <div className="flex items-center gap-2">
                    <label
                      htmlFor="signup-avatar-file"
                      className="text-[11px] font-medium text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer"
                    >
                      <Camera className="w-3 h-3" />
                      <span>Or upload photo</span>
                    </label>
                    <input
                      id="signup-avatar-file"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageFileChange}
                    />
                    {formData.image && (
                      <button
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, image: "" }))}
                        className="text-[11px] text-zinc-500 hover:text-zinc-300 ml-auto"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
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
                  placeholder="John Doe"
                  className="w-full bg-[#121216] border border-zinc-800/90 px-4 py-3.5 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-rose-500/80 focus:ring-2 focus:ring-rose-500/20 transition-all"
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
                  placeholder="name@example.com"
                  className="w-full bg-[#121216] border border-zinc-800/90 px-4 py-3.5 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-rose-500/80 focus:ring-2 focus:ring-rose-500/20 transition-all"
                />
              </div>
            </div>

            {/* PASSWORD & CONFIRM PASSWORD WITH EYE TOGGLE */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="password" className="text-xs font-semibold tracking-wider text-zinc-400 uppercase">
                  PASSWORD
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    className="w-full bg-[#121216] border border-zinc-800/90 px-4 py-3.5 pr-10 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-rose-500/80 focus:ring-2 focus:ring-rose-500/20 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200 transition-colors p-1 cursor-pointer"
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4 text-rose-400" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-xs font-semibold tracking-wider text-zinc-400 uppercase">
                  CONFIRM
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    className="w-full bg-[#121216] border border-zinc-800/90 px-4 py-3.5 pr-10 text-sm text-zinc-100 focus:outline-none focus:border-rose-500/80 focus:ring-2 focus:ring-rose-500/20 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200 transition-colors p-1 cursor-pointer"
                    title={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4 text-rose-400" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
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
                  className={`relative text-left p-4 border transition-all duration-200 cursor-pointer ${
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
                  className={`relative text-left p-4 border transition-all duration-200 cursor-pointer ${
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
              className="w-full mt-6 py-4 px-6 font-semibold text-sm text-white bg-linear-to-r from-rose-500 via-rose-600 to-pink-600 hover:opacity-95 shadow-xl shadow-rose-600/25 active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
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
        {/* Dark Vignette & Edge Shadow Gradient */}
        <div className="absolute inset-0 bg-linear-to-t from-[#0a0a0c] via-transparent to-black/30" />
        <div className="absolute inset-0 bg-linear-to-r from-[#0a0a0c] via-transparent to-transparent opacity-80" />

        {/* Floating Highlight Badge */}
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