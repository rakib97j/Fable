import React from "react";
import AnalyticsOverviewAdmin from "@/components/dashboard/AdminComponents/AnalyticsOverviewAdmin";

export const metadata = {
  title: 'Fable || Admin Overview',
  description: 'Admin platform activity, sales analytics, and metric overview.',
};

export default function AdminDashboardPage() {
  return <AnalyticsOverviewAdmin />;
}
