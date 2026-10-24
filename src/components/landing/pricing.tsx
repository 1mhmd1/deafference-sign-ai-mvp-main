"use client"

import { useEffect, useId, useRef, useState, type ReactNode } from "react"
import { AnimatePresence, motion } from "framer-motion"
import Link from "next/link"
import {
  ArrowLeft,
  ArrowRight,
  Building,
  Building2,
  Check,
  Handshake,
  HeartPulse,
  RefreshCw,
  UserRound,
  type LucideIcon,
} from "lucide-react"
import { Container } from "@/components/shared/container"
import { SectionTitle } from "@/components/shared/section-title"
import { APP_ROUTES } from "@/lib/constants"
import { cn } from "@/lib/utils"
import { useI18n } from "@/i18n/use-i18n"
import { GlowOrb, focusRingPop, popButtonSizes, popPrimaryButton, popSecondaryButton } from "./ui/pop"
import { requestContactTopic, type ContactTopic } from "./contact-intent"

/**
 * Pricing as a guided choice: Personal use or Industries. Opening one widens it and folds
 * the other into a slim rail on its own side (Personal on the start side, Industries on
 * the end side). Industries then offers Subscription (Pro, Premium) or Enterprise (contract).
 *
 * Plan copy and prices live in `t.landing.pricing.plans`, zipped by index with PLAN_META.
 */
const PLAN_META: { id: string; icon: LucideIcon; href: string; highlighted?: boolean; topic?: ContactTopic }[] = [
  { id: "free", icon: UserRound, href: APP_ROUTES.translate },
  { id: "pro", icon: Building, href: APP_ROUTES.signup },
  { id: "premium", icon: HeartPulse, href: APP_ROUTES.signup, highlighted: true },
  { id: "enterprise", icon: Building2, href: "#contact", topic: "sales" },
]
const PERSONAL_PLAN = 0
const SUBSCRIPTION_PLANS = [1, 2]
const ENTERPRISE_PLAN = 3

type Audience = "personal" | "industries"
type Track = "subscription" | "enterprise"

// Personal leans warm (orange), Industries leans cool (blue).
const AUDIENCE_STYLE: Record<Audience, { Icon: LucideIcon; tile: string; wash: string; ring: string }> = {
  personal: {
    Icon: UserRound,
    tile: "from-[#F97316] to-[#C2410C]",
    wash: "from-brand-orange/[0.08]",
    ring: "hover:border-brand-orange/40",
  },
  industries: {
    Icon: Building2,
    tile: "from-[#2563EB] to-[#1E3A8A]",
    wash: "from-[color:var(--primary)]/[0.08]",
    ring: "hover:border-[color:var(--primary)]/40",
  },
}

const fade = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.3, ease: "easeOut" as const },
}

function Price({ price, cadence, large = false }: { price: string; cadence: string; large?: boolean }) {
  return (
    <div className="flex flex-wrap items-baseline gap-x-1.5">
      <span
        className={cn(
          "pop-gradient-text max-w-full font-bold tracking-tight break-words",
          large ? "text-4xl sm:text-5xl" : price.length > 8 ? "text-2xl" : "text-3xl",
        )}
        dir="ltr"
      >
        {price}
      </span>
      <span className="text-sm text-muted-foreground">{cadence}</span>
    </div>
  )
}

function FeatureList({ features, columns = false }: { features: readonly string[]; columns?: boolean }) {
  return (
    <ul className={cn("space-y-3 text-sm leading-6 text-black", columns && "sm:grid sm:grid-cols-2 sm:gap-x-6 sm:space-y-0 sm:gap-y-3")}>
      {features.map((feature) => (
        <li key={feature} className="flex gap-3">
          <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-[color:var(--primary)]/10 text-[#2563EB]" aria-hidden="true">
            <Check className="size-3" strokeWidth={3} />
          </span>
          <span>{feature}</span>
        </li>
      ))}
    </ul>
  )
}

function PlanCta({ index, className }: { index: number; className?: string }) {
  const { t } = useI18n()
  const meta = PLAN_META[index]
  const plan = t.landing.pricing.plans[index]
  if (!meta || !plan) return null
  return (
    <Link
      href={meta.href}
      onClick={meta.topic ? () => requestContactTopic(meta.topic!) : undefined}
      className={cn(meta.highlighted ? popPrimaryButton : popSecondaryButton, popButtonSizes.md, className)}
    >
      {plan.cta}
      <ArrowRight className="size-4 rtl:-scale-x-100" aria-hidden="true" />
    </Link>
  )
}

/** A subscription plan card (Pro / Premium). */
function PlanCard({ index }: { index: number }) {
  const { t } = useI18n()
  const copy = t.landing.pricing
  const meta = PLAN_META[index]
  const plan = copy.plans[index]
  if (!meta || !plan) return null
  const headingId = `plan-${meta.id}-heading`
  return (
    <article
      aria-labelledby={headingId}
      className={cn(
        "relative flex h-full flex-col rounded-2xl border bg-card p-6",
        meta.highlighted
          ? "border-brand-orange/40 shadow-[0_24px_48px_-28px_rgba(234,88,12,0.45)]"
          : "border-border shadow-[0_14px_32px_-24px_rgba(16,24,40,0.25)]",
      )}
    >
      {meta.highlighted ? (
        <span className="absolute -top-3 start-6 rounded-full border border-brand-orange/30 bg-orange-50 px-2.5 py-0.5 text-xs font-semibold text-[#C2410C] shadow-sm">
          {copy.mostPopular}
        </span>
      ) : null}
      <div className="flex items-center gap-2.5">
        <span
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-xl",
            meta.highlighted ? "bg-orange-50 text-[#C2410C]" : "bg-[color:var(--primary)]/10 text-[#1D4ED8]",
          )}
          aria-hidden="true"
        >
          <meta.icon className="size-5" />
        </span>
        <h4 id={headingId} className="text-lg font-semibold text-foreground">
          {plan.name}
        </h4>
      </div>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">{plan.audience}</p>
      <div className="mt-5">
        <Price price={plan.price} cadence={plan.cadence} />
      </div>
      <div className="mt-6 flex-1">
        <FeatureList features={plan.features} />
      </div>
      <PlanCta index={index} className="mt-8 w-full" />
    </article>
  )
}

/** The two starting boxes, and the slim rail a box folds into when the other one is open. */
function AudienceIntro({
  audience,
  folded,
  onOpen,
  controls,
}: {
  audience: Audience
  folded: boolean
  onOpen: () => void
  controls: string
}) {
  const { t } = useI18n()
  const paths = t.landing.pricing.paths
  const copy = paths[audience]
  const style = AUDIENCE_STYLE[audience]

  if (folded) {
    return (
      <button
        type="button"
        onClick={onOpen}
        aria-expanded={false}
        aria-controls={controls}
        className={cn(
          "group flex h-full w-full items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 text-start shadow-sm transition-colors lg:flex-col lg:justify-center lg:gap-4 lg:px-2 lg:py-6",
          style.ring,
          focusRingPop,
        )}
      >
        <span className={cn("flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-white", style.tile)} aria-hidden="true">
          <style.Icon className="size-5" />
        </span>
        <span className="flex-1 text-sm font-semibold text-black lg:flex-none lg:[writing-mode:vertical-rl]">
          <span className="sr-only">{paths.switchTo} </span>
          {copy.title}
        </span>
        <ArrowRight
          className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 rtl:-scale-x-100 lg:rotate-90"
          aria-hidden="true"
        />
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={onOpen}
      aria-expanded={false}
      aria-controls={controls}
      className={cn(
        "group relative flex h-full min-h-72 w-full flex-col overflow-hidden rounded-3xl border border-border bg-card bg-gradient-to-br to-transparent p-8 text-start shadow-[0_1px_2px_rgba(16,24,40,0.05),0_24px_50px_-30px_rgba(16,24,40,0.3)] transition-[border-color,transform,box-shadow] duration-300 hover:-translate-y-1 sm:p-10",
        style.wash,
        style.ring,
        focusRingPop,
      )}
    >
      {/* Oversized faded icon as the box's artwork. */}
      <style.Icon aria-hidden="true" className="pointer-events-none absolute -end-8 -bottom-10 size-56 text-black opacity-[0.04]" />
      <span
        className={cn(
          "flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-[0_14px_28px_-14px_rgba(37,99,235,0.6)] transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105",
          style.tile,
        )}
        aria-hidden="true"
      >
        <style.Icon className="size-7" />
      </span>
      <span className="mt-6 text-2xl font-bold tracking-tight text-black sm:text-3xl">{copy.title}</span>
      <span className="mt-3 max-w-md text-sm leading-7 text-muted-foreground sm:text-base">{copy.body}</span>
      <span className="mt-auto inline-flex items-center gap-2 pt-8 text-sm font-semibold text-[#1D4ED8]">
        {copy.cta}
        <ArrowRight className="size-4 transition-transform group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1" aria-hidden="true" />
      </span>
    </button>
  )
}

/** Header shown at the top of an opened audience panel. */
function OpenHeader({ audience, onBack }: { audience: Audience; onBack: () => void }) {
  const { t } = useI18n()
  const paths = t.landing.pricing.paths
  const copy = paths[audience]
  const style = AUDIENCE_STYLE[audience]
  return (
    <div className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex items-start gap-4">
        <span className={cn("flex size-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-white", style.tile)} aria-hidden="true">
          <style.Icon className="size-6" />
        </span>
        <div>
          <h3 className="text-2xl font-bold tracking-tight text-black">{copy.title}</h3>
          <p className="mt-1.5 max-w-xl text-sm leading-6 text-muted-foreground">{copy.body}</p>
        </div>
      </div>
      <button
        type="button"
        onClick={onBack}
        className={cn(
          "inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-black transition-colors hover:bg-muted",
          focusRingPop,
        )}
      >
        <ArrowLeft className="size-3.5 rtl:-scale-x-100" aria-hidden="true" />
        {paths.back}
      </button>
    </div>
  )
}

function PersonalDetails({ onBack }: { onBack: () => void }) {
  const { t } = useI18n()
  const plan = t.landing.pricing.plans[PERSONAL_PLAN]
  if (!plan) return null
  return (
    <div>
      <OpenHeader audience="personal" onBack={onBack} />
      <div className="mt-8 grid gap-8 lg:grid-cols-5 lg:gap-10">
        <div className="lg:col-span-2">
          <p className="text-xs font-semibold tracking-[0.16em] text-[#C2410C] uppercase">{plan.name}</p>
          <div className="mt-2">
            <Price price={plan.price} cadence={plan.cadence} large />
          </div>
          <p className="mt-4 text-sm leading-6 text-muted-foreground">{plan.audience}</p>
          <PlanCta index={PERSONAL_PLAN} className="mt-6 w-full sm:w-auto" />
        </div>
        <div className="rounded-2xl border border-border bg-muted/30 p-6 lg:col-span-3">
          <FeatureList features={plan.features} />
        </div>
      </div>
    </div>
  )
}

function IndustriesDetails({ onBack }: { onBack: () => void }) {
  const { t } = useI18n()
  const paths = t.landing.pricing.paths
  // Opens on Subscription, so the plans show straight away (one track is always shown).
  const [track, setTrack] = useState<Track | null>("subscription")
  const regionId = useId()
  const enterprise = t.landing.pricing.plans[ENTERPRISE_PLAN]

  const tracks: { id: Track; Icon: LucideIcon; title: string; body: string }[] = [
    { id: "subscription", Icon: RefreshCw, ...paths.subscription },
    { id: "enterprise", Icon: Handshake, ...paths.enterprise },
  ]

  return (
    <div>
      <OpenHeader audience="industries" onBack={onBack} />

      <p className="mt-8 text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase">{paths.tracksLabel}</p>
      <div className="mt-3 grid gap-4 sm:grid-cols-2">
        {tracks.map(({ id, Icon, title, body }) => {
          const selected = track === id
          return (
            <button
              key={id}
              type="button"
              aria-pressed={selected}
              aria-controls={regionId}
              onClick={() => setTrack(id)}
              className={cn(
                "group relative flex items-start gap-4 overflow-hidden rounded-2xl border p-5 text-start transition-[border-color,background-color,box-shadow] duration-300",
                selected
                  ? "border-[color:var(--primary)]/45 bg-[color:var(--primary)]/[0.06] shadow-[0_18px_40px_-28px_rgba(30,64,175,0.5)]"
                  : "border-border bg-card hover:border-[color:var(--primary)]/30",
                focusRingPop,
              )}
            >
              {/* Orange marker on the chosen track. */}
              <span
                aria-hidden="true"
                className={cn(
                  "absolute inset-y-4 start-0 w-1 rounded-e-full bg-brand-orange transition-opacity duration-300",
                  selected ? "opacity-100" : "opacity-0",
                )}
              />
              <span
                className={cn(
                  "flex size-11 shrink-0 items-center justify-center rounded-xl transition-colors duration-300",
                  selected ? "bg-[#2563EB] text-white" : "bg-[color:var(--primary)]/10 text-[#1D4ED8]",
                )}
                aria-hidden="true"
              >
                <Icon className="size-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-base font-semibold text-black">{title}</span>
                <span className="mt-1 block text-sm leading-6 text-muted-foreground">{body}</span>
              </span>
              <ArrowRight
                className={cn(
                  "mt-1 size-4 shrink-0 text-muted-foreground transition-transform duration-300 rtl:-scale-x-100",
                  selected && "rotate-90 text-[#1D4ED8] rtl:-rotate-90",
                )}
                aria-hidden="true"
              />
            </button>
          )
        })}
      </div>

      <div id={regionId} aria-live="polite" className="mt-8">
        <AnimatePresence mode="wait" initial={false}>
          {track === "subscription" ? (
            <motion.div key="subscription" {...fade} className="grid gap-6 pt-3 md:grid-cols-2">
              {SUBSCRIPTION_PLANS.map((index) => (
                <PlanCard key={index} index={index} />
              ))}
            </motion.div>
          ) : track === "enterprise" && enterprise ? (
            <motion.article
              key="enterprise"
              {...fade}
              aria-labelledby="plan-enterprise-heading"
              className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-[0_24px_48px_-30px_rgba(30,64,175,0.45)] sm:p-8"
            >
              <span aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand-orange to-[color:var(--primary)] rtl:bg-gradient-to-l" />
              <div className="grid gap-8 lg:grid-cols-5 lg:gap-10">
                <div className="lg:col-span-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-orange/30 bg-orange-50 px-2.5 py-1 text-xs font-semibold text-[#C2410C]">
                    <Handshake className="size-3.5" aria-hidden="true" />
                    {paths.contract}
                  </span>
                  <h4 id="plan-enterprise-heading" className="mt-4 text-xl font-semibold text-foreground">
                    {enterprise.name}
                  </h4>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{enterprise.audience}</p>
                  <div className="mt-5">
                    <Price price={enterprise.price} cadence={enterprise.cadence} />
                  </div>
                  <PlanCta index={ENTERPRISE_PLAN} className="mt-6 w-full sm:w-auto" />
                </div>
                <div className="rounded-2xl border border-border bg-muted/30 p-6 lg:col-span-3">
                  <FeatureList features={enterprise.features} />
                </div>
              </div>
            </motion.article>
          ) : (
            <motion.p
              key="hint"
              {...fade}
              className="rounded-2xl border border-dashed border-border px-6 py-8 text-center text-sm text-muted-foreground"
            >
              {paths.chooseHint}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

/** Holds one audience: its starting box, its folded rail, or its opened details. */
function AudienceSlot({
  audience,
  open,
  setOpen,
  children,
}: {
  audience: Audience
  open: Audience | null
  setOpen: (next: Audience | null) => void
  children: ReactNode
}) {
  const { t } = useI18n()
  const panelId = `pricing-${audience}-panel`
  const isOpen = open === audience
  const folded = open !== null && !isOpen
  // The button that opened this panel is gone, so move keyboard focus into the panel.
  const panelRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (isOpen) panelRef.current?.focus({ preventScroll: true })
  }, [isOpen])
  return (
    <div
      className={cn(
        "min-w-0 transition-[flex-grow,flex-basis] duration-500 ease-[cubic-bezier(.22,1,.36,1)]",
        // Opened takes the room; folded shrinks to a rail; at rest both share it.
        folded ? "lg:shrink-0 lg:grow-0 lg:basis-24" : "lg:grow lg:basis-0",
      )}
    >
      {isOpen ? (
        <motion.div
          key="open"
          ref={panelRef}
          id={panelId}
          role="region"
          tabIndex={-1}
          aria-label={t.landing.pricing.paths[audience].title}
          {...fade}
          className="h-full rounded-3xl outline-none border border-border bg-card p-6 shadow-[0_1px_2px_rgba(16,24,40,0.05),0_30px_60px_-34px_rgba(30,64,175,0.4)] sm:p-8"
        >
          {children}
        </motion.div>
      ) : (
        <AudienceIntro audience={audience} folded={folded} onOpen={() => setOpen(audience)} controls={panelId} />
      )}
    </div>
  )
}

export function Pricing() {
  const { t } = useI18n()
  const copy = t.landing.pricing
  const [open, setOpen] = useState<Audience | null>(null)

  return (
    <section id="pricing" aria-labelledby="pricing-heading" className="relative border-y border-border/60 py-24 sm:py-28">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
        <div className="pop-atmosphere absolute inset-0" />
        <div className="pop-grid absolute inset-0 opacity-30" />
        <GlowOrb className="left-[-10%] top-10 size-80" color="rgba(249,115,22,0.12)" />
        <GlowOrb className="right-[-8%] bottom-10 size-72" color="rgba(59,130,246,0.16)" />
      </div>

      <Container fluid className="relative">
        <SectionTitle
          headingId="pricing-heading"
          eyebrow={copy.eyebrow}
          title={copy.title}
          align="center"
        />

        <div role="group" aria-label={copy.paths.label} className="mt-14 flex flex-col gap-4 lg:flex-row lg:items-stretch lg:gap-5">
          <AudienceSlot audience="personal" open={open} setOpen={setOpen}>
            <PersonalDetails onBack={() => setOpen(null)} />
          </AudienceSlot>
          <AudienceSlot audience="industries" open={open} setOpen={setOpen}>
            <IndustriesDetails onBack={() => setOpen(null)} />
          </AudienceSlot>
        </div>

        <p className="mx-auto mt-10 max-w-2xl text-center text-sm leading-6 text-muted-foreground">{copy.note}</p>
      </Container>
    </section>
  )
}
