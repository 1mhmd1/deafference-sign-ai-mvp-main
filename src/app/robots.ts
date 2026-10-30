import type { MetadataRoute } from "next"
import { SITE_URL } from "@/lib/site"

/** Crawlers see the public website; accounts, admin, the API and the old demo pages stay out. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/admin",
        "/auth/",
        "/dashboard",
        "/profile",
        "/settings",
        "/history",
        "/verify",
        "/forbidden",
        "/forgot-password",
        "/reset-password",
        "/components-demo",
        "/enhanced-state-machine-demo",
        "/mock-testing-demo",
        "/translation-with-buffer",
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
