"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { ArrowRight, BrainCircuit, Hand, Mic } from "lucide-react"
import { Container } from "@/components/shared/container"
import { cn } from "@/lib/utils"
import { useI18n } from "@/i18n/use-i18n"
import { useLandingReducedMotion } from "./calm-mode"
import { GlowOrb, PopEyebrow, Reveal } from "./ui/pop"

const WAVE_BARS = [10, 18, 12, 24, 16, 22, 11, 17, 9] as const

/** Step 1: a hearing person talks; their words appear as a live waveform in a speech bubble. */
function SpeechCaptureVisual({ active }: { active: boolean }) {
  return (
    <div className="flex h-24 items-center justify-center" aria-hidden="true">
      <svg width="168" height="96" viewBox="0 0 168 96" fill="none">
        {/* Speaker */}
        <path d="M6 94c0-17 9-27 24-27s24 10 24 27Z" fill="var(--brand-navy)" fillOpacity="0.14" />
        <circle cx="30" cy="42" r="17" fill="#F2CBA9" />
        <path d="M13 40c0-12 7-19 17-19s17 7 17 19c-4-6-10-9-17-9s-13 3-17 9Z" fill="var(--brand-navy)" fillOpacity="0.75" />
        <circle cx="24" cy="43" r="1.8" fill="var(--brand-navy)" />
        <circle cx="36" cy="43" r="1.8" fill="var(--brand-navy)" />
        <motion.ellipse
          cx="30"
          cy="51"
          rx="3.5"
          fill="var(--brand-red)"
          initial={{ ry: 1 }}
          animate={active ? { ry: [1, 3.2, 1.4, 2.8, 1] } : { ry: 1 }}
          transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Speech bubble carrying the sound */}
        <path
          d="M70 8h84a10 10 0 0 1 10 10v34a10 10 0 0 1-10 10H82l-12 10 2-10a10 10 0 0 1-12-10V18A10 10 0 0 1 70 8Z"
          fill="white"
          stroke="var(--brand-orange)"
          strokeWidth="2"
        />
        {WAVE_BARS.map((h, i) => (
          <motion.rect
            key={i}
            x={74 + i * 9}
            y={35 - h / 2}
            width="4.5"
            height={h}
            rx="2.25"
            fill="var(--brand-orange)"
            style={{ transformBox: "fill-box", transformOrigin: "center" }}
            animate={active ? { scaleY: [0.5, 1.15, 0.65, 1] } : { scaleY: 0.45 }}
            transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.07, ease: "easeInOut" }}
          />
        ))}

        {/* Microphone listening */}
        <circle cx="150" cy="78" r="14" fill="var(--brand-orange)" />
        <rect x="146.5" y="69" width="7" height="12" rx="3.5" fill="white" />
        <path d="M143.5 77a6.5 6.5 0 0 0 13 0M150 83.5v3.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
        <motion.circle
          cx="150"
          cy="78"
          r="14"
          stroke="var(--brand-orange)"
          strokeWidth="1.5"
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
          animate={active ? { scale: [1, 1.7], opacity: [0.7, 0] } : { scale: 1, opacity: 0 }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
        />
      </svg>
    </div>
  )
}

// Hand keypoints (wrist + five fingertips), the way sign recognition sees a hand.
const HAND_WRIST = [140, 84] as const
const HAND_TIPS = [
  [121, 66],
  [128, 46],
  [139, 40],
  [150, 45],
  [158, 58],
] as const

/** Step 2: sound goes into the AI, which turns it into the keypoints of a signing hand. */
function AIProcessingVisual({ active }: { active: boolean }) {
  return (
    <div className="flex h-24 items-center justify-center" aria-hidden="true">
      <svg width="168" height="96" viewBox="0 0 168 96" fill="none">
        {/* Sound in */}
        <path
          d="M2 48h6l4-10 5 20 5-28 5 34 5-22 4 12 3-6h6"
          stroke="var(--brand-orange)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <motion.circle
          cy="48"
          r="3"
          fill="var(--brand-orange)"
          initial={{ cx: 44, opacity: 0 }}
          animate={active ? { cx: [44, 58], opacity: [0, 1, 0] } : { cx: 44, opacity: 0 }}
          transition={{ duration: 1, repeat: Infinity, ease: "easeIn" }}
        />

        {/* AI chip with a turning scan ring */}
        <motion.circle
          cx="82"
          cy="48"
          r="30"
          stroke="var(--primary)"
          strokeOpacity="0.45"
          strokeWidth="1.5"
          strokeDasharray="5 6"
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
          animate={active ? { rotate: 360 } : { rotate: 0 }}
          transition={active ? { duration: 6, repeat: Infinity, ease: "linear" } : { duration: 0.4 }}
        />
        <path
          d="M70 22v6M82 22v6M94 22v6M70 68v6M82 68v6M94 68v6M56 36h6M56 48h6M56 60h6M102 36h6M102 48h6M102 60h6"
          stroke="var(--primary)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <motion.rect
          x="62"
          y="28"
          width="40"
          height="40"
          rx="10"
          fill="var(--primary)"
          animate={active ? { fillOpacity: [0.8, 1, 0.8] } : { fillOpacity: 0.9 }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
        />
        <text x="82" y="54" textAnchor="middle" fontSize="17" fontWeight="800" fill="white" fontFamily="inherit">
          AI
        </text>

        {/* Signing hand out, drawn as keypoints */}
        <motion.circle
          cy="48"
          r="3"
          fill="var(--primary)"
          initial={{ cx: 106, opacity: 0 }}
          animate={active ? { cx: [106, 118], opacity: [0, 1, 0] } : { cx: 106, opacity: 0 }}
          transition={{ duration: 1, repeat: Infinity, ease: "easeOut", delay: 0.5 }}
        />
        {HAND_TIPS.map(([x, y], i) => (
          <motion.g
            key={i}
            animate={active ? { opacity: [0.2, 1, 1, 0.2] } : { opacity: 1 }}
            transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
          >
            <line x1={HAND_WRIST[0]} y1={HAND_WRIST[1]} x2={x} y2={y} stroke="var(--brand-navy)" strokeOpacity="0.45" strokeWidth="2" />
            <circle cx={x} cy={y} r="4" fill="var(--brand-red)" />
          </motion.g>
        ))}
        <circle cx={HAND_WRIST[0]} cy={HAND_WRIST[1]} r="5.5" fill="var(--brand-navy)" />
      </svg>
    </div>
  )
}

/** Step 3: an animated signer on screen, with the caption typing in underneath. */
function SignStreamVisual({ active }: { active: boolean }) {
  return (
    <div className="flex h-24 items-center justify-center" aria-hidden="true">
      <svg width="168" height="96" viewBox="0 0 168 96" fill="none">
        {/* Screen */}
        <rect x="30" y="2" width="108" height="84" rx="12" fill="white" stroke="var(--brand-navy)" strokeOpacity="0.25" strokeWidth="2" />
        <path d="M70 93h28" stroke="var(--brand-navy)" strokeOpacity="0.25" strokeWidth="3" strokeLinecap="round" />

        {/* Live dot */}
        <circle cx="44" cy="15" r="3.5" fill="#10B981" />
        <motion.circle
          cx="44"
          cy="15"
          r="3.5"
          fill="#10B981"
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
          animate={active ? { scale: [1, 2.4], opacity: [0.6, 0] } : { scale: 1, opacity: 0 }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeOut" }}
        />

        {/* Signer */}
        <path d="M60 66c0-14 10-22 24-22s24 8 24 22Z" fill="var(--primary)" />
        <circle cx="84" cy="30" r="11" fill="#F2CBA9" />
        <path d="M73 29c0-8 5-13 11-13s11 5 11 13c-3-4-7-6-11-6s-8 2-11 6Z" fill="var(--brand-navy)" fillOpacity="0.8" />
        <path d="M79 35q5 4 10 0" stroke="var(--brand-navy)" strokeWidth="1.6" strokeLinecap="round" />
        {/* Signing arm: forearm up from the elbow, I-LOVE-YOU handshape */}
        <motion.g
          style={{ transformBox: "view-box", transformOrigin: "106px 58px" }}
          animate={active ? { rotate: [0, -14, 6, -10, 0] } : { rotate: 0 }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <path d="M100 52L106 58L114 36" stroke="#F2CBA9" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M112 31l-1-9M120 32l3-8M110 36l-6-3" stroke="#F2CBA9" strokeWidth="3.5" strokeLinecap="round" />
          <circle cx="115" cy="34" r="5.5" fill="#F2CBA9" />
        </motion.g>

        {/* Caption */}
        <rect x="42" y="70" width="84" height="10" rx="5" fill="var(--brand-navy)" fillOpacity="0.85" />
        <motion.rect
          x="48"
          y="73.5"
          height="3"
          rx="1.5"
          fill="white"
          initial={{ width: 56 }}
          animate={active ? { width: [0, 72, 72, 0] } : { width: 56 }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", times: [0, 0.5, 0.85, 1] }}
        />
      </svg>
    </div>
  )
}

/** Visuals zipped by index with `t.landing.howItWorks.stages`. */
const STAGES = [
  { Icon: Mic, index: "01", Visual: SpeechCaptureVisual, terminal: false },
  { Icon: BrainCircuit, index: "02", Visual: AIProcessingVisual, terminal: false },
  { Icon: Hand, index: "03", Visual: SignStreamVisual, terminal: true },
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
                  <span
                    aria-hidden="true"
                    className={cn(
                      "flex size-9 items-center justify-center rounded-xl transition-colors",
                      isActive ? "bg-brand-orange/15 text-[#C2410C]" : "bg-[color:var(--primary)]/10 text-[#1D4ED8]",
                    )}
                  >
                    <stage.Icon className="size-5" />
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

