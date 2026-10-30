import type { Metadata } from "next"
import { ForbiddenContent } from "@/components/auth/forbidden-content"

export const metadata: Metadata = {
  title: { absolute: "403 — Forbidden" },
  robots: { index: false },
  description: "You don't have permission to access this page.",
}

export default function ForbiddenPage() {
  return <ForbiddenContent />
}
