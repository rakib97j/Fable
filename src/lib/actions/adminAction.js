"use server";

import { headers } from "next/headers";
import { auth } from "../auth";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";

export const getAdminEBooks = async () => {
  // JWT token Get
  const { token } = await auth.api.getToken({
    headers: await headers(),
  });

  const res = await fetch(
    `${baseUrl}/api/admin/e-books`,
    

    { cache: "no-store",
        headers: {
        authorization: `Bearer ${token}`,
      }, },
  );

  if (!res.ok) return { success: false, data: [] };

  const data = await res.json();
  const eBooks = Array.isArray(data)
    ? data
    : Array.isArray(data?.data)
      ? data.data
      : [];

  return { success: true, data: eBooks };
};

export const updateEBookStatus = async (id, status) => {
  // JWT token Get
  const { token } = await auth.api.getToken({
    headers: await headers(),
  });

  try {
    const payload = { status };
    delete payload._id;

    const primaryUrl = baseUrl
      ? `${baseUrl}/api/e-books/${id}`
      : `/api/e-books/${id}`;


    let res = await fetch(primaryUrl, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    if (!res.ok) {
      const adminUrl = baseUrl
        ? `${baseUrl}/api/admin/e-books/${id}`
        : `/api/admin/e-books/${id}`;
      res = await fetch(adminUrl, {
        method: "PATCH",
        headers: { "Content-Type": "application/json",  authorization: `Bearer ${token}`},
        body: JSON.stringify(payload),
        cache: "no-store",
      });
    }

    if (res.ok) {
      const data = await res.json().catch(() => ({}));
      return { success: true, data };
    }
    return {
      success: false,
      message: `Failed to update status (${res.status})`,
    };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const deleteEBook = async (id) => {
  // JWT token Get
  const { token } = await auth.api.getToken({
    headers: await headers(),
  });

  try {
    const primaryUrl = baseUrl
      ? `${baseUrl}/api/e-books/${id}`
      : `/api/e-books/${id}`;
    let res = await fetch(primaryUrl, {
      method: "DELETE",
      cache: "no-store",
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const adminUrl = baseUrl
        ? `${baseUrl}/api/admin/e-books/${id}`
        : `/api/admin/e-books/${id}`;
      res = await fetch(adminUrl, {
        method: "DELETE",
        cache: "no-store",
        headers: {
        authorization: `Bearer ${token}`,
      },
      });
    }

    if (res.ok) {
      const data = await res.json().catch(() => ({}));
      return { success: true, data };
    }
    return {
      success: false,
      message: `Failed to delete e-book (${res.status})`,
    };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const getUsers = async () => {
  // JWT token Get
  const { token } = await auth.api.getToken({
    headers: await headers(),
  });

  try {
    const res = await fetch(
      `${baseUrl}/api/users`,
      
      { cache: "no-store",
        headers:{
                authorization : `Bearer ${token}`
            }
       },
    );
    if (!res.ok) return { success: false, data: [] };

    const data = await res.json();
    const users = Array.isArray(data)
      ? data
      : Array.isArray(data?.data)
        ? data.data
        : [];

    return { success: true, data: users };
  } catch (error) {
    console.error("Error in getUsers action:", error);
    return { success: false, data: [] };
  }
};

export const updateUserRole = async (id, role) => {
  // JWT token Get
  const { token } = await auth.api.getToken({
    headers: await headers(),
  });
  try {
    const primaryUrl = baseUrl
      ? `${baseUrl}/api/users/${id}`
      : `/api/users/${id}`;
    const res = await fetch(primaryUrl, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ role }),
      cache: "no-store",
    });

    if (res.ok) {
      const data = await res.json().catch(() => ({}));
      return { success: true, data };
    }
    return {
      success: false,
      message: `Failed to update user role (${res.status})`,
    };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const deleteUser = async (id) => {
  // JWT token Get
  const { token } = await auth.api.getToken({
    headers: await headers(),
  });
  try {
    const primaryUrl = baseUrl
      ? `${baseUrl}/api/users/${id}`
      : `/api/users/${id}`;
    const res = await fetch(primaryUrl, {
      method: "DELETE",
      headers: {
        authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (res.ok) {
      const data = await res.json().catch(() => ({}));
      return { success: true, data };
    }
    return { success: false, message: `Failed to delete user (${res.status})` };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const getAdminPayments = async () => {
  // JWT token Get
  const { token } = await auth.api.getToken({
    headers: await headers(),
  });
  try {
    const primaryUrl = baseUrl
      ? `${baseUrl}/api/admin/payments`
      : `/api/admin/payments`;
    const res = await fetch(primaryUrl, {
      cache: "no-store",
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) return { success: false, data: [] };

    const data = await res.json();
    const payments = Array.isArray(data)
      ? data
      : Array.isArray(data?.data)
        ? data.data
        : [];

    return { success: true, data: payments };
  } catch (error) {
    console.error("Error in getAdminPayments action:", error);
    return { success: false, data: [] };
  }
};
