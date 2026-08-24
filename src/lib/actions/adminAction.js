"use server"

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";

export const getAdminEBooks = async () => {
    const res = await fetch(`${baseUrl}/api/admin/e-books`, { cache: 'no-store' });
    
    if (!res.ok) return { success: false, data: [] };
    
    const data = await res.json();
    const eBooks = Array.isArray(data) ? data : (Array.isArray(data?.data) ? data.data : []);

    return { success: true, data: eBooks };
};

export const updateEBookStatus = async (id, status) => {
    try {
        const payload = { status };
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
        return { success: false, message: `Failed to update status (${res.status})` };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

export const deleteEBook = async (id) => {
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
