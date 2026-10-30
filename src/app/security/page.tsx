import type { Metadata } from "next"
import { SecurityPage } from "@/components/landing/security-page"
import { JsonLd } from "@/components/shared/json-ld"
import { breadcrumbJsonLd, pageMetadata } from "@/lib/site"

export const metadata: Metadata = pageMetadata({
  title: "Security & privacy",
  description:
    "How Deafference protects your conversations: camera and microphone only when you ask, no recordings saved to your account, and your data rights.",
  path: "/security",
})

export default function Page() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd("Security & privacy", "/security")} />
      <SecurityPage />
    </>
  )
}
