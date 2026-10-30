"use client"

import { useEffect, useId, useState } from "react"
import { Activity, Gauge, Info, ListChecks, Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { useI18n } from "@/i18n/use-i18n"
import { CameraSettingsCard } from "./camera-settings"
import type { RecognitionStatus } from "./status-card"

const IS_DEV = process.env.NODE_ENV !== "production"

const PREVIEW_STATUSES: RecognitionStatus[] = [
  "camera-loading",
  "ready",
  "listening",
  "low-confidence",
  "no-hand",
  "error",
  "success",
]

function PreviewOnlyNote({ text }: { text: string }) {
  return (
    <p className="mt-2 flex items-start gap-1.5 text-xs text-amber-700 dark:text-amber-400">
      <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
      <span>{text}</span>
    </p>
  )
}

export function SettingsDebugPanel({
  open,
  onClose,
  statusPreview = null,
  onStatusPreviewChange,
}: {
  open: boolean
  onClose: () => void
  /** Dev-only: forces the status card into a given state for visual QA. */
  statusPreview?: RecognitionStatus | null
  onStatusPreviewChange?: (status: RecognitionStatus | null) => void
}) {
  const { t } = useI18n()
  const copy = t.app.debug
  const [confidence, setConfidence] = useState(80)
  const [query, setQuery] = useState("")
  const titleId = useId()
  const previewId = useId()

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
    }
    if (open) document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [open, onClose])

  const words = copy.words.filter((word) => word.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()))

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm transition-opacity",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        id="settings-debug"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        inert={!open}
        className={cn(
          "fixed inset-y-0 end-0 z-50 flex w-full max-w-md flex-col bg-card transition-transform duration-300 ease-out",
          open ? "translate-x-0 shadow-2xl" : "translate-x-full rtl:-translate-x-full shadow-none",
        )}
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div className="text-start">
            <h2 id={titleId} className="text-lg font-semibold">
              {copy.title}
            </h2>
            <p className="text-xs text-muted-foreground">{copy.subtitle}</p>
          </div>
          <Button variant="ghost" size="icon" className="size-10" aria-label={copy.close} onClick={onClose}>
            <X aria-hidden="true" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-2">
          <div className="divide-y divide-border">
            <section className="py-5">
              <CameraSettingsCard bare />
            </section>

            {/* Confidence threshold (no recognizer consumes it yet) */}
            <section className="py-5">
              <div className="flex items-center gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground" aria-hidden="true">
                  <Gauge className="size-4" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-foreground">{copy.confidence}</p>
                  <p className="text-xs text-muted-foreground">{copy.confidenceDesc}</p>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between" dir="ltr">
                  <span className="text-xs text-muted-foreground">0%</span>
                  <span className="text-sm font-semibold text-foreground">{confidence}%</span>
                  <span className="text-xs text-muted-foreground">100%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={1}
                  value={confidence}
                  onChange={(e) => setConfidence(Number(e.target.value))}
                  aria-label={copy.confidence}
                  dir="ltr"
                  // A 24px-tall touch area with the same thin 8px track painted across its middle.
                  className="mt-1 h-6 w-full cursor-pointer appearance-none rounded-full bg-[linear-gradient(var(--muted),var(--muted))] bg-[length:100%_0.5rem] bg-center bg-no-repeat accent-primary"
                />
                <PreviewOnlyNote text={copy.previewOnly} />
              </div>
            </section>

            {/* Vocabulary list */}
            <section className="py-5">
              <div className="flex items-center gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground" aria-hidden="true">
                  <ListChecks className="size-4" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-foreground">{copy.vocabulary}</p>
                  <p className="text-xs text-muted-foreground">{copy.vocabularyDesc}</p>
                </div>
              </div>

              <div className="relative mt-3">
                <Search className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                <Input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={copy.searchVocabulary}
                  aria-label={copy.searchVocabulary}
                  className="ps-9"
                />
              </div>

              <ul className="mt-3 max-h-48 space-y-1 overflow-y-auto rounded-2xl border border-border bg-background/60 p-2">
                {words.length === 0 ? (
                  <li className="px-3 py-2 text-sm text-muted-foreground">{copy.noMatches}</li>
                ) : (
                  words.map((word) => (
                    <li key={word} className="rounded-xl px-3 py-2 text-sm text-foreground">
                      {word}
                    </li>
                  ))
                )}
              </ul>
            </section>

            {/* Dev-only status preview */}
            {IS_DEV && onStatusPreviewChange ? (
              <section className="py-5">
                <div className="flex items-center gap-3">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground" aria-hidden="true">
                    <Activity className="size-4" />
                  </span>
                  <div>
                    <label htmlFor={previewId} className="text-sm font-semibold text-foreground">
                      {copy.statusPreview}
                    </label>
                    <p className="text-xs text-muted-foreground">{copy.statusPreviewDesc}</p>
                  </div>
                </div>
                <Select
                  id={previewId}
                  className="mt-3"
                  value={statusPreview ?? ""}
                  onChange={(e) => onStatusPreviewChange((e.target.value || null) as RecognitionStatus | null)}
                >
                  <option value="">{copy.statusPreviewLive}</option>
                  {PREVIEW_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </Select>
              </section>
            ) : null}
          </div>
        </div>
      </aside>
    </>
  )
}
