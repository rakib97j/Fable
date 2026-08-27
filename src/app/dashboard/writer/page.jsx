import React from "react";
import WriterDashboardOverview from "@/components/dashboard/WriterComponents/WriterDashboardOverview";

export const metadata = {
  title: "Fable || Writer Dashboard",
  description: "Overview of published e-books, sales analytics, and writer performance.",
};

export default function WriterDashboardPage() {
  return <WriterDashboardOverview />;
}
