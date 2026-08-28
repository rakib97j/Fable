"use server";

import { headers } from "next/headers";
import { auth } from "../auth";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:9090";

export async function getRandomWriters() {
 
  try {
    const res = await fetch(`${baseUrl}/api/users/randomWriters`, {
      cache: "no-store",

    });
    if (!res.ok) return { success: false, data: [] };
    const data = await res.json();
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching random writers:", error);
    return { success: false, data: [] };
  }
}

export async function getAllWriters() {
   
  try {
    const res = await fetch(`${baseUrl}/api/users/writers`, {
      cache: "no-store",
  
    });
    if (!res.ok) return { success: false, data: [] };
    const data = await res.json();
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching all writers:", error);
    return { success: false, data: [] };
  }
}

export async function getWriterDetails(id) {
   // JWT token Get
  const { token } = await auth.api.getToken({
    headers: await headers(),
  });
  try {
    if (!id) return { success: false, message: "Invalid writer ID", data: null };
    const res = await fetch(`${baseUrl}/api/users/writers/${encodeURIComponent(id)}`, {
      cache: "no-store",
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      return { success: false, message: "Writer not found", data: null };
    }

    const data = await res.json();
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching writer details:", error);
    return { success: false, message: error.message, data: null };
  }
}

