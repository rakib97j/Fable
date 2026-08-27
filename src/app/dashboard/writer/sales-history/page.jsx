import React from "react";
import SalesHistoryClientComponent from "@/components/dashboard/WriterComponents/SalesHistoryClientComponent";

export const metadata = {
  title: "Writer || Sales History",
  description: "Track book sales and earnings history for Fable writers.",
};

export default function WriterSalesHistoryPage() {
  return <SalesHistoryClientComponent />;
}
