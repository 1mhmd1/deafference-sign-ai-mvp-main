"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Wordmark } from "@/components/shared/wordmark"
import { APP_ROUTES } from "@/lib/constants"
import { useI18n } from "@/i18n/use-i18n"
import { resolveLandingHref, smoothScrollToTop } from "./nav-links"
import { DfIcon, JudyArt, type IconName } from "./home/df-ui"

const CONTACT_EMAIL = "fatima@deafference.com"

/** Pictures for the accessibility badges of `t.landing.home.footer.badges` (same order). */
const BADGE_ICONS: IconName[] = ["check", "keyboard", "volume", "globe", "motion", "earoff"]

/**
 * Site footer, drawn as the website design: the brand and its two actions, three groups of links, and
 * the accessibility statement with Judy. The "Accessibility" link lands on that card from every page.
 */
export function Footer() {
  const { t, fmt } = useI18n()
  const copy = t.landing.footer
  const links = t.landing.nav.links
  const badges = t.landing.home.footer.badges
  const pathname = usePathname()
  // Each page appears once ("Open the app" is the button in the brand block). Section anchors
  // (#scenarios, #demo) resolve to the home page from other pages.
  const groups: { heading: string; icon: IconName; items: { href: string; label: string }[] }[] = [
    {
      heading: copy.product,
      icon: "phone",
      items: [
        { href: resolveLandingHref("#how-it-works", pathname), label: links.howItWorks },
        { href: resolveLandingHref("#features", pathname), label: links.features },
        { href: resolveLandingHref("#scenarios", pathname), label: links.scenarios },
        { href: resolveLandingHref("#demo", pathname), label: links.demo },
      ],
    },
    {
      heading: copy.company,
      icon: "heart",
      items: [
        { href: "/about", label: links.about },
        { href: "/pricing", label: links.pricing },
        { href: "/contact", label: links.contact },
      ],
    },
    {
      heading: copy.help,
      icon: "question",
      items: [
        { href: "/faq", label: links.faq },
        { href: "/security", label: links.security },
        { href: "/terms", label: copy.terms },
        { href: "#accessibility", label: copy.accessibility },
      ],
    },
  ]

  return (
    <footer className="df df-foot">
      <div className="df-wrap">
        <div className="df-foot__top">
          <div className="df-foot__brand">
            <Wordmark className="df-footlogo" />
            <p>{copy.tagline}</p>
            <div className="df-foot__ctas">
              <Link href={APP_ROUTES.translate} className="df-btn df-btn--primary">
                <DfIcon name="phone" size={20} />
                <span>{copy.openApp}</span>
                <DfIcon name="arrow" size={18} className="df-btn__trail" />
              </Link>
              <a className="df-chip df-chip--link" href={`mailto:${CONTACT_EMAIL}`} dir="ltr">
                <DfIcon name="mail" size={18} />
                <span>{CONTACT_EMAIL}</span>
              </a>
            </div>
          </div>
          {groups.map((group) => (
            <nav key={group.heading} className="df-foot__col" aria-labelledby={`foot-${group.icon}`}>
              <h2 className="df-foot__h" id={`foot-${group.icon}`}>
                <DfIcon name={group.icon} size={20} />
                {group.heading}
              </h2>
              <ul>
                {group.items.map((item) => (
                  <li key={item.href}>
                    {item.href.startsWith("/") ? <Link href={item.href}>{item.label}</Link> : <a href={item.href}>{item.label}</a>}
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <section className="df-foot__a11y" id="accessibility" aria-labelledby="footer-a11y-title">
          <span className="df-foot__judy">
            <JudyArt size={120} pose="wave" />
          </span>
          <div className="df-foot__a11ytext">
            <h2 className="df-foot__h" id="footer-a11y-title">
              <DfIcon name="a11y" size={20} />
              {copy.a11yTitle}
            </h2>
            <ul className="df-foot__badges">
              {badges.map((badge, i) => (
                <li key={badge}>
                  <DfIcon name={BADGE_ICONS[i] ?? "check"} size={20} />
                  {/* The right-to-left badge names Arabic in its own script. */}
                  <span>
                    {i === 3 ? (
                      <>
                        <span lang="ar">عربي</span> {badge}
                      </>
                    ) : (
                      badge
                    )}
                  </span>
                </li>
              ))}
            </ul>
            <p>
              {copy.a11yContact}{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} dir="ltr">
                {CONTACT_EMAIL}
              </a>
            </p>
          </div>
        </section>

        <div className="df-foot__bottom">
          <span>{fmt(copy.rights, { year: new Date().getFullYear() })}</span>
          <a href="#top" onClick={smoothScrollToTop} className="df-link">
            <DfIcon name="arrowup" size={18} />
            {copy.backToTop}
          </a>
        </div>
      </div>
    </footer>
  )
}
