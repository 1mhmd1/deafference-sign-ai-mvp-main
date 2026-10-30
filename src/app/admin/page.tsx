import type { Metadata } from "next"
import { AdminShell } from "@/components/admin/admin-shell"

export const metadata: Metadata = {
  title: "Admin panel",
  robots: { index: false },
  description: "Manage users, feedback, and contact submissions for the Deafference platform.",
}

export default function AdminPage() {
  return <AdminShell />
}
