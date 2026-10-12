"use client"

import { useEffect, useId, useRef, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import {
  ArrowRight,
  Captions,
  Clock,
  HeartPulse,
  Pause,
  Play,
  RotateCcw,
  Siren,
  Sparkles,
  Type,
  Zap,
  type LucideIcon,
} from "lucide-react"
import { Container } from "@/components/shared/container"
import { APP_ROUTES } from "@/lib/constants"
import { cn } from "@/lib/utils"
import { useI18n } from "@/i18n/use-i18n"
import {
  GlowOrb,
  Magnetic,
  PopEyebrow,
  Reveal,
  focusRingPop,
  popArrowIcon,
  popButtonSizes,
  popPrimaryButton,
  popSecondaryButton,
} from "./ui/pop"

const WAVE_BARS = [9, 17, 12, 21, 14, 19, 10, 16, 13, 20] as const

/** Icons zipped by index with `t.landing.demo.productDemos` / `.tutorials`. */
const PRODUCT_DEMO_ICONS: LucideIcon[] = [Zap, Type]
const TUTORIAL_ICONS: LucideIcon[] = [Sparkles, HeartPulse, Siren]

type MediaItem = { icon: LucideIcon; title: string; description: string; audience?: string }

/** Light, brand-tinted "screen" surface used by the walkthrough preview and the video placeholders. */
const SCREEN_SURFACE =
  "border border-[color:var(--primary)]/15 bg-gradient-to-br from-[#EAF2FF] via-white to-[#F1EEFF]"

function FlagshipDemo() {
  const { t } = useI18n()
  const copy = t.landing.demo.flagship
  const steps = copy.steps
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [captionsOn, setCaptionsOn] = useState(true)

  useEffect(() => {
    if (!playing) return
    if (step >= steps.length - 1) {
      const timeout = setTimeout(() => setPlaying(false), 1400)
      return () => clearTimeout(timeout)
    }
    const timeout = setTimeout(() => setStep((s) => s + 1), 1400)
    return () => clearTimeout(timeout)
  }, [playing, step, steps.length])

  function handlePlay() {
    if (!playing && step >= steps.length - 1) setStep(0)
    setPlaying((p) => !p)
  }

  function handleReplay() {
    setStep(0)
    setPlaying(true)
  }

  const atEnd = step >= steps.length - 1 && !playing

  return (
    <article
      aria-labelledby="flagship-demo-heading"
      className="glass-pop glow-border-pop relative overflow-hidden rounded-3xl p-6 sm:p-8"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 id="flagship-demo-heading" className="text-lg font-bold text-black sm:text-xl">
          {copy.title}
        </h3>
        <span className="inline-flex items-center rounded-full bg-orange-50 px-2.5 py-1 text-xs font-semibold tracking-[0.08em] text-[#C2410C] uppercase ring-1 ring-[#C2410C]/20">
          {copy.badge}
        </span>
      </div>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-black">{copy.note}</p>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-center">
        <div>
          <div className="flex items-end gap-1" aria-hidden="true">
            {WAVE_BARS.map((h, i) => (
              <motion.span
                key={i}
                className="w-1.5 rounded-full bg-[color:var(--primary)]"
                style={{ height: h }}
                animate={playing ? { scaleY: [1, 1.6, 0.7, 1] } : { scaleY: 0.5 }}
                transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.06, ease: "easeInOut" }}
              />
            ))}
          </div>

          {/* Progress indicator synced to the active walkthrough step */}
          <div
            className="mt-5 h-1.5 w-full overflow-hidden rounded-full bg-[color:var(--primary)]/10"
            role="progressbar"
            aria-label={copy.progressLabel}
            aria-valuemin={1}
            aria-valuemax={steps.length}
            aria-valuenow={step + 1}
            aria-valuetext={`${step + 1} / ${steps.length}: ${steps[step]?.label ?? ""}`}
          >
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-[#2563EB] to-[#1D4ED8]"
              animate={{ width: `${((step + 1) / steps.length) * 100}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>

          <ol className="mt-5 space-y-3" aria-label={copy.stepsLabel}>
            {steps.map((s, i) => {
              const isCurrent = i === step
              return (
                <li
                  key={s.label}
                  aria-current={isCurrent ? "step" : undefined}
                  className={cn(
                    "flex items-center gap-3 rounded-xl border px-4 py-3 transition-colors duration-300",
                    isCurrent
                      ? "border-[#2563EB]/45 bg-[color:var(--primary)]/8"
                      : "border-border bg-white/50",
                  )}
                >
                  <span
                    className={cn(
                      "flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors",
                      isCurrent ? "bg-[#2563EB] text-white" : "bg-[color:var(--primary)]/10 text-[#1D4ED8]",
                    )}
                    aria-hidden="true"
                  >
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className={cn("text-sm text-black", isCurrent ? "font-bold" : "font-semibold")}>{s.label}</p>
                    {captionsOn ? <p className="text-xs text-black">{s.caption}</p> : null}
                  </div>
                  {/* Text indicator, so the current step isn't conveyed by colour alone. */}
                  {isCurrent ? (
                    <span className="shrink-0 rounded-full bg-[#2563EB] px-2 py-0.5 text-xs font-semibold text-white">
                      {copy.current}
                    </span>
                  ) : null}
                </li>
              )
            })}
          </ol>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Magnetic>
              <button type="button" onClick={handlePlay} className={cn(popPrimaryButton, popButtonSizes.md)}>
                {playing ? (
                  <Pause className="size-4" aria-hidden="true" />
                ) : (
                  <Play className="size-4 rtl:-scale-x-100" aria-hidden="true" />
                )}
                {playing ? copy.pause : atEnd ? copy.replay : copy.play}
              </button>
            </Magnetic>
            <button type="button" onClick={handleReplay} className={cn(popSecondaryButton, popButtonSizes.md)}>
              <RotateCcw className="size-4" aria-hidden="true" />
              {copy.restart}
            </button>
            <button
              type="button"
              onClick={() => setCaptionsOn((c) => !c)}
              aria-pressed={captionsOn}
              className={cn(
                popSecondaryButton,
                popButtonSizes.md,
                captionsOn && "bg-orange-50 text-[#C2410C] ring-1 ring-[#C2410C]/30",
              )}
            >
              <Captions className="size-4" aria-hidden="true" />
              {copy.captions}
            </button>
          </div>
        </div>

        {/* Device-style preview screen, kept light to match the rest of the page. */}
        <figure className={cn("rounded-2xl p-6 shadow-[0_20px_50px_-28px_rgba(30,64,175,0.35)]", SCREEN_SURFACE)}>
          <figcaption className="text-xs font-semibold tracking-[0.16em] text-[#1D4ED8] uppercase">
            {copy.previewTitle}
          </figcaption>
          <div className="mt-6 flex items-center justify-center">
            <svg width="88" height="108" viewBox="0 0 72 88" fill="none" aria-hidden="true">
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
                stroke="#2563EB"
                strokeWidth="3.5"
                strokeLinecap="round"
                fill="none"
                animate={step === 2 && playing ? { pathLength: [0, 1, 1, 0] } : { pathLength: 0.6 }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
              />
              <circle cx="60" cy="34" r="4" fill="var(--brand-orange)" />
            </svg>
          </div>
          <p className="mt-6 text-center text-sm leading-6 text-black">
            {captionsOn ? steps[step]?.caption : copy.captionsHidden}
          </p>
        </figure>
      </div>
    </article>
  )
}

/** Placeholder card for a video that doesn't exist yet: "Preview" only reveals an honest "coming soon" note. */
function MediaCard({ item }: { item: MediaItem }) {
  const { t, fmt } = useI18n()
  const copy = t.landing.demo.media
  const [showNote, setShowNote] = useState(false)
  const noteId = useId()
  const Icon = item.icon

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="glass-pop group flex flex-col overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--pop-glow)]"
    >
      <figure className={cn("relative m-0 aspect-video overflow-hidden border-x-0 border-t-0", SCREEN_SURFACE)}>
        <div aria-hidden="true" className="absolute inset-0 flex items-center justify-center">
          <Icon className="size-10 text-[#2563EB]/55" />
        </div>

        <span className="absolute end-2 bottom-2 inline-flex items-center gap-1 rounded-full bg-white/95 px-2 py-0.5 text-xs font-semibold text-black shadow-sm">
          <Clock className="size-3.5" aria-hidden="true" />
          {copy.comingSoon}
        </span>

        {item.audience ? (
          <span className="absolute start-2 top-2 rounded-full bg-white/95 px-2 py-1 text-xs font-semibold text-[#C2410C] shadow-sm">
            {item.audience}
          </span>
        ) : null}

        <figcaption className="sr-only">{item.title}</figcaption>
      </figure>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-base font-bold text-black">{item.title}</h3>
        <p className="mt-2 text-sm leading-6 text-black">{item.description}</p>
        <div className="mt-4">
          <button
            type="button"
            onClick={() => setShowNote((v) => !v)}
            aria-expanded={showNote}
            aria-controls={noteId}
            aria-label={fmt(copy.previewAria, { title: item.title })}
            className={cn(popSecondaryButton, popButtonSizes.sm)}
          >
            <Play className="size-3.5 fill-current rtl:-scale-x-100" aria-hidden="true" />
            {copy.preview}
          </button>
          <p id={noteId} hidden={!showNote} className="mt-3 text-sm leading-6 text-black">
            {copy.comingSoonNote}
          </p>
        </div>
      </div>
    </motion.article>
  )
}

type TabKey = "demos" | "tutorials"
const TAB_KEYS: TabKey[] = ["demos", "tutorials"]

function DemoCenterTabs() {
  const { t, dir } = useI18n()
  const copy = t.landing.demo
  const [active, setActive] = useState<TabKey>("demos")
  const baseId = useId()
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({})

  const productDemos: MediaItem[] = copy.productDemos.map((item, i) => ({ ...item, icon: PRODUCT_DEMO_ICONS[i] ?? Zap }))
  const tutorials: MediaItem[] = copy.tutorials.map((item, i) => ({ ...item, icon: TUTORIAL_ICONS[i] ?? Sparkles }))

  function focusTabAt(index: number) {
    const target = TAB_KEYS[(index + TAB_KEYS.length) % TAB_KEYS.length]
    if (!target) return
    setActive(target)
    tabRefs.current[target]?.focus()
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLButtonElement>, index: number) {
    // In RTL the visually "next" tab is to the left.
    const step = dir === "rtl" ? -1 : 1
    switch (event.key) {
      case "ArrowRight":
        event.preventDefault()
        focusTabAt(index + step)
        break
      case "ArrowLeft":
        event.preventDefault()
        focusTabAt(index - step)
        break
      case "Home":
        event.preventDefault()
        focusTabAt(0)
        break
      case "End":
        event.preventDefault()
        focusTabAt(TAB_KEYS.length - 1)
        break
      default:
        break
    }
  }

  return (
    <div>
      <div role="tablist" aria-label={copy.tabsLabel} className="glass-pop inline-flex max-w-full flex-wrap gap-1.5 rounded-3xl p-1.5 sm:rounded-full">
        {TAB_KEYS.map((key, index) => {
          const selected = key === active
          return (
            <button
              key={key}
              ref={(node) => {
                tabRefs.current[key] = node
              }}
              type="button"
              role="tab"
              id={`${baseId}-tab-${key}`}
              aria-selected={selected}
              aria-controls={`${baseId}-panel-${key}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(key)}
              onKeyDown={(event) => handleKeyDown(event, index)}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                selected
                  ? "bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] text-white shadow-[0_8px_20px_-8px_rgba(37,99,235,0.6)]"
                  : "text-black hover:text-black",
                focusRingPop,
              )}
            >
              {copy.tabs[key]}
            </button>
          )
        })}
      </div>

      <div
        role="tabpanel"
        id={`${baseId}-panel-demos`}
        aria-labelledby={`${baseId}-tab-demos`}
        hidden={active !== "demos"}
        tabIndex={0}
        className={cn("mt-8 space-y-5 rounded-lg", focusRingPop)}
      >
        {active === "demos" ? (
          <>
            <FlagshipDemo />
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {productDemos.map((item) => (
                <MediaCard key={item.title} item={item} />
              ))}
            </div>
          </>
        ) : null}
      </div>

      <div
        role="tabpanel"
        id={`${baseId}-panel-tutorials`}
        aria-labelledby={`${baseId}-tab-tutorials`}
        hidden={active !== "tutorials"}
        tabIndex={0}
        className={cn("mt-8 rounded-lg", focusRingPop)}
      >
        {active === "tutorials" ? (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {tutorials.map((item) => (
              <MediaCard key={item.title} item={item} />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  )
}

export function DemoCenter() {
  const { t } = useI18n()
  const copy = t.landing.demo

  return (
    <section
      id="demo"
      aria-labelledby="demo-heading"
      className="pop-atmosphere relative overflow-hidden py-24 sm:py-28"
    >
      <div className="pop-grid pointer-events-none absolute inset-0 -z-10 opacity-[0.05]" aria-hidden="true" />
      <GlowOrb className="top-0 -right-24 size-[26rem] pop-float" color="rgba(59,130,246,0.16)" />
      <GlowOrb className="-bottom-24 -left-16 size-[24rem] pop-float-delay" color="rgba(127,224,224,0.18)" />

      <Container fluid>
        <Reveal className="max-w-2xl">
          <PopEyebrow>
            <span aria-hidden="true">▶</span> {copy.eyebrow}
          </PopEyebrow>
          <h2 id="demo-heading" className="mt-5 text-3xl font-bold tracking-tight text-balance text-black sm:text-4xl">
            {copy.title}
          </h2>
          <p className="mt-4 text-base leading-7 text-black">{copy.description}</p>
        </Reveal>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.55, ease: "easeOut", delay: 0.05 }}
          className="mt-12"
        >
          <DemoCenterTabs />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
          className="glass-pop glow-border-pop mt-10 flex flex-col items-center gap-3 rounded-3xl p-6 text-center sm:p-8"
        >
          <p className="text-base font-semibold text-black sm:text-lg">{copy.ctaTitle}</p>
          <p className="max-w-md text-sm leading-6 text-black">{copy.ctaBody}</p>
          <Magnetic className="mt-2">
            <Link href={APP_ROUTES.translate} className={cn(popPrimaryButton, popButtonSizes.lg)}>
              {copy.ctaButton}
              <ArrowRight className={popArrowIcon} aria-hidden="true" />
            </Link>
          </Magnetic>
        </motion.div>
      </Container>
    </section>
  )
}

