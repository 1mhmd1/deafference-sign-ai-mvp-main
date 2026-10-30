"use client"

import { motion } from "framer-motion"
import { AppWindow, ArrowLeftRight, Captions, Laptop, Mic, MonitorSmartphone, SlidersHorizontal, Smartphone, Tablet } from "lucide-react"
import { Container } from "@/components/shared/container"
import { SectionTitle } from "@/components/shared/section-title"
import { cn } from "@/lib/utils"
import { useI18n } from "@/i18n/use-i18n"
import { useLandingReducedMotion } from "./calm-mode"
import { AnimatedNumber, GlassPanel, popStage, popTile, staggerContainer, staggerItem } from "./ui/pop"

const QUALITY_ICONS = [AppWindow, MonitorSmartphone, SlidersHorizontal]

// Fixed bar heights (no randomness) so server and client draw the same waveform.
const BARS = [8, 14, 20, 12, 24, 16, 22, 10, 18, 12] as const

/** Real-time: the speaker's words and the captions move at the same time, not one after the other. */
function RealTimeVisual() {
  const reduced = useLandingReducedMotion()
  return (
    <div className="flex w-full max-w-[15rem] flex-col gap-3">
      <div className="flex items-center gap-3">
        <div className={cn(popTile, "size-10")}>
          <Mic className="size-5" />
        </div>
        <div className="flex h-7 flex-1 items-center gap-1">
          {BARS.map((h, i) => (
            <motion.div
              key={i}
              className="w-1.5 rounded-full bg-[#E0601A]"
              style={{ height: h }}
              animate={reduced ? undefined : { scaleY: [0.5, 1, 0.65, 1] }}
              transition={{ duration: 1.3, repeat: Infinity, delay: i * 0.06, ease: "easeInOut" }}
            />
          ))}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className={cn(popTile, "size-10")}>
          <Captions className="size-5" />
        </div>
        <div className="flex flex-1 flex-col gap-1.5">
          {/* Caption lines write themselves in while the bars above are still moving. */}
          {["100%", "70%"].map((width, i) => (
            <div key={width} className="h-1.5 overflow-hidden rounded-full bg-[color:var(--primary)]/12">
              <motion.div
                className="h-full origin-[left] rounded-full bg-[color:var(--primary)] rtl:origin-[right]"
                style={{ width }}
                initial={{ scaleX: reduced ? 1 : 0 }}
                animate={reduced ? { scaleX: 1 } : { scaleX: [0, 1, 1] }}
                transition={reduced ? { duration: 0 } : { duration: 2.6, repeat: Infinity, delay: i * 0.4, times: [0, 0.7, 1], ease: "easeOut" }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/** Any screen: phone, tablet and laptop, the devices people already have. */
function AnyScreenVisual() {
  return (
    <div className="flex items-end gap-3">
      <div className={cn(popTile, "size-11")}>
        <Smartphone className="size-5" />
      </div>
      <div className={cn(popTile, "size-14 rounded-2xl")}>
        <Tablet className="size-7" />
      </div>
      <div className={cn(popTile, "size-[4.5rem] rounded-2xl")}>
        <Laptop className="size-9" />
      </div>
    </div>
  )
}

/** Two languages: the full interface in English and in Arabic (each name in its own script). */
function LanguagesVisual() {
  const chip = "rounded-xl bg-white px-3.5 py-2.5 text-base font-bold text-black shadow-[0_10px_24px_-16px_rgba(94,15,69,0.45)] ring-1 ring-[color:var(--primary)]/12"
  return (
    <div className="flex items-center gap-3">
      <div className={chip} lang="en" dir="ltr">
        English
      </div>
      <ArrowLeftRight className="size-5 text-[color:var(--primary)]" />
      <div className={chip} lang="ar" dir="rtl">
        العربية
      </div>
    </div>
  )
}

const METRIC_VISUALS = [RealTimeVisual, AnyScreenVisual, LanguagesVisual]

/** Splits a metric string like "2 languages" into an animatable number plus its surrounding
 * text, so figures can count up. Returns null for non-numeric metrics, which render as plain text. */
function parseMetric(value: string) {
  const match = value.match(/-?\d+(?:\.\d+)?/)
  if (!match || match.index === undefined) return null
  return {
    prefix: value.slice(0, match.index),
    number: Number(match[0]),
    suffix: value.slice(match.index + match[0].length),
  }
}

export function Performance() {
  const { t } = useI18n()
  const copy = t.landing.performance
  return (
    <section
      id="performance"
      aria-labelledby="performance-heading"
      className="relative py-24 sm:py-28"
    >
      <Container fluid>
        <SectionTitle
          headingId="performance-heading"
          eyebrow={copy.eyebrow}
          title={copy.title}
        />

        <motion.ul
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="mt-12 grid gap-4 md:grid-cols-3"
        >
          {copy.metrics.map((metric, index) => {
            const Visual = METRIC_VISUALS[index] ?? AnyScreenVisual
            const parsed = parseMetric(metric.value)
            return (
              <motion.li key={metric.label} variants={staggerItem} className="flex">
                <GlassPanel className="flex w-full flex-col p-5 sm:p-6">
                  <div aria-hidden="true" className={cn("flex h-36 items-center justify-center p-4", popStage)}>
                    <Visual />
                  </div>
                  <p className="mt-5 text-3xl font-semibold tracking-tight">
                    {parsed ? (
                      <b className="pop-gradient-text font-semibold">
                        {parsed.prefix}
                        <AnimatedNumber value={parsed.number} suffix={parsed.suffix} />
                      </b>
                    ) : (
                      <b className="pop-gradient-text font-semibold">{metric.value}</b>
                    )}
                  </p>
                  <p className="mt-1.5 text-sm leading-6 text-black">{metric.label}</p>
                </GlassPanel>
              </motion.li>
            )
          })}
        </motion.ul>

        <motion.ul
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="mt-4 grid gap-4 md:grid-cols-3"
        >
          {copy.qualities.map((item, i) => {
            const Icon = QUALITY_ICONS[i] ?? AppWindow
            return (
              <motion.li key={item.title} variants={staggerItem} className="flex">
                <GlassPanel className="flex w-full items-start gap-4 p-5">
                  <div aria-hidden="true" className={cn(popTile, "size-11")}>
                    <Icon className="size-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-black">{item.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-black">{item.text}</p>
                  </div>
                </GlassPanel>
              </motion.li>
            )
          })}
        </motion.ul>
      </Container>
    </section>
  )
}
