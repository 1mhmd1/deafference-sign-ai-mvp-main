"use client"

import { AboutBody } from "./pages/about"
import { SubpageShell } from "./subpage-shell"

/** /about: everything about the team except "Our story", which stays on the home page. */
export function AboutPage() {
  return (
    <SubpageShell>
      <AboutBody />
    </SubpageShell>
  )
}
