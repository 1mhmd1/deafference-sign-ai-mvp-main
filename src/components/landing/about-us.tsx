"use client"

import type { ReactNode } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import {
  Accessibility,
  Ambulance,
  ArrowLeftRight,
  ArrowRight,
  AudioLines,
  BrainCircuit,
  Building2,
  CalendarX,
  Captions,
  ClipboardList,
  CodeXml,
  Compass,
  Contrast,
  Globe2,
  Hand,
  HandHeart,
  Landmark,
  Languages,
  Laptop,
  NotebookPen,
  Plus,
  ShieldCheck,
  Stethoscope,
  Target,
  Timer,
  Type,
  UserCheck,
  UserPlus,
  UserRound,
  WifiOff,
  Sparkles,
  type LucideIcon,
} from "lucide-react"
import { Container } from "@/components/shared/container"
import { cn } from "@/lib/utils"
import { useI18n } from "@/i18n/use-i18n"
import {
  Reveal,
  staggerContainer,
  staggerItem,
  PopEyebrow,
  GlassPanel,
  popBrandTile,
  popMotionProps,
  popButtonSizes,
  popSecondaryButton,
  popStage,
  popTile,
} from "./ui/pop"
import { contactHref } from "./contact-intent"
import { SignVideoButton } from "./sign-video"

/** Team is described by role/responsibility, not by individual names or photos. */
const TEAM_GROUP_ICONS: LucideIcon[] = [Target, CodeXml, HandHeart]
/** One icon per role, in the order of `t.landing.about.teamGroups[].roles`. */
const ROLE_ICONS: LucideIcon[][] = [
  [Compass, Stethoscope],
  [BrainCircuit, Laptop],
  [Hand, Languages],
]

const GOAL_ICONS: LucideIcon[] = [Languages, Building2, WifiOff]

// The logo's warm range for gradient tiles, so neighbouring cards never look identical.
const ACCENTS = [
  "from-[#E0601A] to-[#C0341B]",
  "from-[#D63C1A] to-[#B01030]",
  "from-[#B01030] to-[#5E0F45]",
] as const

// Bento layout for the five values: two wide cards on top, three below.
const VALUE_SPANS = ["lg:col-span-3", "lg:col-span-3", "lg:col-span-2", "lg:col-span-2", "lg:col-span-2"] as const

const pad2 = (n: number) => String(n).padStart(2, "0")

/** Numbered step badge, the same one the home page's story uses. */
function StepNumber({ n }: { n: number }) {
  return (
    <b className="grid size-6 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#D63C1A] to-[#B01030] text-xs leading-none text-white">
      {n}
    </b>
  )
}

/** Heading for one part of the section (values, team, future): the pill itself is the <h3>. */
function PartHeading({ id, children, intro }: { id: string; children: ReactNode; intro?: string }) {
  return (
    <Reveal className="max-w-2xl">
      <h3 id={id}>
        <PopEyebrow>{children}</PopEyebrow>
      </h3>
      {intro ? <p className="mt-4 text-sm leading-7 text-black sm:text-base">{intro}</p> : null}
    </Reveal>
  )
}

/** Picture for each story scene, in order: no interpreter booked, five minutes became forty, Deafference, understood. */
function StoryVisual({ index, minutes }: { index: number; minutes: string }) {
  const iconTile = cn(popTile, "size-14 rounded-2xl")
  if (index === 0) {
    return (
      <div className={iconTile}>
        <CalendarX className="size-7" />
      </div>
    )
  }
  if (index === 1) {
    // <b>/<small>, not <span>: the landing's forced dark span colour would hide the accent on "40".
    return (
      <div className="flex items-center gap-3">
        <div className={iconTile}>
          <NotebookPen className="size-7" />
        </div>
        <div className="flex items-baseline gap-1.5 font-extrabold text-black" dir="ltr">
          <b className="text-2xl">5</b>
          <ArrowRight className="size-4 self-center text-[color:var(--primary)]" />
          <b className="text-3xl text-[color:var(--primary)]">40</b>
          <small className="text-xs font-semibold">{minutes}</small>
        </div>
      </div>
    )
  }
  if (index === 2) {
    return (
      <div className="grid size-16 place-items-center rounded-full bg-white shadow-[0_0_0_6px_rgba(242,140,26,0.18),0_14px_30px_-16px_rgba(176,16,48,0.6)]">
        <img src="/deafference-mark.png" alt="" className="size-10 object-contain" />
      </div>
    )
  }
  return (
    <div className="flex items-center gap-2">
      <div className={iconTile}>
        <Hand className="size-7" />
      </div>
      <ArrowLeftRight className="size-5 text-[color:var(--primary)]" />
      <div className={iconTile}>
        <AudioLines className="size-7" />
      </div>
    </div>
  )
}

/** "Our story" as one sentence and four connected scenes (arrows between them on wide screens, numbers everywhere). */
function Story() {
  const { t } = useI18n()
  const about = t.landing.about

  return (
    <div>
      <Reveal className="max-w-2xl">
        <PopEyebrow>{about.storyEyebrow}</PopEyebrow>
        <p className="mt-6 text-2xl leading-snug font-bold text-balance text-black sm:text-3xl">{about.storyLead}</p>
      </Reveal>

      <motion.ol
        aria-label={about.storyScenesLabel}
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
        className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8"
      >
        {about.storyScenes.map((scene, i) => (
          <motion.li key={scene.title} variants={staggerItem} className="relative flex">
            {i > 0 ? (
              <ArrowRight
                aria-hidden="true"
                className="absolute top-14 -start-[26px] hidden size-5 text-[color:var(--primary)]/60 rtl:-scale-x-100 lg:block"
              />
            ) : null}
            <GlassPanel className="flex w-full flex-col p-5">
              <div aria-hidden="true" className={cn("flex h-28 items-center justify-center", popStage)}>
                <StoryVisual index={i} minutes={about.storyMinutes} />
              </div>
              <h3 className="mt-4 flex items-center gap-2 text-base font-bold text-black">
                <StepNumber n={i + 1} />
                {scene.title}
              </h3>
              <p className="mt-1.5 text-sm leading-6 text-black">{scene.caption}</p>
            </GlassPanel>
          </motion.li>
        ))}
      </motion.ol>
    </div>
  )
}

/** White chip with an icon (or the Deafference mark) and a label, for the pictures on the mission and vision cards. */
function BrandChip({ icon: Icon, label, brand = false }: { icon?: LucideIcon; label: string; brand?: boolean }) {
  return (
    // The label is a <b> with its own colour: inside an `.on-brand` card, li/span text inherits the card's white.
    <li className="inline-flex items-center gap-2 rounded-full bg-[#fff] py-1.5 ps-1.5 pe-3.5 shadow-[0_10px_24px_-14px_rgba(40,8,30,0.6)]">
      <span className="grid size-7 place-items-center rounded-full bg-[#FFF1E8]">
        {brand ? <img src="/deafference-mark.png" alt="" className="size-5 object-contain" /> : Icon ? <Icon className="size-4 text-[#C0341B]" /> : null}
      </span>
      <b className="text-sm font-semibold text-[#8E1243]">{label}</b>
    </li>
  )
}

/**
 * Mission and vision side by side as two logo-coloured cards: the mission over the places it is for,
 * the vision beside the everyday things it should feel as ordinary as (captions, a ramp).
 */
function MissionVision() {
  const { t } = useI18n()
  const about = t.landing.about
  const missionIcons: LucideIcon[] = [ClipboardList, Ambulance, Landmark]
  const visionIcons: (LucideIcon | null)[] = [Captions, Accessibility, null]
  const cards = [
    {
      key: "mission",
      eyebrow: about.tabs.mission,
      title: about.missionTitle,
      body: about.missionBody,
      Icon: Target,
      bg: "from-[#D63C1A] to-[#B01030]",
      chips: about.missionPlaces.map((label, i) => ({ label, icon: missionIcons[i] ?? Landmark, brand: false })),
    },
    {
      key: "vision",
      eyebrow: about.tabs.vision,
      title: about.visionTitle,
      body: about.visionBody,
      Icon: Compass,
      bg: "from-[#8E1243] to-[#5E0F45]",
      chips: about.visionItems.map((label, i) => ({ label, icon: visionIcons[i] ?? undefined, brand: visionIcons[i] === null })),
    },
  ]

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {cards.map(({ key, eyebrow, title, body, Icon, bg, chips }, index) => (
        <motion.article
          key={key}
          aria-labelledby={`about-${key}-title`}
          {...popMotionProps(index * 0.1)}
          className={cn(
            "on-brand flex flex-col rounded-[2rem] bg-gradient-to-br p-7 text-white shadow-[0_30px_60px_-34px_rgba(94,15,69,0.65)] sm:p-10",
            bg,
          )}
        >
          <div className="flex items-center gap-3">
            <span className="flex size-12 items-center justify-center rounded-2xl bg-[rgba(255,255,255,0.16)] ring-1 ring-[rgba(255,255,255,0.3)]">
              <Icon className="size-6" aria-hidden="true" />
            </span>
            <span className="text-xs font-semibold tracking-[0.2em] uppercase">{eyebrow}</span>
          </div>
          <h3 id={`about-${key}-title`} className="mt-6 text-2xl font-bold sm:text-3xl">
            {title}
          </h3>
          <p className="mt-4 max-w-xl flex-1 text-sm leading-7 sm:text-base sm:leading-8">{body}</p>
          {/* The places (mission) and everyday comparisons (vision) the text names, as a picture. */}
          <ul aria-hidden="true" className="mt-7 flex flex-wrap gap-2.5">
            {chips.map((chip) => (
              <BrandChip key={chip.label} {...chip} />
            ))}
          </ul>
        </motion.article>
      ))}
    </div>
  )
}

/** Small picture for each value, in the order of `t.landing.about.values`. Decorative: the card text says it. */
function ValueVisual({ index }: { index: number }) {
  const tile = cn(popTile, "size-11")
  const brand = cn(popBrandTile, "size-14 rounded-2xl shadow-[0_14px_28px_-14px_rgba(176,16,48,0.6)]")
  const joiner = "text-[color:var(--primary)]"
  switch (index) {
    // Accessibility first: the Deaf person's experience in the middle, the display settings around it.
    case 0:
      return (
        <div className="flex items-center gap-3">
          <div className={tile}>
            <Type className="size-5" />
          </div>
          <div className={brand}>
            <Hand className="size-7" />
          </div>
          <div className={tile}>
            <Contrast className="size-5" />
          </div>
        </div>
      )
    // Patient safety: the clinician's words come out as one clear, checked message.
    case 1:
      return (
        <div className="flex items-center gap-3">
          <div className={tile}>
            <Stethoscope className="size-5" />
          </div>
          <ArrowRight className={cn("size-4 rtl:-scale-x-100", joiner)} />
          <div className="relative flex w-28 flex-col gap-1.5 rounded-2xl rounded-es-sm bg-white px-3 py-3 shadow-[0_10px_24px_-16px_rgba(94,15,69,0.45)] ring-1 ring-[color:var(--primary)]/12">
            <div className="h-1.5 w-16 rounded-full bg-[color:var(--primary)]/45" />
            <div className="h-1.5 w-11 rounded-full bg-[color:var(--primary)]/20" />
            <div className={cn(popBrandTile, "absolute -end-2.5 -top-2.5 size-7 rounded-full")}>
              <ShieldCheck className="size-4" />
            </div>
          </div>
        </div>
      )
    // Cultural respect: sign languages around the world, each with its own grammar.
    case 2:
      return (
        <div className="flex items-center gap-2.5">
          <div className={cn(tile, "-rotate-6")}>
            <Hand className="size-5" />
          </div>
          <div className={brand}>
            <Globe2 className="size-7" />
          </div>
          <div className={cn(tile, "rotate-6")}>
            <Hand className="size-5 -scale-x-100" />
          </div>
        </div>
      )
    // Technical care: speed and accuracy as one requirement.
    case 3:
      return (
        <div className="flex items-center gap-2.5">
          <div className={tile}>
            <Timer className="size-5" />
          </div>
          <Plus className={cn("size-4", joiner)} />
          <div className={tile}>
            <Target className="size-5" />
          </div>
        </div>
      )
    // Honest about limits: Deafference hands over to a qualified interpreter when that's the right choice.
    default:
      return (
        <div className="flex items-center gap-3">
          <div className="grid size-12 place-items-center rounded-full bg-white shadow-[0_0_0_5px_rgba(242,140,26,0.16)]">
            <img src="/deafference-mark.png" alt="" className="size-7 object-contain" />
          </div>
          <ArrowLeftRight className={cn("size-5", joiner)} />
          <div className={tile}>
            <UserCheck className="size-5" />
          </div>
        </div>
      )
  }
}

function Values() {
  const { t } = useI18n()
  const about = t.landing.about
  return (
    <section aria-labelledby="about-values-title">
      <PartHeading id="about-values-title">
        <Sparkles className="size-3.5" aria-hidden="true" /> {about.tabs.values}
      </PartHeading>
      <motion.ul
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-6"
      >
        {about.values.map((value, index, all) => {
          // On two columns an odd last card spans both so the grid stays balanced.
          const spanLast = all.length % 2 === 1 && index === all.length - 1
          return (
            <motion.li
              key={value.title}
              variants={staggerItem}
              className={cn("flex", VALUE_SPANS[index] ?? "lg:col-span-2", spanLast && "sm:col-span-2")}
            >
              <GlassPanel className="flex w-full flex-col p-5">
                <div aria-hidden="true" className={cn("flex h-28 items-center justify-center", popStage)}>
                  <ValueVisual index={index} />
                </div>
                <h4 className="mt-4 flex items-center gap-2 text-lg font-bold text-black">
                  <StepNumber n={index + 1} />
                  {value.title}
                </h4>
                <p className="mt-1.5 text-sm leading-6 text-black">{value.description}</p>
              </GlassPanel>
            </motion.li>
          )
        })}
      </motion.ul>
    </section>
  )
}

function Team() {
  const { t } = useI18n()
  const about = t.landing.about
  return (
    <section aria-labelledby="about-team-title">
      <PartHeading id="about-team-title" intro={about.teamIntro}>
        {about.tabs.team}
      </PartHeading>

      <div className="mt-8 grid gap-5 lg:grid-cols-3">
        {about.teamGroups.map((group, groupIndex) => {
          const Icon = TEAM_GROUP_ICONS[groupIndex] ?? Target
          return (
            <motion.div key={group.heading} {...popMotionProps(groupIndex * 0.1)} className="flex">
              <GlassPanel className="w-full p-6">
                <div className="flex items-center gap-3">
                  <span
                    className={cn("on-brand flex size-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-white", ACCENTS[groupIndex % ACCENTS.length])}
                    aria-hidden="true"
                  >
                    <Icon className="size-5" />
                  </span>
                  <h4 className="text-base font-bold text-black">{group.heading}</h4>
                </div>
                <ul className="mt-5 space-y-3">
                  {group.roles.map((member, roleIndex) => {
                    const RoleIcon = ROLE_ICONS[groupIndex]?.[roleIndex] ?? UserRound
                    return (
                      <li key={member.role} className={cn("flex items-start gap-3 p-3", popStage)}>
                        <span aria-hidden="true" className={cn(popTile, "size-10")}>
                          <RoleIcon className="size-5" />
                        </span>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-black">{member.role}</p>
                          <p className="mt-0.5 text-sm leading-6 text-black">{member.note}</p>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              </GlassPanel>
            </motion.div>
          )
        })}
      </div>

      {/* Hiring: the team's faces with an open seat. */}
      <Reveal delay={0.15} className="mt-6">
        <GlassPanel className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div aria-hidden="true" className="flex items-center">
              {[0, 1, 2].map((i) => (
                <div key={i} className={cn(popTile, "-me-2 size-11 rounded-full ring-2 ring-[color:var(--card)]")}>
                  <UserRound className="size-5" />
                </div>
              ))}
              <div className={cn(popBrandTile, "size-11 rounded-full ring-2 ring-[color:var(--card)]")}>
                <UserPlus className="size-5" />
              </div>
            </div>
            <div>
              <h4 className="text-lg font-bold text-black">{about.hiring.title}</h4>
              <p className="mt-1 max-w-xl text-sm leading-6 text-black">{about.hiring.body}</p>
            </div>
          </div>
          {/* The team part lives on /about, and the contact form on /contact. */}
          <Link href={contactHref()} className={cn(popSecondaryButton, popButtonSizes.sm, "w-fit shrink-0")}>
            {about.hiring.cta}
          </Link>
        </GlassPanel>
      </Reveal>
    </section>
  )
}

/** Future goals as a roadmap: a line with numbered stops (horizontal from `md`, vertical below). */
function Roadmap() {
  const { t } = useI18n()
  const about = t.landing.about
  return (
    <section aria-labelledby="about-future-title">
      <PartHeading id="about-future-title">{about.tabs.future}</PartHeading>

      <ol className="relative mt-10 grid gap-8 md:grid-cols-3 md:gap-6">
        {/* The road: across the stops on desktop, down the side on mobile. */}
        <span
          aria-hidden="true"
          className="absolute top-[26px] hidden h-1 rounded-full bg-gradient-to-r from-[#F28C1A] via-[#D63C1A] to-[#B01030]/25 md:block md:inset-x-[16.66%] rtl:bg-gradient-to-l"
        />
        <span
          aria-hidden="true"
          className="absolute start-[26px] top-7 bottom-7 w-1 rounded-full bg-gradient-to-b from-[#F28C1A] via-[#D63C1A] to-[#B01030]/25 md:hidden"
        />
        {about.goals.map((goal, index) => {
          const Icon = GOAL_ICONS[index] ?? Languages
          return (
            <motion.li
              key={goal.title}
              {...popMotionProps(index * 0.12)}
              className="relative flex gap-5 md:flex-col md:items-center md:text-center"
            >
              <span
                className={cn(
                  "on-brand relative z-10 flex size-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-white ring-4 ring-white dark:ring-[#150e15]",
                  ACCENTS[index % ACCENTS.length],
                )}
                aria-hidden="true"
              >
                <Icon className="size-6" />
              </span>
              <GlassPanel className="flex-1 p-5 md:w-full">
                <span className="inline-flex items-center rounded-full border border-[color:var(--primary)]/25 bg-[color:var(--primary)]/8 px-2.5 py-1 text-xs font-semibold text-[#1D4ED8]">
                  {pad2(index + 1)} · {goal.timeframe}
                </span>
                <h4 className="mt-3 text-base font-bold text-black">{goal.title}</h4>
                <p className="mt-1.5 text-sm leading-6 text-black">{goal.description}</p>
              </GlassPanel>
            </motion.li>
          )
        })}
      </ol>
    </section>
  )
}

/** Home page: "Our story" only, with a link to the full About us page. */
export function AboutUs() {
  const { t } = useI18n()
  const about = t.landing.about

  return (
    <section id="about" aria-labelledby="about-heading" className="relative overflow-hidden py-24 sm:py-28">

      <Container fluid>
        {/* No visible title: the section opens straight on "Our story". */}
        <h2 id="about-heading" className="sr-only">
          {about.eyebrow}
        </h2>

        <div>
          <Story />
          <Reveal className="mt-10">
            <Link href="/about" className={cn(popSecondaryButton, popButtonSizes.md, "w-fit")}>
              {about.moreLink}
              <ArrowRight className="size-4 rtl:-scale-x-100" aria-hidden="true" />
            </Link>
          </Reveal>
        </div>
      </Container>
    </section>
  )
}

/** /about page: mission and vision, values, team and future goals (the story stays on the home page). */
export function AboutUsDetails() {
  const { t } = useI18n()
  const about = t.landing.about

  return (
    <section id="about-us" aria-labelledby="about-us-heading" className="relative overflow-hidden py-24 sm:py-28">

      <Container fluid>
        {/* No visible title on this page: it opens straight on mission and vision. */}
        <h1 id="about-us-heading" className="sr-only">
          {about.eyebrow}
        </h1>

        <SignVideoButton videoKey="about" className="mb-10" />
        <div className="space-y-20 lg:space-y-28">
          <MissionVision />
          <Values />
          <Team />
          <Roadmap />
        </div>
      </Container>
    </section>
  )
}
