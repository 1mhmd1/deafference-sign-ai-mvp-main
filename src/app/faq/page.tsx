import type { Metadata } from "next"
import { FaqPage } from "@/components/landing/faq-page"
import { JsonLd } from "@/components/shared/json-ld"
import { landing } from "@/i18n/messages/landing"
import { breadcrumbJsonLd, pageMetadata } from "@/lib/site"

export const metadata: Metadata = pageMetadata({
  title: "FAQ",
  description:
    "Common questions about Deafference, answered simply: sign languages, privacy, interpreters, pricing, Arabic, accuracy and using it offline.",
  path: "/faq",
})

// The questions and answers as schema.org data (English: what crawlers, who send no language cookie, see).
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: landing.en.faq.items.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: item.answer },
  })),
}

export default function Page() {
  return (
    <>
      <JsonLd data={[breadcrumbJsonLd("FAQ", "/faq"), faqJsonLd]} />
      <FaqPage />
    </>
  )
}
