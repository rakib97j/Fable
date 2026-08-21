export const metadata = {
  title: 'Admin || Analytics',
  description: 'This is Admin Dashboard Page',
}

export default function AdminAnalyticsOverviewPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-serif font-semibold text-zinc-100">Analytics Overview</h1>
      <p className="text-sm text-zinc-400">Detailed metric charts and growth trends.</p>
      <div className="p-12 rounded-none border border-zinc-800/80 bg-[#121216]/60 text-center text-sm text-zinc-500">
        Analytics metrics and charts.
      </div>
    </div>
  );
}
