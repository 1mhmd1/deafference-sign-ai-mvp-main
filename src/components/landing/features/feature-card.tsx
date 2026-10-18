"use client"

import { motion } from "framer-motion"
import { ArrowUpRight, Sparkles, type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { useI18n } from "@/i18n/use-i18n"
import type { FeatureCardData } from "./feature-card-grid"
import { focusRingPop } from "../ui/pop"

/** One side of a translation direction: spoken/written language ("voice", orange) or sign ("sign", blue). */
export type Modality = { Icon: LucideIcon; tone: "voice" | "sign"; label: string }

const TONE = {
  voice: {
    hex: "#F97316",
    node: "bg-brand-orange/10 text-[#C2410C] ring-brand-orange/30",
    halo: "border-brand-orange/40",
  },
  sign: {
    hex: "#2563EB",
    node: "bg-[color:var(--primary)]/10 text-[#1D4ED8] ring-[color:var(--primary)]/30",
    halo: "border-[color:var(--primary)]/40",
  },
} as const

function ModalityNode({ modality, pulse }: { modality: Modality; pulse: boolean }) {
  const tone = TONE[modality.tone]
  return (
    <div className="flex w-16 shrink-0 flex-col items-center gap-2">
      <span className={cn("relative flex size-14 items-center justify-center rounded-2xl ring-1", tone.node)}>
        {pulse && (
          <motion.span
            className={cn("absolute inset-0 rounded-2xl border", tone.halo)}
            animate={{ scale: [1, 1.35], opacity: [0.7, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
          />
        )}
        <modality.Icon className="size-6" strokeWidth={1.75} />
      </span>
      {modality.label ? (
        <span className="max-w-full truncate text-[11px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
          {modality.label}
        </span>
      ) : null}
    </div>
  )
}

/** The concept, drawn instead of a picture: input → AI → output, with packets flowing across. */
function ConceptDiagram({ from, to, reducedMotion }: { from: Modality; to: Modality; reducedMotion: boolean }) {
  const { dir } = useI18n()
  const travel = dir === "rtl" ? ["100%", "0%"] : ["0%", "100%"]
  const toward = dir === "rtl" ? "to left" : "to right"
  return (
    <div
      aria-hidden="true"
      className="relative flex items-center gap-3 overflow-hidden rounded-xl border border-border bg-[radial-gradient(circle,rgba(37,99,235,0.12)_1px,transparent_1px)] [background-size:16px_16px] px-4 py-6"
    >
      <ModalityNode modality={from} pulse={false} />

      <div className="relative h-14 flex-1 self-start">
        {/* Track from the input colour to the output colour. */}
        <span
          className="absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 rounded-full opacity-60"
          style={{ background: `linear-gradient(${toward}, ${TONE[from.tone].hex}, ${TONE[to.tone].hex})` }}
        />
        {!reducedMotion &&
          [0, 1, 2].map((n) => (
            <motion.span
              key={n}
              className="absolute top-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{ background: n % 2 ? TONE[to.tone].hex : TONE[from.tone].hex }}
              animate={{ left: travel, opacity: [0, 1, 1, 0] }}
              transition={{ duration: 2.1, repeat: Infinity, delay: n * 0.7, ease: "easeInOut" }}
            />
          ))}
        {/* AI in the middle of the conversion. */}
        <span className="absolute top-1/2 left-1/2 flex size-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card text-[#C2410C] shadow-sm">
          <Sparkles className="size-4" strokeWidth={1.75} />
        </span>
      </div>

      <ModalityNode modality={to} pulse={!reducedMotion} />
    </div>
  )
}

export function FeatureCard({ card, reducedMotion = false }: { card: FeatureCardData; reducedMotion?: boolean }) {
  const { dir } = useI18n()
  const { title, pillText, icon: Icon, from, to, subtitle, badgeTag, detail, learnMore, learnMoreHref } = card
  const toward = dir === "rtl" ? "to left" : "to right"
  const fromHex = TONE[from.tone].hex
  const toHex = TONE[to.tone].hex

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-[0_1px_2px_rgba(16,24,40,0.05),0_14px_32px_-22px_rgba(16,24,40,0.2)] transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-[color:var(--primary)]/30 hover:shadow-[0_1px_2px_rgba(16,24,40,0.05),0_28px_56px_-28px_rgba(30,64,175,0.35)]">
      {/* Top edge runs from the input colour to the output colour of this direction. */}
      <span aria-hidden="true" className="absolute inset-x-0 top-0 h-1" style={{ background: `linear-gradient(${toward}, ${fromHex}, ${toHex})` }} />

      <div className="flex items-start gap-3">
        <span
          aria-hidden="true"
          className="flex size-11 shrink-0 items-center justify-center rounded-xl text-white shadow-[0_10px_20px_-10px_rgba(37,99,235,0.6)] transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105"
          style={{ background: `linear-gradient(135deg, ${fromHex}, ${toHex})` }}
        >
          <Icon className="size-5" strokeWidth={1.75} />
        </span>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <h4 className="text-lg leading-tight font-bold tracking-tight text-foreground">{title}</h4>
            {badgeTag && (
              <span className="inline-flex items-center rounded-md border border-border bg-muted/40 px-1.5 py-0.5 text-[11px] font-semibold text-black">
                {badgeTag}
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
        </div>
      </div>

      <div className="mt-5">
        <ConceptDiagram from={from} to={to} reducedMotion={reducedMotion} />
        {/* Screen readers get the direction as text; the diagram above is decorative. */}
        <p className={cn("mt-2 text-center text-xs font-semibold tracking-wider text-muted-foreground uppercase", from.label && "sr-only")}>
          {pillText}
        </p>
      </div>

      <p className="mt-4 flex-1 text-sm leading-6 text-muted-foreground">{detail}</p>

      <a
        href={learnMoreHref}
        className={cn(
          "mt-4 inline-flex w-fit items-center gap-1 rounded-md text-sm font-semibold text-[#1D4ED8] underline-offset-4 hover:underline",
          focusRingPop,
        )}
      >
        {learnMore}
        <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 rtl:-scale-x-100" aria-hidden="true" />
      </a>
    </article>
  )
}
