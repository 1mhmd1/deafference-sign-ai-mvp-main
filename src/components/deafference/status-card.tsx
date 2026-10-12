"use client"

import { motion } from "framer-motion"
import { AlertTriangle, CheckCircle2, Hand, HelpCircle, Loader2, ScanLine, Video, type LucideIcon } from "lucide-react"
import { Card } from "@/components/ui/card"
import { JudyCharacter, type JudyMood, type JudyPose } from "@/components/judy/judy-character"
import { cn } from "@/lib/utils"
import { useI18n } from "@/i18n/use-i18n"

/**
 * Translation status. `camera-loading`, `ready` and `error` are driven by the
 * real camera today; `listening`, `low-confidence`, `no-hand` and `success`
 * can only occur once a hand-tracking/recognition model feeds data in (they're
 * previewable in dev via the settings & debug panel).
 */
export type RecognitionStatus =
  | "camera-loading"
  | "ready"
  | "listening"
  | "low-confidence"
  | "no-hand"
  | "error"
  | "success"

const STATUS_META: Record<
  RecognitionStatus,
  { icon: LucideIcon; tone: string; iconTone: string; pose: JudyPose; mood: JudyMood; spin?: boolean }
> = {
  "camera-loading": {
    icon: Loader2,
    tone: "border-border bg-muted/50",
    iconTone: "text-muted-foreground",
    pose: "idle",
    mood: "neutral",
    spin: true,
  },
  ready: { icon: Video, tone: "border-emerald-500/30 bg-emerald-500/8", iconTone: "text-emerald-600", pose: "wave", mood: "neutral" },
  listening: { icon: ScanLine, tone: "border-indicator-indigo/40 bg-indicator-indigo/10", iconTone: "text-indicator-indigo", pose: "listen", mood: "listen" },
  "low-confidence": { icon: HelpCircle, tone: "border-amber-500/40 bg-amber-500/10", iconTone: "text-amber-600", pose: "ponder", mood: "think" },
  "no-hand": { icon: Hand, tone: "border-amber-500/40 bg-amber-500/10", iconTone: "text-amber-600", pose: "point", mood: "neutral" },
  error: { icon: AlertTriangle, tone: "border-destructive/40 bg-destructive/8", iconTone: "text-destructive", pose: "idle", mood: "sad" },
  success: { icon: CheckCircle2, tone: "border-emerald-500/30 bg-emerald-500/8", iconTone: "text-emerald-600", pose: "cheer-loop", mood: "happy" },
}

export interface StatusCardProps {
  status: RecognitionStatus
  /** False while no recognition model is connected — `ready` then says so honestly. */
  recognitionConnected?: boolean
  /** Optional helper-text override (e.g. the specific camera error). */
  description?: string
}

export function StatusCard({ status, recognitionConnected = false, description }: StatusCardProps) {
  const { t } = useI18n()
  const states = t.app.status.states
  const meta = STATUS_META[status]
  const Icon = meta.icon

  const copy = {
    "camera-loading": states.cameraLoading,
    ready: recognitionConnected ? states.ready : states.readyNoRecognizer,
    listening: states.listening,
    "low-confidence": states.lowConfidence,
    "no-hand": states.noHand,
    error: states.error,
    success: states.success,
  }[status]

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut", delay: 0.05 }}
    >
      <Card className="p-5">
        <p className="text-sm font-bold tracking-[0.12em] text-[#1D4ED8] uppercase">{t.app.status.eyebrow}</p>
        <div className="mt-4 flex items-center gap-4">
          <div className="w-[72px] shrink-0" aria-hidden="true">
            <JudyCharacter inline size={72} pose={meta.pose} mood={meta.mood} announce={false} label={t.app.status.judyLabel} />
          </div>
          <div
            role="status"
            aria-live="polite"
            aria-atomic="true"
            data-status={status}
            className={cn("min-w-0 flex-1 rounded-2xl border px-4 py-3 text-start", meta.tone)}
          >
            <p className="flex items-center gap-2 text-base font-bold text-brand-navy sm:text-lg">
              <Icon className={cn("size-5 shrink-0", meta.iconTone, meta.spin && "animate-spin")} aria-hidden="true" />
              <span>{copy.title}</span>
            </p>
            <p className="mt-1.5 text-sm leading-6 text-muted-foreground">{description ?? copy.desc}</p>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
