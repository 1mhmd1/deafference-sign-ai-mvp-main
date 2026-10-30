import type { Metadata } from "next"
import { PricingPage } from "@/components/landing/pricing-page"
import { JsonLd } from "@/components/shared/json-ld"
import { breadcrumbJsonLd, pageMetadata } from "@/lib/site"

export const metadata: Metadata = pageMetadata({
  title: "Pricing",
  description:
    "Deafference plans for every scale: free for personal use, monthly plans for clinics and schools, and annual contracts for hospital networks.",
  path: "/pricing",
})

export default function Page() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd("Pricing", "/pricing")} />
      <PricingPage />
    </>
  )
}
