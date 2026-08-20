"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
} from "lucide-react";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false); //ptofile dropdown
  const pathname = usePathname();

  // Close mobile menu and dropdown on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsProfileDropdownOpen(false);
  }, [pathname]);


  // nav links 

  const navLinks = [  
    { name: "Home", href: "/", icon: Home },
    { name: "Browse Ebooks", href: "/e-books", icon: BookMarked },
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  ]; 

  const toggleLogin = () => {
    setIsLoggedIn((prev) => !prev);
    setIsProfileDropdownOpen(false);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/80 dark:bg-zinc-950/80 border-b border-zinc-200/80 dark:border-zinc-800/80 transition-colors">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Left: Brand Logo & Name */}
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="flex items-center gap-2.5 group focus:outline-none focus:ring-2 focus:ring-indigo-500/40 rounded-xl p-1 -ml-1 transition-all"
            aria-label="Fable Home"
          >
            
            <div className="flex flex-col">
              <span className="font-bold text-xl tracking-tight bg-linear-to-r from-zinc-900 via-indigo-950 to-indigo-800 dark:from-white dark:via-zinc-200 dark:to-indigo-300 bg-clip-text text-transparent leading-none">
                Fable
              </span>
              {/* <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 tracking-wider uppercase">
                Ebooks
              </span> */}
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50/80 dark:bg-indigo-950/40 font-semibold"
                      : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100/80 dark:hover:bg-zinc-800/60"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? "text-indigo-600 dark:text-indigo-400" : "text-zinc-500 dark:text-zinc-400"
                    }`}
                  />
                  <span>{link.name}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-indigo-600 dark:bg-indigo-400 rounded-full" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Right: Auth State Actions (Desktop & Tablet) */}
        <div className="hidden sm:flex items-center gap-3">
          {isLoggedIn ? (
            <div className="relative">
              <button
                onClick={() => setIsProfileDropdownOpen((prev) => !prev)}
                className="flex items-center gap-2.5 p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800/70 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                aria-expanded={isProfileDropdownOpen}
                aria-label="User menu"
              >
                <Avatar className="w-8 h-8 ring-2 ring-indigo-500/30">
                  <Avatar.Image src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150" alt="User avatar" />
                  <Avatar.Fallback className="bg-indigo-600 text-white font-semibold text-xs">FB</Avatar.Fallback>
                </Avatar>
                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Alex</span>
                <ChevronDown className="w-4 h-4 text-zinc-500 transition-transform duration-200" />
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200/80 dark:border-zinc-800/80 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-2.5 border-b border-zinc-100 dark:border-zinc-800">
                    <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Signed in as</p>
                    <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate mt-0.5">alex@fable.com</p>
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
                    onClick={toggleLogin}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Log Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                variant="light"
                onClick={toggleLogin}
                className="font-medium text-zinc-700 dark:text-zinc-300 hover:text-indigo-600 dark:hover:text-indigo-400"
              >
                <LogIn className="w-4 h-4 mr-1.5 text-zinc-500" />
                Log In
              </Button>
              <Button
                onClick={toggleLogin}
                className="bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium shadow-md shadow-indigo-500/20"
              >
                Get Started
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Icon Button */}
        <div className="flex items-center gap-2 md:hidden">
          {/* Show avatar shortcut if logged in */}
          {isLoggedIn && (
            <button
              onClick={toggleLogin}
              title="Click to Logout"
              className="p-1 rounded-full ring-2 ring-indigo-500/30"
            >

              {/* dummy profile data */}
              <Avatar className="w-7 h-7">
                <Avatar.Image src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150" alt="User avatar" />
                <Avatar.Fallback className="bg-indigo-600 text-white text-xs">FB</Avatar.Fallback>
              </Avatar>
            </button>
          )}

          <button
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className="p-2 rounded-xl text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer / Overlay Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-16 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl border-b border-zinc-200/80 dark:border-zinc-800/80 shadow-2xl transition-all duration-200 animate-in slide-in-from-top-2">
          <div className="px-4 pt-4 pb-6 space-y-2">
            <p className="px-3 text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2">Navigation</p>
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium transition-all ${
                    isActive
                      ? "bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-semibold border-l-4 border-indigo-600 dark:border-indigo-400 pl-3"
                      : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-5 h-5 ${isActive ? "text-indigo-600 dark:text-indigo-400" : "text-zinc-500"}`} />
                    <span>{link.name}</span>
                  </div>
                  {isActive && <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />}
                </Link>
              );
            })}

            <div className="pt-4 border-t border-zinc-200/80 dark:border-zinc-800/80 mt-4 space-y-2">
              {isLoggedIn ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 px-3 py-2">
                    <Avatar className="w-9 h-9 ring-2 ring-indigo-500/30">
                      <Avatar.Image src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150" alt="User avatar" />
                      <Avatar.Fallback className="bg-indigo-600 text-white font-semibold text-xs">FB</Avatar.Fallback>
                    </Avatar>
                    <div className="flex flex-col truncate">
                      <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Alex</span>
                      <span className="text-xs text-zinc-500 truncate">alex@fable.com</span>
                    </div>
                  </div>
                  <Button
                    onClick={toggleLogin}
                    className="w-full bg-red-50 dark:bg-red-950/30 hover:bg-red-100 text-red-600 dark:text-red-400 font-medium py-3 rounded-xl flex items-center justify-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Log Out</span>
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-2.5 pt-2">
                  <Button
                    onClick={toggleLogin}
                    className="w-full bg-linear-to-r from-indigo-600 to-purple-600 text-white font-medium py-3.5 rounded-xl shadow-md flex items-center justify-center gap-2"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Log In</span>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
