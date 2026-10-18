"use client"

import { useState } from "react"
import { RotateCcw, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSettings } from "@/components/deafference/settings-provider"
import { useI18n } from "@/i18n/use-i18n"

type Feedback = "saved" | "resetDone" | null

export function SettingsSaveBar() {
  const { save, reset, isDirty } = useSettings()
  const { t } = useI18n()
  const m = t.settings.saveBar
  // Store a key (not the string) so the message follows a language switch.
  const [feedback, setFeedback] = useState<Feedback>(null)

  function announce(next: Exclude<Feedback, null>) {
    setFeedback(next)
    window.setTimeout(() => setFeedback((current) => (current === next ? null : current)), 3000)
  }

  function handleSave() {
    save()
    announce("saved")
  }

  function handleReset() {
    reset()
    announce("resetDone")
  }

  return (
    <div className="sticky bottom-0 z-10 -mx-4 border-t border-border bg-background/95 px-4 pt-4 pb-24 backdrop-blur sm:-mx-6 sm:px-6 sm:pb-4 sm:pe-72 lg:-mx-8 lg:px-8 lg:pe-80">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p role="status" aria-live="polite" className="text-sm text-muted-foreground">
          {feedback ? m[feedback] : isDirty ? m.unsaved : m.allSaved}
        </p>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" className="h-10 px-4" onClick={handleReset}>
            <RotateCcw className="size-4" aria-hidden="true" />
            {m.reset}
          </Button>
          <Button type="button" className="h-10 px-4" onClick={handleSave} disabled={!isDirty}>
            <Save className="size-4" aria-hidden="true" />
            {m.save}
          </Button>
        </div>
      </div>
    </div>
  )
}
