"use client"

import type { ReactNode } from "react"
import { Navbar } from "./navbar"
import { Footer } from "./footer"
import { useI18n } from "@/i18n/use-i18n"
import { cn } from "@/lib/utils"
import { CalmModeProvider, useCalmMode } from "./calm-mode"
import { landingFonts } from "./home/fonts"
import "./landing.css"
import "./home/df.css"
import "./pages/pages.css"

/**
 * Shell for the landing's own pages (/how-it-works, /about, /pricing, /faq, /security, /contact,
 * /terms, /scenarios): same navbar, footer, page background and calm mode as the home page. Their
 * content (./pages) is drawn with the home page's design.
 */
export function SubpageShell({ children }: { children: ReactNode }) {
  return (
    <CalmModeProvider>
      <ShellContent>{children}</ShellContent>
    </CalmModeProvider>
  )
}

function ShellContent({ children }: { children: ReactNode }) {
  const { t } = useI18n()
  const calm = useCalmMode()?.calm ?? false

  return (
    // Same shell as the landing page (landing-home gives it the same page background).
    <div className={cn("landing-pop landing-home relative min-h-dvh bg-background text-foreground", landingFonts, calm && "reduce-motion")}>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-[#B01030] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
      >
        {t.landing.nav.skipLink}
      </a>
      <Navbar />
      <main id="main-content" tabIndex={-1} className="relative z-10 outline-none">
        {children}
      </main>
      <Footer />
    </div>
  )
}
