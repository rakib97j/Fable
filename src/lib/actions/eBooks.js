"use server"

import { MongoClient } from "mongodb";
import { headers } from "next/headers";
import { auth } from "../auth";



const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";
const mongoUri = process.env.MONGODB_URI;
const dbName = process.env.AUTH_DB_NAME || "fable_db";

/**
 * Direct MongoDB helper when API endpoint is unavailable or returns empty
 */
const getEbooksFromDb = async (query = {}, limit = 0, sample = false) => {
 


  if (!mongoUri) return [];
  try {
    const client = new MongoClient(mongoUri);
    await client.connect();
    const db = client.db(dbName);

    let collection = db.collection("e-books");
    let count = await collection.countDocuments();
    if (count === 0) {
      const altCol = db.collection("ebooks");
      const altCount = await altCol.countDocuments();
      if (altCount > 0) collection = altCol;
    }

    let books = [];
    if (sample && limit > 0) {
      books = await collection.aggregate([{ $match: query }, { $sample: { size: limit } }]).toArray();
    } else if (limit > 0) {
      books = await collection.find(query).limit(limit).toArray();
    } else {
      books = await collection.find(query).toArray();
    }

    await client.close();

    return books.map((b) => ({
      ...b,
      _id: b._id ? String(b._id) : undefined,
    }));
  } catch (err) {
    console.error("MongoDB direct ebook fetch error:", err);
    return [];
  }
};

export const AddEBooks = async (newEBookData) => {
  // JWT token Get
  const { token } = await auth.api.getToken({
    headers: await headers(),
  });
    try {
        const primaryUrl = baseUrl ? `${baseUrl}/api/e-books` : `/api/e-books`;
        const res = await fetch(primaryUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${token}`

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
  // JWT token Get
  const { token } = await auth.api.getToken({
    headers: await headers(),
  });
    try {
        if (baseUrl) {
            const res = await fetch(`${baseUrl}/api/e-books`, { cache: 'no-store' ,headers: {
        authorization: `Bearer ${token}`,
      },});

            if (res.ok) {
                const data = await res.json();
                if (Array.isArray(data) && data.length > 0) return { success: true, data };
                if (Array.isArray(data?.data) && data.data.length > 0) return { success: true, data: data.data };
            }
        }

        // Fallback: direct MongoDB query
        const dbBooks = await getEbooksFromDb();
        return { success: true, data: dbBooks };
    } catch (error) {
        console.error("Error fetching e-books:", error);
        const dbBooks = await getEbooksFromDb();
        return { success: true, data: dbBooks };
    }
};
export const GetEBooks = getEBooks;

// for writer manage Ebooks 
export const getEBooksByWriter = async (writerId) => {
  // JWT token Get
  const { token } = await auth.api.getToken({
    headers: await headers(),
  });
    try {
        if (!writerId) return { success: true, data: [] };

        if (baseUrl) {
            const res = await fetch(`${baseUrl}/api/e-books/writer/${writerId}`, { cache: 'no-store'  ,headers: {
        authorization: `Bearer ${token}`,
      },});

            if (res.ok) {
                const data = await res.json();
                if (Array.isArray(data) && data.length > 0) return { success: true, data };
                if (Array.isArray(data?.data) && data.data.length > 0) return { success: true, data: data.data };
            }
        }

        // Fallback: direct MongoDB query by writer email/ID
        const decodedWriterId = decodeURIComponent(writerId);
        const dbBooks = await getEbooksFromDb({
          $or: [
            { writerEmail: decodedWriterId },
            { writerId: decodedWriterId },
            { author: decodedWriterId }
          ]
        });
        return { success: true, data: dbBooks };
    } catch (error) {
        console.error("Error fetching writer e-books:", error);
        return { success: false, data: [] };
    }
};
export const GetWriterEBooks = getEBooksByWriter;

// Random ebooks for Featured E-Books
export const getRandomEBooks = async () => {
  // JWT token Get
  const { token } = await auth.api.getToken({
    headers: await headers(),
  });
    try {
        if (baseUrl) {
            const url = `${baseUrl}/api/e-books/random`;
            const res = await fetch(url, { cache: 'no-store',headers: {
        authorization: `Bearer ${token}`,
      },});

            if (res.ok) {
                const data = await res.json();
                if (Array.isArray(data) && data.length > 0) return { success: true, data };
                if (Array.isArray(data?.data) && data.data.length > 0) return { success: true, data: data.data };
            }
        }

        // Fallback: direct MongoDB random sampling
        const dbBooks = await getEbooksFromDb({}, 4, true);
        if (dbBooks.length > 0) return { success: true, data: dbBooks };

        // If sample empty, get any ebooks
        const allBooks = await getEbooksFromDb({}, 4, false);
        return { success: true, data: allBooks };
    } catch (error) {
        console.error("Error fetching random e-books:", error);
        const dbBooks = await getEbooksFromDb({}, 4, false);
        return { success: true, data: dbBooks };
    }
};
export const GetRandomEBooks = getRandomEBooks;

// Update writer e-book
export const updateWriterEBook = async (id, updateData) => {
  // JWT token Get
  const { token } = await auth.api.getToken({
    headers: await headers(),
  });
    try {
        const payload = { ...updateData };
        delete payload._id;

        const primaryUrl = baseUrl ? `${baseUrl}/api/e-books/${id}` : `/api/e-books/${id}`;
        let res = await fetch(primaryUrl, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' , authorization: `Bearer ${token}` },
            body: JSON.stringify(payload),
            cache: 'no-store'
        });

        if (!res.ok) {
            const adminUrl = baseUrl ? `${baseUrl}/api/admin/e-books/${id}` : `/api/admin/e-books/${id}`;
            res = await fetch(adminUrl, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' ,authorization: `Bearer ${token}` },
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
  // JWT token Get
  const { token } = await auth.api.getToken({
    headers: await headers(),
  });
    try {
        const primaryUrl = baseUrl ? `${baseUrl}/api/e-books/${id}` : `/api/e-books/${id}`;
        let res = await fetch(primaryUrl, {
            method: 'DELETE',
            cache: 'no-store',
            headers: {
        authorization: `Bearer ${token}`,
      },
        });

        if (!res.ok) {
            const adminUrl = baseUrl ? `${baseUrl}/api/admin/e-books/${id}` : `/api/admin/e-books/${id}`;
            res = await fetch(adminUrl, {
                method: 'DELETE',
                cache: 'no-store',
                headers: {
        authorization: `Bearer ${token}`,
      },
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
   // JWT token Get
  const { token } = await auth.api.getToken({
    headers: await headers(),
  });
    try {
        if (!id) return { success: false, data: null };

        if (baseUrl) {
            try {
                const res = await fetch(`${baseUrl}/api/e-books/${id}`, { cache: 'no-store', headers: {
        authorization: `Bearer ${token}`,
      },});
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

   // JWT token Get
  const { token } = await auth.api.getToken({
    headers: await headers(),
  });
  try {
    const res = await fetch(`${baseUrl}/api/bookmarks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" ,  authorization: `Bearer ${token}` },
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
   // JWT token Get
  const { token } = await auth.api.getToken({
    headers: await headers(),
  });
  try {
    if (!baseUrl || !userId) return { success: true, data: [] };
    const res = await fetch(`${baseUrl}/api/bookmarks/${encodeURIComponent(userId)}`, {
      cache: "no-store",
      headers: {
        authorization: `Bearer ${token}`,
      },
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
   // JWT token Get
  const { token } = await auth.api.getToken({
    headers: await headers(),
  });
  try {
    const res = await fetch(`${baseUrl}/api/bookmarks`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" ,authorization: `Bearer ${token}` },
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
   // JWT token Get
  const { token } = await auth.api.getToken({
    headers: await headers(),
  });
  try {
    const res = await fetch(`${baseUrl}/api/payment`, {
      method: "POST",
      headers: { "Content-Type": "application/json", authorization: `Bearer ${token}` },
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

export const getUserPurchases = async (userId, userEmail) => {
   // JWT token Get
  const { token } = await auth.api.getToken({
    headers: await headers(),
  });
  try {
    const identifier = userId || userEmail;
    if (!baseUrl || !identifier) return { success: true, data: [] };

    // Try fetching by userId / identifier
    const res = await fetch(`${baseUrl}/api/purchases/${encodeURIComponent(identifier)}`, {
      cache: "no-store",
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      const data = await res.json();
      const list = Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : [];
      if (list.length > 0) return { success: true, data: list };
    }

    // Fallback: If searching by ID returned 0 items and email exists, search by user email
    if (userEmail && userEmail !== identifier) {
      const emailRes = await fetch(`${baseUrl}/api/purchases/${encodeURIComponent(userEmail)}`, {
        cache: "no-store",
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      if (emailRes.ok) {
        const emailData = await emailRes.json();
        const emailList = Array.isArray(emailData) ? emailData : Array.isArray(emailData?.data) ? emailData.data : [];
        if (emailList.length > 0) return { success: true, data: emailList };
      }
    }

    return { success: true, data: [] };
  } catch (error) {
    console.error("getUserPurchases error:", error);
    return { success: false, data: [], error: error.message };
  }
};
