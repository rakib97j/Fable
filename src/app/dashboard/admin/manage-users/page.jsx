import React from "react";
import ManageUsersAdmin from "@/components/dashboard/AdminComponents/ManageUsersAdmin";

export const metadata = {
  title: 'Admin || Manage Users',
  description: 'Manage registered platform writers and readers.',
};

export default function AdminManageUsersPage() {
  return <ManageUsersAdmin />;
}

