export const metadata = {
  title: 'Writer || Add E-book',
  description: 'This is Fable writer dashboard add e-books Page',
}


export default function WriterAddEbookPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-3xl font-serif font-semibold text-zinc-100">Add New Ebook</h1>
      <p className="text-sm text-zinc-400">Fill in the details to publish a new story.</p>
      <div className="p-6 rounded-none border border-zinc-800/80 bg-[#121216]/60 space-y-4">
        <div className="text-sm text-zinc-400">
          Writer story submission form.
        </div>
      </div>
    </div>
  );
}
