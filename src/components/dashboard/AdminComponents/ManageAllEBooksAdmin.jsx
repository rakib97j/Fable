"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { 
  BookOpen, 
  Search, 
  Trash2, 
  CheckCircle2, 
  EyeOff, 
  Loader2, 
  AlertCircle,
  AlertTriangle,
  Filter,
  RefreshCw,
  User,
  Tag,
  X,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { getAdminEBooks, updateEBookStatus, deleteEBook } from "@/lib/actions/adminAction";

export default function ManageAllEBooksAdmin() {
  const [eBooks, setEBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [notification, setNotification] = useState(null);

  // Delete Confirmation Modal State
  const [deletingBook, setDeletingBook] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchEbooks = async () => {
    setLoading(true);
    try {
      const res = await getAdminEBooks();
      if (res?.success && Array.isArray(res.data)) {
        setEBooks(res.data);
      } else {
        const rawRes = await fetch("/api/admin/e-books", { cache: "no-store" });
        if (rawRes.ok) {
          const data = await rawRes.json();
          const list = Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : [];
          setEBooks(list);
        }
      }
    } catch (err) {
      console.error("Failed to load admin e-books:", err);
      showToast("error", "Failed to fetch e-books list.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEbooks();
  }, []);

  const showToast = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // Toggle publish / unpublish / approve
  const handleTogglePublish = async (book) => {
    const bookId = book._id || book.id;
    const currentStatus = (book.status || "pending").toLowerCase();
    const newStatus = currentStatus === "published" ? "unpublished" : "published";

    setActionLoadingId(bookId);

    // Optimistic UI update
    setEBooks((prev) =>
      prev.map((b) => ((b._id || b.id) === bookId ? { ...b, status: newStatus } : b))
    );

    const res = await updateEBookStatus(bookId, newStatus);
    setActionLoadingId(null);

    if (res?.success) {
      showToast(
        "success",
        `"${book.title}" is now ${newStatus === "published" ? "Published" : "Unpublished"}.`
      );
    } else {
      setEBooks((prev) =>
        prev.map((b) => ((b._id || b.id) === bookId ? { ...b, status: currentStatus } : b))
      );
      showToast("error", res?.message || "Failed to update status.");
    }
  };

  // Trigger Delete Confirmation Dialog
  const handleOpenDeleteModal = (book) => {
    setDeletingBook(book);
  };

  const handleCloseDeleteModal = () => {
    setDeletingBook(null);
    setIsDeleting(false);
  };

  // Confirm Delete Action
  const handleConfirmDelete = async () => {
    if (!deletingBook) return;

    const bookId = deletingBook._id || deletingBook.id;
    const bookTitle = deletingBook.title || "E-book";

    setIsDeleting(true);
    setActionLoadingId(bookId);

    // Optimistic UI update
    setEBooks((prev) => prev.filter((b) => (b._id || b.id) !== bookId));

    const res = await deleteEBook(bookId);
    setActionLoadingId(null);
    setIsDeleting(false);

    if (res?.success) {
      showToast("success", `"${bookTitle}" was successfully deleted.`);
      handleCloseDeleteModal();
    } else {
      fetchEbooks();
      showToast("error", res?.message || "Failed to delete e-book.");
    }
  };

  // Filtered Ebooks list
  const filteredEBooks = useMemo(() => {
    return eBooks.filter((book) => {
      const search = searchTerm.toLowerCase().trim();
      const titleMatch = (book.title || "").toLowerCase().includes(search);
      const writerMatch = (book.writerName || book.author || "").toLowerCase().includes(search);
      if (search && !titleMatch && !writerMatch) return false;

      const status = (book.status || "pending").toLowerCase();
      if (statusFilter !== "All" && status !== statusFilter.toLowerCase()) {
        return false;
      }

      return true;
    });
  }, [eBooks, searchTerm, statusFilter]);

  // Pagination State (8-10 items per page)
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  const totalPages = Math.ceil(filteredEBooks.length / itemsPerPage) || 1;
  const paginatedEBooks = useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    return filteredEBooks.slice(startIdx, startIdx + itemsPerPage);
  }, [filteredEBooks, currentPage, itemsPerPage]);

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`p-4 border text-xs font-medium flex items-center justify-between gap-3 shadow-lg transition-all animate-in fade-in slide-in-from-top-2 ${
            notification.type === "success"
              ? "border-emerald-500/40 bg-emerald-950/40 text-emerald-300"
              : "border-rose-500/40 bg-rose-950/40 text-rose-300"
          }`}
        >
          <div className="flex items-center gap-2.5">
            {notification.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            <span>{notification.message}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="text-zinc-400 hover:text-white"
          >
            ✕
          </button>
        </div>
      )}

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-4">
        <div>
          <h1 className="text-3xl font-serif font-semibold text-zinc-100 flex items-center gap-2.5">
            <BookOpen className="w-6 h-6 text-rose-500" />
            Manage All E-books
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Admin control to review, approve, publish, unpublish, or delete e-books across Fable.
          </p>
        </div>

        <button
          onClick={fetchEbooks}
          disabled={loading}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-zinc-300 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 transition-colors w-fit cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-rose-500" : ""}`} />
          <span>Refresh List</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-[#121216]/90 border border-zinc-800/80 p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by title or writer..."
            className="w-full bg-[#18181f] border border-zinc-800 text-zinc-200 placeholder-zinc-500 text-xs pl-9 pr-3 py-2 focus:outline-none focus:border-rose-500 transition-colors"
          />
        </div>

        {/* Status Pills */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto text-xs">
          <span className="text-zinc-500 text-[11px] font-mono mr-1 hidden md:inline  items-center gap-1">
            <Filter className="w-3 h-3" /> Status:
          </span>
          {["All", "Pending", "Published", "Unpublished"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 font-medium transition-all cursor-pointer ${
                statusFilter === st
                  ? "bg-rose-500/20 text-rose-400 border border-rose-500/40"
                  : "bg-zinc-900/60 text-zinc-400 hover:text-zinc-200 border border-zinc-800/60"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Main Table */}
      <div className="rounded-none border border-zinc-800/80 bg-[#121216]/60 overflow-hidden shadow-xl">
        {/* Table Header */}
        <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3.5 border-b border-zinc-800/80 text-[11px] font-semibold tracking-wider text-zinc-400 uppercase font-mono">
          <span className="col-span-4">TITLE & GENRE</span>
          <span className="col-span-3">WRITER NAME</span>
          <span className="col-span-1">PRICE</span>
          <span className="col-span-2">STATUS</span>
          <span className="col-span-2 text-right">ACTIONS</span>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="p-16 flex flex-col items-center justify-center text-zinc-500 gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-rose-500" />
            <span className="text-xs font-mono">Fetching e-books directory...</span>
          </div>
        ) : filteredEBooks.length === 0 ? (
          /* Empty State */
          <div className="p-16 text-center text-sm text-zinc-500 flex flex-col items-center justify-center gap-2">
            <BookOpen className="w-10 h-10 text-zinc-600 stroke-[1.5]" />
            <p className="text-zinc-300 font-medium">No e-books found</p>
            <p className="text-xs text-zinc-500 max-w-sm">
              No e-books matched your search or status filter. Try clearing filters.
            </p>
          </div>
        ) : (
          /* Table Rows */
          <div className="divide-y divide-zinc-800/60">
            {paginatedEBooks.map((book) => {
              const bookId = book._id || book.id;
              const priceVal = typeof book.price === "number" ? book.price : parseFloat(book.price) || 0;
              const isFree = book.isFree || priceVal === 0;
              const status = (book.status || "pending").toLowerCase();
              const isPublished = status === "published";
              const isPending = status === "pending";
              const isActioning = actionLoadingId === bookId;

              return (
                <div
                  key={bookId}
                  className="grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-zinc-900/40 transition-colors"
                >
                  {/* Title & Cover */}
                  <div className="md:col-span-4 flex items-center gap-3.5 min-w-0">
                    <div className="relative w-10 h-13 shrink-0 bg-zinc-800 overflow-hidden border border-zinc-700/60 shadow-md">
                      {book.coverImage ? (
                        <Image
                          src={book.coverImage}
                          alt={book.title || "Cover"}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-zinc-600">
                          <BookOpen className="w-5 h-5 stroke-[1.5]" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 space-y-0.5">
                      <h3 className="text-sm font-serif font-medium text-zinc-100 truncate">
                        {book.title}
                      </h3>
                      <div className="flex items-center gap-1 text-[11px] text-zinc-400 font-mono">
                        <Tag className="w-3 h-3 text-rose-500/80 shrink-0" />
                        <span className="truncate">{book.genre || "Uncategorized"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Writer Name */}
                  <div className="md:col-span-3 text-xs text-zinc-300 flex items-center gap-1.5 truncate">
                    <User className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                    <span className="truncate font-medium">
                      {book.writerName || book.author || "Anonymous"}
                    </span>
                  </div>

                  {/* Price */}
                  <div className="md:col-span-1 text-xs font-mono font-semibold">
                    {isFree ? (
                      <span className="text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 text-[10px]">
                        FREE
                      </span>
                    ) : (
                      <span className="text-zinc-200">${priceVal.toFixed(2)}</span>
                    )}
                  </div>

                  {/* Status Badge */}
                  <div className="md:col-span-2">
                    {isPublished ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium text-emerald-400 bg-emerald-950/40 border border-emerald-800/50">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        Published
                      </span>
                    ) : isPending ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium text-amber-400 bg-amber-950/40 border border-amber-800/50">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                        Pending
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium text-rose-400 bg-rose-950/40 border border-rose-800/50">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                        Unpublished
                      </span>
                    )}
                  </div>

                  {/* Actions (Publish/Unpublish & Delete) */}
                  <div className="md:col-span-2 flex items-center justify-end gap-2">
                    {/* Publish / Unpublish / Approve Toggle */}
                    <button
                      type="button"
                      disabled={isActioning}
                      onClick={() => handleTogglePublish(book)}
                      className={`px-3 py-1.5 text-xs font-medium transition-colors flex items-center gap-1 border cursor-pointer disabled:opacity-50 ${
                        isPending
                          ? "bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border-emerald-700 font-semibold shadow-sm"
                          : isPublished
                          ? "bg-amber-950/40 hover:bg-amber-900/60 text-amber-300 border-amber-800/60"
                          : "bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-300 border-emerald-800/60"
                      }`}
                      title={isPending ? "Accept & Publish pending request" : isPublished ? "Unpublish E-book" : "Publish E-book"}
                    >
                      {isActioning ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : isPending ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Approve & Publish</span>
                        </>
                      ) : isPublished ? (
                        <>
                          <EyeOff className="w-3.5 h-3.5 text-amber-400" />
                          <span className="hidden lg:inline">Unpublish</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="hidden lg:inline">Publish</span>
                        </>
                      )}
                    </button>

                    {/* Delete Button */}
                    <button
                      type="button"
                      disabled={isActioning}
                      onClick={() => handleOpenDeleteModal(book)}
                      className="p-1.5 text-zinc-400 hover:text-rose-300 bg-rose-950/30 hover:bg-rose-900/60 border border-rose-800/40 transition-colors cursor-pointer disabled:opacity-50"
                      title="Delete E-book"
                    >
                      <Trash2 className="w-4 h-4 text-rose-400" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination Bar */}
        {!loading && filteredEBooks.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-zinc-800/80 bg-zinc-900/40 text-xs font-mono text-zinc-400">
            <span>
              Showing <strong className="text-zinc-200">{(currentPage - 1) * itemsPerPage + 1}</strong> – <strong className="text-zinc-200">{Math.min(currentPage * itemsPerPage, filteredEBooks.length)}</strong> of <strong className="text-zinc-200">{filteredEBooks.length}</strong> ebooks
            </span>

            {totalPages > 1 && (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  className="px-2.5 py-1.5 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed text-zinc-300 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Prev</span>
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-1.5 font-mono text-xs transition-colors cursor-pointer border ${
                      currentPage === pageNum
                        ? "bg-rose-600 text-white border-rose-500 font-bold shadow-md shadow-rose-600/20"
                        : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700"
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}

                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  className="px-2.5 py-1.5 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed text-zinc-300 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span>Next</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* DELETE CONFIRMATION DIALOG MODAL */}
      {deletingBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-[#121216] border border-rose-900/60 shadow-2xl overflow-hidden p-6 space-y-5">
            <button
              onClick={handleCloseDeleteModal}
              disabled={isDeleting}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="p-3 bg-rose-950/80 border border-rose-800/80 rounded-full text-rose-400">
                <AlertTriangle className="w-6 h-6 shrink-0" />
              </div>
              <div>
                <h3 className="text-lg font-serif font-semibold text-zinc-100">
                  Confirm Delete E-book
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Permanent Action
                </p>
              </div>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed bg-zinc-900/80 p-3 border border-zinc-800">
              Are you sure you want to delete <span className="font-semibold text-white">&ldquo;{deletingBook.title}&ldquo;</span>? This will permanently remove the e-book from the library and cannot be undone.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">  
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleCloseDeleteModal}
                className="px-4 py-2 text-xs font-medium text-zinc-400 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 transition-colors cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-rose-600 hover:bg-rose-500 border border-rose-500 transition-all shadow-md shadow-rose-950/40 cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete E-book</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
