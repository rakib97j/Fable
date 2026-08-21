"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  useEffect(() => {
    if (!isPending) {
      const role = (session?.user?.role || "writer").toLowerCase();
      router.replace(`/dashboard/${role}`);
    }
  }, [session, isPending, router]);

  return (
    <div className="p-12 text-center text-sm text-zinc-500">
      Loading dashboard...
    </div>
  );
}


