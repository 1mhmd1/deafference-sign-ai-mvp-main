import { redirect } from "next/navigation"

/** Settings now live inside the profile page. */
export default function SettingsPage() {
  redirect("/profile?tab=settings")
}
