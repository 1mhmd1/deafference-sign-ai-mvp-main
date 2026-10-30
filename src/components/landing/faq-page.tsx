"use client"

import { FaqBody } from "./pages/faq"
import { SubpageShell } from "./subpage-shell"

/** /faq: common questions, answered simply (moved off the home page). */
export function FaqPage() {
  return (
    <SubpageShell>
      <FaqBody />
    </SubpageShell>
  )
}
