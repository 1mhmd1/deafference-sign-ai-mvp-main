import type { Metadata } from "next"
import { HowItWorksPage } from "@/components/landing/how-it-works-page"

export const metadata: Metadata = {
  title: "How it works — Deafference",
  description:
    "How Deafference translates speech to sign and sign to text and speech, its features, and how it performs.",
}

export default function Page() {
  return <HowItWorksPage />
}
