import React from "react";
import AnalyticsOverviewAdmin from "@/components/dashboard/AdminComponents/AnalyticsOverviewAdmin";

export const metadata = {
  title: 'Admin || Analytics Overview',
  description: 'Detailed analytics, total revenue, user count, and sales trends.',
};

export default function AdminAnalyticsOverviewPage() {
  return <AnalyticsOverviewAdmin />;
}

