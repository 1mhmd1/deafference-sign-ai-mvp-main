"use client"

import { AboutUsDetails } from "./about-us"
import { SubpageShell } from "./subpage-shell"
import { SectionTransition } from "./ui/section-transition"

/** /about: everything about the team except "Our story", which stays on the home page. */
export function AboutPage() {
  return (
    <SubpageShell>
      <SectionTransition first>
        <AboutUsDetails />
      </SectionTransition>
    </SubpageShell>
  )
}
