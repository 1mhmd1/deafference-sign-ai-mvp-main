"use client"

import { SecurityBody } from "./pages/security"
import { SubpageShell } from "./subpage-shell"

/** /security: how conversations and data are protected (moved here from /how-it-works). */
export function SecurityPage() {
  return (
    <SubpageShell>
      <SecurityBody />
    </SubpageShell>
  )
}
