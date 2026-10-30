import type { Metadata } from "next"
import { AboutPage } from "@/components/landing/about-page"
import { JsonLd } from "@/components/shared/json-ld"
import { breadcrumbJsonLd, pageMetadata } from "@/lib/site"

export const metadata: Metadata = pageMetadata({
  title: "About us",
  description:
    "Deafference's mission and vision, the values we build by, the team behind it and where we're heading, with and for Deaf and hard-of-hearing people.",
  path: "/about",
})

export default function Page() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd("About us", "/about")} />
      <AboutPage />
    </>
  )
}
