"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";
import {
  LayoutDashboard,
  BookOpen,
  History,
  User,
  Bookmark,
  BookMarked,
  PlusCircle,
  TrendingUp,
  BarChart3,
  Users,
  Library,
  Receipt,
  Menu,
  X,
  LogOut,
} from "lucide-react";

export default function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { data: session } = useSession();
  
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const user = mounted ? session?.user : null;
  const role = (user?.role || "writer").toLowerCase(); // 'reader' | 'writer' | 'admin'

  const linksByRole = {
    reader: [
      { name: "Overview", href: "/dashboard/reader", icon: LayoutDashboard },
      { name: "Purchased Ebooks", href: "/dashboard/reader/purchased-ebooks", icon: BookOpen },
      { name: "Purchase History", href: "/dashboard/reader/purchase-history", icon: History },
      { name: "Profile", href: "/dashboard/reader/profile", icon: User },
      { name: "Bookmarks", href: "/dashboard/reader/bookmarks", icon: Bookmark },
    ],
    writer: [
      { name: "Overview", href: "/dashboard/writer", icon: LayoutDashboard },
      { name: "Manage Ebooks", href: "/dashboard/writer/manage-ebooks", icon: BookMarked },
      { name: "Add Ebook", href: "/dashboard/writer/add-ebook", icon: PlusCircle },
      { name: "Sales History", href: "/dashboard/writer/sales-history", icon: TrendingUp },
      { name: "Bookmarks", href: "/dashboard/writer/bookmarks", icon: Bookmark },
    ],
    admin: [
      { name: "Overview", href: "/dashboard/admin", icon: BarChart3 },
      { name: "Manage Users", href: "/dashboard/admin/manage-users", icon: Users },
      { name: "Manage All Ebooks", href: "/dashboard/admin/manage-all-ebooks", icon: Library },
      { name: "View Transactions", href: "/dashboard/admin/view-transactions", icon: Receipt },
    ],
  };

  const navLinks = linksByRole[role] || linksByRole.reader;

  const roleTitle = mounted
    ? role === "admin"
      ? "Fable Admin"
      : user?.name || role
    : "Writer";

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#0a0a0c] dark:bg-[#0d0d0f] text-zinc-100 w-64 border-r border-zinc-800/80 font-sans select-none">
      
      {/* Header Section matching visual mockup */}
      <div className="p-6 border-b border-zinc-800/80">
        <p className="text-[10px] font-semibold tracking-[0.2em] text-zinc-500 uppercase">
          DASHBOARD
        </p>
        <h2 className="text-2xl font-serif font-bold tracking-tight text-white mt-1 capitalize truncate">
          {roleTitle}
        </h2>
        <p className="text-xs font-bold tracking-[0.15em] text-rose-500 uppercase mt-1">
          {role}
        </p>
      </div>

      {/* Navigational Links */}
      <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
        {(() => {
          const activeLink = navLinks.reduce((bestMatch, link) => {
            const isMatch =
              pathname === link.href || pathname?.startsWith(`${link.href}/`);
            if (isMatch && (!bestMatch || link.href.length > bestMatch.href.length)) {
              return link;
            }
            return bestMatch;
          }, null);

          return navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = activeLink?.href === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileOpen(false)}
                className={`group flex items-center justify-between px-3.5 py-3  text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-rose-500/10 text-rose-400 font-semibold border border-rose-500/30 shadow-sm"
                    : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/60"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? "text-rose-500" : "text-zinc-500 group-hover:text-zinc-300"
                    }`}
                  />
                  <span>{link.name}</span>
                </div>
                {isActive && (
                  <div className="w-1.5 h-1.5 rounded-full bg-rose-500 shadow-sm shadow-rose-500" />
                )}
              </Link>
            );
          });
        })()}
      </nav>

      {/* Footer info in sidebar */}
      <div className="p-4 border-t border-zinc-800/80 flex flex-col gap-2">
        <button
          onClick={async () => {
            await signOut();
            router.push("/auth/signin");
          }}
          className="flex items-center gap-2.5 px-3.5 py-2 rounded-lg text-sm font-medium text-rose-400 hover:bg-rose-500/10 transition-colors w-full text-left cursor-pointer"
        >
          <LogOut className="w-4 h-4 text-rose-500" />
          <span>Log Out</span>
        </button>
        <div className="text-[11px] text-zinc-500 flex items-center justify-between pt-1">
          <span>Fable Workspace For <span className="font-bold text-rose-500 uppercase" >{role}</span> </span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Toggle Button Header Bar (< lg) */}
      <div className="lg:hidden w-full bg-[#0a0a0c] border-b border-zinc-800/80 px-4 py-3 flex items-center justify-between sticky top-16 z-30">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileOpen((prev) => !prev)}
            className="p-2 rounded-none bg-zinc-900 text-zinc-300 hover:text-white border border-zinc-800 focus:outline-none"
            aria-label="Toggle Dashboard Sidebar"
          >
            {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div>
            <span className="text-xs text-zinc-500 uppercase tracking-wider block">Dashboard</span>
            <span className="text-sm font-semibold text-white capitalize">{role} Menu</span>
          </div>
        </div>
      </div>

      {/* Mobile Overlay Slide Drawer */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileOpen(false)}
          />
          
          {/* Drawer Content */}
          <div className="relative z-50 w-64 max-w-full min-h-screen bg-[#0a0a0c] shadow-2xl animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}

      {/* Desktop Sidebar (lg and above) */}
      <aside className="hidden lg:block w-64 shrink-0 min-h-[calc(100vh-4rem)] sticky top-16 z-20">
        {sidebarContent}
      </aside>
    </>
  );
}
