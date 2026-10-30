"use client"

/**
 * Shared visual language for the redesigned landing page ("pop UI").
 * Every landing section imports these instead of hand-rolling its own
 * reveal/glass/glow/counter treatment, so the whole page reads as one
 * cohesive system. Landing-only — never imported outside src/components/landing.
 */

import { useEffect, useRef, useState, type ReactNode } from "react"
import { motion, useMotionValue, useSpring, useTransform, type Variants, type MotionProps } from "framer-motion"
import { cn } from "@/lib/utils"

/** Fades + rises an element into view once, on scroll. Wrap any block with it. */
export function Reveal({
  children,
  delay = 0,
  y = 22,
  className,
  as = "div",
}: {
  children: ReactNode
  delay?: number
  y?: number
  className?: string
  as?: "div" | "span"
}) {
  const Comp = motion[as]
  return (
    <Comp
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.6, ease: "easeOut", delay }}
      className={className}
    >
      {children}
    </Comp>
  )
}

/** Staggered container — pair with <RevealItem> children for cascading entrances. */
export const staggerContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.04 } },
}
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
}

/** Small eyebrow / kicker pill used above section headings across the page. */
export function PopEyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-[color:var(--primary)]/20 bg-[color:var(--primary)]/8 px-3.5 py-1.5 text-xs font-semibold tracking-[0.14em] text-[color:var(--primary)] uppercase",
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-brand-orange" aria-hidden="true" />
      {children}
    </span>
  )
}

/** Glassy floating panel: the base surface for cards, tabs, form fields, etc. */
export function GlassPanel({
  children,
  className,
  as = "div",
  glow = false,
  tilt = false,
}: {
  children: ReactNode
  className?: string
  as?: React.ElementType
  glow?: boolean
  tilt?: boolean
}) {
  const Comp = as
  const content = (
    <Comp
      className={cn(
        "glass-pop glow-border-pop relative rounded-3xl",
        glow && "shadow-[var(--pop-glow)]",
        className,
      )}
    >
      {children}
    </Comp>
  )
  if (!tilt) return content
  return <TiltWrap>{content}</TiltWrap>
}

/** Subtle 3D pointer-follow tilt for cards that want extra depth. */
export function TiltWrap({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [6, -6]), { stiffness: 150, damping: 18 })
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-6, 6]), { stiffness: 150, damping: 18 })

  return (
    <motion.div
      ref={ref}
      onPointerMove={(e) => {
        const rect = ref.current?.getBoundingClientRect()
        if (!rect) return
        mx.set((e.clientX - rect.left) / rect.width - 0.5)
        my.set((e.clientY - rect.top) / rect.height - 0.5)
      }}
      onPointerLeave={() => {
        mx.set(0)
        my.set(0)
      }}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/** Magnetic pointer-attraction wrapper for buttons/links — nudges toward the cursor. */
export function Magnetic({ children, strength = 14, className }: { children: ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useSpring(0, { stiffness: 200, damping: 14 })
  const y = useSpring(0, { stiffness: 200, damping: 14 })

  return (
    <motion.div
      ref={ref}
      onPointerMove={(e) => {
        const rect = ref.current?.getBoundingClientRect()
        if (!rect) return
        x.set(((e.clientX - rect.left) / rect.width - 0.5) * strength)
        y.set(((e.clientY - rect.top) / rect.height - 0.5) * strength)
      }}
      onPointerLeave={() => {
        x.set(0)
        y.set(0)
      }}
      style={{ x, y }}
      className={cn("inline-block", className)}
    >
      {children}
    </motion.div>
  )
}

/** Counts up from 0 to a target number once it scrolls into view. */
export function AnimatedNumber({
  value,
  suffix = "",
  prefix = "",
  duration = 1.4,
  className,
}: {
  value: number
  suffix?: string
  prefix?: string
  duration?: number
  className?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const [display, setDisplay] = useState(0)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setStarted(true)
      },
      { threshold: 0.4 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!started) return
    let raf: number
    const start = performance.now()
    const tick = (now: number) => {
      const progress = Math.min((now - start) / (duration * 1000), 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(Math.round(eased * value))
      if (progress < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [started, value, duration])

  return (
    <span ref={ref} className={className}>
      {prefix}
      {display}
      {suffix}
    </span>
  )
}

/** Animated SVG connector line with a traveling glow dot — used to link steps/nodes. */
export function ConnectorPath({ d, delay = 0, className }: { d: string; delay?: number; className?: string }) {
  return (
    <svg className={cn("pointer-events-none absolute", className)} fill="none" aria-hidden="true">
      <path d={d} stroke="var(--primary)" strokeOpacity={0.28} strokeWidth={1.5} strokeDasharray="4 6" />
      <motion.circle
        r={3}
        fill="var(--primary)"
        animate={{ offsetDistance: ["0%", "100%"], opacity: [0, 1, 1, 0] }}
        transition={{ duration: 3, delay, repeat: Infinity, ease: "easeInOut" }}
        style={{ offsetPath: `path('${d}')` }}
      />
    </svg>
  )
}

export const focusRingPop =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-background"

/**
 * The landing page's two button styles. Primary: the logo's flame red → crimson, dark
 * enough at both ends that white text stays above 4.5:1. Secondary: light glass with ink text.
 * Pair with a size, e.g. `popButtonSizes.md`.
 */
export const popPrimaryButton = cn(
  "group inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#D63C1A] to-[#B01030] font-semibold text-white shadow-[0_14px_32px_-12px_rgba(214,60,26,0.5)] transition-all hover:-translate-y-0.5 hover:shadow-[0_20px_40px_-12px_rgba(176,16,48,0.55)]",
  focusRingPop,
)
export const popSecondaryButton = cn(
  "glass-pop group inline-flex items-center justify-center gap-2 rounded-full font-semibold text-brand-navy transition-all hover:-translate-y-0.5 hover:bg-white/90",
  focusRingPop,
)
export const popButtonSizes = {
  sm: "h-10 px-4 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-base",
} as const

/**
 * Plain white "stage" with a hairline border behind a card's small diagram (no tint, no pattern).
 * `pop-stage` lets high contrast (landing.css) strengthen the border.
 */
export const popStage =
  "pop-stage rounded-2xl border border-[rgba(15,23,42,0.07)] bg-[#fff] dark:border-[rgba(255,255,255,0.08)] dark:bg-[#211620]"

/**
 * White icon tile with the brand-coloured icon, used inside the diagrams. Pair with a size, e.g. `size-10`.
 * `pop-tile` keeps the icon colour when the tile is a span (landing.css).
 */
export const popTile =
  "pop-tile grid shrink-0 place-items-center rounded-xl bg-white text-[color:var(--primary)] shadow-[0_10px_24px_-16px_rgba(94,15,69,0.45)] ring-1 ring-[color:var(--primary)]/12"

/** Logo-gradient tile (flame → crimson) with a white icon; `on-brand` keeps any text in it white. */
export const popBrandTile = "on-brand grid shrink-0 place-items-center rounded-xl bg-gradient-to-br from-[#D63C1A] to-[#B01030] text-white"

/** Forward-pointing arrow icon classes: mirrored in RTL, with a direction-aware hover nudge. */
export const popArrowIcon =
  "size-4 shrink-0 transition-transform rtl:-scale-x-100 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5"

export function popMotionProps(delay = 0): MotionProps {
  return {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.25 },
    transition: { duration: 0.55, ease: "easeOut", delay },
  }
}
