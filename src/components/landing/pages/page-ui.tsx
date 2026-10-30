"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import { APP_ROUTES } from "@/lib/constants"
import { useI18n } from "@/i18n/use-i18n"
import { cn } from "@/lib/utils"
import { SignVideoButton } from "../sign-video"
import type { SignVideoKey } from "../sign-videos"
import { contactHref } from "../contact-intent"
import { AppGlyph, Bubble, DfIcon, Kicker, type IconName, type Tone } from "../home/df-ui"

/*
 * Shared parts of the landing's own pages (how it works, about, pricing, FAQ, security, contact, terms,
 * scenarios), drawn with the home page's design (home/df.css + ./pages.css): the page header with its
 * picture, and the closing "Start here" band.
 */

/**
 * A heading split for the logo-gradient accent: at its last comma when it has one ("Common questions,"
 * + "answered simply"), otherwise before its last two words (one for a two-word heading).
 */
export function splitTitle(title: string): { lead: string; accent: string } {
  const text = title.trim()
  const comma = Math.max(text.lastIndexOf(","), text.lastIndexOf("،"))
  if (comma > 0 && comma < text.length - 1) return { lead: text.slice(0, comma + 1), accent: text.slice(comma + 1).trim() }
  const words = text.split(/\s+/)
  if (words.length < 2) return { lead: "", accent: text }
  const cut = words.length === 2 ? 1 : words.length - 2
  return { lead: words.slice(0, cut).join(" "), accent: words.slice(cut).join(" ") }
}

/** A heading with the gradient accent on its last words (see splitTitle). */
export function SplitTitle({ text }: { text: string }) {
  const { lead, accent } = splitTitle(text)
  return lead ? (
    <>
      {lead} <span className="df-grad">{accent}</span>
    </>
  ) : (
    <span className="df-grad">{accent}</span>
  )
}

export type HeroPill = { label: string; tone: Tone; icon?: IconName; n?: number }

/**
 * The page header's picture, in the home hero's style: a soft orb with a dashed orbit, the page's own
 * pictogram in the middle and three floating labels. Decorative: the header's text says the same.
 */
export function PageArt({
  tone,
  icon,
  badge,
  center,
  pills,
}: {
  tone: Tone
  icon?: IconName
  badge?: IconName
  /** Replaces the pictogram tile. */
  center?: ReactNode
  pills: HeroPill[]
}) {
  return (
    <div className={cn("df-part", `df-tone--${tone}`)} aria-hidden="true">
      <span className="df-part__orb" />
      <span className="df-part__orbit" />
      <div className="df-part__center">
        {center ??
          (icon ? (
            <span className="df-part__well">
              <DfIcon name={icon} size={88} stroke={1.6} />
              {badge ? (
                <span className="df-part__badge">
                  <DfIcon name={badge} size={28} />
                </span>
              ) : null}
            </span>
          ) : null)}
      </div>
      {pills.slice(0, 3).map((pill, i) => (
        <span key={pill.label} className={cn("df-part__pill", `df-part__pill--${i + 1}`, `df-tone--${pill.tone}`)}>
          <b>{pill.n ?? <DfIcon name={pill.icon ?? "check"} size={18} />}</b>
          <span>{pill.label}</span>
        </span>
      ))}
    </div>
  )
}

export type JumpLink = { href: string; label: string; icon: IconName }

/**
 * The page header: "Home › Page", the page's heading (h1) with its gradient accent, a lead line, then
 * whatever the page adds (buttons, chips, links to its sections), with the picture beside it.
 */
export function PageHero({
  id,
  crumb,
  crumbIcon,
  title,
  titleLead,
  titleAccent,
  lead,
  children,
  jumps,
  videoKey,
  art,
}: {
  id: string
  /** The page's short name, as in the header menu. */
  crumb: string
  crumbIcon: IconName
  /** Split automatically (splitTitle), unless titleLead/titleAccent are given. */
  title?: string
  titleLead?: string
  titleAccent?: string
  lead?: ReactNode
  children?: ReactNode
  jumps?: JumpLink[]
  videoKey?: SignVideoKey
  art?: ReactNode
}) {
  const { t } = useI18n()
  const parts = titleAccent ? { lead: titleLead ?? "", accent: titleAccent } : splitTitle(title ?? "")

  return (
    <section className="df df-phero" aria-labelledby={id}>
      <span className="df-hero__bg" aria-hidden="true" />
      <div className="df-wrap">
        <div className={cn("df-phero__grid", !art && "df-phero__grid--solo")}>
          <div className="df-phero__copy">
            <nav className="df-crumbs" aria-label={t.landing.pages.crumbs}>
              <ol>
                <li>
                  <Link href="/">
                    <DfIcon name="home" size={18} />
                    {t.landing.nav.links.homeLink}
                  </Link>
                </li>
                <li>
                  <DfIcon name="chev" size={16} className="df-crumbs__sep" />
                  <span className="df-crumbs__here" aria-current="page">
                    <span className="df-kicker__icon">
                      <DfIcon name={crumbIcon} size={16} />
                    </span>
                    {crumb}
                  </span>
                </li>
              </ol>
            </nav>
            <h1 id={id} className="df-phero__title">
              {parts.lead ? <>{parts.lead} </> : null}
              <span className="df-grad">{parts.accent}</span>
            </h1>
            {lead ? <p className="df-lead df-phero__lead">{lead}</p> : null}
            {children}
            {videoKey ? <SignVideoButton videoKey={videoKey} look="df" /> : null}
            {jumps?.length ? (
              <nav className="df-jumps" aria-label={t.landing.pages.onThisPage}>
                <ul>
                  {jumps.map((jump) => (
                    <li key={jump.href}>
                      <a className="df-chip df-chip--link" href={jump.href}>
                        <DfIcon name={jump.icon} size={18} />
                        <span>{jump.label}</span>
                        <DfIcon name="arrowdown" size={16} className="df-jumps__go" />
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            ) : null}
          </div>
          {art}
        </div>
      </div>
    </section>
  )
}

/** The closing band on the landing's pages: try the app, or talk to us, beside a two-line conversation. */
export function CtaBand({ contact = true }: { contact?: boolean }) {
  const { t } = useI18n()
  const cta = t.landing.cta
  const hero = t.landing.home.hero

  return (
    <section className="df df-section df-section--tight" aria-labelledby="df-ctaband-t">
      <div className="df-wrap">
        <div className="df-ctaband">
          <span className="df-getapp__glow" aria-hidden="true" />
          <div className="df-ctaband__copy">
            <Kicker icon="bolt" variant="on">
              {cta.eyebrow}
            </Kicker>
            <h2 id="df-ctaband-t" className="df-title">
              {cta.title}
            </h2>
            <p className="df-ctaband__body">{cta.body}</p>
            <div className="df-row">
              <Link className="df-btn df-btn--light df-btn--lg" href={APP_ROUTES.translate}>
                {cta.primary}
                <DfIcon name="arrow" size={20} className="df-btn__trail" />
              </Link>
              {contact ? (
                <Link className="df-btn df-btn--onaction df-btn--lg" href={contactHref()}>
                  <DfIcon name="mail" size={20} />
                  {cta.secondary}
                </Link>
              ) : null}
            </div>
          </div>
          <div className="df-ctaband__art" aria-hidden="true">
            <Bubble side="sign" text={hero.youSay} whoLabel={t.landing.home.signed} />
            <AppGlyph size={76} />
            <Bubble side="speech" text={hero.theySay} whoLabel={t.landing.home.spoken} />
          </div>
        </div>
      </div>
    </section>
  )
}
