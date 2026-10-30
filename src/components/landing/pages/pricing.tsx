"use client"

import { useEffect, useId, useRef, useState, type ReactNode, type Ref } from "react"
import Link from "next/link"
import { APP_ROUTES } from "@/lib/constants"
import { cn } from "@/lib/utils"
import { useI18n } from "@/i18n/use-i18n"
import { contactHref } from "../contact-intent"
import { Avatar, Chip, DfIcon, Mark, PhoneMock, SectionHead, type IconName, type Tone } from "../home/df-ui"
import { CtaBand, PageArt, PageHero, SplitTitle } from "./page-ui"

/*
 * Pricing as a guided choice: Personal use or Industries. Opening one widens it and folds the other
 * into a slim rail on its own side. Industries then offers Subscription (Pro, Premium) or Enterprise.
 * Plan copy and prices live in `t.landing.pricing.plans`, zipped by index with PLAN_META.
 */
const PLAN_META: { id: string; icon: IconName; href: string; highlighted?: boolean }[] = [
  { id: "free", icon: "user", href: APP_ROUTES.translate },
  { id: "pro", icon: "briefcase", href: APP_ROUTES.signup },
  { id: "premium", icon: "hospital", href: APP_ROUTES.signup, highlighted: true },
  // Opens the contact form on /contact with "Sales" already chosen.
  { id: "enterprise", icon: "building", href: contactHref("sales") },
]
const PERSONAL_PLAN = 0
const SUBSCRIPTION_PLANS = [1, 2]
const ENTERPRISE_PLAN = 3

type Audience = "personal" | "industries"
type Track = "subscription" | "enterprise"

/** Personal at the logo's flame end, Industries at its plum end. */
const AUDIENCE_LOOK: Record<Audience, { icon: IconName; tone: Tone }> = {
  personal: { icon: "user", tone: "flame" },
  industries: { icon: "building", tone: "plum" },
}

/** The picture on each starting box: one person with the app on their phone; an organisation over its places. */
function AudienceArt({ audience }: { audience: Audience }) {
  if (audience === "personal") {
    return (
      <span className="df-pics">
        <Avatar tone="flame" size={92} badge="hand" />
        <PhoneMock size="sm">
          <span className="df-phone__mini">
            <Mark size={34} />
            <span className="df-bars">
              <i />
              <i style={{ width: "60%" }} />
            </span>
          </span>
        </PhoneMock>
      </span>
    )
  }
  const places: IconName[] = ["stethoscope", "cap", "users"]
  return (
    <span className="df-orgart">
      <span className="df-well df-well--xl df-well--solid">
        <DfIcon name="building" size={48} />
      </span>
      <span className="df-orgart__line" />
      <span className="df-pics">
        {places.map((icon) => (
          <span key={icon} className="df-well df-well--raised">
            <DfIcon name={icon} size={26} />
          </span>
        ))}
      </span>
    </span>
  )
}

function Price({ price, cadence, size }: { price: string; cadence: string; size?: "lg" | "sm" }) {
  return (
    <p className={cn("df-price", size && `df-price--${size}`)}>
      <b className="df-grad" dir="ltr">
        {price}
      </b>
      <span>{cadence}</span>
    </p>
  )
}

function Checks({ items, columns = false }: { items: readonly string[]; columns?: boolean }) {
  return (
    <ul className={cn("df-checks", columns && "df-checks--2")}>
      {items.map((item) => (
        <li key={item}>
          <span className="df-well df-well--solid df-tone--plum" aria-hidden="true">
            <DfIcon name="check" size={16} stroke={2.5} />
          </span>
          <span>{item}</span>
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
    <Link href={meta.href} className={cn("df-btn df-btn--lg", meta.highlighted ? "df-btn--primary" : "df-btn--outline", className)}>
      {plan.cta}
      <DfIcon name="arrow" size={20} className="df-btn__trail" />
    </Link>
  )
}

/** A subscription plan (Pro / Premium). */
function PlanCard({ index }: { index: number }) {
  const { t } = useI18n()
  const copy = t.landing.pricing
  const meta = PLAN_META[index]
  const plan = copy.plans[index]
  if (!meta || !plan) return null
  const headingId = `plan-${meta.id}-heading`
  return (
    <article aria-labelledby={headingId} className={cn("df-plancard", meta.highlighted ? "df-plancard--top df-tone--ruby" : "df-tone--plum")}>
      {meta.highlighted ? (
        <span className="df-plancard__flag">
          <Chip icon="sparkle">{copy.mostPopular}</Chip>
        </span>
      ) : null}
      <div className="df-card__head">
        <span className="df-well" aria-hidden="true">
          <DfIcon name={meta.icon} size={26} />
        </span>
        <h4 id={headingId} className="df-card__title">
          {plan.name}
        </h4>
      </div>
      <p className="df-text">{plan.audience}</p>
      <Price price={plan.price} cadence={plan.cadence} />
      <Checks items={plan.features} />
      <PlanCta index={index} />
    </article>
  )
}

/** The starting box, or the slim rail it folds into when the other one is open. */
function AudienceIntro({
  audience,
  folded,
  onOpen,
  controls,
  buttonRef,
}: {
  audience: Audience
  folded: boolean
  onOpen: () => void
  controls: string
  buttonRef: Ref<HTMLButtonElement>
}) {
  const { t } = useI18n()
  const paths = t.landing.pricing.paths
  const copy = paths[audience]
  const look = AUDIENCE_LOOK[audience]

  if (folded) {
    return (
      <button ref={buttonRef} type="button" onClick={onOpen} aria-expanded={false} aria-controls={controls} className={cn("df-rail", `df-tone--${look.tone}`)}>
        <span className="df-well df-well--solid" aria-hidden="true">
          <DfIcon name={look.icon} size={26} />
        </span>
        <span className="df-rail__text">
          <span className="df-sr">{paths.switchTo} </span>
          {copy.title}
        </span>
        <DfIcon name="arrow" size={20} />
      </button>
    )
  }

  return (
    <button ref={buttonRef} type="button" onClick={onOpen} aria-expanded={false} aria-controls={controls} className={cn("df-aud", `df-tone--${look.tone}`)}>
      <span className="df-aud__art" aria-hidden="true">
        <AudienceArt audience={audience} />
      </span>
      <span className="df-aud__title">{copy.title}</span>
      <span className="df-aud__body">{copy.body}</span>
      <span className="df-aud__go">
        {copy.cta}
        <DfIcon name="arrow" size={20} />
      </span>
    </button>
  )
}

/** The top of an opened audience: who it is for, and the way back to both options. */
function OpenHeader({ audience, onBack }: { audience: Audience; onBack: () => void }) {
  const { t } = useI18n()
  const paths = t.landing.pricing.paths
  const copy = paths[audience]
  const look = AUDIENCE_LOOK[audience]
  return (
    <div className="df-openhead">
      <div className={cn("df-openhead__who", `df-tone--${look.tone}`)}>
        <span className="df-well df-well--lg df-well--solid" aria-hidden="true">
          <DfIcon name={look.icon} size={34} />
        </span>
        <div>
          <h3>{copy.title}</h3>
          <p className="df-text">{copy.body}</p>
        </div>
      </div>
      <button type="button" onClick={onBack} className="df-btn df-btn--soft df-btn--sm">
        <DfIcon name="back" size={18} />
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
      <div className="df-plan df-tone--flame">
        <div className="df-plan__side">
          <span className="df-plan__name">{plan.name}</span>
          <Price price={plan.price} cadence={plan.cadence} size="lg" />
          <p className="df-text">{plan.audience}</p>
          <PlanCta index={PERSONAL_PLAN} />
        </div>
        <div className="df-plan__box">
          <Checks items={plan.features} />
        </div>
      </div>
    </div>
  )
}

function IndustriesDetails({ onBack }: { onBack: () => void }) {
  const { t } = useI18n()
  const paths = t.landing.pricing.paths
  // Opens on Subscription, so the plans show straight away (one track is always shown).
  const [track, setTrack] = useState<Track>("subscription")
  const regionId = useId()
  const enterprise = t.landing.pricing.plans[ENTERPRISE_PLAN]

  const tracks: { id: Track; icon: IconName; title: string; body: string }[] = [
    { id: "subscription", icon: "repeat", ...paths.subscription },
    { id: "enterprise", icon: "paper", ...paths.enterprise },
  ]

  return (
    <div>
      <OpenHeader audience="industries" onBack={onBack} />

      <p className="df-tracks__label">{paths.tracksLabel}</p>
      <div className="df-tracks">
        {tracks.map(({ id, icon, title, body }) => (
          <button key={id} type="button" aria-pressed={track === id} aria-controls={regionId} onClick={() => setTrack(id)} className="df-track df-tone--ruby">
            <span className={cn("df-well", track === id && "df-well--solid")} aria-hidden="true">
              <DfIcon name={icon} size={24} />
            </span>
            <span>
              <b>{title}</b>
              <span>{body}</span>
            </span>
            <DfIcon name="check" size={22} stroke={2.5} className="df-track__check" />
          </button>
        ))}
      </div>

      <div id={regionId} aria-live="polite">
        {track === "subscription" ? (
          <div key="subscription" className="df-plans">
            {SUBSCRIPTION_PLANS.map((index) => (
              <PlanCard key={index} index={index} />
            ))}
          </div>
        ) : enterprise ? (
          <article key="enterprise" aria-labelledby="plan-enterprise-heading" className="df-plancard df-tone--ruby" style={{ marginTop: "var(--df-space-8)" }}>
            <div className="df-plan" style={{ marginTop: 0 }}>
              <div className="df-plan__side">
                <Chip icon="paper" tone="sun">
                  {paths.contract}
                </Chip>
                <h4 id="plan-enterprise-heading" className="df-card__title">
                  {enterprise.name}
                </h4>
                <p className="df-text">{enterprise.audience}</p>
                <Price price={enterprise.price} cadence={enterprise.cadence} size="sm" />
                <PlanCta index={ENTERPRISE_PLAN} />
              </div>
              <div className="df-plan__box">
                <Checks items={enterprise.features} />
              </div>
            </div>
          </article>
        ) : null}
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
  // The button that opened this panel is gone, so keyboard focus moves into the panel; "Back to both
  // options" removes the panel, so focus returns to this audience's box.
  const panelRef = useRef<HTMLDivElement>(null)
  const introRef = useRef<HTMLButtonElement>(null)
  const wasOpen = useRef(false)
  useEffect(() => {
    if (isOpen) panelRef.current?.focus({ preventScroll: true })
    else if (wasOpen.current && open === null) introRef.current?.focus({ preventScroll: true })
    wasOpen.current = isOpen
  }, [isOpen, open])
  return (
    <div className={cn("df-slot", folded && "df-slot--rail")}>
      {isOpen ? (
        <div ref={panelRef} id={panelId} role="region" tabIndex={-1} aria-label={t.landing.pricing.paths[audience].title} className="df-openpanel">
          {children}
        </div>
      ) : (
        <AudienceIntro audience={audience} folded={folded} onOpen={() => setOpen(audience)} controls={panelId} buttonRef={introRef} />
      )}
    </div>
  )
}

/** /pricing: who it is for, then the plans for that choice. */
export function PricingBody() {
  const { t } = useI18n()
  const copy = t.landing.pricing
  const [open, setOpen] = useState<Audience | null>(null)

  return (
    <>
      <PageHero
        id="df-page-t"
        crumb={t.landing.nav.links.pricing}
        crumbIcon="tag"
        title={copy.title}
        lead={copy.description}
        videoKey="pricing"
        art={
          <PageArt
            tone="sun"
            icon="tag"
            badge="check"
            pills={[
              { label: copy.paths.personal.title, icon: "user", tone: "flame" },
              { label: copy.paths.industries.title, icon: "building", tone: "plum" },
              { label: t.landing.cta.chip, icon: "check", tone: "ruby" },
            ]}
          />
        }
      />
      <section className="df df-section df-section--sunken" id="plans" aria-labelledby="df-plans-t">
        <div className="df-wrap">
          <SectionHead id="df-plans-t" title={<SplitTitle text={copy.paths.label} />} />
          <div role="group" aria-label={copy.paths.label} className="df-choose__row">
            <AudienceSlot audience="personal" open={open} setOpen={setOpen}>
              <PersonalDetails onBack={() => setOpen(null)} />
            </AudienceSlot>
            <AudienceSlot audience="industries" open={open} setOpen={setOpen}>
              <IndustriesDetails onBack={() => setOpen(null)} />
            </AudienceSlot>
          </div>
          <p className="df-note df-small">
            <DfIcon name="info" size={20} />
            {copy.note}
          </p>
        </div>
      </section>
      <CtaBand />
    </>
  )
}
