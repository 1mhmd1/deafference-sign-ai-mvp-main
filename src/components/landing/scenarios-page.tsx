"use client"

import { ScenariosBody } from "./pages/scenarios"
import { SubpageShell } from "./subpage-shell"

/** /scenarios: the everyday places where Deafference helps, with Judy's walk through them. */
export function ScenariosPage() {
  return (
    <SubpageShell>
      <ScenariosBody />
    </SubpageShell>
  )
}
