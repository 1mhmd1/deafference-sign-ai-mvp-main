"use client"

import { useEffect, useRef, useState, type RefObject } from "react"
import { AlertTriangle, CheckCircle2, Circle, Hand, Loader2, Maximize2, Mic, Pause, Play, RotateCcw, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useI18n } from "@/i18n/use-i18n"
import { JudyCharacter, type JudyMood, type JudyPose } from "@/components/judy/judy-character"
import { useMediaQuery, useReducedMotion } from "./hooks"
import type { Status } from "./data"
import type { PlaybackSpeed } from "./use-avatar-translator"

export const PLAYBACK_SPEEDS: PlaybackSpeed[] = [0.5, 0.75, 1]

/** Gestures Judy cycles through while "signing" — illustrative only, not real signs. */
const SIGNING_POSES: JudyPose[] = ["point", "wave", "dance", "twirl"]

function judyFor(status: Status, unitIndex: number, reduceMotion: boolean): { pose: JudyPose; mood?: JudyMood } {
  switch (status) {
    case "listening":
      return { pose: "listen" }
    case "understanding":
      return { pose: "ponder" }
    case "preparing":
      return { pose: "cute-think" }
    case "signing":
      return { pose: reduceMotion ? "point" : SIGNING_POSES[Math.max(0, unitIndex) % SIGNING_POSES.length] }
    case "complete":
      return { pose: "wave", mood: "happy" }
    case "error":
      return { pose: "idle", mood: "sad" }
    default:
      return { pose: "idle", mood: "happy" }
  }
}

/**
 * Scales/pauses Judy's CSS animations through the Web Animations API, so the
 * slow-motion and pause controls reach her without editing her files.
 */
function useAnimationPlayback(ref: RefObject<HTMLElement | null>, rate: number, paused: boolean, key: string) {
  useEffect(() => {
    const root = ref.current
    if (!root || typeof root.getAnimations !== "function") return
    const apply = () => {
      for (const animation of root.getAnimations({ subtree: true })) {
        animation.playbackRate = rate
        if (paused && animation.playState === "running") animation.pause()
        else if (!paused && animation.playState === "paused") animation.play()
      }
    }
    apply()
    // Pose changes start new CSS animations; catch them as they begin.
    root.addEventListener("animationstart", apply)
    return () => root.removeEventListener("animationstart", apply)
  }, [ref, rate, paused, key])
}

function StatusBadge({ status, paused }: { status: Status; paused: boolean }) {
  const { t } = useI18n()
  const labels = t.studio.status
  const shown = status === "signing" && paused ? "paused" : status
  const Icon =
    shown === "listening"
      ? Mic
      : shown === "understanding" || shown === "preparing"
        ? Loader2
        : shown === "signing"
          ? Hand
          : shown === "paused"
            ? Pause
            : shown === "complete"
              ? CheckCircle2
              : shown === "error"
                ? AlertTriangle
                : Circle
  const active = shown === "listening" || shown === "understanding" || shown === "preparing" || shown === "signing"
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold",
        shown === "complete"
          ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
          : shown === "error"
            ? "bg-destructive/10 text-destructive"
            : active
              ? "brand-gradient text-white"
              : "bg-muted text-muted-foreground",
      )}
    >
      <Icon className={cn("size-3.5", (shown === "understanding" || shown === "preparing") && "motion-safe:animate-spin")} aria-hidden="true" />
      {labels[shown]}
    </span>
  )
}

export function AvatarPreview({
  status,
  paused,
  phrase,
  units,
  unitIndex,
  progress,
  speed,
  errorTitle,
  errorBody,
  canReplay,
  onPlay,
  onPause,
  onReplay,
  onSpeedChange,
}: {
  status: Status
  paused: boolean
  /** Localised library phrase being signed ("" when none). */
  phrase: string
  units: string[]
  unitIndex: number
  progress: number
  speed: PlaybackSpeed
  errorTitle?: string
  errorBody?: string
  canReplay: boolean
  onPlay: () => void
  onPause: () => void
  onReplay: () => void
  onSpeedChange: (speed: PlaybackSpeed) => void
}) {
  const { t, fmt } = useI18n()
  const s = t.studio.avatar
  const [fullscreen, setFullscreen] = useState(false)
  const reduceMotion = useReducedMotion()
  const wide = useMediaQuery("(min-width: 640px)")
  const judyRef = useRef<HTMLDivElement>(null)
  const fullJudyRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  const signing = status === "signing"
  const { pose, mood } = judyFor(status, unitIndex, reduceMotion)
  const judyRate = signing ? speed : 1
  const judyPaused = signing && paused
  useAnimationPlayback(judyRef, judyRate, judyPaused, `${pose}-${fullscreen}`)
  useAnimationPlayback(fullJudyRef, judyRate, judyPaused, `${pose}-${fullscreen}`)

  useEffect(() => {
    if (!fullscreen) return
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFullscreen(false)
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [fullscreen])

  const caption =
    status === "error"
      ? errorTitle ?? ""
      : phrase ||
        (status === "understanding" || status === "preparing" || status === "listening" ? s.captionWorking : s.captionIdle)
  const showUnits = phrase && units.length > 0 && (signing || status === "complete")
  const currentUnit = status === "complete" ? units.length - 1 : unitIndex

  const playing = signing && !paused
  const controls = (
    <div className="flex flex-wrap items-center justify-center gap-2">
      {playing ? (
        <Button variant="outline" onClick={onPause} className="h-10 min-w-24">
          <Pause aria-hidden="true" />
          {s.pause}
        </Button>
      ) : (
        <Button variant="outline" onClick={onPlay} disabled={!canReplay} className="h-10 min-w-24">
          <Play className="rtl:-scale-x-100" aria-hidden="true" />
          {s.play}
        </Button>
      )}
      <Button variant="outline" onClick={onReplay} disabled={!canReplay} className="h-10 min-w-24">
        <RotateCcw aria-hidden="true" />
        {s.replay}
      </Button>
      <div role="group" aria-label={s.speed} className="flex items-center gap-1 rounded-lg border border-border bg-background p-1">
        <span className="px-1.5 text-xs font-medium text-muted-foreground" aria-hidden="true">
          {s.speed}
        </span>
        {PLAYBACK_SPEEDS.map((value) => (
          <button
            key={value}
            type="button"
            aria-pressed={speed === value}
            aria-label={`${s.speed} ${fmt(s.speedValue, { value })}`}
            onClick={() => onSpeedChange(value)}
            className={cn(
              "h-8 min-w-11 rounded-md px-2 text-xs font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
              speed === value ? "bg-foreground text-background" : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            {fmt(s.speedValue, { value })}
          </button>
        ))}
      </div>
    </div>
  )

  const progressBar = (big: boolean) => (
    <div
      className={cn("w-full overflow-hidden rounded-full bg-muted", big ? "h-3" : "h-2.5")}
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={s.progress}
    >
      <div className="brand-gradient h-full rounded-full" style={{ width: `${progress}%` }} />
    </div>
  )

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">{s.heading}</span>
        <div aria-live="polite" aria-atomic="true">
          <StatusBadge status={status} paused={paused} />
        </div>
      </div>

      <div className="relative flex flex-1 items-center justify-center overflow-hidden rounded-2xl border border-border bg-gradient-to-b from-accent/50 to-card px-2 pt-4 pb-2">
        <span className="absolute start-3 top-3 rounded-full bg-background/90 px-2.5 py-1 text-xs font-semibold text-muted-foreground shadow-sm">
          {s.demoBadge}
        </span>
        <div ref={judyRef}>
          {!fullscreen ? (
            <JudyCharacter inline size={wide ? 200 : 160} pose={pose} mood={mood} announce={false} label={s.judyLabel} />
          ) : null}
        </div>
      </div>

      <div className="rounded-xl bg-muted/70 px-4 py-3 text-center" aria-live="polite">
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">{s.captionLabel}</p>
        <p dir="auto" className={cn("mt-1 text-lg font-semibold text-balance", status === "error" ? "text-destructive" : "text-foreground")}>
          {caption}
        </p>
        {status === "error" && errorBody ? <p className="mt-1 text-sm text-muted-foreground text-balance">{errorBody}</p> : null}
        {showUnits ? (
          <>
            <p dir="auto" className="mt-2 flex flex-wrap justify-center gap-1.5" aria-hidden="true">
              {units.map((unit, index) => (
                <span
                  key={`${unit}-${index}`}
                  className={cn(
                    "rounded-md px-2 py-0.5 text-sm",
                    index === currentUnit ? "bg-foreground font-semibold text-background" : index < currentUnit ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  {unit}
                </span>
              ))}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {fmt(s.signOf, { current: currentUnit + 1, total: units.length })}
            </p>
          </>
        ) : null}
      </div>

      {progressBar(false)}
      {controls}

      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-muted-foreground">{reduceMotion ? s.reducedMotion : s.demoNote}</p>
        <Button variant="ghost" onClick={() => setFullscreen(true)} className="h-10">
          <Maximize2 aria-hidden="true" />
          {s.fullscreen}
        </Button>
      </div>

      {fullscreen && (
        <div role="dialog" aria-modal="true" aria-label={s.heading} className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-background">
          <div className="flex items-center justify-between border-b border-border px-4 py-3 sm:px-6">
            <StatusBadge status={status} paused={paused} />
            <Button ref={closeRef} variant="ghost" size="icon-lg" aria-label={s.exitFullscreen} onClick={() => setFullscreen(false)}>
              <X />
            </Button>
          </div>
          <div className="flex flex-1 flex-col items-center justify-center gap-6 p-6">
            <div ref={fullJudyRef}>
              <JudyCharacter inline size={wide ? 260 : 180} pose={pose} mood={mood} announce={false} label={s.judyLabel} />
            </div>
            <p dir="auto" className="max-w-2xl text-center text-3xl font-semibold text-balance sm:text-4xl">
              {showUnits ? units[currentUnit] ?? caption : caption}
            </p>
            {phrase ? <p dir="auto" className="text-center text-lg text-muted-foreground">{phrase}</p> : null}
            <div className="w-full max-w-md">{progressBar(true)}</div>
            {controls}
          </div>
        </div>
      )}
    </div>
  )
}
