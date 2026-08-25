"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { AddEBooks } from "@/lib/actions/eBooks";
import { useSession } from "@/lib/auth-client";
import {
  Upload,
  Image as ImageIcon,
  X,
  BookOpen,
  DollarSign,
  Tag,
  FileText,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Bold,
  Italic,
  List,
  Heading,
  Quote,
  Eye,
  User
} from "lucide-react";

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

// ImgBB Image 
const uploadImageToImgBB = async (imageFile) => {
  const apiKey = process.env.NEXT_PUBLIC_IMAGE_UPLOAD_API;
  if (!apiKey) {
    throw new Error("ImgBB API key is missing. Please set NEXT_PUBLIC_IMAGE_UPLOAD_API in your .env file.");
  }

  const bodyData = new FormData();
  bodyData.append("image", imageFile);

  const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
    method: "POST",
    body: bodyData,
  });

  const data = await res.json();
  if (data?.success) {
    return data.data.url; 
  } else {
    throw new Error(data?.error?.message || "ImgBB image upload failed");
  }
};

export default function AddEbookForm() {
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user;

  const [formData, setFormData] = useState({
    title: "",
    writerName: user?.name || user?.email || "",
    genre: "Fantasy",
    price: "",
    isFree: false,
    shortDescription: "",
    description: "",
  });

 

  const [coverImage, setCoverImage] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [activeTab, setActiveTab] = useState("edit"); // edit | preview

  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file (PNG, JPG, WEBP).");
      return;
    }

    // Max 5MB file size limit
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5MB.");
      return;
    }

    setCoverImage(file);
    const objectUrl = URL.createObjectURL(file);
    setCoverPreview(objectUrl);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const removeCoverImage = () => {
    if (coverPreview) {
      URL.revokeObjectURL(coverPreview);
    }
    setCoverImage(null);
    setCoverPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const insertTextFormatting = (prefix, suffix = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    const replacement = prefix + (selectedText || "text") + suffix;

    const newValue =
      textarea.value.substring(0, start) +
      replacement +
      textarea.value.substring(end);

    setFormData((prev) => ({ ...prev, description: newValue }));

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + prefix.length,
        start + prefix.length + (selectedText.length || 4)
      );
    }, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      alert("Please provide a title for your e-book.");
      return;
    }
    if (!formData.description.trim()) {
      alert("Please enter the full content for your e-book.");
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    let coverImageUrl = "";

    // Upload cover image to ImgBB if selected
    if (coverImage) {
      try {
        coverImageUrl = await uploadImageToImgBB(coverImage);
      } catch (uploadError) {
        setIsSubmitting(false);
        setSubmitStatus({
          type: "error",
          message: uploadError.message || "Failed to upload image to ImgBB.",
        });
        return;
      }
    }

    const payload = {
      title: formData.title,
      writerName: user?.name || formData.writerName || user?.email || "Anonymous",
      writerEmail: user?.email || "",
      writerId: user?.id || "",
      genre: formData.genre,
      price: formData.isFree ? 0 : parseFloat(formData.price || 0),
      isFree: formData.isFree,
      shortDescription: formData.shortDescription,
      description: formData.description,
      coverImage: coverImageUrl,
      status: "pending",
      createdAt: new Date().toISOString(),
      date: new Date().toISOString(),
    };

    const result = await AddEBooks(payload);

    setIsSubmitting(false);

    if (result?.success) {
      setSubmitStatus({
        type: "success",
        message: `"${formData.title}" has been submitted successfully with status "pending"! Redirecting to Manage Ebooks...`,
      });

      // Reset form on success (keeping logged-in writer name)
      setFormData({
        title: "",
        writerName: user?.name || user?.email || "",
        genre: "Fantasy",
        price: "",
        isFree: false,
        shortDescription: "",
        description: "",
      });
      removeCoverImage();

      // Redirect to Manage Ebooks page
      setTimeout(() => {
        router.push("/dashboard/writer/manage-ebooks");
      }, 500);
    } else {
      setSubmitStatus({
        type: "error",
        message: result?.message || "Failed to create e-book. Please try again.",
      });
    }
  };

  const wordCount = formData.description.trim() ? formData.description.trim().split(/\s+/).length : 0;
  const charCount = formData.description.length;

  return (
    <div className="space-y-6">
      {/* Status banner */}
      {submitStatus && (
        <div className={`p-4 border text-sm flex items-center justify-between gap-3 ${submitStatus.type === "success"
            ? "border-emerald-500/30 bg-emerald-950/30 text-emerald-300"
            : "border-rose-500/30 bg-rose-950/30 text-rose-300"
          }`}>
          <div className="flex items-center gap-2.5">
            {submitStatus.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            )}
            <span>{submitStatus.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setSubmitStatus(null)}
            className="text-zinc-400 hover:text-zinc-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header controls & preview tab toggle */}
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
        <div>
          <h2 className="text-xl font-serif font-semibold text-zinc-100 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-rose-500" />
            E-book Publication Details
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Fill in the essential information to list your story on the Fable library.
          </p>
        </div>

        <div className="flex items-center gap-1 bg-zinc-900/80 p-1 border border-zinc-800/80 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab("edit")}
            className={`px-3 py-1.5 font-medium transition-all ${activeTab === "edit"
                ? "bg-zinc-800 text-zinc-100 shadow-sm"
                : "text-zinc-400 hover:text-zinc-200"
              }`}
          >
            Edit Form
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("preview")}
            className={`px-3 py-1.5 font-medium flex items-center gap-1.5 transition-all ${activeTab === "preview"
                ? "bg-zinc-800 text-zinc-100 shadow-sm"
                : "text-zinc-400 hover:text-zinc-200"
              }`}
          >
            <Eye className="w-3.5 h-3.5" />
            Card Preview
          </button>
        </div>
      </div>

      {activeTab === "preview" ? (
        /* Live Card Preview */
        <div className="p-8 border border-zinc-800/80 bg-[#121216]/60 flex flex-col items-center justify-center min-h-95">
          <div className="text-xs text-zinc-400 mb-6 uppercase tracking-wider font-mono">
            Live Reader View Preview
          </div>
          <div className="w-full max-w-sm rounded border border-zinc-800 bg-[#18181f] overflow-hidden shadow-2xl transition-all hover:border-zinc-700">
            <div className="aspect-3/4 w-full bg-zinc-900 relative overflow-hidden flex items-center justify-center">
              {coverPreview ? (
                <Image
                  src={coverPreview}
                  alt={formData.title || "Ebook Cover"}
                  fill
                  unoptimized
                  className="object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center p-6 text-center text-zinc-600">
                  <BookOpen className="w-12 h-12 stroke-[1.5] mb-2 opacity-50" />
                  <span className="text-xs font-mono">No Cover Uploaded</span>
                </div>
              )}
              <span className="absolute top-3 right-3 px-2.5 py-1 bg-zinc-950/80 backdrop-blur-md border border-zinc-700/50 text-[10px] uppercase font-semibold tracking-wider text-rose-400">
                {formData.genre}
              </span>
            </div>
            <div className="p-5 space-y-3">
              <div className="space-y-1">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-serif font-semibold text-lg text-zinc-100 line-clamp-1">
                    {formData.title || "Untitled Story"}
                  </h3>
                  <span className="text-sm font-semibold text-rose-400 shrink-0 font-mono">
                    {formData.isFree ? "FREE" : formData.price ? `$${formData.price}` : "$0.00"}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                  <User className="w-3.5 h-3.5 text-rose-500/80" />
                  <span className="font-medium text-zinc-300">
                    {user?.name || user?.email || formData.writerName || "Anonymous Writer"}
                  </span>
                </div>
              </div>
              <p className="text-xs text-zinc-400 line-clamp-3 leading-relaxed">
                {formData.shortDescription || formData.description || "No description provided yet..."}
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* Form View */
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left/Main Column: Basic Info & Content */}
            <div className="md:col-span-2 space-y-6">
              {/* Title & Writer Name Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Title Field */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300">
                    E-book Title <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g. The Chronicles of Aetheria"
                    className="w-full px-4 py-3 bg-zinc-900/90 border border-zinc-800 text-zinc-100 placeholder-zinc-500 text-sm focus:outline-none focus:border-rose-500 transition-colors"
                  />
                </div>

                {/* Writer Name Field (Auto-filled from logged in user & non-editable) */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className=" text-xs font-semibold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-zinc-400" />
                      Writer / Author Name <span className="text-rose-500">*</span>
                    </label>
                    <span className="text-[10px] text-zinc-400 uppercase font-mono tracking-wider">
                      (Auto-filled)
                    </span>
                  </div>
                  <input
                    type="text"
                    name="writerName"
                    readOnly
                    required
                    value={user?.name || user?.email || formData.writerName}
                    placeholder="Loading user name..."
                    className="w-full px-4 py-3 bg-zinc-900/40 border border-zinc-800/80 text-zinc-300 text-sm cursor-not-allowed opacity-90 focus:outline-none select-none"
                  />
                </div>
              </div>

              {/* Genre & Price Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Genre Field */}
                <div className="space-y-2">
                  <label className=" text-xs font-semibold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-zinc-400" />
                    Genre <span className="text-rose-500">*</span>
                  </label>
                  <select
                    name="genre"
                    value={formData.genre}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-zinc-900/90 border border-zinc-800 text-zinc-100 text-sm focus:outline-none focus:border-rose-500 transition-colors cursor-pointer"
                  >
                    {GENRES.map((g) => (
                      <option key={g} value={g} className="bg-zinc-900 text-zinc-100">
                        {g}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Field */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className=" text-xs font-semibold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                      <DollarSign className="w-3.5 h-3.5 text-zinc-400" />
                      Price (USD) <span className="text-rose-500">*</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-400 select-none">
                      <input
                        type="checkbox"
                        name="isFree"
                        checked={formData.isFree}
                        onChange={handleInputChange}
                        className="rounded-none border-zinc-700 bg-zinc-900 text-rose-500 focus:ring-0 focus:ring-offset-0"
                      />
                      <span>Mark as Free</span>
                    </label>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3.5 top-3.5 text-zinc-500 text-sm font-mono">$</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      name="price"
                      disabled={formData.isFree}
                      value={formData.isFree ? "0.00" : formData.price}
                      onChange={handleInputChange}
                      placeholder="9.99"
                      className="w-full pl-8 pr-4 py-3 bg-zinc-900/90 border border-zinc-800 text-zinc-100 placeholder-zinc-500 text-sm focus:outline-none focus:border-rose-500 transition-colors disabled:opacity-50 font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Short Description Field */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-zinc-400" />
                  Short Description
                </label>
                <textarea
                  name="shortDescription"
                  rows={3}
                  value={formData.shortDescription}
                  onChange={handleInputChange}
                  placeholder="Write a brief overview or hook for your e-book..."
                  className="w-full px-4 py-3 bg-zinc-900/90 border border-zinc-800 text-zinc-100 placeholder-zinc-500 text-sm focus:outline-none focus:border-rose-500 transition-colors resize-y leading-relaxed font-sans"
                />
              </div>

              {/* Description (Full Content) Field */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className=" text-xs font-semibold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-zinc-400" />
                    Full Content <span className="text-rose-500">*</span>
                  </label>
                  <div className="text-[11px] text-zinc-500 font-mono space-x-2">
                    <span>{wordCount} words</span>
                    <span>•</span>
                    <span>{charCount} chars</span>
                  </div>
                </div>

                {/* Toolbar */}
                <div className="border border-zinc-800 bg-[#121216]/80 p-2 space-y-2">
                  <div className="flex items-center gap-1 text-zinc-400 border-b border-zinc-800/80 pb-2 text-xs">
                    <button
                      type="button"
                      title="Bold"
                      onClick={() => insertTextFormatting("**", "**")}
                      className="p-1.5 hover:bg-zinc-800 hover:text-zinc-200 transition-colors"
                    >
                      <Bold className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      title="Italic"
                      onClick={() => insertTextFormatting("*", "*")}
                      className="p-1.5 hover:bg-zinc-800 hover:text-zinc-200 transition-colors"
                    >
                      <Italic className="w-3.5 h-3.5" />
                    </button>
                    <div className="w-px h-4 bg-zinc-800 mx-1" />
                    <button
                      type="button"
                      title="Heading"
                      onClick={() => insertTextFormatting("### ")}
                      className="p-1.5 hover:bg-zinc-800 hover:text-zinc-200 transition-colors"
                    >
                      <Heading className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      title="Quote"
                      onClick={() => insertTextFormatting("> ")}
                      className="p-1.5 hover:bg-zinc-800 hover:text-zinc-200 transition-colors"
                    >
                      <Quote className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      title="Bullet List"
                      onClick={() => insertTextFormatting("- ")}
                      className="p-1.5 hover:bg-zinc-800 hover:text-zinc-200 transition-colors"
                    >
                      <List className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <textarea
                    ref={textareaRef}
                    name="description"
                    required
                    rows={12}
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Write a captivating summary or the full synopsis/content of your e-book here..."
                    className="w-full p-2 bg-transparent text-zinc-100 placeholder-zinc-500 text-sm focus:outline-none resize-y leading-relaxed font-sans"
                  />
                </div>
                <p className="text-[11px] text-zinc-500">
                  Markdown syntax supported for formatting headings, quotes, and emphasis.
                </p>
              </div>
            </div>

            {/* Right Column: Cover Image Upload */}
            <div className="space-y-6">
              <div className="space-y-2">
                <label className=" text-xs font-semibold uppercase tracking-wider text-zinc-300 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-zinc-400" />
                    Cover Image
                  </span>
                  <span className="text-[10px] text-zinc-500 uppercase font-mono">PNG, JPG, WEBP</span>
                </label>

                {/* Upload Zone / Preview Area */}
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onClick={() => !coverPreview && fileInputRef.current?.click()}
                  className={`relative border-2 border-dashed p-6 text-center transition-all flex flex-col items-center justify-center min-h-80 ${isDragging
                      ? "border-rose-500 bg-rose-500/10"
                      : coverPreview
                        ? "border-zinc-700 bg-zinc-900/60 p-2"
                        : "border-zinc-800 hover:border-zinc-700 bg-zinc-900/40 cursor-pointer"
                    }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => e.target.files && handleFileChange(e.target.files[0])}
                  />

                  {coverPreview ? (
                    <div className="relative w-full h-full group flex flex-col items-center">
                      <div className="relative aspect-3/4 w-full max-w-50 overflow-hidden border border-zinc-800 shadow-lg">
                        <Image
                          src={coverPreview}
                          alt="Ebook cover preview"
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      </div>
                      <div className="mt-3 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            fileInputRef.current?.click();
                          }}
                          className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-200 transition-colors cursor-pointer"
                        >
                          Change Cover
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeCoverImage();
                          }}
                          className="p-1 bg-rose-950/80 text-rose-400 hover:bg-rose-900 border border-rose-800/60 transition-colors cursor-pointer"
                          title="Remove image"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      {coverImage && (
                        <span className="mt-2 text-[10px] text-zinc-500 font-mono truncate max-w-full">
                          {coverImage.name} ({(coverImage.size / 1024 / 1024).toFixed(2)} MB)
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-3 pointer-events-none">
                      <div className="w-12 h-12 rounded-full bg-zinc-800/80 border border-zinc-700/50 flex items-center justify-center mx-auto text-zinc-400">
                        <Upload className="w-5 h-5 text-rose-500" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-zinc-200">
                          Click to upload or drag & drop
                        </p>
                        <p className="text-[11px] text-zinc-500">
                          Recommended ratio 3:4 (e.g. 1200 x 1600 px)
                        </p>
                      </div>
                      <span className="inline-block px-3 py-1 bg-zinc-800/60 border border-zinc-700/60 text-[11px] text-zinc-300">
                        Browse Files
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Tips / Information box */}
              <div className="p-4 border border-zinc-800/80 bg-zinc-900/30 text-xs text-zinc-400 space-y-2">
                <div className="font-semibold text-zinc-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-rose-400" />
                  Publishing Tips
                </div>
                <ul className="list-disc list-inside space-y-1 text-[11px] text-zinc-400 leading-relaxed">
                  <li>Use high-resolution front covers for better visibility.</li>
                  <li>Provide an intriguing synopsis to attract readers.</li>
                  <li>Set competitive pricing for higher engagement.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-4 border-t border-zinc-800/80 pt-6">
            <button
              type="button"
              onClick={() => {
                setFormData({
                  title: "",
                  genre: "Fantasy",
                  price: "",
                  isFree: false,
                  description: "",
                });
                removeCoverImage();
              }}
              className="px-5 py-2.5 text-xs font-medium text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
            >
              Reset Form
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-6 py-2.5 font-medium text-xs text-white bg-linear-to-r from-rose-500 to-pink-600 hover:opacity-90 transition-all shadow-md shadow-rose-600/20 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Publishing...</span>
                </>
              ) : (
                <>
                  <BookOpen className="w-4 h-4" />
                  <span>Publish E-book</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
