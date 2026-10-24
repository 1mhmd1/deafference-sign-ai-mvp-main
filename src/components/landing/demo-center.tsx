"use client"

import { useId, useState } from "react"
import { motion } from "framer-motion"
import { Clock, HeartPulse, Play, Siren, Sparkles, type LucideIcon } from "lucide-react"
import { Container } from "@/components/shared/container"
import { cn } from "@/lib/utils"
import { useI18n } from "@/i18n/use-i18n"
import { GlowOrb, PopEyebrow, Reveal, popButtonSizes, popSecondaryButton } from "./ui/pop"

/** Icons zipped by index with `t.landing.demo.tutorials`. */
const TUTORIAL_ICONS: LucideIcon[] = [Sparkles, HeartPulse, Siren]

type MediaItem = { icon: LucideIcon; title: string; description: string; audience?: string }

/** Light, brand-tinted "screen" surface used by the video placeholders. */
const SCREEN_SURFACE =
  "border border-[color:var(--primary)]/15 bg-gradient-to-br from-[#EAF2FF] via-white to-[#F1EEFF]"

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
        <h4 className="text-base font-bold text-black">{item.title}</h4>
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

export function DemoCenter() {
  const { t } = useI18n()
  const copy = t.landing.demo
  const tutorials: MediaItem[] = copy.tutorials.map((item, i) => ({ ...item, icon: TUTORIAL_ICONS[i] ?? Sparkles }))

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
        </Reveal>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.55, ease: "easeOut", delay: 0.05 }}
          className="mt-12"
        >
          <h3 className="text-lg font-bold text-black sm:text-xl">{copy.tutorialsTitle}</h3>
          <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {tutorials.map((item) => (
              <MediaCard key={item.title} item={item} />
            ))}
          </div>
        </motion.div>
      </Container>
    </section>
  )
}
