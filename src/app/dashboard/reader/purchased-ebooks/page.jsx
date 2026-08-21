export default function ReaderPurchasedEbooksPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-serif font-semibold text-zinc-100">Purchased Ebooks</h1>
      <p className="text-sm text-zinc-400">Your collection of acquired books.</p>
      <div className="p-12 rounded-none border border-zinc-800/80 bg-[#121216]/60 text-center text-sm text-zinc-500">
        No purchased ebooks found.
      </div>
    </div>
  );
}
