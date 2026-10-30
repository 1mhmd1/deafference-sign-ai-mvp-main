"use client"

import { motion } from "framer-motion"
import { Captions, FileText, Hand, Keyboard, Mic, MessageSquare, Volume2, type LucideIcon } from "lucide-react"
import { FeatureCard, type Modality } from "./feature-card"
import { useI18n } from "@/i18n/use-i18n"
import { useLandingReducedMotion } from "../calm-mode"
import { staggerContainer, staggerItem } from "../ui/pop"

export interface FeatureCardData {
  id: string
  title: string
  subtitle: string
  pillText: string
  icon: LucideIcon
  /** What goes in and what comes out; drawn as the card's concept diagram. */
  from: Modality
  to: Modality
  badgeTag: string
  detail: string
  learnMore: string
  learnMoreHref: string
}

// Orange carries spoken/written language, blue carries sign (same story as "How it works").
const SPEECH = { Icon: Mic, tone: "voice" } as const
const VOICE_OUT = { Icon: Volume2, tone: "voice" } as const
const TYPING = { Icon: Keyboard, tone: "voice" } as const
const CAPTIONS = { Icon: Captions, tone: "voice" } as const
const SIGN = { Icon: Hand, tone: "sign" } as const

/** Icons and concept diagrams, zipped by index with `t.landing.features.cards`. */
const FEATURE_VISUALS = [
  { id: "speech-to-sign", icon: Mic, from: SPEECH, to: SIGN },
  { id: "sign-to-speech", icon: Volume2, from: SIGN, to: VOICE_OUT },
  { id: "text-to-sign", icon: MessageSquare, from: TYPING, to: SIGN },
  { id: "sign-to-text", icon: FileText, from: SIGN, to: CAPTIONS },
] as const

/** "SPEECH → SIGN" / "الكلام ← الإشارة" → ["SPEECH", "SIGN"]; null if the pill has no arrow. */
function splitPill(pill: string): [string, string] | null {
  const parts = pill.split(/\s*[→←]\s*/)
  return parts.length === 2 ? [parts[0], parts[1]] : null
}

export function FeatureCardGrid() {
  const { t } = useI18n()
  const copy = t.landing.features
  const reducedMotion = useLandingReducedMotion()
  const cards: FeatureCardData[] = FEATURE_VISUALS.map((visual, i) => {
    const text = copy.cards[i]
    const pill = text?.pill ?? ""
    const labels = splitPill(pill)
    return {
      id: visual.id,
      icon: visual.icon,
      from: { ...visual.from, label: labels?.[0] ?? "" },
      to: { ...visual.to, label: labels?.[1] ?? "" },
      title: text?.title ?? "",
      subtitle: text?.subtitle ?? "",
      pillText: pill,
      badgeTag: text?.badge ?? "",
      detail: text?.detail ?? "",
      learnMore: copy.learnMore,
      // The demo center is on the home page (these cards live on /how-it-works).
      learnMoreHref: "/#demo",
    }
  })

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4"
    >
      {cards.map((card) => (
        <motion.div key={card.id} variants={staggerItem} className="h-full">
          <FeatureCard card={card} reducedMotion={reducedMotion} />
        </motion.div>
      ))}
    </motion.div>
  )
}
