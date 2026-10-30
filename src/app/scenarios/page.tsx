import type { Metadata } from "next"
import { ScenariosPage } from "@/components/landing/scenarios-page"
import { JsonLd } from "@/components/shared/json-ld"
import { breadcrumbJsonLd, pageMetadata } from "@/lib/site"

export const metadata: Metadata = pageMetadata({
  title: "Scenarios",
  description:
    "Where Deafference helps: healthcare, hotels, workplaces, emergencies, travel, public services and education. A walk through everyday life with Judy.",
  path: "/scenarios",
})

export default function Page() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd("Scenarios", "/scenarios")} />
      <ScenariosPage />
    </>
  )
}
