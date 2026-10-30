"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import {
  ArrowRight,
  Camera,
  CirclePlay,
  Hand,
  Languages,
  ListChecks,
  Maximize2,
  MessageSquareText,
  Siren,
  UserRound,
  type LucideIcon,
} from "lucide-react"
import { Container } from "@/components/shared/container"
import { APP_ROUTES } from "@/lib/constants"
import { useI18n } from "@/i18n/use-i18n"
import { FlowSteps } from "./ui/flow"
import { PopEyebrow, Reveal, popArrowIcon } from "./ui/pop"

/**
 * Icons for each tutorial's three steps, zipped by index with `t.landing.demo.tutorials[i].steps`.
 * They follow what the app really does: profile → camera permission → sign language; the front-desk
 * exchange; and the Emergency button → a phrase → the phrase shown full screen.
 */
const TUTORIAL_STEP_ICONS: LucideIcon[][] = [
  [UserRound, Camera, Languages],
  [Hand, MessageSquareText, UserRound],
  [Siren, ListChecks, Maximize2],
]

type Tutorial = { title: string; description: string; audience: string; steps: string[] }

/**
 * A tutorial whose video isn't recorded yet: the thumbnail shows the steps it will teach, a plain
 * "Video coming soon" status (no play button that does nothing), and a real link to try it in the app.
 */
function TutorialCard({ item, icons }: { item: Tutorial; icons: LucideIcon[] }) {
  const { t } = useI18n()
  const copy = t.landing.demo.media

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="glass-pop flex flex-col overflow-hidden rounded-2xl"
    >
      <figure className="relative m-0 flex aspect-video flex-col items-center justify-center border-b border-[rgba(15,23,42,0.07)] bg-[#fff] px-3 pt-8 pb-10 dark:border-[rgba(255,255,255,0.08)] dark:bg-[#211620]">
        <FlowSteps numbered steps={item.steps.map((label, i) => ({ label, icon: icons[i] }))} />
        <figcaption className="sr-only">{item.description}</figcaption>

        <div className="absolute start-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-black shadow-sm">
          {item.audience}
        </div>
        {/* Status, not a control: the play symbol says "video", the words say it isn't out yet. */}
        <div className="absolute end-3 bottom-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-black shadow-sm">
          <CirclePlay className="size-4 text-[color:var(--primary)]" aria-hidden="true" />
          {copy.comingSoon}
        </div>
      </figure>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <h4 className="text-base leading-snug font-bold text-black">{item.title}</h4>
        <Link
          href={APP_ROUTES.translate}
          className="group mt-auto inline-flex w-fit items-center gap-1.5 rounded-sm text-sm font-semibold text-[color:var(--primary)] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--primary)]"
        >
          {copy.tryIt}
          <ArrowRight className={popArrowIcon} aria-hidden="true" />
        </Link>
      </div>
    </motion.article>
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

      <Container fluid>
        <Reveal className="max-w-2xl">
          <PopEyebrow>
            <CirclePlay className="size-3.5" aria-hidden="true" /> {copy.eyebrow}
          </PopEyebrow>
          <h2 id="demo-heading" className="mt-5 text-3xl font-bold tracking-tight text-balance text-black sm:text-4xl">
            {copy.title}
          </h2>
        </Reveal>

        <div className="mt-12">
          <h3 className="text-lg font-bold text-black sm:text-xl">{copy.tutorialsTitle}</h3>
          <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {copy.tutorials.map((item, i) => (
              <TutorialCard key={item.title} item={item} icons={TUTORIAL_STEP_ICONS[i] ?? TUTORIAL_STEP_ICONS[0]} />
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
