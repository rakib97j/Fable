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



// for writer Ebooks 
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
