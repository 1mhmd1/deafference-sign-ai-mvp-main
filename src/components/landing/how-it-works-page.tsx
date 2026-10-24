"use client"

import { HowItWorksVisual } from "./how-it-works-visual"
import { Features } from "./features"
import { Performance } from "./performance"
import { PrivacyPolicy } from "./privacy-policy"
import { SubpageShell } from "./subpage-shell"
import { SectionTransition } from "./ui/section-transition"

/** /how-it-works: the product explained (steps both ways, features, performance, privacy), opened from the navbar. */
export function HowItWorksPage() {
  return (
    <SubpageShell>
      <SectionTransition first>
        <HowItWorksVisual />
      </SectionTransition>
      <SectionTransition>
        <Features />
      </SectionTransition>
      <SectionTransition>
        <Performance />
      </SectionTransition>
      <SectionTransition>
        <PrivacyPolicy />
      </SectionTransition>
    </SubpageShell>
  )
}
