"use client"

import { HowItWorksBody } from "./pages/how-it-works"
import { SubpageShell } from "./subpage-shell"

/**
 * /how-it-works: the product explained (steps both ways, the four directions, performance), opened
 * from the navbar. Privacy & security has its own page, /security.
 */
export function HowItWorksPage() {
  return (
    <SubpageShell>
      <HowItWorksBody />
    </SubpageShell>
  )
}
