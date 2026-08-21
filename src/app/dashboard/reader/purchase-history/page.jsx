export default function ReaderPurchaseHistoryPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-serif font-semibold text-zinc-100">Purchase History</h1>
      <p className="text-sm text-zinc-400">View all past transactions and receipts.</p>
      <div className="p-12 rounded-none border border-zinc-800/80 bg-[#121216]/60 text-center text-sm text-zinc-500">
        No transaction history available.
      </div>
    </div>
  );
}
