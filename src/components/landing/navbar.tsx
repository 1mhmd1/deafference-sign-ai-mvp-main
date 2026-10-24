"use client"

import { useEffect, useRef, useState, type MouseEvent } from "react"
import { AnimatePresence, motion } from "framer-motion"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, UserCircle2, X } from "lucide-react"
import { Container } from "@/components/shared/container"
import { Wordmark } from "@/components/shared/wordmark"
import { LanguageToggle } from "@/components/shared/language-toggle"
import { APP_ROUTES } from "@/lib/constants"
import { cn } from "@/lib/utils"
import { useI18n } from "@/i18n/use-i18n"
import { AuthNavActions, initialsFor } from "@/components/auth/auth-nav-actions"
import { useAuth } from "@/components/auth/auth-provider"
import { useProfilePhoto } from "@/components/profile/profile-photo"
import { ThemeToggle } from "./theme-toggle"
import { resolveLandingHref, smoothScrollToTop } from "./nav-links"
import { focusRingPop } from "./ui/pop"
import type { LandingMessages } from "@/i18n/messages/landing"

// The navbar's own list and order (the footer keeps using LANDING_NAV from lib/constants).
// Hrefs go through resolveLandingHref: anchors point back to "/" off the home page, and
// #how-it-works opens /how-it-works.
const NAV_ITEMS: { href: string; label: keyof LandingMessages["nav"]["links"] }[] = [
  { href: "#top", label: "homeLink" },
  { href: "#about", label: "about" },
  { href: "#how-it-works", label: "howItWorks" },
  { href: "#scenarios", label: "scenarios" },
  { href: "#pricing", label: "pricing" },
]

function NavLink({
  href,
  label,
  onClick,
  onHover,
  isActive,
}: {
  href: string
  label: string
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void
  onHover?: (hovering: boolean) => void
  isActive?: boolean
}) {
  const className = cn(
    "relative z-10 block rounded-full px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors 2xl:px-4",
    isActive ? "text-black" : "text-foreground/65 hover:text-black",
    focusRingPop,
  )
  const props = {
    className,
    onClick,
    onMouseEnter: () => onHover?.(true),
    onMouseLeave: () => onHover?.(false),
  }
  return href.startsWith("#") ? (
    <a href={href} {...props}>
      {label}
    </a>
  ) : (
    <Link href={href} {...props}>
      {label}
    </Link>
  )
}

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [hovered, setHovered] = useState<string | null>(null)
  const menuPanelRef = useRef<HTMLDivElement>(null)
  const menuToggleRef = useRef<HTMLButtonElement>(null)
  const pathname = usePathname()
  const { t } = useI18n()
  const { user } = useAuth()
  const photo = useProfilePhoto()
  const nav = t.landing.nav
  const navItems = NAV_ITEMS.map((item) => ({
    key: item.href,
    href: resolveLandingHref(item.href, pathname),
    label: nav.links[item.label],
  }))
  // "#top" only appears on the home page itself (elsewhere Home and the logo link to "/").
  const topClick = (href: string) => (href === "#top" ? smoothScrollToTop : undefined)

  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 8)
    }
    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    if (!isMenuOpen) return

    function handlePointerDown(event: PointerEvent) {
      const target = event.target as Node
      if (menuPanelRef.current?.contains(target) || menuToggleRef.current?.contains(target)) return
      setIsMenuOpen(false)
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsMenuOpen(false)
        menuToggleRef.current?.focus()
      }
    }

    document.addEventListener("pointerdown", handlePointerDown)
    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [isMenuOpen])

  return (
    <motion.header
      initial={{ opacity: 0, y: -24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="pointer-events-none sticky top-0 z-50 flex justify-center px-3 pt-3 sm:px-4 sm:pt-4"
    >
      {/* Full width at all times: shrinking the pill on scroll made its contents overflow and overlap. */}
      <div
        className={cn(
          "pointer-events-auto w-full rounded-[1.75rem] transition-all duration-300",
          isScrolled ? "glass-pop shadow-[0_18px_50px_-28px_rgba(30,64,175,0.45)]" : "border border-transparent bg-transparent",
        )}
      >
        <Container fluid className="flex h-16 min-w-0 items-center justify-between gap-2 sm:h-[4.25rem] sm:gap-4">
          <a
            href={pathname === "/" ? "#top" : "/"}
            onClick={pathname === "/" ? smoothScrollToTop : undefined}
            aria-label={nav.home}
            className={cn("nav-logo flex shrink-0 items-center rounded-lg", focusRingPop)}
          >
            {/* Bigger logo with a warm glow behind the ear, a glint that sweeps across the
                letters every few seconds (masked to the logo's shape) and a lift on hover.
                Styles in landing.css (.nav-logo-*). */}
            <span className="relative inline-flex">
              <span aria-hidden="true" className="nav-logo-glow" />
              <Wordmark className="nav-logo-img relative h-10 min-[380px]:h-12 sm:h-14 lg:h-[3.75rem]" />
              <span aria-hidden="true" className="nav-logo-shine" />
            </span>
          </a>

          <nav aria-label={nav.desktopLabel} className="hidden min-w-0 xl:block">
            <ul className="relative flex items-center gap-0.5 rounded-full border border-[color:var(--primary)]/12 bg-white/50 p-1">
              {navItems.map((item) => (
                <li key={item.key} className="relative">
                  {hovered === item.href && (
                    <motion.span
                      layoutId="nav-hover-indicator"
                      className="absolute inset-0 rounded-full bg-[color:var(--primary)]/12"
                      transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    />
                  )}
                  <NavLink
                    href={item.href}
                    label={item.label}
                    onClick={topClick(item.href)}
                    isActive={hovered === item.href}
                    onHover={(hovering) =>
                      setHovered((prev) => {
                        if (hovering) return item.href
                        return prev === item.href ? null : prev
                      })
                    }
                  />
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex shrink-0 items-center gap-1.5 min-[380px]:gap-2 sm:gap-3">
            <div className="hidden items-center gap-2 xl:flex">
              <ThemeToggle />
              <LanguageToggle />
            </div>


            <LanguageToggle className="xl:hidden" />

            <AuthNavActions hideAccount className="hidden xl:flex" signupClassName="border border-[color:var(--primary)]/20 bg-white font-semibold text-[#1D4ED8] shadow-sm [a]:hover:bg-[#EFF6FF]" />

            <Link
              href={APP_ROUTES.profile}
              aria-label={user ? `${user.name || user.email}, ${t.profile.hub.tabs.profile.label}` : t.profile.hub.tabs.profile.label}
              title={t.profile.hub.tabs.profile.label}
              className={cn(
                "inline-flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[color:var(--primary)]/20 bg-white/80 text-black transition-colors hover:bg-[color:var(--primary)]/10",
                focusRingPop,
              )}
            >
              {/* The profile picture from /profile when there is one; otherwise initials, or the icon when signed out. */}
              {photo ? (
                <img src={photo} alt="" className="size-full object-cover" />
              ) : user ? (
                <span aria-hidden="true" className="text-xs font-bold text-[color:var(--primary)]">
                  {initialsFor(user.name, user.email)}
                </span>
              ) : (
                <UserCircle2 className="size-5" aria-hidden="true" />
              )}
            </Link>

            <button
              ref={menuToggleRef}
              type="button"
              onClick={() => setIsMenuOpen((open) => !open)}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-nav"
              aria-label={isMenuOpen ? nav.closeMenu : nav.openMenu}
              className={cn(
                "inline-flex size-11 items-center justify-center rounded-full text-black transition-colors hover:bg-[color:var(--primary)]/10 xl:hidden",
                focusRingPop,
              )}
            >
              {isMenuOpen ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
            </button>
          </div>
        </Container>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            ref={menuPanelRef}
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="glass-pop pointer-events-auto absolute inset-x-3 top-[4.75rem] rounded-3xl p-2 shadow-[0_24px_60px_-24px_rgba(30,64,175,0.5)] xl:hidden"
          >
            <Container fluid className="py-2">
              <nav id="mobile-nav" aria-label={nav.mobileLabel}>
                <ul className="flex flex-col gap-1">
                  {navItems.map((item, i) => (
                    <motion.li
                      key={item.key}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.25, delay: i * 0.05 }}
                    >
                      <NavLink
                        href={item.href}
                        label={item.label}
                        onClick={(event) => {
                          topClick(item.href)?.(event)
                          setIsMenuOpen(false)
                        }}
                      />
                    </motion.li>
                  ))}
                </ul>
              </nav>

              <div className="mt-3 flex flex-col gap-3 border-t border-[color:var(--primary)]/12 pt-3">
                <ThemeToggle className="self-start" />
                <AuthNavActions hideAccount className="self-start" signupClassName="border border-[color:var(--primary)]/20 bg-white font-semibold text-[#1D4ED8] shadow-sm [a]:hover:bg-[#EFF6FF]" />
              </div>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}

