"use client"

import { motion } from "framer-motion"
import { ArrowUpRight, type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { useI18n } from "@/i18n/use-i18n"
import type { FeatureCardData } from "./feature-card-grid"
import { focusRingPop, popStage } from "../ui/pop"

/** One side of a translation direction: spoken/written language ("voice", orange) or sign ("sign", crimson). */
export type Modality = { Icon: LucideIcon; tone: "voice" | "sign"; label: string }

// Both ends of the logo: orange for spoken/written language, crimson for sign.
const TONE = {
  voice: {
    hex: "#E0601A",
    node: "bg-[#fff] text-[#C2410C] ring-[#E0601A]/35 dark:bg-[#211620] dark:text-[#ffa36b]",
    halo: "border-[#E0601A]/40",
  },
  sign: {
    hex: "#B01030",
    node: "bg-[#fff] text-[#B01030] ring-[#B01030]/30 dark:bg-[#211620] dark:text-[#ff8fa8]",
    halo: "border-[#B01030]/40",
  },
} as const

function ModalityNode({ modality, pulse }: { modality: Modality; pulse: boolean }) {
  const tone = TONE[modality.tone]
  return (
    <div className="flex w-16 shrink-0 flex-col items-center gap-2">
      {/* A div, not a span: the landing forces span text (and so the icon's currentColor) dark. */}
      <div className={cn("relative flex size-14 items-center justify-center rounded-2xl shadow-[0_10px_24px_-16px_rgba(94,15,69,0.45)] ring-1", tone.node)}>
        {pulse && (
          <motion.span
            className={cn("absolute inset-0 rounded-2xl border", tone.halo)}
            animate={{ scale: [1, 1.35], opacity: [0.7, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
          />
        )}
        <modality.Icon className="size-6" strokeWidth={1.75} />
      </div>
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
      className={cn("relative flex items-center gap-3 overflow-hidden px-4 py-6", popStage)}
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
        {/* Deafference in the middle of the conversion. */}
        <div className="absolute top-1/2 left-1/2 grid size-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[#fff] shadow-[0_0_0_4px_rgba(242,140,26,0.16)]">
          <img src="/deafference-mark.png" alt="" className="size-5 object-contain" />
        </div>
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
    <article className="glass-pop group relative flex h-full flex-col overflow-hidden rounded-2xl border p-6 transition-transform duration-300 hover:-translate-y-1">
      {/* Top edge runs from the input colour to the output colour of this direction. */}
      <span aria-hidden="true" className="absolute inset-x-0 top-0 h-1" style={{ background: `linear-gradient(${toward}, ${fromHex}, ${toHex})` }} />

      <div className="flex items-start gap-3">
        <span
          aria-hidden="true"
          className="on-brand flex size-11 shrink-0 items-center justify-center rounded-xl text-white shadow-[0_10px_20px_-10px_rgba(176,16,48,0.55)] transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105"
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
