import type { MetadataRoute } from "next"
import { PUBLIC_PAGES, SITE_URL } from "@/lib/site"

/** The website's public pages. Each page shows both languages at the same address (a language switch). */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()
  return PUBLIC_PAGES.map(({ path, priority }) => ({
    url: `${SITE_URL}${path === "/" ? "" : path}`,
    lastModified,
    changeFrequency: "monthly",
    priority,
  }))
}
