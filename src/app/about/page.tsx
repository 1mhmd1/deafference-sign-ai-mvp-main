import type { Metadata } from "next"
import { AboutPage } from "@/components/landing/about-page"

export const metadata: Metadata = {
  title: "About us — Deafference",
  description: "Deafference's mission and vision, the values we build by, the team behind it, and where we're heading.",
}

export default function Page() {
  return <AboutPage />
}
