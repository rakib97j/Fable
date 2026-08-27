import React from "react";
import ViewTransactionsAdmin from "@/components/dashboard/AdminComponents/ViewTransactionsAdmin";

export const metadata = {
  title: 'Admin || Transactions',
  description: 'View and manage all platform financial transactions.',
};

export default function AdminViewTransactionsPage() {
  return <ViewTransactionsAdmin />;
}

