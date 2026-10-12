"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { useInView } from "framer-motion"
import { Container } from "@/components/shared/container"
import { JudyCharacter, type JudyPose } from "@/components/judy/judy-character"
import { cn } from "@/lib/utils"
import { useI18n } from "@/i18n/use-i18n"
import { useLandingReducedMotion } from "./calm-mode"
import { GlowOrb, PopEyebrow, Reveal } from "./ui/pop"

// Spots are where Judy's feet go, as % of the illustration (left, top).
// scenarios-hub.png is 1672×941; the numbers were read off the artwork.
type Spot = { left: number; top: number }

// Labels and Judy's lines come from `t.landing.scenarios.items`, zipped by index.
type Scenario = {
  /** Standing spot on the room's floor. */
  at: Spot
  /** Where the room's road meets the hub ring. */
  road: Spot
  /** Extra ring points to pass on the way to the next room, so she walks around the hub, not through it. */
  via?: Spot[]
  pose: JudyPose
}

const SCENARIOS: Scenario[] = [
  { at: { left: 52, top: 29 }, road: { left: 55.9, top: 34 }, pose: "listen" }, // Healthcare
  { at: { left: 77.2, top: 35.6 }, road: { left: 60.4, top: 36.1 }, pose: "wave" }, // Hospitality
  { at: { left: 71.8, top: 63.8 }, road: { left: 60.4, top: 49.9 }, pose: "point" }, // Workplaces
  // Emergencies
  { at: { left: 58.3, top: 85 }, road: { left: 56.8, top: 60.6 }, via: [{ left: 50.5, top: 64.8 }], pose: "listen" },
  { at: { left: 28.7, top: 81.8 }, road: { left: 41.3, top: 59.5 }, pose: "phone" }, // Travel
  { at: { left: 19.7, top: 62.7 }, road: { left: 35.9, top: 48.9 }, pose: "point" }, // Services & Public
  // Education
  { at: { left: 26.9, top: 39.3 }, road: { left: 41.3, top: 35.1 }, via: [{ left: 48.4, top: 33.5 }], pose: "cute-think" },
]

// Must match `.judy-in-scene { width: 4.2% }` so her feet land on the spot.
const JUDY_HALF_WIDTH = 2.1
const IMAGE_ASPECT = 941 / 1672
const MS_PER_UNIT = 110
const VISIT_MS = 3800

export function Scenarios() {
  const { t } = useI18n()
  const copy = t.landing.scenarios
  const sceneRef = useRef<HTMLDivElement>(null)
  const inView = useInView(sceneRef, { amount: 0.3 })
  const reduceMotion = useLandingReducedMotion()

  const [stopIndex, setStopIndex] = useState(0)
  const [spot, setSpot] = useState<Spot>(SCENARIOS[0].at)
  const [pose, setPose] = useState<JudyPose>("idle")
  const [facing, setFacing] = useState<"left" | "right">("right")
  // Index of the stop whose line Judy is saying (null = bubble hidden), so the text follows the UI language.
  const [speaking, setSpeaking] = useState<number | null>(null)
  const [travelMs, setTravelMs] = useState(0)
  // The loop reads these between awaits, so it resumes where she is when the section scrolls back in.
  const spotRef = useRef(spot)
  const stopRef = useRef(stopIndex)

  useEffect(() => {
    if (!inView || reduceMotion) return
    let cancelled = false
    const timers = new Set<number>()
    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        const id = window.setTimeout(() => {
          timers.delete(id)
          resolve()
        }, ms)
        timers.add(id)
      })

    const walkTo = async (to: Spot) => {
      const from = spotRef.current
      const distance = Math.hypot(to.left - from.left, (to.top - from.top) * IMAGE_ASPECT)
      const ms = Math.max(350, Math.round(distance * MS_PER_UNIT))
      if (Math.abs(to.left - from.left) > 0.5) setFacing(to.left < from.left ? "left" : "right")
      setTravelMs(ms)
      setPose("walk")
      spotRef.current = to
      setSpot(to)
      await wait(ms)
    }

    const tour = async () => {
      while (!cancelled) {
        const here = SCENARIOS[stopRef.current]
        setPose(here.pose)
        setSpeaking(stopRef.current)
        await wait(VISIT_MS)
        if (cancelled) return
        setSpeaking(null)
        await wait(400)

        const nextIndex = (stopRef.current + 1) % SCENARIOS.length
        const next = SCENARIOS[nextIndex]
        stopRef.current = nextIndex
        setStopIndex(nextIndex)
        for (const point of [here.road, ...(here.via ?? []), next.road, next.at]) {
          if (cancelled) return
          await walkTo(point)
        }
      }
    }
    tour()

    return () => {
      cancelled = true
      timers.forEach((id) => window.clearTimeout(id))
      setSpeaking(null)
    }
  }, [inView, reduceMotion])

  const currentItem = copy.items[stopIndex]
  // Without motion Judy stays put, so her line for the current stop is always shown.
  const message = reduceMotion ? (currentItem?.message ?? "") : speaking !== null ? (copy.items[speaking]?.message ?? "") : ""

  return (
    <section id="scenarios" aria-labelledby="scenarios-heading" className="pop-atmosphere relative overflow-hidden py-24 sm:py-28">
      <GlowOrb className="-top-24 right-0 size-[26rem] pop-float" color="rgba(45,212,191,0.16)" />

      <Container fluid>
        <Reveal className="max-w-2xl">
          <PopEyebrow>
            <span aria-hidden="true">🧭</span> {copy.eyebrow}
          </PopEyebrow>
          <h2 id="scenarios-heading" className="mt-5 text-3xl font-bold tracking-tight text-balance text-black sm:text-4xl">
            {copy.title}
          </h2>
          <p className="mt-4 text-base leading-7 text-black">{copy.description}</p>
        </Reveal>

        <Reveal delay={0.1} className="mt-12">
          <div ref={sceneRef} className="relative aspect-[1672/941] w-full" style={{ ["--judy-travel" as string]: `${travelMs}ms` }}>
            <Image
              src="/scenarios-hub.png"
              alt={copy.imageAlt}
              fill
              sizes="(max-width: 1024px) 100vw, 1024px"
              className="object-contain"
            />
            {/* Artwork coordinates: Judy's spots stay physical (left/bottom) in both directions. */}
            <JudyCharacter
              className="judy-in-scene"
              announce={false}
              label={t.landing.judy.sceneLabel}
              x={`${spot.left - JUDY_HALF_WIDTH}%`}
              y={`${100 - spot.top}%`}
              pose={pose}
              facing={facing}
              message={message}
            />
          </div>

          {/* Text version of Judy's bubble: readable at any screen size, not announced on every change. */}
          {currentItem ? (
            <p className="mt-5 text-center text-sm leading-6 text-black sm:text-base">
              <span className="font-semibold text-[#1D4ED8]">{copy.nowLabel}</span> {currentItem.label} — {currentItem.message}
            </p>
          ) : null}

          <ul className="mt-4 flex flex-wrap justify-center gap-2" aria-label={copy.listLabel}>
            {copy.items.map((item, i) => (
              <li
                key={item.label}
                aria-current={i === stopIndex ? "true" : undefined}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-semibold transition-colors",
                  i === stopIndex
                    ? "border-[#1D4ED8] bg-[#1D4ED8] text-white"
                    : "border-[color:var(--primary)]/25 bg-white/60 text-[#1D4ED8]",
                )}
              >
                {item.label}
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </section>
  )
}

