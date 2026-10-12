import { redirect } from "next/navigation"

/** History now lives inside the profile page. */
export default function HistoryPage() {
  redirect("/profile?tab=history")
}
