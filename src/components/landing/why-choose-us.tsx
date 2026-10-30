"use client"

import { motion } from "framer-motion"
import {
  Ambulance,
  ArchiveX,
  ArrowRight,
  AudioLines,
  Camera,
  CameraOff,
  CirclePause,
  ClipboardCheck,
  Contrast,
  Hand,
  Mic,
  MicOff,
  Pill,
  Stethoscope,
  Type,
  type LucideIcon,
} from "lucide-react"
import { Container } from "@/components/shared/container"
import { SectionTitle } from "@/components/shared/section-title"
import { cn } from "@/lib/utils"
import { useI18n } from "@/i18n/use-i18n"
import type { LandingMessages } from "@/i18n/messages/landing"
import { useLandingReducedMotion } from "./calm-mode"
import { GlassPanel, popStage as STAGE, popTile as TILE, staggerContainer, staggerItem } from "./ui/pop"

type VisualCopy = LandingMessages["why"]["visual"]

const LABEL = "text-xs font-semibold text-black"

/** A switch drawn in its "on" position, with the word "On" so the state isn't carried by colour alone. */
function OnSwitch({ on }: { on: string }) {
  return (
    <div className="flex items-center gap-2">
      <small className="text-[11px] font-bold text-[color:var(--primary)] uppercase">{on}</small>
      <div className="flex h-6 w-10 items-center justify-end rounded-full bg-gradient-to-r from-[#D63C1A] to-[#B01030] p-0.5">
        <div className="size-5 rounded-full bg-[#fff] shadow" />
      </div>
    </div>
  )
}

/** Accessibility first: the three display settings the app really has (text size, high contrast, reduced motion), switched on. */
function AccessibilityVisual({ copy }: { copy: VisualCopy }) {
  const rows: { icon: LucideIcon; label: string; control: React.ReactNode }[] = [
    {
      icon: Type,
      label: copy.textSize,
      control: (
        <div className="flex items-end gap-1 rounded-lg bg-[color:var(--primary)]/8 p-1" dir="ltr">
          <b className="grid size-7 place-items-center rounded-md text-xs text-black">A</b>
          <b className="grid size-7 place-items-center rounded-md bg-white text-lg text-[color:var(--primary)] shadow-sm">A</b>
        </div>
      ),
    },
    { icon: Contrast, label: copy.contrast, control: <OnSwitch on={copy.on} /> },
    { icon: CirclePause, label: copy.motion, control: <OnSwitch on={copy.on} /> },
  ]
  return (
    <div className="mx-auto flex w-full max-w-sm flex-col gap-2.5">
      {rows.map(({ icon: Icon, label, control }) => (
        <div key={label} className="flex items-center justify-between gap-3 rounded-2xl bg-white/90 px-3.5 py-3 shadow-[0_10px_24px_-18px_rgba(94,15,69,0.5)] ring-1 ring-[color:var(--primary)]/10">
          <div className="flex items-center gap-3">
            <div className={cn(TILE, "size-9")}>
              <Icon className="size-[18px]" />
            </div>
            <div className="text-sm font-semibold text-black">{label}</div>
          </div>
          {control}
        </div>
      ))}
    </div>
  )
}

/** Healthcare moments: a patient and a clinician on either side of Deafference, over the four places it is made for. */
function HealthcareVisual({ copy }: { copy: VisualCopy }) {
  const placeIcons: LucideIcon[] = [ClipboardCheck, Stethoscope, Pill, Ambulance]
  return (
    <div className="flex w-full flex-col items-center gap-4">
      <div className="flex items-center gap-2">
        <div className="flex flex-col items-center gap-1.5">
          <div className={cn(TILE, "size-11")}>
            <Hand className="size-5" />
          </div>
          <div className={LABEL}>{copy.patient}</div>
        </div>
        <div className="mb-5 h-px w-6 bg-[color:var(--primary)]/40" />
        <div className="mb-5 grid size-12 place-items-center rounded-full bg-white shadow-[0_0_0_5px_rgba(242,140,26,0.18)]">
          <img src="/deafference-mark.png" alt="" className="size-7 object-contain" />
        </div>
        <div className="mb-5 h-px w-6 bg-[color:var(--primary)]/40" />
        <div className="flex flex-col items-center gap-1.5">
          <div className={cn(TILE, "size-11")}>
            <Stethoscope className="size-5" />
          </div>
          <div className={LABEL}>{copy.clinician}</div>
        </div>
      </div>
      <div className="flex flex-wrap justify-center gap-1.5">
        {copy.places.map((place, i) => {
          const Icon = placeIcons[i] ?? Stethoscope
          return (
            <div key={place} className="inline-flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-[11px] font-semibold text-black ring-1 ring-[color:var(--primary)]/12">
              <Icon className="size-3.5 text-[color:var(--primary)]" />
              {place}
            </div>
          )
        })}
      </div>
    </div>
  )
}

/** One direction of the exchange: from-tile → a track with a travelling dot → to-tile. */
function Lane({ from, to, reduced, delay }: { from: { icon: LucideIcon; label: string }; to: { icon: LucideIcon; label: string }; reduced: boolean; delay: number }) {
  const From = from.icon
  const To = to.icon
  return (
    <div className="flex items-center gap-2">
      <div className="flex w-16 flex-col items-center gap-1">
        <div className={cn(TILE, "size-10")}>
          <From className="size-5" />
        </div>
        <div className={LABEL}>{from.label}</div>
      </div>
      {/* Mirrored in RTL as a whole, so the dot always travels the way the arrow points. */}
      <div className="relative mb-5 h-1 flex-1 overflow-hidden rounded-full bg-[color:var(--primary)]/15 rtl:-scale-x-100">
        {reduced ? null : (
          <motion.div
            className="absolute inset-y-0 w-1/3 rounded-full bg-gradient-to-r from-transparent via-[#D63C1A] to-transparent"
            initial={{ left: "-35%" }}
            animate={{ left: ["-35%", "100%"] }}
            transition={{ duration: 1.8, delay, repeat: Infinity, repeatDelay: 0.9, ease: "easeInOut" }}
          />
        )}
      </div>
      <ArrowRight className="mb-5 size-4 shrink-0 text-[color:var(--primary)] rtl:-scale-x-100" />
      <div className="flex w-16 flex-col items-center gap-1">
        <div className={cn(TILE, "size-10")}>
          <To className="size-5" />
        </div>
        <div className={LABEL}>{to.label}</div>
      </div>
    </div>
  )
}

/** Two-way: sign → speech on one lane, speech → sign on the other, moving at the same time. */
function TwoWayVisual({ copy }: { copy: VisualCopy }) {
  const reduced = useLandingReducedMotion()
  const sign = { icon: Hand, label: copy.sign }
  const speech = { icon: AudioLines, label: copy.speech }
  return (
    <div className="flex w-full max-w-xs flex-col gap-3">
      <Lane from={sign} to={speech} reduced={reduced} delay={0} />
      <Lane from={speech} to={sign} reduced={reduced} delay={1.3} />
    </div>
  )
}

/**
 * Private by design: camera and mic on during a session, off after it, and nothing kept in the account.
 * Also the opening picture of /security and the "Private & secure" card on /how-it-works.
 */
export function PrivacyVisual({ copy }: { copy: VisualCopy }) {
  const state = (label: string, on: boolean) => (
    <div className="flex flex-col items-center gap-2">
      <div className={cn("flex gap-1.5 rounded-2xl p-2", on ? "bg-gradient-to-br from-[#D63C1A] to-[#B01030]" : "bg-white ring-1 ring-[color:var(--primary)]/15")}>
        {[on ? Camera : CameraOff, on ? Mic : MicOff].map((Icon, i) => (
          <div key={i} className={cn("grid size-9 place-items-center rounded-xl", on ? "bg-white/15 text-white" : "text-black/55 dark:text-white/60")}>
            <Icon className="size-[18px]" />
          </div>
        ))}
      </div>
      <div className={LABEL}>{label}</div>
    </div>
  )
  return (
    <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
      {state(copy.sessionOn, true)}
      <ArrowRight className="mb-6 size-4 text-[color:var(--primary)] rtl:-scale-x-100" />
      {state(copy.sessionOff, false)}
      <div className="mb-6 inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-black ring-1 ring-[color:var(--primary)]/15">
        <ArchiveX className="size-4 text-[color:var(--primary)]" />
        {copy.notSaved}
      </div>
    </div>
  )
}

const VISUALS = [AccessibilityVisual, HealthcareVisual, TwoWayVisual, PrivacyVisual] as const

/**
 * Grid placement (3 columns on desktop): wide + narrow on the first row, narrow + wide on the second.
 * Wide cards put their diagram beside the text, so no card is left mostly empty.
 */
const LAYOUT = [
  { area: "sm:col-span-2", stage: "min-h-48 lg:w-[26rem] lg:shrink-0", wide: true },
  { area: "", stage: "min-h-44", wide: false },
  { area: "", stage: "min-h-44", wide: false },
  { area: "sm:col-span-2", stage: "min-h-44 lg:w-[26rem] lg:shrink-0", wide: true },
] as const

export function WhyChooseUs() {
  const { t } = useI18n()
  const why = t.landing.why

  return (
    <section id="why-choose-us" className="relative overflow-hidden py-24 sm:py-28">

      <Container fluid>
        <SectionTitle eyebrow={why.eyebrow} title={why.title} />

        <motion.ul
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {why.reasons.map((item, index) => {
            const layout = LAYOUT[index] ?? LAYOUT[1]
            const Visual = VISUALS[index] ?? HealthcareVisual
            return (
              <motion.li key={item.title} variants={staggerItem} className={cn("flex", layout.area)}>
                <GlassPanel className={cn("flex w-full flex-col gap-5 p-5 sm:p-6", layout.wide && "lg:flex-row lg:items-center lg:gap-8")}>
                  <div aria-hidden="true" className={cn("flex items-center justify-center p-4", STAGE, layout.stage)}>
                    <Visual copy={why.visual} />
                  </div>
                  <div className={cn(layout.wide && "lg:flex-1")}>
                    <h3 className={cn("font-semibold text-black", index === 0 ? "text-xl sm:text-2xl" : "text-lg")}>{item.title}</h3>
                    <p className="mt-1.5 text-sm leading-6 text-black sm:text-base">{item.description}</p>
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
