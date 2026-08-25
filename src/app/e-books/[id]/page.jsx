import React from "react";
import EBookDetailsClient from "@/components/EBooks/EBookDetailsClient";
import { getEBookById } from "@/lib/actions/eBooks";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const res = await getEBookById(id);
  const ebook = res?.data;

  if (!ebook) {
    return {
      title: "E-book Not Found || Fable",
      description: "The requested e-book could not be found.",
    };
  }

  return {
    title: `${ebook.title || "E-book Details"} || Fable`,
    description: ebook.description
      ? ebook.description.slice(0, 160)
      : `Read ${ebook.title} by ${ebook.writerName || ebook.author || "Fable Author"}.`,
  };
}

export default async function EBookDetailsPage({ params }) {
  const { id } = await params;
  const res = await getEBookById(id);
  const ebook = res?.data || null;

  return (
    <main className="min-h-screen bg-[#0a0a0c]">
      <EBookDetailsClient ebook={ebook} />
    </main>
  );
}
