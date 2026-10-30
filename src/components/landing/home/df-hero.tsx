"use client"

import Link from "next/link"
import { openEmergencyPhrases } from "@/components/deafference/emergency-quick-actions"
import { APP_ROUTES } from "@/lib/constants"
import { useI18n } from "@/i18n/use-i18n"
import { SignVideoButton } from "../sign-video"
import { HeroNetwork } from "./df-hero-net"
import { AccentTitle, Chip, DfIcon } from "./df-ui"

const FACT_ICONS = ["expand", "user", "lock"] as const

/** Hero: the promise, the two first actions, and Deafference linking the four steps of a conversation. */
export function DfHero() {
  const { t } = useI18n()
  const hero = t.landing.hero
  const copy = t.landing.home.hero

  return (
    <section className="df df-hero" id="top" aria-labelledby="df-hero-title">
      <div className="df-hero__bg" aria-hidden="true" />
      <div className="df-wrap df-hero__grid">
        <div className="df-hero__copy">
          <div className="df-hero__chips">
            <Chip icons={["hand", "mic"]} joiner="swap">
              {hero.status}
            </Chip>
            <SignVideoButton videoKey="home" look="df" />
          </div>
          <h1 className="df-hero__title" id="df-hero-title">
            <AccentTitle lead={copy.titleLead} accent={copy.titleAccent} />
          </h1>
          <p className="df-lead df-hero__lead">{hero.tagline}</p>
          <div className="df-hero__ctas">
            <Link href={APP_ROUTES.translate} className="df-btn df-btn--primary df-btn--lg">
              <DfIcon name="phone" size={24} />
              <span>{hero.primaryCta}</span>
              <DfIcon name="arrow" size={18} className="df-btn__trail" />
            </Link>
            {/* The same panel as the floating Emergency button: it works on every page, without an account. */}
            <button type="button" onClick={openEmergencyPhrases} aria-haspopup="dialog" className="df-btn df-btn--sos-outline df-btn--lg">
              <DfIcon name="siren" size={24} />
              <span>{hero.emergency}</span>
            </button>
          </div>
          <ul className="df-facts">
            {copy.facts.map((fact, i) => (
              <li key={fact}>
                <DfIcon name={FACT_ICONS[i] ?? "check"} size={20} />
                <span>{fact}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Deafference at the centre of the conversation, sending a pulse to each of its four steps. */}
        <HeroNetwork />
      </div>
    </section>
  )
}
