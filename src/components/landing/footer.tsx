"use client"

import type { MouseEvent, ReactNode } from "react"
import { motion } from "framer-motion"
import { usePathname } from "next/navigation"
import { ArrowUp, Mail } from "lucide-react"
import { Container } from "@/components/shared/container"
import { FOOTER_EXPLORE_NAV, FOOTER_COMPANY_NAV } from "@/lib/constants"
import { cn } from "@/lib/utils"
import { useI18n } from "@/i18n/use-i18n"
import { navLabel, resolveLandingHref, smoothScrollToTop } from "./nav-links"
import { focusRingPop } from "./ui/pop"

const CONTACT_EMAIL = "fatima@deafference.com"

function FooterLink({ href, children, onClick }: { href: string; children: ReactNode; onClick?: (event: MouseEvent<HTMLAnchorElement>) => void }) {
  return (
    <a
      href={href}
      onClick={onClick}
      className={cn(
        "group relative inline-flex w-fit items-center gap-2 rounded-sm text-[15px] text-foreground/75 transition-all duration-200 hover:translate-x-0.5 hover:text-[#1D4ED8] rtl:hover:-translate-x-0.5 dark:hover:text-[#93C5FD]",
        focusRingPop,
      )}
    >
      {children}
      <span
        aria-hidden="true"
        className="absolute -bottom-0.5 start-0 h-px w-0 bg-[color:var(--primary)] transition-all duration-300 group-hover:w-full"
      />
    </a>
  )
}

/** Column heading with a short blue→orange brand rule in front of it. */
function FooterHeading({ children }: { children: ReactNode }) {
  return (
    <h2 className="flex items-center gap-2.5 text-xs font-semibold tracking-[0.2em] text-foreground uppercase">
      <span aria-hidden="true" className="h-0.5 w-5 rounded-full bg-gradient-to-r from-[#2563EB] to-[#F47C20] rtl:bg-gradient-to-l" />
      {children}
    </h2>
  )
}

/** Rounded "pill" link used for the email in the brand block. */
function FooterPill({ href, children, dir }: { href: string; children: ReactNode; dir?: "ltr" }) {
  return (
    <a
      href={href}
      dir={dir}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-[#3b82f6]/20 bg-white/80 px-4 py-2 text-sm font-medium text-foreground shadow-[0_8px_24px_-18px_rgba(37,99,235,0.6)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#F47C20]/50 dark:bg-white/5",
        focusRingPop,
      )}
    >
      {children}
    </a>
  )
}

export function Footer() {
  const { t, fmt } = useI18n()
  const copy = t.landing.footer
  const links = t.landing.nav.links
  const pathname = usePathname()

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      // Full-width footer flush with the bottom of the page. On phones the bottom strip is a bit taller
      // so the bottom bar sits above the fixed Judy / Emergency circles.
      className="relative z-10 overflow-hidden border-t border-[#3b82f6]/10 bg-[#F8FAFF] pt-16 pb-24 sm:pt-20 sm:pb-0 dark:border-[#60a5fa]/15 dark:bg-[#0B1220]"
    >
      {/* Brand gradient along the top edge */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#2563EB] via-[#57A4F9] to-[#F47C20] rtl:bg-gradient-to-l"
      />

      <Container fluid className="relative">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            {/* Same light/dark wordmarks as <Logo />, sized up for the footer. */}
            <span className="inline-flex items-center">
              <img src="/deafference-logo-transparent.png" alt="Deafference" className="h-14 w-auto object-contain sm:h-16 dark:hidden" />
              <img src="/deafference-logo-transparent-dark.png" alt="Deafference" className="hidden h-14 w-auto object-contain sm:h-16 dark:block" />
            </span>
            <p className="mt-5 max-w-md text-[15px] leading-7 text-foreground/80">{copy.tagline}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <FooterPill href={`mailto:${CONTACT_EMAIL}`} dir="ltr">
                <Mail className="size-4 text-[#2563EB]" aria-hidden="true" />
                {CONTACT_EMAIL}
              </FooterPill>
            </div>
          </div>

          <div className="grid gap-10 sm:grid-cols-4 lg:col-span-7">
            <div className="sm:col-span-2">
              <FooterHeading>{copy.explore}</FooterHeading>
              <nav aria-label={copy.explore} className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3.5">
                {FOOTER_EXPLORE_NAV.map((item) => (
                  <FooterLink key={item.href} href={resolveLandingHref(item.href, pathname)}>
                    {navLabel(links, item.href, item.label)}
                  </FooterLink>
                ))}
              </nav>
            </div>

            <div>
              <FooterHeading>{copy.company}</FooterHeading>
              <nav aria-label={copy.company} className="mt-5 flex flex-col gap-3.5">
                {FOOTER_COMPANY_NAV.map((item) => (
                  <FooterLink key={item.href} href={resolveLandingHref(item.href, pathname)}>
                    {navLabel(links, item.href, item.label)}
                  </FooterLink>
                ))}
              </nav>
            </div>

            <div>
              <FooterHeading>{copy.contactHeading}</FooterHeading>
              <div className="mt-5 flex flex-col gap-3.5">
                <FooterLink href={`mailto:${CONTACT_EMAIL}`}>
                  <Mail className="size-4" aria-hidden="true" />
                  {copy.email}
                </FooterLink>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar: centered on desktop (clear of the walking Judy on the left and the circles on the
            right); on phones it hugs the end side, above the circles. */}
        <div className="mt-12 flex items-center justify-end gap-3 border-t border-[#3b82f6]/10 py-6 sm:justify-center sm:gap-8 dark:border-[#60a5fa]/15">
          <p className="text-xs text-foreground/70">{fmt(copy.rights, { year: new Date().getFullYear() })}</p>
          {/* Back to top of whichever page you're on, gliding up. */}
          <a
            href="#top"
            onClick={smoothScrollToTop}
            className={cn(
              "group inline-flex items-center gap-2.5 rounded-full text-sm font-medium text-foreground/80 transition-colors hover:text-[#1D4ED8] dark:hover:text-[#93C5FD]",
              focusRingPop,
            )}
          >
            {/* Phones show just the round arrow so it stays on the copyright line. */}
            <span className="max-sm:sr-only">{copy.backToTop}</span>
            <span className="grid size-9 shrink-0 place-items-center rounded-full border border-[#3b82f6]/20 bg-white/80 shadow-[0_8px_20px_-14px_rgba(37,99,235,0.7)] transition-transform duration-200 group-hover:-translate-y-0.5 dark:bg-white/5">
              <ArrowUp className="size-4" aria-hidden="true" />
            </span>
          </a>
        </div>
      </Container>
    </motion.footer>
  )
}
