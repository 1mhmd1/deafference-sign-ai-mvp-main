"use client"

import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react"
import { motion } from "framer-motion"
import { Check, Copy, Hourglass, Languages, PlugZap, Volume2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import { useI18n } from "@/i18n/use-i18n"
import { getServerSnapshot, getSnapshot, speak, subscribe } from "@/lib/speech"
import { useCameraPreferences } from "./camera-preferences"

export interface TranslationPanelProps {
  /** Running transcript produced by the recognizer. Empty until a model is connected. */
  transcript?: string
  /** Recognizer confidence for the latest result, 0–1. `null`/undefined → shown as unavailable. */
  confidence?: number | null
  /** Whether a recognition model is connected at all. */
  recognitionConnected?: boolean
}

export function TranslationPanel({ transcript = "", confidence = null, recognitionConnected = false }: TranslationPanelProps) {
  const { t, locale } = useI18n()
  const copy = t.app.translation
  const [prefs, setPref] = useCameraPreferences()
  const speech = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">("idle")
  const speakLabelId = useId()

  const text = transcript.trim()
  const hasText = text.length > 0
  const chip = !recognitionConnected ? "notConnected" : hasText ? "live" : "waiting"
  const ChipIcon = chip === "notConnected" ? PlugZap : chip === "live" ? Languages : Hourglass

  // Auto-speak only the newly appended part of the transcript.
  const spokenRef = useRef(text)
  useEffect(() => {
    const previous = spokenRef.current
    spokenRef.current = text
    if (!prefs.speakOutLoud || !speech.supported || !text || text === previous) return
    const delta = previous && text.startsWith(previous) ? text.slice(previous.length) : text
    if (delta.trim()) speak(delta)
  }, [text, prefs.speakOutLoud, speech.supported])

  useEffect(() => {
    if (copyState === "idle") return
    const id = window.setTimeout(() => setCopyState("idle"), 2500)
    return () => window.clearTimeout(id)
  }, [copyState])

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text)
      setCopyState("copied")
    } catch {
      setCopyState("failed")
    }
  }

  const confidencePct = typeof confidence === "number" ? Math.round(Math.min(1, Math.max(0, confidence)) * 100) : null

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: "easeOut", delay: 0.08 }}
    >
      <Card className="p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-bold tracking-[0.12em] text-[#1D4ED8] uppercase">{copy.eyebrow}</p>
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold",
              chip === "notConnected"
                ? "bg-amber-500/12 text-amber-800 dark:text-amber-300"
                : chip === "live"
                  ? "bg-emerald-500/12 text-emerald-700 dark:text-emerald-300"
                  : "bg-muted text-muted-foreground",
            )}
          >
            <ChipIcon className="size-3.5" aria-hidden="true" />
            {copy.chips[chip]}
          </span>
        </div>

        <div
          role="log"
          aria-live="polite"
          aria-label={copy.transcriptLabel}
          className={cn(
            "mt-5 flex min-h-[13rem] flex-col justify-center rounded-3xl border bg-white/70 px-5 py-6",
            hasText ? "border-[color:var(--primary)]/20 text-start" : "items-center border-dashed border-[color:var(--primary)]/25 text-center",
          )}
        >
          {hasText ? (
            <p className="text-3xl leading-tight font-bold tracking-tight text-brand-navy sm:text-4xl" lang={locale}>
              {text}
            </p>
          ) : (
            <>
              <p className="text-lg font-bold text-brand-navy">
                {recognitionConnected ? copy.emptyWaiting : copy.emptyNotConnected}
              </p>
              <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
                {recognitionConnected ? copy.emptyWaitingDesc : copy.emptyNotConnectedDesc}
              </p>
            </>
          )}
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            {copy.confidence}:{" "}
            {confidencePct === null ? (
              <span className="font-semibold text-foreground">
                <span aria-hidden="true">—</span>
                <span className="sr-only">{copy.confidenceUnavailable}</span>
              </span>
            ) : (
              <span className="font-semibold text-foreground" dir="ltr">
                {confidencePct}%
              </span>
            )}
          </p>
          <div className="flex items-center gap-2">
            <span className="sr-only" aria-live="polite">
              {copyState === "copied" ? copy.copied : copyState === "failed" ? copy.copyFailed : ""}
            </span>
            <Button variant="outline" className="h-10 rounded-full px-4" onClick={handleCopy} disabled={!hasText}>
              {copyState === "copied" ? <Check className="size-4" aria-hidden="true" /> : <Copy className="size-4" aria-hidden="true" />}
              {copyState === "copied" ? copy.copied : copy.copy}
            </Button>
          </div>
        </div>
        {copyState === "failed" ? <p className="mt-2 text-xs text-destructive">{copy.copyFailed}</p> : null}

        <div className="mt-4 flex items-start justify-between gap-4 border-t border-border pt-4">
          <div className="flex items-start gap-3">
            <Volume2 className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
            <div>
              <p id={speakLabelId} className="text-sm font-semibold text-foreground">
                {copy.speakToggle}
              </p>
              <p className="text-xs text-muted-foreground">
                {speech.supported ? copy.speakDesc : copy.speakUnsupported}
              </p>
            </div>
          </div>
          <div className={cn("flex min-h-10 items-center", !speech.supported && "pointer-events-none opacity-50")}>
            <Switch
              labelledBy={speakLabelId}
              checked={prefs.speakOutLoud && speech.supported}
              onChange={(value) => setPref("speakOutLoud", value)}
            />
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
