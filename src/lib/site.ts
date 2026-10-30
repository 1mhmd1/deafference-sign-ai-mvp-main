import type { Metadata } from "next"

/**
 * The site's public address. Canonical links, the sitemap, robots.txt and link previews are built on
 * it. Set NEXT_PUBLIC_SITE_URL for a custom domain; on Vercel the production domain is used otherwise.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "https://deafference-sign-ai-mvp-main.vercel.app")
).replace(/\/+$/, "")

export const SITE_NAME = "Deafference"

/** The default description (search results, link previews). Worded like the FAQ: "built to", not "does". */
export const SITE_DESCRIPTION =
  "An AI app built to help Deaf, hard-of-hearing and hearing people understand each other, in sign language, speech and text, for healthcare and everyday life."

export const CONTACT_EMAIL = "fatima@deafference.com"

/** The link-preview picture (app/opengraph-image.png). A page that sets its own openGraph loses the
 *  inherited one, so pageMetadata names it again. */
const SHARE_IMAGE = {
  url: "/opengraph-image.png",
  width: 1200,
  height: 630,
  alt: "Deafference: breaking communication barriers. Sign language, speech and text, both ways.",
}

/** The landing's public pages, for the sitemap (most important first). */
export const PUBLIC_PAGES = [
  { path: "/", priority: 1 },
  { path: "/how-it-works", priority: 0.9 },
  { path: "/scenarios", priority: 0.8 },
  { path: "/pricing", priority: 0.8 },
  { path: "/about", priority: 0.7 },
  { path: "/faq", priority: 0.7 },
  { path: "/security", priority: 0.6 },
  { path: "/contact", priority: 0.6 },
  { path: "/translate", priority: 0.6 },
  { path: "/terms", priority: 0.3 },
] as const

/** Title, description, canonical address and link-preview text for one public page. */
export function pageMetadata({ title, description, path }: { title: string; description: string; path: string }): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    // A page's openGraph replaces the layout's, so the shared fields are repeated here.
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale: "en_US",
      alternateLocale: ["ar"],
      url: path,
      title: `${title} — ${SITE_NAME}`,
      description,
      images: [SHARE_IMAGE],
    },
    twitter: { card: "summary_large_image", title: `${title} — ${SITE_NAME}`, description, images: [SHARE_IMAGE] },
  }
}

/** "Home › Page" as schema.org breadcrumbs (the same trail the page header shows). */
export function breadcrumbJsonLd(name: string, path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name, item: `${SITE_URL}${path}` },
    ],
  }
}
