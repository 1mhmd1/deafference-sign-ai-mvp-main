"use client"

import { useEffect, useId, useState, type ReactNode } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { ArrowRight, AudioLines, Cpu, MonitorPlay } from "lucide-react"
import { Container } from "@/components/shared/container"
import { cn } from "@/lib/utils"
import { useI18n } from "@/i18n/use-i18n"
import { useLandingReducedMotion } from "./calm-mode"
import { GlowOrb, PopEyebrow, Reveal } from "./ui/pop"

// Shared look for the three step diagrams: hairline strokes, neutral ink for structure,
// and a colour story: orange is speech, blue is sign. Step 1 is orange, step 2 turns
// orange into blue, step 3 is blue. No characters or faces.
const INK = "var(--brand-navy)"
const ACCENT = "var(--primary)"
const SOUND = "var(--brand-orange)"

function DiagramPanel({ children }: { children: ReactNode }) {
  return (
    <svg viewBox="0 0 240 104" fill="none" className="h-auto w-full max-w-[520px]" aria-hidden="true">
      {children}
    </svg>
  )
}

// Fixed bar heights (no randomness) so server and client render the same waveform.
const WAVEFORM = [6, 10, 16, 9, 22, 30, 18, 26, 38, 24, 32, 44, 28, 36, 22, 30, 40, 26, 18, 28, 14, 20, 10, 16, 8, 12, 6] as const

/** Step 1: a recording panel: microphone input and a live waveform with a moving playhead. */
function SpeechCaptureVisual({ active }: { active: boolean }) {
  const startX = 66
  const step = 5.6
  return (
    <DiagramPanel>
      {/* Microphone input */}
      <circle cx="34" cy="52" r="18" stroke={SOUND} strokeOpacity="0.35" strokeWidth="1.5" />
      <rect x="29" y="39" width="10" height="17" rx="5" stroke={SOUND} strokeWidth="1.75" />
      <path d="M25 51a9 9 0 0 0 18 0M34 60v5" stroke={SOUND} strokeWidth="1.75" strokeLinecap="round" />
      <motion.circle
        cx="34"
        cy="52"
        r="18"
        stroke={SOUND}
        strokeWidth="1"
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
        initial={{ scale: 1, opacity: 0 }}
        animate={active ? { scale: [1, 1.35], opacity: [0.5, 0] } : { scale: 1, opacity: 0 }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
      />

      {/* Waveform on a baseline */}
      <path d={`M${startX - 4} 52H${startX + WAVEFORM.length * step}`} stroke={INK} strokeOpacity="0.12" strokeWidth="1" />
      {WAVEFORM.map((h, i) => (
        <motion.rect
          key={i}
          x={startX + i * step}
          y={52 - h / 2}
          width="2"
          height={h}
          rx="1"
          fill={SOUND}
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
          initial={{ scaleY: 0.55, opacity: 0.55 }}
          animate={active ? { scaleY: [0.55, 1, 0.7, 1], opacity: [0.55, 1, 0.8, 1] } : { scaleY: 0.55, opacity: 0.55 }}
          transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.04, ease: "easeInOut" }}
        />
      ))}
      <motion.line
        y1="24"
        y2="80"
        stroke={SOUND}
        strokeWidth="1"
        initial={{ x1: startX, x2: startX, opacity: 0 }}
        animate={
          active
            ? { x1: [startX, startX + WAVEFORM.length * step], x2: [startX, startX + WAVEFORM.length * step], opacity: [0, 0.8, 0.8, 0] }
            : { x1: startX, x2: startX, opacity: 0 }
        }
        transition={{ duration: 2.6, repeat: Infinity, ease: "linear" }}
      />

      {/* Input level */}
      <rect x="66" y="88" width="150" height="3" rx="1.5" fill={INK} fillOpacity="0.08" />
      <motion.rect
        x="66"
        y="88"
        height="3"
        rx="1.5"
        fill={SOUND}
        initial={{ width: 60 }}
        animate={active ? { width: [40, 120, 70, 110, 40] } : { width: 60 }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
      />
    </DiagramPanel>
  )
}

// Widths of the sign-structure blocks the model emits (one row per sign in order).
const SIGN_TOKENS = [
  { x: 168, y: 30, w: 46 },
  { x: 168, y: 47, w: 34 },
  { x: 168, y: 64, w: 54 },
] as const

/** Step 2: audio enters a processing unit and leaves as an ordered set of sign blocks. */
function AIProcessingVisual({ active }: { active: boolean }) {
  const gradientId = `hiw-convert-${useId().replace(/:/g, "")}`
  return (
    <DiagramPanel>
      <defs>
        <linearGradient id={gradientId} x1="96" y1="28" x2="144" y2="76" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="var(--brand-orange)" />
          <stop offset="1" stopColor="var(--primary)" />
        </linearGradient>
      </defs>
      {/* Audio in */}
      <path
        d="M16 52h8l3-8 4 16 4-24 4 30 4-20 3 10 2-4h6"
        stroke={SOUND}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M62 52h30" stroke={INK} strokeOpacity="0.18" strokeWidth="1.25" strokeDasharray="3 3" />
      <motion.circle
        cy="52"
        r="2.5"
        fill={SOUND}
        initial={{ cx: 62, opacity: 0 }}
        animate={active ? { cx: [62, 92], opacity: [0, 1, 0] } : { cx: 62, opacity: 0 }}
        transition={{ duration: 1.1, repeat: Infinity, ease: "easeIn" }}
      />

      {/* Processing unit */}
      <rect x="96" y="28" width="48" height="48" rx="10" fill={`url(#${gradientId})`} fillOpacity="0.1" stroke={`url(#${gradientId})`} strokeWidth="1.75" />
      <rect x="108" y="40" width="24" height="24" rx="4" stroke={`url(#${gradientId})`} strokeWidth="1.5" />
      <path
        d="M114 28v-5M120 28v-5M126 28v-5M114 81v-5M120 81v-5M126 81v-5M96 46h-5M96 52h-5M96 58h-5M149 46h-5M149 52h-5M149 58h-5"
        stroke={`url(#${gradientId})`}
        strokeOpacity="0.6"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <motion.rect
        x="109"
        width="22"
        height="1.5"
        fill={SOUND}
        initial={{ y: 42, opacity: 0 }}
        animate={active ? { y: [42, 61, 42], opacity: [0.9, 0.9, 0.9] } : { y: 42, opacity: 0 }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Ordered sign structure out */}
      <path d="M149 52h11M160 35v34M160 35h6M160 52h6M160 69h6" stroke={INK} strokeOpacity="0.18" strokeWidth="1.25" />
      {SIGN_TOKENS.map((token, i) => (
        <motion.g
          key={i}
          initial={{ opacity: 1 }}
          animate={active ? { opacity: [0.25, 1, 1, 0.25] } : { opacity: 1 }}
          transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.3, ease: "easeInOut" }}
        >
          <rect x={token.x} y={token.y} width={token.w} height="10" rx="5" fill={ACCENT} fillOpacity={i === 0 ? 0.9 : 0.55} />
          <circle cx={token.x + 5} cy={token.y + 5} r="2" fill="white" />
        </motion.g>
      ))}
    </DiagramPanel>
  )
}

/** Step 3: a video frame with a signer silhouette, timeline and captions underneath. */
function SignStreamVisual({ active }: { active: boolean }) {
  return (
    <DiagramPanel>
      {/* Video frame */}
      <rect x="64" y="12" width="112" height="62" rx="8" fill={INK} fillOpacity="0.06" stroke={INK} strokeOpacity="0.18" strokeWidth="1.25" />
      {/* Live indicator */}
      <circle cx="74" cy="21" r="2.5" fill="#10B981" />
      <motion.circle
        cx="74"
        cy="21"
        r="2.5"
        fill="#10B981"
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
        initial={{ scale: 1, opacity: 0 }}
        animate={active ? { scale: [1, 2.6], opacity: [0.5, 0] } : { scale: 1, opacity: 0 }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
      />

      {/* Signer silhouette */}
      <circle cx="120" cy="34" r="8" fill={ACCENT} fillOpacity="0.85" />
      <path d="M100 74c0-16 9-25 20-25s20 9 20 25Z" fill={ACCENT} fillOpacity="0.85" />
      <motion.g
        initial={{ x: 0, y: 0 }}
        animate={active ? { x: [0, -3, 2, 0], y: [0, -4, 1, 0] } : { x: 0, y: 0 }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
      >
        <path d="M104 58l-6-16" stroke={ACCENT} strokeOpacity="0.85" strokeWidth="5" strokeLinecap="round" />
        <circle cx="97" cy="39" r="4" fill={ACCENT} />
      </motion.g>
      <motion.g
        initial={{ x: 0, y: 0 }}
        animate={active ? { x: [0, 3, -2, 0], y: [0, 2, -5, 0] } : { x: 0, y: 0 }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
      >
        <path d="M136 58l7-14" stroke={ACCENT} strokeOpacity="0.85" strokeWidth="5" strokeLinecap="round" />
        <circle cx="144" cy="41" r="4" fill={ACCENT} />
      </motion.g>

      {/* Timeline */}
      <rect x="64" y="80" width="112" height="2.5" rx="1.25" fill={INK} fillOpacity="0.1" />
      <motion.rect
        x="64"
        y="80"
        height="2.5"
        rx="1.25"
        fill={SOUND}
        initial={{ width: 48 }}
        animate={active ? { width: [0, 112] } : { width: 48 }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "linear" }}
      />

      {/* Captions */}
      <rect x="78" y="88" width="84" height="3" rx="1.5" fill={INK} fillOpacity="0.35" />
      <motion.rect
        x="92"
        y="95"
        height="3"
        rx="1.5"
        fill={INK}
        fillOpacity="0.2"
        initial={{ width: 56 }}
        animate={active ? { width: [0, 56, 56] } : { width: 56 }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeOut", times: [0, 0.5, 1] }}
      />
    </DiagramPanel>
  )
}

/** Visuals zipped by index with `t.landing.howItWorks.stages`. */
const STAGES = [
  { Icon: AudioLines, index: "01", Visual: SpeechCaptureVisual, terminal: false, tile: "from-[#F97316] to-[#C2410C]" },
  { Icon: Cpu, index: "02", Visual: AIProcessingVisual, terminal: false, tile: "from-[#F97316] to-[#2563EB]" },
  { Icon: MonitorPlay, index: "03", Visual: SignStreamVisual, terminal: true, tile: "from-[#2563EB] to-[#1D4ED8]" },
] as const

const STEP_MS = 2800

export function HowItWorksVisual() {
  const { t } = useI18n()
  const copy = t.landing.howItWorks
  const reduceMotion = useLandingReducedMotion()
  const [active, setActive] = useState(0)
  // Auto-advance pauses while the pointer is over the steps, after a tap/click, and in calm/reduced-motion mode.
  const [hovering, setHovering] = useState(false)
  const [locked, setLocked] = useState(false)
  const paused = locked || hovering || reduceMotion

  useEffect(() => {
    if (paused) return
    const id = setInterval(() => setActive((s) => (s + 1) % STAGES.length), STEP_MS)
    return () => clearInterval(id)
  }, [paused])

  const current = STAGES[active]
  const currentText = copy.stages[active]
  const CurrentVisual = current.Visual

  return (
    <section
      id="how-it-works"
      aria-labelledby="how-it-works-heading"
      className="pop-atmosphere relative overflow-hidden py-24 sm:py-28"
    >
      <div className="pop-grid pointer-events-none absolute inset-0 -z-10 opacity-[0.05]" aria-hidden="true" />
      <GlowOrb className="-top-20 -left-16 size-[24rem] pop-float" color="rgba(59,130,246,0.16)" />
      <GlowOrb className="top-24 -right-24 size-[26rem] pop-float-delay" color="rgba(167,180,255,0.18)" />

      <Container fluid>
        <Reveal className="max-w-2xl">
          <PopEyebrow>{copy.eyebrow}</PopEyebrow>
          <h2 id="how-it-works-heading" className="mt-5 text-3xl font-bold tracking-tight text-balance text-black sm:text-4xl">
            {copy.title}
          </h2>
          <p className="mt-4 text-base leading-7 text-black">{copy.description}</p>
        </Reveal>

        <div
          className="mt-14 grid gap-8 lg:grid-cols-12 lg:items-stretch lg:gap-10"
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
        >
          {/* Step list. Steps are content, not controls: hovering/tapping only moves the highlight. */}
          <Reveal className="lg:col-span-5">
            <ol className="relative flex h-full flex-col justify-between gap-3">
              {/* Spine joining the step icons (centred on the 44px tiles inside the 16px row padding). */}
              <span aria-hidden="true" className="absolute start-[37px] top-10 bottom-10 w-0.5 -translate-x-1/2 rounded-full bg-gradient-to-b from-brand-orange/70 via-[color:var(--primary)]/40 to-[color:var(--primary)]/70 rtl:translate-x-1/2" />
              {STAGES.map((stage, i) => {
                const isActive = active === i
                const text = copy.stages[i]
                return (
                  <li
                    key={stage.index}
                    onMouseEnter={() => setActive(i)}
                    onClick={() => {
                      setActive(i)
                      setLocked(true)
                    }}
                    className={cn(
                      "relative flex gap-4 rounded-2xl border p-4 text-start transition-[background-color,border-color,box-shadow] duration-300",
                      isActive
                        ? "border-brand-orange/25 bg-card bg-gradient-to-r from-brand-orange/[0.06] to-transparent shadow-[0_1px_2px_rgba(16,24,40,0.05),0_16px_36px_-24px_rgba(234,88,12,0.3)] rtl:bg-gradient-to-l"
                        : "border-transparent hover:bg-card/60",
                    )}
                  >
                    {/* Orange accent: a short bar on the inline-start edge of the active step. */}
                    <span
                      aria-hidden="true"
                      className={cn(
                        "absolute inset-y-5 -start-px w-0.5 rounded-full bg-brand-orange transition-opacity duration-300",
                        isActive ? "opacity-100" : "opacity-0",
                      )}
                    />
                    <span
                      aria-hidden="true"
                      className={cn(
                        "relative z-10 flex size-11 shrink-0 items-center justify-center rounded-xl transition-colors duration-300",
                        isActive
                          ? cn("bg-gradient-to-br text-white shadow-[0_10px_22px_-10px_rgba(234,88,12,0.55)]", stage.tile)
                          : "bg-card text-[#1D4ED8] ring-1 ring-[color:var(--primary)]/20",
                      )}
                    >
                      <stage.Icon className="size-5" strokeWidth={1.75} />
                    </span>
                    <div className="min-w-0 pt-0.5">
                      <p className="flex flex-wrap items-center gap-x-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                        <span
                          className={cn("font-mono font-semibold transition-colors duration-300", isActive && "text-[#C2410C]")}
                        >
                          {stage.index}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{text?.tag}</span>
                      </p>
                      <h3 className="mt-1 text-lg font-semibold tracking-tight text-black">{text?.title}</h3>
                      <p className="mt-1.5 text-sm leading-6 text-muted-foreground">{text?.caption}</p>
                    </div>
                  </li>
                )
              })}
            </ol>
          </Reveal>

          {/* Stage: the active step's diagram, large. Decorative — the list above carries the content. */}
          <Reveal delay={0.1} className="lg:col-span-7">
            <div
              aria-hidden="true"
              className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-[0_1px_2px_rgba(16,24,40,0.05),0_30px_60px_-30px_rgba(30,64,175,0.3)]"
            >
              <span className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-brand-orange via-[#F59E0B] to-[color:var(--primary)] rtl:bg-gradient-to-l" />
              <div className="flex items-center justify-between gap-4 border-b border-border px-5 py-3.5 sm:px-6">
                <div className="flex min-w-0 items-center gap-3">
                  <span className={cn("flex size-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br text-white", current.tile)}>
                    <current.Icon className="size-4" strokeWidth={1.75} />
                  </span>
                  <span className="truncate text-sm font-semibold text-black">{currentText?.title}</span>
                </div>
                <span className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-border bg-muted/40 px-2.5 py-1 text-xs font-medium text-black">
                  {current.terminal ? (
                    <span className="size-1.5 rounded-full bg-emerald-500" />
                  ) : (
                    <ArrowRight className="size-3 rtl:-scale-x-100" />
                  )}
                  {currentText?.tag}
                </span>
              </div>

              <div className="relative min-h-64 flex-1 overflow-hidden bg-[radial-gradient(circle,rgba(37,99,235,0.14)_1px,transparent_1px)] [background-size:18px_18px] sm:min-h-72">
                <span className="pointer-events-none absolute -top-24 -start-24 size-72 rounded-full bg-[radial-gradient(circle,rgba(249,115,22,0.18),transparent_70%)]" />
                <span className="pointer-events-none absolute -bottom-24 -end-24 size-72 rounded-full bg-[radial-gradient(circle,rgba(37,99,235,0.14),transparent_70%)]" />
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={active}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="absolute inset-0 flex items-center justify-center p-6 sm:p-10"
                  >
                    <CurrentVisual active={!reduceMotion} />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Progress: one segment per step; done steps in soft orange, the running one fills in orange. */}
              <div className="flex gap-2 border-t border-border px-5 py-4 sm:px-6">
                {STAGES.map((stage, i) => (
                  <span key={stage.index} className="relative h-1 flex-1 overflow-hidden rounded-full bg-border">
                    {i < active && <span className="absolute inset-0 rounded-full bg-brand-orange/45" />}
                    {i === active && (
                      <motion.span
                        key={paused ? "still" : `run-${active}`}
                        className="absolute inset-0 origin-[left] rounded-full bg-brand-orange rtl:origin-[right]"
                        initial={{ scaleX: paused ? 1 : 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: paused ? 0 : STEP_MS / 1000, ease: "linear" }}
                      />
                    )}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  )
}
