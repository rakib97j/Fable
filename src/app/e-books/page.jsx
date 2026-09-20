import React, { Suspense } from 'react';
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
      <Suspense fallback={
        <div className="w-full py-20 text-center text-zinc-400 font-mono text-xs">
          Loading catalog...
        </div>
      }>
        <EBooksClientPage initialData={initialData} />
      </Suspense>
    </main>
  );
};

export default EBooksPage;