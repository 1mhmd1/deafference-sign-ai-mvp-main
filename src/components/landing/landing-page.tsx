"use client"

import { Navbar } from "./navbar"
import { Scenarios } from "./scenarios"
import { Footer } from "./footer"
import { DfHero } from "./home/df-hero"
import { DfHow } from "./home/df-how"
import { DfSos } from "./home/df-sos"
import { DfExplore, DfVideos } from "./home/df-sections"
import { DfWhy } from "./home/df-why"
import { DfApp } from "./home/df-app"
import { landingFonts } from "./home/fonts"
import { useI18n } from "@/i18n/use-i18n"
import { cn } from "@/lib/utils"
import { CalmModeProvider, useCalmMode } from "./calm-mode"
import "./landing.css"
import "./home/df.css"

export function LandingPage() {
  return (
    <CalmModeProvider>
      <LandingContent />
    </CalmModeProvider>
  )
}

function LandingContent() {
  const { t } = useI18n()
  const calm = useCalmMode()?.calm ?? false

  return (
    <div className={cn("landing-pop landing-home relative min-h-dvh bg-background text-foreground", landingFonts, calm && "reduce-motion")}>
      {/* First focusable element: lets keyboard users jump past the navbar. */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-[#B01030] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
      >
        {t.landing.nav.skipLink}
      </a>
      <Navbar />
      {/* The website design's order (home/): hero → how it works → Judy's scenarios → emergency
          phrases → tutorials → links to pricing, questions, security and contact → why
          choose us → open the app. The scenarios map and Judy are the site's own. */}
      <main id="main-content" tabIndex={-1} className="relative z-10 outline-none">
        <DfHero />
        <DfHow />
        <Scenarios />
        <DfSos />
        <DfVideos />
        <DfExplore />
        <DfWhy />
        <DfApp />
      </main>
      <Footer />
    </div>
  )
}
