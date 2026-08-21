export const metadata = {
  title: 'Reader || Bookmarks',
  description: 'This is Fable Reader Bookmarks history',
}


export default function ReaderBookmarksPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-serif font-semibold text-zinc-100">Bookmarks</h1>
      <p className="text-sm text-zinc-400">Your saved books and reading list.</p>
      <div className="p-12 rounded-none border border-zinc-800/80 bg-[#121216]/60 text-center text-sm text-zinc-500">
        No bookmarked books yet.
      </div>
    </div>
  );
}
