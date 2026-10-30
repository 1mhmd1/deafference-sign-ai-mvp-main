"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Wordmark } from "@/components/shared/wordmark"
import { APP_ROUTES } from "@/lib/constants"
import { useI18n } from "@/i18n/use-i18n"
import { AuthNavActions, initialsFor } from "@/components/auth/auth-nav-actions"
import { useAuth } from "@/components/auth/auth-provider"
import { useProfilePhoto } from "@/components/profile/profile-photo"
import { AccessibilityMenu } from "./accessibility-menu"
import { resolveLandingHref, smoothScrollToTop } from "./nav-links"
import { DfIcon, type IconName } from "./home/df-ui"
import type { LandingMessages } from "@/i18n/messages/landing"

// The header's links, in the design's order, each with its picture. Hrefs go through resolveLandingHref:
// sections with their own page (about, how it works, pricing, FAQ, security, contact) open it, and the
// home page's anchors point back to "/" from other pages.
const NAV_ITEMS: { href: string; label: keyof LandingMessages["nav"]["links"]; icon: IconName }[] = [
  { href: "#about", label: "about", icon: "heart" },
  { href: "#how-it-works", label: "howItWorks", icon: "swap" },
  { href: "#scenarios", label: "scenarios", icon: "pin" },
  { href: "#pricing", label: "pricing", icon: "tag" },
  { href: "#faq", label: "faq", icon: "question" },
  { href: "#privacy", label: "security", icon: "shield" },
  { href: "#contact", label: "contact", icon: "mail" },
]

function NavLink({ href, label, icon, onClick }: { href: string; label: string; icon: IconName; onClick?: () => void }) {
  const body = (
    <>
      <DfIcon name={icon} size={20} />
      <span>{label}</span>
    </>
  )
  return href.startsWith("#") ? (
    <a href={href} className="df-nav__link" onClick={onClick}>
      {body}
    </a>
  ) : (
    <Link href={href} className="df-nav__link" onClick={onClick}>
      {body}
    </Link>
  )
}

/** EN | عربي: the current language first, the one it switches to after it. */
function LanguagePill() {
  const { locale, setLocale, t } = useI18n()
  const next = locale === "ar" ? "en" : "ar"
  return (
    <button type="button" className="df-nav__pill" onClick={() => setLocale(next)} aria-label={t.common.language.switchTo}>
      <DfIcon name="globe" size={18} />
      <span lang={locale}>{locale === "ar" ? "عربي" : "EN"}</span>
      <span className="df-nav__ar" lang={next}>
        {next === "ar" ? "عربي" : "EN"}
      </span>
    </button>
  )
}

/** Signed in: the profile picture (or initials) linking to /profile. */
function ProfileLink({ onClick }: { onClick?: () => void }) {
  const { t } = useI18n()
  const { user } = useAuth()
  const photo = useProfilePhoto()
  if (!user) return null
  return (
    <Link
      href={APP_ROUTES.profile}
      onClick={onClick}
      aria-label={`${user.name || user.email}, ${t.profile.hub.tabs.profile.label}`}
      title={t.profile.hub.tabs.profile.label}
      className="df-nav__avatar"
    >
      {photo ? <img src={photo} alt="" /> : <span aria-hidden="true">{initialsFor(user.name, user.email)}</span>}
    </Link>
  )
}

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuPanelRef = useRef<HTMLDivElement>(null)
  const menuToggleRef = useRef<HTMLButtonElement>(null)
  const pathname = usePathname()
  const { t } = useI18n()
  const { user } = useAuth()
  const nav = t.landing.nav
  const navItems = NAV_ITEMS.map((item) => ({
    key: item.href,
    href: resolveLandingHref(item.href, pathname),
    label: nav.links[item.label],
    icon: item.icon,
  }))

  useEffect(() => {
    if (!isMenuOpen) return
    function handlePointerDown(event: PointerEvent) {
      const target = event.target as Node
      if (menuPanelRef.current?.contains(target) || menuToggleRef.current?.contains(target)) return
      setIsMenuOpen(false)
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return
      setIsMenuOpen(false)
      menuToggleRef.current?.focus()
    }
    document.addEventListener("pointerdown", handlePointerDown)
    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [isMenuOpen])

  const closeMenu = () => setIsMenuOpen(false)

  return (
    <header className="df df-top">
      <div className="df-wrap">
        <nav className="df-nav" aria-label={nav.desktopLabel}>
          <a
            href={pathname === "/" ? "#top" : "/"}
            onClick={pathname === "/" ? smoothScrollToTop : undefined}
            aria-label={nav.home}
            className="df-wordmark"
          >
            {/* Not `.df-logo`: that class sets display:block, which would show both the light and dark artwork. */}
            <Wordmark className="df-navlogo" />
          </a>

          <ul className="df-nav__links">
            {navItems.map((item) => (
              <li key={item.key}>
                <NavLink href={item.href} label={item.label} icon={item.icon} />
              </li>
            ))}
          </ul>

          <div className="df-nav__end">
            <LanguagePill />
            {/* Text size, light/dark, high contrast and calm mode; its panel opens under this button. */}
            <AccessibilityMenu />
            {user ? (
              <>
                <ProfileLink />
                <AuthNavActions hideAccount className="df-nav__login" />
              </>
            ) : (
              <>
                <Link href={APP_ROUTES.login} className="df-btn df-btn--ghost df-nav__login">
                  <span>{t.auth.nav.login}</span>
                </Link>
                <Link href={APP_ROUTES.signup} className="df-btn df-btn--primary df-nav__cta">
                  <span>{t.auth.nav.signup}</span>
                </Link>
              </>
            )}
            <button
              ref={menuToggleRef}
              type="button"
              className="df-btn df-btn--soft df-btn--icon df-nav__menu"
              onClick={() => setIsMenuOpen((open) => !open)}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-nav"
              aria-label={isMenuOpen ? nav.closeMenu : nav.openMenu}
            >
              <DfIcon name={isMenuOpen ? "x" : "menu"} size={22} />
            </button>
          </div>

          {isMenuOpen ? (
            <div ref={menuPanelRef} id="mobile-nav" className="df-nav__drawer">
              <ul aria-label={nav.mobileLabel}>
                {navItems.map((item) => (
                  <li key={item.key}>
                    <NavLink
                      href={item.href}
                      label={item.label}
                      icon={item.icon}
                      onClick={closeMenu}
                    />
                  </li>
                ))}
              </ul>
              <div className="df-nav__drawer-ctas">
                {user ? (
                  <>
                    <Link href={APP_ROUTES.profile} onClick={closeMenu} className="df-btn df-btn--outline">
                      <DfIcon name="user" size={20} />
                      <span>{t.profile.hub.tabs.profile.label}</span>
                    </Link>
                    <AuthNavActions hideAccount />
                  </>
                ) : (
                  <>
                    <Link href={APP_ROUTES.login} onClick={closeMenu} className="df-btn df-btn--outline">
                      <span>{t.auth.nav.login}</span>
                    </Link>
                    <Link href={APP_ROUTES.signup} onClick={closeMenu} className="df-btn df-btn--primary">
                      <span>{t.auth.nav.signup}</span>
                    </Link>
                  </>
                )}
              </div>
            </div>
          ) : null}
        </nav>
      </div>
    </header>
  )
}
