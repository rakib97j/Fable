"use client";

import React, { useState, useMemo } from "react";
import {
  Users,
  Search,
  BookOpen,
  UserCheck,
  Shield,
  Trash2,
  ChevronDown,
  User,
  Mail,
  Sparkles,
  RefreshCw,
} from "lucide-react";

import { getUsers } from "@/lib/actions/adminAction";
import { Loader2 } from "lucide-react";

export default function ManageUsersAdmin() {
  const [activeTab, setActiveTab] = useState("writer"); // 'writer' | 'reader'
  const [searchTerm, setSearchTerm] = useState("");
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch users from database endpoint /api/users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await getUsers();
      if (res?.success && Array.isArray(res.data)) {
        setUsersList(res.data);
      } else {
        const rawRes = await fetch("/api/users", { cache: "no-store" });
        if (rawRes.ok) {
          const data = await rawRes.json();
          const list = Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : [];
          setUsersList(list);
        } else {
          setUsersList([]);
        }
      }
    } catch (err) {
      console.error("Failed to fetch users from /api/users:", err);
      setUsersList([]);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchUsers();
  }, []);

  // Filter users by tab & search query
  const filteredUsers = useMemo(() => {
    return usersList.filter((u) => {
      const userRole = (u.role || "").toLowerCase();
      const matchesTab = userRole === activeTab.toLowerCase();
      const userName = (u.name || u.email || "").toLowerCase();
      const userEmail = (u.email || "").toLowerCase();
      const matchesSearch =
        userName.includes(searchTerm.toLowerCase()) ||
        userEmail.includes(searchTerm.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [usersList, activeTab, searchTerm]);

  // Counts for tabs
  const writerCount = useMemo(
    () => usersList.filter((u) => (u.role || "").toLowerCase() === "writer").length,
    [usersList]
  );
  const readerCount = useMemo(
    () => usersList.filter((u) => (u.role || "").toLowerCase() === "reader").length,
    [usersList]
  );

  return (
    <div className="space-y-6">
      {/* Top Header & Overview */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-3xl font-serif font-semibold text-zinc-100 flex items-center gap-2.5">
            <Users className="w-7 h-7 text-rose-500" />
            Manage Users
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            View, filter, and manage permissions for registered writers and readers.
          </p>
        </div>

        {/* Quick Stat Pill */}
        <div className="flex items-center gap-3 bg-zinc-900/80 p-2.5 px-4 border border-zinc-800/80 text-xs">
          <div className="flex items-center gap-1.5 text-zinc-400">
            <UserCheck className="w-4 h-4 text-emerald-400" />
            <span>Total Account Base:</span>
            <span className="font-mono font-bold text-zinc-100">{usersList.length}</span>
          </div>
        </div>
      </div>

      {/* 2-Tab Navigation System */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80">
        <div className="flex items-center gap-1 bg-zinc-900/50 p-1 border border-zinc-800/80">
          <button
            type="button"
            onClick={() => setActiveTab("writer")}
            className={`px-5 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "writer"
                ? "bg-rose-600 text-white shadow-lg shadow-rose-600/20"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Writers</span>
            <span className="ml-1 px-2 py-0.5 text-[10px] font-mono bg-zinc-950/60 rounded-full border border-zinc-700/50">
              {writerCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("reader")}
            className={`px-5 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "reader"
                ? "bg-rose-600 text-white shadow-lg shadow-rose-600/20"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
            }`}
          >
            <User className="w-4 h-4" />
            <span>Readers</span>
            <span className="ml-1 px-2 py-0.5 text-[10px] font-mono bg-zinc-950/60 rounded-full border border-zinc-700/50">
              {readerCount}
            </span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-zinc-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={`Search ${activeTab}s by name or email...`}
            className="w-full pl-9 pr-4 py-2 bg-zinc-900/90 border border-zinc-800 text-zinc-100 placeholder-zinc-500 text-xs focus:outline-none focus:border-rose-500 transition-colors"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="border border-zinc-800/80 bg-[#121216]/60 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="bg-zinc-900/90 border-b border-zinc-800 text-zinc-400 font-mono uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-6 py-4">User Name</th>
                <th className="px-6 py-4">Email Address</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-zinc-500">
                    <Loader2 className="w-6 h-6 mx-auto animate-spin text-rose-500 mb-2" />
                    <p className="text-xs font-mono">Loading users from database...</p>
                  </td>
                </tr>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((u, idx) => {
                  const userId = u._id ? String(u._id) : u.id || `usr_${idx}`;
                  const displayName = u.name || u.email?.split("@")[0] || "User";
                  const displayEmail = u.email || "No email provided";
                  const roleLower = (u.role || "reader").toLowerCase();

                  return (
                    <tr key={userId} className="hover:bg-zinc-900/40 transition-colors">
                      {/* User Name */}
                      <td className="px-6 py-4 font-medium text-zinc-100 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 font-bold font-serif shrink-0 uppercase">
                          {displayName.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-zinc-100 text-sm">{displayName}</div>
                          <div className="text-[10px] text-zinc-500 font-mono">ID: {userId}</div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="px-6 py-4 font-mono text-zinc-400">
                        <div className="flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                          <span>{displayEmail}</span>
                        </div>
                      </td>

                    {/* Role Badge */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider border ${
                          u.role === "writer"
                            ? "bg-rose-950/60 text-rose-300 border-rose-500/30"
                            : u.role === "admin"
                            ? "bg-amber-950/60 text-amber-300 border-amber-500/30"
                            : "bg-blue-950/60 text-blue-300 border-blue-500/30"
                        }`}
                      >
                        {u.role === "writer" ? (
                          <BookOpen className="w-3 h-3 text-rose-400" />
                        ) : u.role === "admin" ? (
                          <Shield className="w-3 h-3 text-amber-400" />
                        ) : (
                          <User className="w-3 h-3 text-blue-400" />
                        )}
                        {u.role}
                      </span>
                    </td>

                    {/* Actions (UI Only) */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Change Role Selector */}
                        <div className="relative inline-block text-left">
                          <select
                            defaultValue={u.role}
                            className="px-2.5 py-1.5 bg-zinc-900 border border-zinc-700/80 text-zinc-200 text-xs focus:outline-none focus:border-rose-500 cursor-pointer font-sans"
                          >
                            <option value="reader">Reader</option>
                            <option value="writer">Writer</option>
                            <option value="admin">Admin</option>
                          </select>
                        </div>

                        {/* Delete User Button */}
                        <button
                          type="button"
                          className="p-1.5 bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 border border-rose-800/40 transition-colors cursor-pointer"
                          title="Delete user"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-zinc-500 space-y-2">
                    <User className="w-8 h-8 mx-auto text-zinc-600 stroke-[1.5]" />
                    <p className="text-xs">No {activeTab}s found matching your search query.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
