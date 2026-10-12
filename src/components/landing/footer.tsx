"use client"

import type { ReactNode } from "react"
import { motion } from "framer-motion"
import { usePathname } from "next/navigation"
import { Accessibility, ArrowUp, Mail } from "lucide-react"
import { Container } from "@/components/shared/container"
import { FOOTER_EXPLORE_NAV, FOOTER_COMPANY_NAV } from "@/lib/constants"
import { Logo } from "@/components/deafference/logo"
import { cn } from "@/lib/utils"
import { useI18n } from "@/i18n/use-i18n"
import { navLabel, resolveLandingHref } from "./nav-links"
import { ConnectorPath, GlowOrb, focusRingPop } from "./ui/pop"

function FooterLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      className={cn(
        "group relative inline-flex w-fit items-center gap-2 rounded-sm text-sm text-black transition-all duration-200 hover:translate-x-0.5 hover:text-[#1D4ED8] rtl:hover:-translate-x-0.5",
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

export function Footer() {
  const { t, fmt } = useI18n()
  const copy = t.landing.footer
  const links = t.landing.nav.links
  const pathname = usePathname()

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="pop-atmosphere relative z-10 overflow-hidden border-t border-border/60 py-16 sm:py-20"
    >
      {/* Layered blue depth + a quiet animated connector, kept subtle for a footer */}
      <div className="pop-grid pointer-events-none absolute inset-0 opacity-40" aria-hidden="true" />
      <GlowOrb className="top-[-6rem] left-[10%] size-72 opacity-70" color="rgba(59,130,246,0.16)" />
      <GlowOrb className="right-[8%] bottom-[-8rem] size-80 opacity-70" color="rgba(167,180,255,0.18)" />
      <ConnectorPath
        d="M 0 30 C 200 -10, 420 80, 700 20"
        className="left-0 top-0 hidden h-24 w-full opacity-70 lg:block"
        delay={0.6}
      />

      <Container fluid className="relative grid gap-12 sm:grid-cols-3 lg:grid-cols-[1.3fr_auto_auto_auto] lg:items-start lg:gap-10">
        <div className="max-w-sm sm:col-span-3 lg:col-span-1">
          <Logo />
          <p className="mt-5 text-sm leading-7 text-black">{copy.tagline}</p>
        </div>

        <div>
          <h2 className="text-xs font-semibold tracking-[0.2em] text-foreground uppercase">{copy.explore}</h2>
          <nav aria-label={copy.explore} className="mt-5 flex flex-col gap-3.5">
            {FOOTER_EXPLORE_NAV.map((item) => (
              <FooterLink key={item.href} href={resolveLandingHref(item.href, pathname)}>
                {navLabel(links, item.href, item.label)}
              </FooterLink>
            ))}
          </nav>
        </div>

        <div>
          <h2 className="text-xs font-semibold tracking-[0.2em] text-foreground uppercase">{copy.company}</h2>
          <nav aria-label={copy.company} className="mt-5 flex flex-col gap-3.5">
            {FOOTER_COMPANY_NAV.map((item) => (
              <FooterLink key={item.href} href={resolveLandingHref(item.href, pathname)}>
                {navLabel(links, item.href, item.label)}
              </FooterLink>
            ))}
          </nav>
        </div>

        <div>
          <h2 className="text-xs font-semibold tracking-[0.2em] text-foreground uppercase">{copy.contactHeading}</h2>
          <div className="mt-5 flex flex-col gap-3.5">
            <FooterLink href="mailto:hello@deafference.ai">
              <Mail className="size-4" aria-hidden="true" />
              {copy.email}
            </FooterLink>
          </div>
        </div>
      </Container>

      <Container fluid className="relative mt-14">
        <section
          id="accessibility"
          aria-labelledby="accessibility-heading"
          className="glass-pop rounded-2xl p-5 sm:flex sm:items-start sm:gap-4 sm:p-6"
        >
          <Accessibility className="size-5 shrink-0 text-[#2563EB] max-sm:mb-3" aria-hidden="true" />
          <div>
            <h2 id="accessibility-heading" className="text-sm font-semibold text-foreground">
              {copy.a11yTitle}
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-black">{copy.a11yBody}</p>
            <p className="mt-2 text-sm leading-6 text-black">
              {copy.a11yContact}{" "}
              <a
                href="mailto:hello@deafference.ai"
                dir="ltr"
                className={cn("rounded-sm font-semibold text-[#1D4ED8] underline-offset-4 hover:underline", focusRingPop)}
              >
                hello@deafference.ai
              </a>
            </p>
          </div>
        </section>
      </Container>

      <Container fluid className="relative mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-[color:var(--primary)]/10 pt-6">
        <p className="text-xs text-black">{fmt(copy.rights, { year: new Date().getFullYear() })}</p>
        <FooterLink href={resolveLandingHref("#top", pathname)}>
          <ArrowUp className="size-4" aria-hidden="true" />
          {copy.backToTop}
        </FooterLink>
      </Container>
    </motion.footer>
  )
}

