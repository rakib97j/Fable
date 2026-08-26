"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  BookOpen, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  AlertTriangle,
  X,
  Save,
  Clock,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { getEBooksByWriter, updateWriterEBook, deleteWriterEBook } from "@/lib/actions/eBooks";

const GENRES = [
  "Fantasy",
  "Science Fiction",
  "Romance",
  "Mystery & Thriller",
  "Non-Fiction",
  "Literary Fiction",
  "Horror",
  "Biography & Memoir",
  "Self-Help",
  "Poetry",
  "Young Adult",
  "Historical Fiction"
];

export default function ManageWriterEbooksClient() {
  const { data: session, isPending: sessionLoading } = useSession();
  const user = session?.user;
  const writerId = user?.id || user?._id;

  const [ebooks, setEbooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [notification, setNotification] = useState(null);

  // Edit Modal State
  const [editingBook, setEditingBook] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: "",
    genre: "Fantasy",
    price: "",
    isFree: false,
    description: "",
    coverImage: ""
  });
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  // Delete Confirmation Modal State
  const [deletingBook, setDeletingBook] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Pagination State (8-10 items per page)
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const totalPages = Math.ceil(ebooks.length / itemsPerPage) || 1;
  const paginatedEbooks = React.useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    return ebooks.slice(startIdx, startIdx + itemsPerPage);
  }, [ebooks, currentPage, itemsPerPage]);

  const fetchWriterEbooks = async () => {
    if (!writerId) {
      if (!sessionLoading) setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const res = await getEBooksByWriter(writerId);
      if (res?.success && Array.isArray(res.data)) {
        setEbooks(res.data);
      }
    } catch (err) {
      console.error("Failed to load writer ebooks:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWriterEbooks();
  }, [writerId, sessionLoading]);

  const showToast = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // Toggle publish / unpublish for writer (only allowed if status is not pending)
  const handleTogglePublish = async (book) => {
    const bookId = book._id || book.id;
    const currentStatus = (book.status || "pending").toLowerCase();

    if (currentStatus === "pending") {
      showToast("error", "Pending e-books can only be accepted and approved by an Admin.");
      return;
    }

    const newStatus = currentStatus === "published" ? "unpublished" : "published";

    setActionLoadingId(bookId);
    setEbooks((prev) =>
      prev.map((b) => ((b._id || b.id) === bookId ? { ...b, status: newStatus } : b))
    );

    const res = await updateWriterEBook(bookId, { status: newStatus });
    setActionLoadingId(null);

    if (res?.success) {
      showToast(
        "success",
        `"${book.title}" status changed to ${newStatus === "published" ? "Published" : "Unpublished"}.`
      );
    } else {
      setEbooks((prev) =>
        prev.map((b) => ((b._id || b.id) === bookId ? { ...b, status: currentStatus } : b))
      );
      showToast("error", res?.message || "Failed to update publish status.");
    }
  };

  // Open Edit Modal with pre-filled old data
  const handleOpenEditModal = (book) => {
    setEditingBook(book);
    const priceVal = typeof book.price === "number" ? book.price : parseFloat(book.price) || 0;
    setEditFormData({
      title: book.title || "",
      genre: book.genre || "Fantasy",
      price: priceVal > 0 ? priceVal.toString() : "",
      isFree: book.isFree || priceVal === 0,
      description: book.description || "",
      coverImage: book.coverImage || ""
    });
  };

  const handleCloseEditModal = () => {
    setEditingBook(null);
    setIsSavingEdit(false);
  };

  const handleEditInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Submit edit modal
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingBook) return;

    const bookId = editingBook._id || editingBook.id;
    setIsSavingEdit(true);

    const updateData = {
      title: editFormData.title,
      genre: editFormData.genre,
      price: editFormData.isFree ? 0 : parseFloat(editFormData.price || 0),
      isFree: editFormData.isFree,
      description: editFormData.description,
      coverImage: editFormData.coverImage
    };

    setEbooks((prev) =>
      prev.map((b) => ((b._id || b.id) === bookId ? { ...b, ...updateData } : b))
    );

    const res = await updateWriterEBook(bookId, updateData);
    setIsSavingEdit(false);

    if (res?.success) {
      showToast("success", `"${editFormData.title}" updated successfully.`);
      handleCloseEditModal();
    } else {
      fetchWriterEbooks();
      showToast("error", res?.message || "Failed to save e-book changes.");
    }
  };

  // Trigger Delete Confirmation Modal
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
    const bookTitle = deletingBook.title || "Ebook";

    setIsDeleting(true);
    setActionLoadingId(bookId);

    setEbooks((prev) => prev.filter((b) => (b._id || b.id) !== bookId));

    const res = await deleteWriterEBook(bookId);
    setActionLoadingId(null);
    setIsDeleting(false);

    if (res?.success) {
      showToast("success", `"${bookTitle}" deleted successfully.`);
      handleCloseDeleteModal();
    } else {
      fetchWriterEbooks();
      showToast("error", res?.message || "Failed to delete e-book.");
    }
  };

  return (
    <div className="space-y-8">
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
          <button onClick={() => setNotification(null)} className="text-zinc-400 hover:text-white">
            ✕
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-serif font-semibold tracking-tight text-zinc-100">
            Manage Ebooks ({ebooks.length})
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Publish, edit, or unpublish your works.
          </p>
        </div>

        <Link
          href="/dashboard/writer/add-ebook"
          className="inline-flex items-center gap-2 px-4 py-2.5 font-medium text-xs text-white bg-linear-to-r from-rose-500 to-pink-600 hover:opacity-90 transition-all shadow-md shadow-rose-600/20 w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>New Ebook</span>
        </Link>
      </div>

      {/* Table Container */}
      <div className="rounded-none border border-zinc-800/80 bg-[#121216]/60 overflow-hidden shadow-xl">
        {/* Table Header */}
        <div className="hidden sm:grid grid-cols-12 gap-4 px-6 py-3.5 border-b border-zinc-800/80 text-[11px] font-semibold tracking-wider text-zinc-400 uppercase font-mono">
          <span className="col-span-5">TITLE</span>
          <span className="col-span-2">PRICE</span>
          <span className="col-span-2">STATUS</span>
          <span className="col-span-3 text-right">ACTIONS</span>
        </div>

        {/* Loading State */}
        {loading || sessionLoading ? (
          <div className="p-16 flex flex-col items-center justify-center text-zinc-500 gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-rose-500" />
            <span className="text-xs">Loading your ebooks...</span>
          </div>
        ) : ebooks.length === 0 ? (
          /* Empty State */
          <div className="p-16 text-center text-sm text-zinc-500 flex flex-col items-center justify-center gap-3">
            <BookOpen className="w-10 h-10 text-zinc-600 stroke-[1.5]" />
            <p>No ebooks yet. Publish your first!</p>
            <Link
              href="/dashboard/writer/add-ebook"
              className="mt-2 text-xs font-medium text-rose-400 hover:text-rose-300 underline underline-offset-4"
            >
              Add New Ebook
            </Link>
          </div>
        ) : (
          /* Ebooks List Table */
          <div className="divide-y divide-zinc-800/60">
            {paginatedEbooks.map((ebook) => {
              const bookId = ebook._id || ebook.id;
              const priceVal = typeof ebook.price === "number" ? ebook.price : parseFloat(ebook.price) || 0;
              const isFree = ebook.isFree || priceVal === 0;
              const status = (ebook.status || "pending").toLowerCase();
              const isPublished = status === "published";
              const isPending = status === "pending";
              const isActioning = actionLoadingId === bookId;

              return (
                <div
                  key={bookId}
                  className="grid grid-cols-1 sm:grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-zinc-900/40 transition-colors"
                >
                  {/* Title & Cover Thumbnail */}
                  <div className="sm:col-span-5 flex items-center gap-3.5">
                    <div className="relative w-10 h-13 shrink-0 bg-zinc-800 overflow-hidden border border-zinc-700/60">
                      {ebook.coverImage ? (
                        <Image
                          src={ebook.coverImage}
                          alt={ebook.title || "Cover"}
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
                    <div className="min-w-0">
                      <h3 className="text-sm font-medium text-zinc-100 truncate">
                        {ebook.title}
                      </h3>
                      <span className="text-xs text-zinc-500 font-mono">
                        {ebook.genre || "General"}
                      </span>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="sm:col-span-2 text-xs font-mono font-medium text-zinc-200">
                    {isFree ? (
                      <span className="text-emerald-400 font-semibold">FREE</span>
                    ) : (
                      `$${priceVal.toFixed(2)}`
                    )}
                  </div>

                  {/* Status Badge */}
                  <div className="sm:col-span-2">
                    {isPublished ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium text-emerald-400 bg-emerald-950/40 border border-emerald-800/50">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        Published
                      </span>
                    ) : isPending ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium text-amber-400 bg-amber-950/40 border border-amber-800/50" title="Awaiting Admin Approval">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                        Pending Approval
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium text-rose-400 bg-rose-950/40 border border-rose-800/50">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                        Unpublished
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="sm:col-span-3 flex items-center justify-end gap-2">
                    {/* Publish / Unpublish Toggle */}
                    {isPending ? (
                      <span className="px-2.5 py-1 text-[11px] text-zinc-500 bg-zinc-900 border border-zinc-800 flex items-center gap-1 cursor-not-allowed" title="Only Admin can accept pending requests">
                        <Clock className="w-3 h-3 text-amber-400" />
                        <span className="hidden md:inline">Pending Admin</span>
                      </span>
                    ) : (
                      <button
                        type="button"
                        disabled={isActioning}
                        onClick={() => handleTogglePublish(ebook)}
                        className={`px-2.5 py-1.5 text-xs font-medium transition-colors flex items-center gap-1 border cursor-pointer disabled:opacity-50 ${
                          isPublished
                            ? "bg-amber-950/40 hover:bg-amber-900/60 text-amber-300 border-amber-800/60"
                            : "bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-300 border-emerald-800/60"
                        }`}
                        title={isPublished ? "Unpublish Ebook" : "Publish Ebook"}
                      >
                        {isActioning ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : isPublished ? (
                          <>
                            <EyeOff className="w-3.5 h-3.5 text-amber-400" />
                            <span className="hidden md:inline">Unpublish</span>
                          </>
                        ) : (
                          <>
                            <Eye className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="hidden md:inline">Publish</span>
                          </>
                        )}
                      </button>
                    )}

                    {/* Edit Button */}
                    <button
                      type="button"
                      disabled={isActioning}
                      onClick={() => handleOpenEditModal(ebook)}
                      className="p-1.5 text-zinc-400 hover:text-zinc-100 bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700/50 transition-colors cursor-pointer disabled:opacity-50"
                      title="Edit Ebook"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>

                    {/* Delete Button */}
                    <button
                      type="button"
                      disabled={isActioning}
                      onClick={() => handleOpenDeleteModal(ebook)}
                      className="p-1.5 text-zinc-400 hover:text-rose-400 bg-zinc-800/50 hover:bg-rose-950/40 border border-zinc-700/50 hover:border-rose-800/60 transition-colors cursor-pointer disabled:opacity-50"
                      title="Delete Ebook"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination Bar */}
        {!loading && ebooks.length > 0 && totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-zinc-800/80 bg-zinc-900/40 text-xs font-mono text-zinc-400">
            <span>
              Showing <strong className="text-zinc-200">{(currentPage - 1) * itemsPerPage + 1}</strong> – <strong className="text-zinc-200">{Math.min(currentPage * itemsPerPage, ebooks.length)}</strong> of <strong className="text-zinc-200">{ebooks.length}</strong> ebooks
            </span>

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
          </div>
        )}
      </div>

      {/* EDIT MODAL FOR WRITER */}
      {editingBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-[#121216] border border-zinc-800 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/60">
              <div className="flex items-center gap-2">
                <Edit className="w-5 h-5 text-rose-500" />
                <h3 className="text-lg font-serif font-semibold text-zinc-100">
                  Edit E-book Details
                </h3>
              </div>
              <button
                type="button"
                onClick={handleCloseEditModal}
                className="text-zinc-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveEdit} className="p-6 space-y-4 overflow-y-auto flex-1">
              {/* Title */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300">
                  E-book Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  value={editFormData.title}
                  onChange={handleEditInputChange}
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 text-zinc-100 text-sm focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Genre */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300">
                    Genre
                  </label>
                  <select
                    name="genre"
                    value={editFormData.genre}
                    onChange={handleEditInputChange}
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 text-zinc-100 text-sm focus:outline-none focus:border-rose-500 cursor-pointer"
                  >
                    {GENRES.map((g) => (
                      <option key={g} value={g} className="bg-zinc-900 text-zinc-100">
                        {g}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
                      Price ($)
                    </label>
                    <label className="flex items-center gap-1.5 text-[11px] text-zinc-400 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        name="isFree"
                        checked={editFormData.isFree}
                        onChange={handleEditInputChange}
                        className="rounded-none border-zinc-700 bg-zinc-900 text-rose-500 focus:ring-0"
                      />
                      <span>Free</span>
                    </label>
                  </div>
                  <input
                    type="number"
                    step="0.01"
                    name="price"
                    disabled={editFormData.isFree}
                    value={editFormData.isFree ? "0.00" : editFormData.price}
                    onChange={handleEditInputChange}
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 text-zinc-100 font-mono text-sm focus:outline-none focus:border-rose-500 disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Cover Image URL */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300">
                  Cover Image URL
                </label>
                <input
                  type="text"
                  name="coverImage"
                  value={editFormData.coverImage}
                  onChange={handleEditInputChange}
                  placeholder="https://..."
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 text-zinc-100 text-xs font-mono focus:outline-none focus:border-rose-500"
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300">
                  Description / Full Content
                </label>
                <textarea
                  name="description"
                  rows={5}
                  value={editFormData.description}
                  onChange={handleEditInputChange}
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 text-zinc-100 text-xs focus:outline-none focus:border-rose-500 resize-y"
                />
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-zinc-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCloseEditModal}
                  className="px-4 py-2 text-xs font-medium text-zinc-400 hover:text-white transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingEdit}
                  className="inline-flex items-center gap-2 px-5 py-2 text-xs font-medium text-white bg-linear-to-r from-rose-500 to-pink-600 hover:opacity-90 transition-all shadow-md shadow-rose-600/20 disabled:opacity-50 cursor-pointer"
                >
                  {isSavingEdit ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
                  Confirm Delete Ebook
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Permanent Action
                </p>
              </div>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed bg-zinc-900/80 p-3 border border-zinc-800">
              Are you sure you want to delete <span className="font-semibold text-white">"{deletingBook.title}"</span>? This will permanently remove your e-book from Fable.
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
                    <span>Delete Ebook</span>
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
