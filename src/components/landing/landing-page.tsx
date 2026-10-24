"use client"

import { Navbar } from "./navbar"
import { Hero } from "./hero"
import { AboutUs } from "./about-us"
import { WhyChooseUs } from "./why-choose-us"
import { Scenarios } from "./scenarios"
import { DemoCenter } from "./demo-center"
import { Pricing } from "./pricing"
import { FAQ } from "./faq"
import { Contact } from "./contact"
import { LiveAppCta } from "./live-app-cta"
import { Footer } from "./footer"
import { useI18n } from "@/i18n/use-i18n"
import { cn } from "@/lib/utils"
import { CalmModeProvider, useCalmMode } from "./calm-mode"
import { SectionTransition } from "./ui/section-transition"
import "./landing.css"

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
    <div className={cn("landing-pop landing-home relative min-h-dvh bg-background text-foreground", calm && "reduce-motion")}>
      {/* First focusable element: lets keyboard users jump past the navbar. */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-[#1D4ED8] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
      >
        {t.landing.nav.skipLink}
      </a>
      <div aria-hidden="true" className="pop-particles pointer-events-none fixed inset-0 z-0 opacity-0" />
      <Navbar />
      {/* Story order: Judy's everyday scenarios → tutorials → the team → pricing → questions →
          contact → why choose us → open the live app. How it works, features, performance and
          privacy live on their own page (/how-it-works). */}
      <main id="main-content" tabIndex={-1} className="relative z-10 outline-none">
        <SectionTransition first>
          <Hero />
        </SectionTransition>
        <SectionTransition>
          <Scenarios />
        </SectionTransition>
        <SectionTransition>
          <DemoCenter />
        </SectionTransition>
        <SectionTransition>
          <AboutUs />
        </SectionTransition>
        <SectionTransition>
          <Pricing />
        </SectionTransition>
        <SectionTransition>
          <FAQ />
        </SectionTransition>
        <SectionTransition>
          <Contact />
        </SectionTransition>
        <SectionTransition>
          <WhyChooseUs />
        </SectionTransition>
        <SectionTransition>
          <LiveAppCta />
        </SectionTransition>
      </main>
      <Footer />
    </div>
  )
}

