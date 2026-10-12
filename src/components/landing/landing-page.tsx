"use client"

import { Navbar } from "./navbar"
import { Hero } from "./hero"
import { AboutUs } from "./about-us"
import { WhyChooseUs } from "./why-choose-us"
import { HowItWorksVisual } from "./how-it-works-visual"
import { Scenarios } from "./scenarios"
import { DemoCenter } from "./demo-center"
import { Features } from "./features"
import { Performance } from "./performance"
import { Pricing } from "./pricing"
import { PrivacyPolicy } from "./privacy-policy"
import { FAQ } from "./faq"
import { Contact } from "./contact"
import { CTA } from "./cta"
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
    <div className={cn("landing-pop relative min-h-dvh bg-background text-foreground", calm && "reduce-motion")}>
      {/* First focusable element: lets keyboard users jump past the navbar. */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-[#1D4ED8] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
      >
        {t.landing.nav.skipLink}
      </a>
      <div aria-hidden="true" className="pop-particles pointer-events-none fixed inset-0 z-0 opacity-0" />
      <Navbar />
      {/* Story order: the problem → how it works → Judy's everyday scenarios → try it →
          what it does → trust (performance, team) → pricing → privacy → questions → contact. */}
      <main id="main-content" tabIndex={-1} className="relative z-10 outline-none">
        <SectionTransition first>
          <Hero />
        </SectionTransition>
        <SectionTransition>
          <WhyChooseUs />
        </SectionTransition>
        <SectionTransition>
          <HowItWorksVisual />
        </SectionTransition>
        <SectionTransition>
          <Scenarios />
        </SectionTransition>
        <SectionTransition>
          <DemoCenter />
        </SectionTransition>
        <SectionTransition>
          <Features />
        </SectionTransition>
        <SectionTransition>
          <Performance />
        </SectionTransition>
        <SectionTransition>
          <AboutUs />
        </SectionTransition>
        <SectionTransition>
          <Pricing />
        </SectionTransition>
        <SectionTransition>
          <PrivacyPolicy />
        </SectionTransition>
        <SectionTransition>
          <FAQ />
        </SectionTransition>
        <SectionTransition>
          <Contact />
        </SectionTransition>
        <SectionTransition>
          <CTA />
        </SectionTransition>
      </main>
      <Footer />
    </div>
  )
}

