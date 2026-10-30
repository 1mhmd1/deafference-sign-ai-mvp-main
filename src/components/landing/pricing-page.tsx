"use client"

import { PricingBody } from "./pages/pricing"
import { SubpageShell } from "./subpage-shell"

/** /pricing: the plans, from personal use to hospital networks (moved off the home page). */
export function PricingPage() {
  return (
    <SubpageShell>
      <PricingBody />
    </SubpageShell>
  )
}
