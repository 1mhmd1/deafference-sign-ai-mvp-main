import type { Metadata } from "next"
import { HowItWorksPage } from "@/components/landing/how-it-works-page"
import { JsonLd } from "@/components/shared/json-ld"
import { breadcrumbJsonLd, pageMetadata } from "@/lib/site"

export const metadata: Metadata = pageMetadata({
  title: "How it works",
  description:
    "How Deafference is built to turn speech into sign and text, and sign into text and speech: step by step, both ways, with its features and performance.",
  path: "/how-it-works",
})

export default function Page() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd("How it works", "/how-it-works")} />
      <HowItWorksPage />
    </>
  )
}
