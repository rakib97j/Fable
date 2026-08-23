import React from 'react';
import EBooksClientPage from '@/components/EBooks/EBooksClientPage';
import { getEBooks } from '@/lib/actions/eBooks';

export const metadata = {
  title: 'Fable || Browse Ebooks',
  description: 'Search titles, filter by genre, price and availability. Every ebook here is original.',
};

const EBooksPage = async () => {
  const result = await getEBooks();
  const initialData = result?.success && Array.isArray(result.data) ? result.data : [];

  return (
    <main className="min-h-screen bg-[#0a0a0c]">
      <EBooksClientPage initialData={initialData} />
    </main>
  );
};

export default EBooksPage;