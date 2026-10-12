"use client"

import { Settings2, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/i18n/use-i18n"

/** Camera/debug settings and accessibility buttons for the sign workspace (the page title lives in TranslateHeader). */
export function WorkspaceTools({
  onOpenAccessibility,
  onOpenSettings,
}: {
  onOpenAccessibility: () => void
  onOpenSettings: () => void
}) {
  const { t } = useI18n()
  const copy = t.app.header

  return (
    <div className="flex shrink-0 items-center gap-2">
      <Button variant="outline" size="icon" className="size-12 rounded-full bg-white/70" aria-label={copy.openSettings} title={copy.openSettings} onClick={onOpenSettings}>
        <Settings2 className="size-4" aria-hidden="true" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="size-12 rounded-full bg-white/70"
        aria-label={copy.openAccessibility}
        title={copy.openAccessibility}
        onClick={onOpenAccessibility}
      >
        <ShieldCheck className="size-4" aria-hidden="true" />
      </Button>
    </div>
  )
}
