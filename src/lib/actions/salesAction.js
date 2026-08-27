"use server";
import { headers } from "next/headers";
import { auth } from "../auth";


const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";

/**
 * Server action to fetch sales history for a specific writer
 * @param {string} writerId
 */
export async function getWriterSalesHistory(writerId) {
   // JWT token Get
  const { token } = await auth.api.getToken({
    headers: await headers(),
  });
  try {
    if (!writerId) {
      return { success: true, data: [] };
    }

    const endpoint = `/api/sales/${encodeURIComponent(writerId)}`;
    const url = baseUrl ? `${baseUrl}${endpoint}` : endpoint;

    const res = await fetch(url, {
      cache: "no-store",
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        return { success: true, data };
      }
      if (Array.isArray(data?.data)) {
        return { success: true, data: data.data };
      }
    }

    return { success: true, data: [] };
  } catch (error) {
    console.error("Error in getWriterSalesHistory action:", error);
    return { success: false, data: [], error: error.message };
  }
}
