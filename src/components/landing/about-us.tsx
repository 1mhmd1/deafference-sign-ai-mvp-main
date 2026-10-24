"use client"

import type { ReactNode } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import {
  Accessibility,
  ArrowRight,
  Building2,
  CodeXml,
  Compass,
  Eye,
  Cpu,
  Globe2,
  HandHeart,
  Languages,
  ShieldCheck,
  Target,
  WifiOff,
  Sparkles,
  Quote,
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
  GlowOrb,
  AnimatedNumber,
  popMotionProps,
  popButtonSizes,
  popSecondaryButton,
} from "./ui/pop"
import { requestContactTopic } from "./contact-intent"

const VALUE_ICONS: LucideIcon[] = [Accessibility, ShieldCheck, Globe2, Cpu, Eye]

/** Team is described by role/responsibility, not by individual names or photos. */
const TEAM_GROUP_ICONS: LucideIcon[] = [Target, CodeXml, HandHeart]

const GOAL_ICONS: LucideIcon[] = [Languages, Building2, WifiOff]

// Rotating accent fills for icon tiles, so neighbouring cards never look identical.
const ACCENTS = [
  "from-[#2563EB] to-[#1D4ED8]",
  "from-[#F97316] to-[#C2410C]",
  "from-[#0EA5E9] to-[#2563EB]",
  "from-[#1E3A8A] to-[#2563EB]",
  "from-[#C2410C] to-[#9A3412]",
] as const

// Bento layout for the five values: two wide cards on top, three below.
const VALUE_SPANS = ["lg:col-span-3", "lg:col-span-3", "lg:col-span-2", "lg:col-span-2", "lg:col-span-2"] as const

const pad2 = (n: number) => String(n).padStart(2, "0")

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

function Story() {
  const { t } = useI18n()
  const about = t.landing.about
  const roleCount = about.teamGroups.reduce((total, group) => total + group.roles.length, 0)
  const stats = [
    { value: about.values.length, label: about.glanceValues, accent: ACCENTS[0], offset: "lg:me-16" },
    { value: roleCount, label: about.glanceRoles, accent: ACCENTS[1], offset: "lg:ms-16" },
    { value: about.goals.length, label: about.glanceGoals, accent: ACCENTS[2], offset: "lg:me-8" },
  ]

  return (
    <div className="grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-10">
      <Reveal className="relative lg:col-span-7">
        <Quote
          aria-hidden="true"
          className="absolute -top-6 -start-2 size-20 text-brand-orange/15 rtl:-scale-x-100 sm:-start-6 sm:size-24"
        />
        <PopEyebrow className="relative">{about.storyEyebrow}</PopEyebrow>
        <p className="relative mt-6 text-2xl leading-snug font-bold text-balance text-black sm:text-3xl">
          {about.storyLead}
        </p>
        <div className="relative mt-6 border-s-4 border-brand-orange/70 ps-5">
          <p className="text-base leading-8 text-pretty text-black sm:text-lg">{about.storyBody}</p>
        </div>
        <p className="mt-5 max-w-xl text-sm leading-7 text-black sm:text-base">{about.storyMore}</p>
      </Reveal>

      {/* At a glance: three stat chips stepping down at alternating offsets. */}
      <div className="lg:col-span-5">
        <p className="mb-4 text-xs font-semibold tracking-[0.18em] text-black uppercase lg:text-center">
          {about.glanceLabel}
        </p>
        <motion.ul
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1"
        >
          {stats.map((stat) => (
            <motion.li key={stat.label} variants={staggerItem} className={stat.offset}>
              <GlassPanel glow tilt className="flex items-center gap-4 p-4 sm:flex-col sm:text-center lg:flex-row lg:text-start">
                <span
                  className={cn(
                    "flex size-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-[0_14px_30px_-14px_rgba(37,99,235,0.7)]",
                    stat.accent,
                  )}
                >
                  <AnimatedNumber value={stat.value} className="text-3xl font-extrabold" />
                </span>
                <span className="text-sm font-semibold text-black">{stat.label}</span>
              </GlassPanel>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </div>
  )
}

/** Mission and vision side by side as two bold colour cards. */
function MissionVision() {
  const { t } = useI18n()
  const about = t.landing.about
  const cards = [
    {
      key: "mission",
      eyebrow: about.tabs.mission,
      title: about.missionTitle,
      body: about.missionBody,
      Icon: Target,
      bg: "from-[#2563EB] via-[#1D4ED8] to-[#1E3A8A]",
    },
    {
      key: "vision",
      eyebrow: about.tabs.vision,
      title: about.visionTitle,
      body: about.visionBody,
      Icon: Compass,
      bg: "from-[#C2410C] via-[#B23A0B] to-[#7C2D12]",
    },
  ]

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {cards.map(({ key, eyebrow, title, body, Icon, bg }, index) => (
        <motion.article
          key={key}
          aria-labelledby={`about-${key}-title`}
          {...popMotionProps(index * 0.1)}
          whileHover={{ y: -6 }}
          className={cn(
            "relative isolate overflow-hidden rounded-[2rem] bg-gradient-to-br p-7 text-white shadow-[0_30px_60px_-30px_rgba(30,58,138,0.7)] sm:p-10",
            bg,
          )}
        >
          {/* Oversized icon watermark and a soft light spot for depth. */}
          <Icon aria-hidden="true" className="absolute -end-10 -bottom-10 -z-10 size-56 text-[rgba(255,255,255,0.08)]" />
          <span
            aria-hidden="true"
            className="absolute -top-20 -start-20 -z-10 size-56 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.22),transparent_70%)]"
          />
          <div className="flex items-center gap-3">
            <span className="flex size-12 items-center justify-center rounded-2xl bg-[rgba(255,255,255,0.16)] ring-1 ring-[rgba(255,255,255,0.3)]">
              <Icon className="size-6" aria-hidden="true" />
            </span>
            <span className="text-xs font-semibold tracking-[0.2em] uppercase">{eyebrow}</span>
          </div>
          <h3 id={`about-${key}-title`} className="mt-6 text-2xl font-bold sm:text-3xl">
            {title}
          </h3>
          <p className="mt-4 max-w-xl text-sm leading-7 sm:text-base sm:leading-8">{body}</p>
        </motion.article>
      ))}
    </div>
  )
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
          const Icon = VALUE_ICONS[index] ?? Accessibility
          // On two columns an odd last card spans both so the grid stays balanced.
          const spanLast = all.length % 2 === 1 && index === all.length - 1
          return (
            <motion.li
              key={value.title}
              variants={staggerItem}
              className={cn(VALUE_SPANS[index] ?? "lg:col-span-2", spanLast && "sm:col-span-2")}
            >
              <GlassPanel tilt glow className="group relative h-full overflow-hidden p-6">
                {/* Accent bar that grows across the top on hover. */}
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute inset-x-0 top-0 h-1 origin-[left] scale-x-0 bg-gradient-to-r transition-transform duration-500 group-hover:scale-x-100 rtl:origin-[right]",
                    ACCENTS[index % ACCENTS.length],
                  )}
                />
                <span
                  aria-hidden="true"
                  className="pop-gradient-text absolute top-4 end-5 text-5xl font-black opacity-25 select-none"
                >
                  {pad2(index + 1)}
                </span>
                <span
                  className={cn(
                    "flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-[0_12px_26px_-12px_rgba(37,99,235,0.7)] transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110",
                    ACCENTS[index % ACCENTS.length],
                  )}
                  aria-hidden="true"
                >
                  <Icon className="size-6" />
                </span>
                <h4 className="mt-5 text-lg font-bold text-black">{value.title}</h4>
                <p className="mt-2 text-sm leading-7 text-black">{value.description}</p>
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
          const accent = ACCENTS[groupIndex % ACCENTS.length]
          return (
            <motion.div key={group.heading} {...popMotionProps(groupIndex * 0.1)} whileHover={{ y: -6 }}>
              <GlassPanel glow className="relative h-full overflow-hidden p-6">
                <span
                  aria-hidden="true"
                  className={cn("absolute -top-16 -end-16 size-40 rounded-full bg-gradient-to-br opacity-15 blur-2xl", accent)}
                />
                <div className="relative flex items-center gap-3">
                  <span
                    className={cn(
                      "flex size-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-white ring-4 ring-[color:var(--primary)]/10",
                      accent,
                    )}
                    aria-hidden="true"
                  >
                    <Icon className="size-5" />
                  </span>
                  <h4 className="text-base font-bold text-black">{group.heading}</h4>
                </div>
                <ul className="relative mt-6 space-y-5 border-s-2 border-dashed border-[color:var(--primary)]/25 ps-5">
                  {group.roles.map((member) => (
                    <li key={member.role} className="relative">
                      <span
                        aria-hidden="true"
                        className="absolute top-1.5 -start-[27px] size-3 rounded-full border-2 border-[color:var(--primary)] bg-background"
                      />
                      <p className="text-sm font-semibold text-black">{member.role}</p>
                      <p className="mt-1 text-sm leading-6 text-black">{member.note}</p>
                    </li>
                  ))}
                </ul>
              </GlassPanel>
            </motion.div>
          )
        })}
      </div>

      {/* Hiring banner with a dashed "door is open" frame. */}
      <Reveal delay={0.15} className="mt-6">
        <div className="relative overflow-hidden rounded-[1.75rem] border-2 border-dashed border-brand-orange/45 bg-brand-orange/5 p-6 sm:p-8">
          <GlowOrb className="-end-10 -top-10 size-40" color="rgba(255,138,61,0.18)" />
          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <motion.span
                aria-hidden="true"
                animate={{ rotate: [0, 12, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#F97316] to-[#C2410C] text-white"
              >
                <Sparkles className="size-6" />
              </motion.span>
              <div>
                <h4 className="text-lg font-bold text-black">{about.hiring.title}</h4>
                <p className="mt-1 max-w-xl text-sm leading-6 text-black">{about.hiring.body}</p>
              </div>
            </div>
            {/* The team part lives on /about, and the contact form on the home page. */}
            <a
              href="/#contact"
              onClick={() => requestContactTopic("general")}
              className={cn(popSecondaryButton, popButtonSizes.sm, "w-fit shrink-0")}
            >
              {about.hiring.cta}
            </a>
          </div>
        </div>
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
          className="absolute top-[26px] hidden h-1 rounded-full bg-gradient-to-r from-brand-orange via-[color:var(--primary)] to-[color:var(--primary)]/20 md:block md:inset-x-[16.66%] rtl:bg-gradient-to-l"
        />
        <span
          aria-hidden="true"
          className="absolute start-[26px] top-7 bottom-7 w-1 rounded-full bg-gradient-to-b from-brand-orange via-[color:var(--primary)] to-[color:var(--primary)]/20 md:hidden"
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
                  "pop-pulse relative z-10 flex size-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-white",
                  ACCENTS[index % ACCENTS.length],
                )}
                aria-hidden="true"
              >
                <Icon className="size-6" />
              </span>
              <GlassPanel tilt glow className="flex-1 p-5 md:w-full">
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
      <div className="pop-grid pointer-events-none absolute inset-0 -z-10 opacity-[0.05]" aria-hidden="true" />
      <GlowOrb className="-top-32 -right-24 size-[26rem] pop-float" color="rgba(59,130,246,0.16)" />
      <GlowOrb className="bottom-0 -left-32 size-96 pop-float-delay" color="rgba(255,138,61,0.12)" />

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
      <div className="pop-grid pointer-events-none absolute inset-0 -z-10 opacity-[0.05]" aria-hidden="true" />
      <GlowOrb className="-top-32 -right-24 size-[26rem] pop-float" color="rgba(59,130,246,0.16)" />
      <GlowOrb className="top-1/3 -left-32 size-96 pop-float-delay" color="rgba(255,138,61,0.12)" />
      <GlowOrb className="bottom-0 right-1/4 size-80 pop-float" color="rgba(167,180,255,0.16)" />

      <Container fluid>
        {/* No visible title on this page: it opens straight on mission and vision. */}
        <h1 id="about-us-heading" className="sr-only">
          {about.eyebrow}
        </h1>

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
