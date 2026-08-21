import DashboardSidebar from "@/components/dashboard/Sidebar";

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#0a0a0c] text-zinc-100 flex flex-col lg:flex-row">
      <DashboardSidebar />
      <main className="flex-1 w-full min-w-0 p-6 sm:p-8 lg:p-10">
        {children}
      </main>
    </div>
  );
}
