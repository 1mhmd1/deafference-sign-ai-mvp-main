"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { ArrowRight, Mic } from "lucide-react"
import { Container } from "@/components/shared/container"
import { cn } from "@/lib/utils"
import { useI18n } from "@/i18n/use-i18n"
import { useLandingReducedMotion } from "./calm-mode"
import { GlowOrb, PopEyebrow, Reveal } from "./ui/pop"

const WAVE_BARS = [8, 16, 11, 20, 13, 18, 9, 15] as const

function SpeechCaptureVisual({ active }: { active: boolean }) {
  return (
    <div className="relative flex h-24 items-center justify-center" aria-hidden="true">
      {[0, 1].map((ring) => (
        <motion.span
          key={ring}
          className="absolute rounded-full border border-brand-orange/40"
          style={{ width: 56, height: 56 }}
          animate={active ? { scale: [1, 2.2], opacity: [0.6, 0] } : { scale: 1, opacity: 0 }}
          transition={{ duration: 2, repeat: Infinity, delay: ring * 0.9, ease: "easeOut" }}
        />
      ))}
      <div className="relative z-10 flex size-14 items-center justify-center rounded-full bg-brand-orange/15 text-brand-orange">
        <Mic className="size-6" />
      </div>
      <div className="absolute bottom-0 flex items-end gap-1">
        {WAVE_BARS.map((h, i) => (
          <motion.span
            key={i}
            className="w-1 rounded-full bg-brand-orange/70"
            style={{ height: h }}
            animate={active ? { scaleY: [1, 1.7, 0.6, 1] } : { scaleY: 0.4 }}
            transition={{ duration: 1, repeat: Infinity, delay: i * 0.05, ease: "easeInOut" }}
          />
        ))}
      </div>
    </div>
  )
}

function AIProcessingVisual({ active }: { active: boolean }) {
  const nodes = [
    [50, 12],
    [14, 62],
    [50, 88],
    [86, 62],
  ]
  return (
    <div className="flex h-24 items-center justify-center" aria-hidden="true">
      <svg width="100" height="96" viewBox="0 0 100 96" fill="none">
        {nodes.map(([x, y], i) => (
          <motion.line
            key={i}
            x1={50}
            y1={50}
            x2={x}
            y2={y}
            stroke="var(--primary)"
            strokeWidth="1.5"
            initial={{ opacity: 0.15 }}
            animate={active ? { opacity: [0.15, 0.9, 0.15] } : { opacity: 0.15 }}
            transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.25, ease: "easeInOut" }}
          />
        ))}
        <circle cx={50} cy={50} r={9} fill="var(--primary)" />
        {nodes.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={5} fill="var(--brand-red)" fillOpacity={0.85} />
        ))}
      </svg>
    </div>
  )
}

function SignStreamVisual({ active }: { active: boolean }) {
  return (
    <div className="flex h-24 items-center justify-center" aria-hidden="true">
      <svg width="72" height="88" viewBox="0 0 72 88" fill="none">
        <circle cx="36" cy="20" r="16" fill="var(--brand-navy)" fillOpacity="0.12" />
        <path
          d="M8 84c0-24 8-38 28-38s28 14 28 38"
          stroke="var(--brand-navy)"
          strokeOpacity="0.12"
          strokeWidth="14"
          strokeLinecap="round"
        />
        <motion.path
          d="M40 48c8-6 16-6 20-14"
          stroke="var(--primary)"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
          animate={active ? { pathLength: [0, 1, 1, 0] } : { pathLength: 0.6 }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        />
        <circle cx="60" cy="34" r="4" fill="var(--primary)" />
      </svg>
    </div>
  )
}

/** Visuals zipped by index with `t.landing.howItWorks.stages`. */
const STAGES = [
  { emoji: "🎙️", index: "01", Visual: SpeechCaptureVisual, terminal: false },
  { emoji: "⚡", index: "02", Visual: AIProcessingVisual, terminal: false },
  { emoji: "🤟", index: "03", Visual: SignStreamVisual, terminal: true },
] as const

/** Animated connector that sits in the gap between two stages: a traveling
 * glow dot along a dashed line, plus a pulsing arrow node. Horizontal on
 * desktop (left-to-right flow), vertical on mobile (top-to-bottom flow). */
function StageConnector({ active }: { active: boolean }) {
  const { dir } = useI18n()
  const travel = dir === "rtl" ? ["95%", "0%"] : ["0%", "95%"]
  return (
    <>
      {/* Desktop: horizontal connector in the gap to the right of the card */}
      <div
        className="pointer-events-none absolute top-16 -end-4 z-20 hidden w-8 -translate-y-1/2 md:block"
        aria-hidden="true"
      >
        <div className="relative h-px w-full overflow-visible rounded-full bg-gradient-to-r from-[color:var(--primary)]/10 via-[color:var(--primary)]/45 to-[color:var(--primary)]/10">
          <motion.span
            className="absolute top-1/2 size-1.5 -translate-y-1/2 rounded-full bg-[color:var(--primary)] shadow-[0_0_10px_2px_rgba(59,130,246,0.7)]"
            animate={{ left: travel, opacity: [0, 1, 1, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
        <motion.span
          animate={active ? { scale: [1, 1.15, 1] } : { scale: 1 }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
          className={cn(
            "glass-pop absolute top-1/2 left-1/2 flex size-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-[color:var(--primary)] transition-colors",
            active && "pop-pulse",
          )}
        >
          <ArrowRight className="size-4 rtl:-scale-x-100" />
        </motion.span>
      </div>

      {/* Mobile: vertical connector below the card */}
      <div
        className="pointer-events-none absolute -bottom-8 left-1/2 z-20 block h-8 w-px -translate-x-1/2 md:hidden"
        aria-hidden="true"
      >
        <div className="relative h-full w-px overflow-visible rounded-full bg-gradient-to-b from-[color:var(--primary)]/10 via-[color:var(--primary)]/45 to-[color:var(--primary)]/10">
          <motion.span
            className="absolute left-1/2 size-1.5 -translate-x-1/2 rounded-full bg-[color:var(--primary)] shadow-[0_0_10px_2px_rgba(59,130,246,0.7)]"
            animate={{ top: ["0%", "95%"], opacity: [0, 1, 1, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
        <motion.span
          animate={active ? { scale: [1, 1.15, 1] } : { scale: 1 }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
          className={cn(
            "glass-pop absolute top-1/2 left-1/2 flex size-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-[color:var(--primary)] transition-colors",
            active && "pop-pulse",
          )}
        >
          <ArrowRight className="size-3.5 rotate-90" />
        </motion.span>
      </div>
    </>
  )
}

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
    const id = setInterval(() => setActive((s) => (s + 1) % STAGES.length), 2800)
    return () => clearInterval(id)
  }, [paused])

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
          <PopEyebrow>
            <span aria-hidden="true">⚡</span> {copy.eyebrow}
          </PopEyebrow>
          <h2 id="how-it-works-heading" className="mt-5 text-3xl font-bold tracking-tight text-balance text-black sm:text-4xl">
            {copy.title}
          </h2>
          <p className="mt-4 text-base leading-7 text-black">{copy.description}</p>
        </Reveal>

        {/* Steps are content, not controls: hovering/tapping only moves the decorative highlight. */}
        <ol
          className="relative mt-16 grid grid-cols-1 gap-14 md:grid-cols-3 md:gap-8"
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
        >
          {STAGES.map((stage, i) => {
            const isActive = active === i
            const Visual = stage.Visual
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
                  "glass-pop group relative rounded-3xl border p-6 text-start transition-all duration-300",
                  isActive
                    ? "border-[color:var(--primary)]/45 shadow-[var(--pop-glow)]"
                    : "border-transparent hover:-translate-y-1 hover:border-[color:var(--primary)]/20",
                )}
              >
                {i < STAGES.length - 1 && <StageConnector active={isActive} />}

                <div className="flex items-center gap-3">
                  <motion.span
                    aria-hidden="true"
                    animate={isActive ? { scale: [1, 1.08, 1], opacity: 1 } : { scale: 1, opacity: 0.7 }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                    className={cn(
                      "relative flex size-11 shrink-0 items-center justify-center rounded-full text-sm font-bold",
                      isActive
                        ? "bg-[#2563EB] text-white shadow-[0_0_0_6px_rgba(59,130,246,0.14)]"
                        : "bg-[color:var(--primary)]/10 text-[#1D4ED8]",
                    )}
                  >
                    {stage.index}
                  </motion.span>
                  <span className="text-xl" aria-hidden="true">
                    {stage.emoji}
                  </span>
                </div>

                <Visual active={isActive && !reduceMotion} />

                <h3 className="mt-2 text-lg font-bold text-black">{text?.title}</h3>
                <p className="mt-2 text-sm leading-6 text-black">{text?.caption}</p>

                <span
                  className={cn(
                    "mt-4 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold transition-colors",
                    isActive
                      ? "border-[color:var(--primary)]/35 bg-[color:var(--primary)]/10 text-[#1D4ED8]"
                      : "border-border text-black",
                  )}
                >
                  {stage.terminal ? (
                    <>
                      <span className="relative flex size-1.5" aria-hidden="true">
                        <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                        <span className="relative inline-flex size-1.5 rounded-full bg-emerald-500" />
                      </span>
                      {text?.tag}
                    </>
                  ) : (
                    <>
                      {text?.tag}
                      <ArrowRight className="size-3 rtl:-scale-x-100" aria-hidden="true" />
                    </>
                  )}
                </span>
              </li>
            )
          })}
        </ol>
      </Container>
    </section>
  )
}

