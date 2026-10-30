"use client"

import { ContactBody } from "./pages/contact"
import { SubpageShell } from "./subpage-shell"

/** /contact: the full contact form and channels (moved off the home page). Accepts ?topic=. */
export function ContactPage() {
  return (
    <SubpageShell>
      <ContactBody />
    </SubpageShell>
  )
}
