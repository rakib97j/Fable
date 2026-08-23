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