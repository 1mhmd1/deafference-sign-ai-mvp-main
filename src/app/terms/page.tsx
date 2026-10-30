import type { Metadata } from "next"
import { TermsPage } from "@/components/landing/terms-page"
import { JsonLd } from "@/components/shared/json-ld"
import { breadcrumbJsonLd, pageMetadata } from "@/lib/site"

export const metadata: Metadata = pageMetadata({
  title: "Terms of service",
  description:
    "The Deafference terms of service: a short overview until the full legal terms are published.",
  path: "/terms",
})

export default function Page() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd("Terms of service", "/terms")} />
      <TermsPage />
    </>
  )
}
