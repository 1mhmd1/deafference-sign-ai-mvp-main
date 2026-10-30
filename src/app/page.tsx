import type { Metadata } from "next"
import { LandingPage } from "@/components/landing/landing-page"
import { JsonLd } from "@/components/shared/json-ld"
import { CONTACT_EMAIL, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site"

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_US",
    alternateLocale: ["ar"],
    url: "/",
    title: `${SITE_NAME} — Breaking communication barriers`,
    description: SITE_DESCRIPTION,
  },
}

const homeJsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: `${SITE_URL}/`,
    logo: `${SITE_URL}/deafference-logo.png`,
    email: CONTACT_EMAIL,
    description: SITE_DESCRIPTION,
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: SITE_NAME,
    url: `${SITE_URL}/`,
    inLanguage: ["en", "ar"],
    publisher: { "@id": `${SITE_URL}/#organization` },
  },
]

export default function Page() {
  return (
    <>
      <JsonLd data={homeJsonLd} />
      <LandingPage />
    </>
  )
}
