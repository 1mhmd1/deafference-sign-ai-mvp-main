import type { MouseEvent } from "react"
import { APP_ROUTES } from "@/lib/constants"
import type { LandingMessages } from "@/i18n/messages/landing"

type NavKey = keyof LandingMessages["nav"]["links"]

/** Maps the shared LANDING_NAV / FOOTER_*_NAV hrefs (lib/constants, read-only) onto translated labels. */
const HREF_TO_KEY: Record<string, NavKey> = {
  "#how-it-works": "howItWorks",
  [APP_ROUTES.scenarios]: "forYou",
  "#scenarios": "forYou",
  "#why-choose-us": "forOrganisations",
  "#faq": "faq",
  "#pricing": "pricing",
  "#features": "features",
  "#about": "about",
  "#contact": "contact",
  [APP_ROUTES.translate]: "translate",
  "#demo": "demo",
  "#privacy": "security",
}

/**
 * Links that now open one of the landing's own pages (the shared hrefs in lib/constants still use anchors).
 * Direct links elsewhere (terms page, sign-up form) point at /security too.
 */
const MOVED: Record<string, string> = {
  "#how-it-works": "/how-it-works",
  "#features": "/how-it-works#features",
  "#performance": "/how-it-works#performance",
  // Pricing, FAQ, privacy & security and the contact form left the home page for their own pages.
  "#pricing": "/pricing",
  "#faq": "/faq",
  "#privacy": "/security",
  "#contact": "/contact",
  // The full About us page; "Our story" stays on the home page and links there.
  "#about": "/about",
}

/**
 * /scenarios has no page; the Scenarios section on the landing page is the destination.
 * Sections that moved to /how-it-works or /about link there (see MOVED).
 * Off the landing page (e.g. /terms reuses the navbar/footer), in-page anchors point back to "/".
 */
export function resolveLandingHref(href: string, pathname: string | null) {
  const moved = MOVED[href]
  if (moved) {
    const [page, anchor] = moved.split("#")
    // Already on that page with a section anchor: keep the plain anchor so it just scrolls.
    return anchor && pathname === page ? `#${anchor}` : moved
  }
  const target = href === APP_ROUTES.scenarios ? "#scenarios" : href
  if (target.startsWith("#") && pathname && pathname !== "/") return `/${target}`
  return target
}

/**
 * onClick for same-page "#top" links (the logo and Home on the home page, the footer's Back to
 * top): glides to the top instead of jumping, drops the "#top" from the address bar, and moves
 * keyboard focus back to the start of the content. Jumps instantly in calm/reduced-motion mode.
 * Modified clicks (new tab/window) keep their default behaviour.
 */
export function smoothScrollToTop(event: MouseEvent<HTMLElement>) {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
  event.preventDefault()
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches || document.querySelector(".reduce-motion") !== null
  // "instant": <html> has scroll-smooth, which would otherwise animate every call.
  if (reduce) window.scrollTo({ top: 0, behavior: "instant" })
  else glideTo(0)
  if (window.location.hash) window.history.replaceState(window.history.state, "", window.location.pathname + window.location.search)
  document.getElementById("main-content")?.focus({ preventScroll: true })
}

const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2)

/**
 * Our own eased scroll: the browser's "smooth" covers long pages in a fraction of a second
 * (it reads as a jump). This takes 0.6–1.2s depending on distance and eases in and out.
 * Wheel, touch or a key press during the glide stops it and hands scrolling back.
 */
function glideTo(targetY: number) {
  const startY = window.scrollY
  const distance = targetY - startY
  if (Math.abs(distance) < 2) return
  const duration = Math.min(1200, Math.max(600, Math.abs(distance) * 0.12))
  const startTime = performance.now()
  let frame = 0
  const stop = () => {
    cancelAnimationFrame(frame)
    for (const type of ["wheel", "touchstart", "keydown"] as const) window.removeEventListener(type, stop)
  }
  for (const type of ["wheel", "touchstart", "keydown"] as const) window.addEventListener(type, stop, { passive: true })
  const step = (now: number) => {
    const t = Math.min(1, (now - startTime) / duration)
    window.scrollTo({ top: startY + distance * easeInOutCubic(t), behavior: "instant" })
    if (t < 1) frame = requestAnimationFrame(step)
    else stop()
  }
  frame = requestAnimationFrame(step)
}

export function navLabel(links: LandingMessages["nav"]["links"], href: string, fallback: string) {
  const key = HREF_TO_KEY[href]
  return key ? links[key] : fallback
}
