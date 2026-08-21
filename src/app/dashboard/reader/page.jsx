

export const metadata = {
  title: 'Fable || Reader',
  description: 'This is Fable Reader Dashboard',
}


export default function ReaderDashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-serif font-semibold text-zinc-100">Reader Dashboard</h1>
      <p className="text-sm text-zinc-400">Welcome to your reader dashboard.</p>
      <div className="p-12 rounded-none border border-zinc-800/80 bg-[#121216]/60 text-center text-sm text-zinc-500">
        Reader Overview & Recommendations.
      </div>
    </div>
  );
}
