"use client"

import { useId, useRef, useState, type ReactNode } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Accessibility,
  Building2,
  CodeXml,
  Compass,
  Eye,
  Cpu,
  Globe2,
  HandHeart,
  HeartHandshake,
  Languages,
  ShieldCheck,
  Target,
  WifiOff,
  Sparkles,
  type LucideIcon,
} from "lucide-react"
import { Container } from "@/components/shared/container"
import { SectionTitle } from "@/components/shared/section-title"
import { IconBadge } from "@/components/shared/icon-badge"
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
  focusRingPop,
  popMotionProps,
  popButtonSizes,
  popSecondaryButton,
} from "./ui/pop"
import { requestContactTopic } from "./contact-intent"

const VALUE_ICONS: LucideIcon[] = [Accessibility, ShieldCheck, Globe2, Cpu, Eye]

/** Team is described by role/responsibility, not by individual names or photos. */
const TEAM_GROUP_ICONS: LucideIcon[] = [Target, CodeXml, HandHeart]

const GOAL_ICONS: LucideIcon[] = [Languages, Building2, WifiOff]

const ABOUT_TABS = ["mission", "vision", "values", "team", "future"] as const

type AboutTabValue = (typeof ABOUT_TABS)[number]

function TeamAvatar({ icon: Icon }: { icon: LucideIcon }) {
  return (
    <div
      className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[color:var(--primary)]/10 text-[#1D4ED8] ring-1 ring-[color:var(--primary)]/20"
      aria-hidden="true"
    >
      <Icon className="size-5" />
    </div>
  )
}

function MissionPanel() {
  const { t } = useI18n()
  const about = t.landing.about
  return (
    <article aria-labelledby="about-mission-title">
      <GlassPanel glow className="p-6 sm:p-10">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-8">
          <IconBadge icon={Target} variant="solid" />
          <div>
            <h3 id="about-mission-title" className="text-xl font-semibold text-black sm:text-2xl">
              {about.missionTitle}
            </h3>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-black sm:text-base">{about.missionBody}</p>
          </div>
        </div>
      </GlassPanel>
    </article>
  )
}

function VisionPanel() {
  const { t } = useI18n()
  const about = t.landing.about
  return (
    <article aria-labelledby="about-vision-title">
      <GlassPanel glow className="p-6 sm:p-10">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-8">
          <IconBadge icon={Compass} variant="solid" />
          <div>
            <h3 id="about-vision-title" className="text-xl font-semibold text-black sm:text-2xl">
              {about.visionTitle}
            </h3>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-black sm:text-base">{about.visionBody}</p>
          </div>
        </div>
      </GlassPanel>
    </article>
  )
}

function ValuesPanel() {
  const { t } = useI18n()
  return (
    <article aria-label={t.landing.about.tabs.values}>
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="grid gap-4 sm:grid-cols-2"
      >
        {t.landing.about.values.map((value, index, all) => {
          const Icon = VALUE_ICONS[index] ?? Accessibility
          // An odd last card spans both columns so the grid stays balanced.
          const spanLast = all.length % 2 === 1 && index === all.length - 1
          return (
            <motion.div key={value.title} variants={staggerItem} className={spanLast ? "sm:col-span-2" : undefined}>
              <GlassPanel tilt glow className="h-full p-6">
                <IconBadge icon={Icon} />
                <h3 className="mt-5 text-lg font-semibold text-black">{value.title}</h3>
                <p className="mt-3 text-sm leading-7 text-black">{value.description}</p>
              </GlassPanel>
            </motion.div>
          )
        })}
      </motion.div>
    </article>
  )
}

function TeamPanel() {
  const { t } = useI18n()
  const about = t.landing.about
  return (
    <article aria-label={about.tabs.team}>
      <p className="mb-8 max-w-2xl text-sm leading-7 text-black sm:text-base">{about.teamIntro}</p>
      <div className="relative ps-8 sm:ps-10">
        <div
          className="absolute start-[11px] top-2 bottom-2 w-px bg-gradient-to-b from-[color:var(--primary)]/45 via-[color:var(--primary)]/15 to-transparent sm:start-[15px]"
          aria-hidden="true"
        />
        <div className="space-y-10">
          {about.teamGroups.map((group, groupIndex) => {
            const Icon = TEAM_GROUP_ICONS[groupIndex] ?? Target
            return (
              <Reveal key={group.heading} delay={groupIndex * 0.08} className="relative">
                <span
                  className="pop-pulse absolute top-1 -start-8 size-[11px] rounded-full bg-[color:var(--primary)] sm:-start-10"
                  aria-hidden="true"
                />
                <h3 className="text-sm font-semibold tracking-wide text-black uppercase">{group.heading}</h3>
                <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                  {group.roles.map((member) => (
                    <motion.li key={member.role} whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
                      <GlassPanel glow className="flex h-full items-start gap-4 p-5">
                        <TeamAvatar icon={Icon} />
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-foreground">{member.role}</p>
                          <p className="mt-1.5 text-sm leading-6 text-black">{member.note}</p>
                        </div>
                      </GlassPanel>
                    </motion.li>
                  ))}
                </ul>
              </Reveal>
            )
          })}
        </div>
      </div>
      <Reveal delay={0.2} className="mt-10">
        <GlassPanel className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="flex items-start gap-4">
            <IconBadge icon={Sparkles} size="compact" />
            <div>
              <h3 className="text-base font-semibold text-black">{about.hiring.title}</h3>
              <p className="mt-1 text-sm leading-6 text-black">{about.hiring.body}</p>
            </div>
          </div>
          <a
            href="#contact"
            onClick={() => requestContactTopic("general")}
            className={cn(popSecondaryButton, popButtonSizes.sm, "w-fit shrink-0")}
          >
            {about.hiring.cta}
          </a>
        </GlassPanel>
      </Reveal>
    </article>
  )
}

function FutureGoalsPanel() {
  const { t } = useI18n()
  return (
    <article aria-label={t.landing.about.tabs.future}>
      <div className="relative ps-8 sm:ps-10">
        <div
          className="absolute start-[11px] top-2 bottom-2 w-px bg-gradient-to-b from-brand-orange/45 via-[color:var(--primary)]/20 to-transparent sm:start-[15px]"
          aria-hidden="true"
        />
        <ul className="space-y-5">
          {t.landing.about.goals.map((goal, index) => {
            const Icon = GOAL_ICONS[index] ?? Languages
            return (
              <motion.li key={goal.title} {...popMotionProps(index * 0.08)} className="relative list-none">
                <span
                  className="pop-pulse absolute top-6 -start-8 size-[11px] rounded-full bg-brand-orange sm:-start-10"
                  aria-hidden="true"
                />
                <GlassPanel tilt glow className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-start gap-4">
                    <IconBadge icon={Icon} size="compact" />
                    <div>
                      <h3 className="text-base font-semibold text-foreground">{goal.title}</h3>
                      <p className="mt-1.5 text-sm leading-6 text-black">{goal.description}</p>
                    </div>
                  </div>
                  <span
                    className={cn(
                      "inline-flex w-fit shrink-0 items-center rounded-full border border-[color:var(--primary)]/20 bg-[color:var(--primary)]/8 px-2.5 py-1 text-xs font-medium text-[#1D4ED8]",
                      "sm:mt-0.5",
                    )}
                  >
                    {goal.timeframe}
                  </span>
                </GlassPanel>
              </motion.li>
            )
          })}
        </ul>
      </div>
    </article>
  )
}

const ABOUT_PANELS: Record<AboutTabValue, ReactNode> = {
  mission: <MissionPanel />,
  vision: <VisionPanel />,
  values: <ValuesPanel />,
  team: <TeamPanel />,
  future: <FutureGoalsPanel />,
}

function AboutTabs() {
  const { t, dir } = useI18n()
  const [active, setActive] = useState<AboutTabValue>("mission")
  const baseId = useId()
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({})

  function focusTabAt(index: number) {
    const target = ABOUT_TABS[(index + ABOUT_TABS.length) % ABOUT_TABS.length]
    if (!target) return
    setActive(target)
    tabRefs.current[target]?.focus()
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLButtonElement>, index: number) {
    // In RTL the visually "next" tab is to the left.
    const step = dir === "rtl" ? -1 : 1
    switch (event.key) {
      case "ArrowRight":
        event.preventDefault()
        focusTabAt(index + step)
        break
      case "ArrowLeft":
        event.preventDefault()
        focusTabAt(index - step)
        break
      case "Home":
        event.preventDefault()
        focusTabAt(0)
        break
      case "End":
        event.preventDefault()
        focusTabAt(ABOUT_TABS.length - 1)
        break
      default:
        break
    }
  }

  return (
    <div>
      <div
        role="tablist"
        aria-label={t.landing.about.tabsLabel}
        className="glass-pop relative flex flex-wrap gap-1 rounded-3xl p-1.5 sm:rounded-full"
      >
        {ABOUT_TABS.map((tab, index) => {
          const selected = tab === active
          return (
            <button
              key={tab}
              ref={(node) => {
                tabRefs.current[tab] = node
              }}
              type="button"
              role="tab"
              id={`${baseId}-tab-${tab}`}
              aria-selected={selected}
              aria-controls={`${baseId}-panel-${tab}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(tab)}
              onKeyDown={(event) => handleKeyDown(event, index)}
              className={cn(
                "relative z-10 rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors",
                selected ? "text-white" : "text-black hover:text-black",
                focusRingPop,
              )}
            >
              {selected ? (
                <motion.span
                  layoutId="about-tab-pill"
                  className="absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] shadow-[0_10px_24px_-8px_rgba(37,99,235,0.55)]"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              ) : null}
              <span className="relative">{t.landing.about.tabs[tab]}</span>
            </button>
          )
        })}
      </div>

      <div className="relative mt-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            id={`${baseId}-panel-${active}`}
            role="tabpanel"
            aria-labelledby={`${baseId}-tab-${active}`}
            tabIndex={0}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className={focusRingPop}
          >
            {ABOUT_PANELS[active]}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

export function AboutUs() {
  const { t } = useI18n()
  const about = t.landing.about
  const roleCount = about.teamGroups.reduce((total, group) => total + group.roles.length, 0)

  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="relative overflow-hidden py-24 sm:py-28"
    >
      <div className="pop-grid pointer-events-none absolute inset-0 -z-10 opacity-[0.05]" aria-hidden="true" />
      <GlowOrb className="-top-32 -right-24 size-[26rem] pop-float" color="rgba(59,130,246,0.16)" />
      <GlowOrb className="bottom-0 -left-24 size-80 pop-float-delay" color="rgba(255,138,61,0.1)" />

      <Container fluid>
        <SectionTitle
          headingId="about-heading"
          eyebrow={about.eyebrow}
          title={about.title}
          description={about.description}
        />

        <div className="relative mt-14 grid gap-10 lg:mt-20 lg:grid-cols-12 lg:gap-6">
          <Reveal className="lg:col-span-7 lg:pt-4">
            <PopEyebrow>{about.storyEyebrow}</PopEyebrow>
            <p className="mt-5 max-w-xl text-base leading-8 text-pretty text-black sm:text-lg">
              <span className="block text-2xl leading-snug font-semibold text-black sm:text-3xl">{about.storyLead}</span>
              <span className="mt-4 block">{about.storyBody}</span>
            </p>
            <p className="mt-4 max-w-xl text-sm leading-7 text-black sm:text-base">{about.storyMore}</p>
          </Reveal>

          <Reveal delay={0.12} className="lg:col-span-5">
            <GlassPanel glow tilt className="relative mx-auto max-w-sm p-6 sm:p-8 lg:ms-auto lg:mt-10">
              <IconBadge icon={HeartHandshake} variant="solid" />
              <p className="mt-5 text-xs font-semibold tracking-[0.18em] text-black uppercase">
                {about.glanceLabel}
              </p>
              <div className="mt-6 grid grid-cols-3 gap-4">
                <div>
                  <AnimatedNumber value={about.values.length} className="text-3xl font-bold text-black" />
                  <p className="mt-1 text-xs text-black">{about.glanceValues}</p>
                </div>
                <div>
                  <AnimatedNumber value={roleCount} className="text-3xl font-bold text-black" />
                  <p className="mt-1 text-xs text-black">{about.glanceRoles}</p>
                </div>
                <div>
                  <AnimatedNumber value={about.goals.length} className="text-3xl font-bold text-[#C2410C]" />
                  <p className="mt-1 text-xs text-black">{about.glanceGoals}</p>
                </div>
              </div>
            </GlassPanel>
          </Reveal>
        </div>

        <Reveal delay={0.1} className="mt-14 lg:mt-16">
          <AboutTabs />
        </Reveal>
      </Container>
    </section>
  )
}

