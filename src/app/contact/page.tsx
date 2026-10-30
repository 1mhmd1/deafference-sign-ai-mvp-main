import type { Metadata } from "next"
import { ContactPage } from "@/components/landing/contact-page"
import { JsonLd } from "@/components/shared/json-ld"
import { breadcrumbJsonLd, pageMetadata } from "@/lib/site"

export const metadata: Metadata = pageMetadata({
  title: "Contact",
  description:
    "Talk to the Deafference team about a rollout, a demo, a partnership or support. Write to us by email, or attach a sign-language video.",
  path: "/contact",
})

export default function Page() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd("Contact", "/contact")} />
      <ContactPage />
    </>
  )
}
