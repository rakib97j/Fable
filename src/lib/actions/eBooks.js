"use server"

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";

export const AddEBooks = async (newEBookData) => {
    try {
        const res = await fetch(`${baseUrl}/api/e-books`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newEBookData),
            cache: 'no-store'
        });

        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
            return {
                success: false,
                message: data?.message || `Request failed with status ${res.status}`
            };
        }

        return {
            success: true,
            data
        };
    } catch (error) {
        return {
            success: false,
            message: error.message || "Network error. Please try again."
        };
    }
}

// All ebooks for Browser E-Books 
export const getEBooks = async () => {
    try {
        if (!baseUrl) return { success: true, data: [] };

        const res = await fetch(`${baseUrl}/api/e-books`, { cache: 'no-store' });

        if (res.ok) {
            const data = await res.json();

            if (Array.isArray(data)) return { success: true, data };
            if (Array.isArray(data?.data)) return { success: true, data: data.data };
        }

        return { success: true, data: [] };
    } catch (error) {
        console.error("Error fetching e-books:", error);
        return { success: false, data: [], error: error.message };
    }
};
export const GetEBooks = getEBooks;



// for writer manage Ebooks 
export const getEBooksByWriter = async (writerId) => {
    try {
        if (!baseUrl || !writerId) return { success: true, data: [] };

        const res = await fetch(`${baseUrl}/api/e-books/writer/${writerId}`, { cache: 'no-store' });

        if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data)) return { success: true, data };
            if (Array.isArray(data?.data)) return { success: true, data: data.data };
        }

        return { success: true, data: [] };
    } catch (error) {
        console.error("Error fetching writer e-books:", error);
        return { success: false, data: [], error: error.message };
    }
};
export const GetWriterEBooks = getEBooksByWriter;




// Random ebooks for Featured E-Books
export const getRandomEBooks = async () => {
    try {
        const url = `${baseUrl}/api/e-books/random`
        const res = await fetch(url, { cache: 'no-store' });

        if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data)) return { success: true, data };
            if (Array.isArray(data?.data)) return { success: true, data: data.data };
        }

        return { success: true, data: [] };
    } catch (error) {
        console.error("Error fetching random e-books:", error);
        return { success: false, data: [], error: error.message };
    }
};
export const GetRandomEBooks = getRandomEBooks;

// Update writer e-book
export const updateWriterEBook = async (id, updateData) => {
    try {
        const payload = { ...updateData };
        delete payload._id;

        const primaryUrl = baseUrl ? `${baseUrl}/api/e-books/${id}` : `/api/e-books/${id}`;
        let res = await fetch(primaryUrl, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
            cache: 'no-store'
        });

        if (!res.ok) {
            const adminUrl = baseUrl ? `${baseUrl}/api/admin/e-books/${id}` : `/api/admin/e-books/${id}`;
            res = await fetch(adminUrl, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
                cache: 'no-store'
            });
        }

        if (res.ok) {
            const data = await res.json().catch(() => ({}));
            return { success: true, data };
        }
        return { success: false, message: `Failed to update e-book (${res.status})` };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

// Delete writer e-book
export const deleteWriterEBook = async (id) => {
    try {
        const primaryUrl = baseUrl ? `${baseUrl}/api/e-books/${id}` : `/api/e-books/${id}`;
        let res = await fetch(primaryUrl, {
            method: 'DELETE',
            cache: 'no-store'
        });

        if (!res.ok) {
            const adminUrl = baseUrl ? `${baseUrl}/api/admin/e-books/${id}` : `/api/admin/e-books/${id}`;
            res = await fetch(adminUrl, {
                method: 'DELETE',
                cache: 'no-store'
            });
        }

        if (res.ok) {
            const data = await res.json().catch(() => ({}));
            return { success: true, data };
        }
        return { success: false, message: `Failed to delete e-book (${res.status})` };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

// Get single ebook by ID
export const getEBookById = async (id) => {
    try {
        if (!id) return { success: false, data: null };

        if (baseUrl) {
            try {
                const res = await fetch(`${baseUrl}/api/e-books/${id}`, { cache: 'no-store' });
                if (res.ok) {
                    const data = await res.json();
                    const ebook = data?.data || data;
                    if (ebook && (ebook._id || ebook.id)) {
                        return { success: true, data: ebook };
                    }
                }
            } catch (fetchErr) {
                console.warn("Direct /api/e-books/:id fetch failed, attempting fallback...", fetchErr.message);
            }
        }

        // Fallback: fetch all e-books and find matching ID
        const allRes = await getEBooks();
        if (allRes?.success && Array.isArray(allRes.data)) {
            const found = allRes.data.find(
                (b) => String(b._id) === String(id) || String(b.id) === String(id)
            );
            if (found) return { success: true, data: found };
        }

        return { success: false, data: null, message: "Ebook not found" };
    } catch (error) {
        console.error("Error in getEBookById:", error);
        return { success: false, data: null, error: error.message };
    }
};
export const GetEBookById = getEBookById;

export const addBookmark = async (userId, book) => {
  try {
    const res = await fetch(`${baseUrl}/api/bookmarks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, book }),
      cache: "no-store",
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return { success: false, message: data?.message || "Failed to add bookmark" };
    }
    return { success: true, data };
  } catch (error) {
    return { success: false, message: error.message || "Network error. Please try again." };
  }
};

export const getUserBookmarks = async (userId) => {
  try {
    if (!baseUrl || !userId) return { success: true, data: [] };
    const res = await fetch(`${baseUrl}/api/bookmarks/${encodeURIComponent(userId)}`, {
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) return { success: true, data };
    }
    return { success: true, data: [] };
  } catch (error) {
    console.error("getUserBookmarks error:", error);
    return { success: false, data: [], error: error.message };
  }
};

export const removeBookmark = async (userId, bookId) => {
  try {
    const res = await fetch(`${baseUrl}/api/bookmarks`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, bookId }),
      cache: "no-store",
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return { success: false, message: data?.message || "Failed to remove bookmark" };
    }
    return { success: true, data };
  } catch (error) {
    return { success: false, message: error.message || "Network error." };
  }
};


export const recordPaymentInDB = async (paymentData) => {
  try {
    const res = await fetch(`${baseUrl}/api/payment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(paymentData),
      cache: "no-store",
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return { success: false, message: data?.message || "Failed to record payment" };
    }
    return { success: true, data };
  } catch (error) {
    return { success: false, message: error.message || "Network error." };
  }
};
