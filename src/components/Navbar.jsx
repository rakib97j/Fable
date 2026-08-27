"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button, Avatar } from "@heroui/react";
import {
  BookOpen,
  Home,
  BookMarked,
  LayoutDashboard,
  LogIn,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  User,
} from "lucide-react";
import { useSession, signOut } from "@/lib/auth-client";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const pathname = usePathname();

  const { data: session, isPending } = useSession();
  const user = session?.user;

  // Close mobile menu and dropdown on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsProfileDropdownOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: "Home", href: "/", icon: Home },
    { name: "Browse Ebooks", href: "/e-books", icon: BookMarked },
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  ];

  const router = useRouter();

  const handleSignOut = async () => {
    setIsProfileDropdownOpen(false);
    setIsMobileMenuOpen(false);
    await signOut();
    router.push("/auth/signin");
  };

  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/80 dark:bg-[#0d0d0f]/80 border-b border-zinc-200/80 dark:border-zinc-800/80 transition-colors">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Left: Brand Logo & Name */}
        <div className="flex items-center gap-8">
          <div>
          <Link href="/" className="inline-flex items-center gap-2.5 group transition-transform hover:scale-105">
            <div className="p-1.5 rounded-xl bg-linear-to-tr from-rose-600 via-rose-500 to-pink-500 text-white shadow-lg shadow-rose-600/30">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="font-serif font-bold text-xl tracking-tight bg-linear-to-r from-rose-500 via-rose-400 to-pink-500 bg-clip-text text-transparent">
              Fable
            </span>
          </Link>
        </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname === link.href || pathname?.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "text-rose-600 dark:text-rose-400 font-semibold"
                      : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? "text-rose-600 dark:text-rose-400" : "text-zinc-500 dark:text-zinc-400"
                    }`}
                  />
                  <span>{link.name}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-rose-600 dark:bg-rose-400 rounded-full" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Right: Auth Actions (Desktop & Tablet) */}
        <div className="hidden sm:flex items-center gap-3">

          {isPending ? (
            <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
          ) : user ? (
            <div className="relative">
              <button
                onClick={() => setIsProfileDropdownOpen((prev) => !prev)}
                className="flex items-center gap-2.5 p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800/70 transition-colors focus:outline-none focus:ring-2 focus:ring-rose-500/30 cursor-pointer"
                aria-expanded={isProfileDropdownOpen}
                aria-label="User menu"
              >
                <Avatar className="w-8 h-8 ring-2 ring-rose-500/30">
                  {user.image && <Avatar.Image src={user.image} alt={user.name || "User avatar"} />}
                  <Avatar.Fallback className="bg-rose-600 text-white font-semibold text-xs">
                    {getInitials(user.name)}
                  </Avatar.Fallback>
                </Avatar>
                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 max-w-[120px] truncate">
                  {user.name || "User"}
                </span>
                <ChevronDown className="w-4 h-4 text-zinc-500 transition-transform duration-200" />
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-60 bg-white dark:bg-[#141417] rounded-2xl shadow-xl border border-zinc-200/80 dark:border-zinc-800/80 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-2.5 border-b border-zinc-100 dark:border-zinc-800">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Signed in as</p>
                      {user.role && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-500 border border-rose-500/20 capitalize">
                          {user.role}
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate mt-1">
                      {user.name || "User"}
                    </p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                      {user.email}
                    </p>
                  </div>
                  <Link
                    href="/dashboard"
                    onClick={() => setIsProfileDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 transition-colors"
                  >
                    <LayoutDashboard className="w-4 h-4 text-zinc-500" />
                    <span>Dashboard</span>
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors text-left cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Log Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/auth/signin">
                <Button
                  variant="light"
                  className="font-medium text-zinc-700 dark:text-zinc-300 hover:text-rose-600 dark:hover:text-rose-400"
                >
                  <LogIn className="w-4 h-4 mr-1.5 text-zinc-500" />
                  Log In
                </Button>
              </Link>

              <Link href="/auth/signup">
                <Button
                  className="bg-linear-to-r from-rose-600 via-rose-500 to-pink-500 hover:from-rose-500 hover:to-pink-400 text-white font-medium shadow-md shadow-rose-600/25 transition-all"
                >
                  Join
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger & User Controls */}
        <div className="flex items-center gap-2 md:hidden">

          {user && (
            <button
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              title="User Account"
              className="p-0.5 rounded-full ring-2 ring-rose-500/30"
            >
              <Avatar className="w-7 h-7">
                {user.image && <Avatar.Image src={user.image} alt={user.name || "User avatar"} />}
                <Avatar.Fallback className="bg-rose-600 text-white text-xs">
                  {getInitials(user.name)}
                </Avatar.Fallback>
              </Avatar>
            </button>
          )}

          <button
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className="p-2 rounded-xl text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 transition-colors focus:outline-none focus:ring-2 focus:ring-rose-500/30"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer / Overlay Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-16 bg-white/95 dark:bg-[#0d0d0f]/95 backdrop-blur-xl border-b border-zinc-200/80 dark:border-zinc-800/80 shadow-2xl transition-all duration-200 animate-in slide-in-from-top-2">
          <div className="px-4 pt-4 pb-6 space-y-2">
            <p className="px-3 text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2">Navigation</p>
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname === link.href || pathname?.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium transition-all ${
                    isActive
                      ? "bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 font-semibold border-l-4 border-rose-600 dark:border-rose-400 pl-3"
                      : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-5 h-5 ${isActive ? "text-rose-600 dark:text-rose-400" : "text-zinc-500"}`} />
                    <span>{link.name}</span>
                  </div>
                  {isActive && <Sparkles className="w-4 h-4 text-rose-600 dark:text-rose-400" />}
                </Link>
              );
            })}

            <div className="pt-4 border-t border-zinc-200/80 dark:border-zinc-800/80 mt-4 space-y-2">
              {user ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 px-3 py-2">
                    <Avatar className="w-9 h-9 ring-2 ring-rose-500/30">
                      {user.image && <Avatar.Image src={user.image} alt={user.name || "User avatar"} />}
                      <Avatar.Fallback className="bg-rose-600 text-white font-semibold text-xs">
                        {getInitials(user.name)}
                      </Avatar.Fallback>
                    </Avatar>
                    <div className="flex flex-col truncate">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{user.name || "User"}</span>
                        {user.role && (
                          <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded-full bg-rose-500/10 text-rose-500 border border-rose-500/20 capitalize">
                            {user.role}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-zinc-500 truncate">{user.email}</span>
                    </div>
                  </div>
                  <Button
                    onClick={handleSignOut}
                    className="w-full bg-rose-50 dark:bg-rose-950/30 hover:bg-rose-100 text-rose-600 dark:text-rose-400 font-medium py-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Log Out</span>
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-2.5 pt-2">
                  <Link href="/auth/signin" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button
                      variant="light"
                      className="w-full font-medium text-zinc-700 dark:text-zinc-300 justify-start"
                    >
                      <LogIn className="w-4 h-4 mr-2" />
                      <span>Log In</span>
                    </Button>
                  </Link>
                  <Link href="/auth/signup" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button
                      className="w-full bg-gradient-to-r from-rose-600 via-rose-500 to-pink-500 hover:from-rose-500 hover:to-pink-400 text-white font-medium py-3.5 rounded-xl shadow-md shadow-rose-600/25 flex items-center justify-center gap-2"
                    >
                      <User className="w-4 h-4" />
                      <span>Join Now</span>
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

