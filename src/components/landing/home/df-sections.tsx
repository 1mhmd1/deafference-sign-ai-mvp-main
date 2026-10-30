"use client"

import { Fragment } from "react"
import Link from "next/link"
import { APP_ROUTES } from "@/lib/constants"
import { useI18n } from "@/i18n/use-i18n"
import { AccentTitle, Avatar, Chip, DfIcon, PictoTile, SectionHead, type IconName, type Tone } from "./df-ui"

/** Pictures for the three tutorials of `t.landing.demo.tutorials` (same order). */
const TUTORIAL_ART: { tone: Tone; badge: IconName; steps: IconName[] }[] = [
  { tone: "flame", badge: "hand", steps: ["user", "camera", "hand"] },
  { tone: "plum", badge: "stethoscope", steps: ["hand", "captions", "mic"] },
  { tone: "ruby", badge: "sliders", steps: ["siren", "paper", "expand"] },
]

/** Demo center: three tutorial cards, each told as three pictured steps (the videos are still being made). */
export function DfVideos() {
  const { t } = useI18n()
  const demo = t.landing.demo
  const copy = t.landing.home.videos

  return (
    <section className="df df-section df-section--sunken" id="demo" aria-labelledby="df-videos-t">
      <div className="df-wrap">
        <SectionHead
          id="df-videos-t"
          kicker={demo.eyebrow}
          kickerIcon="play"
          title={<AccentTitle lead={copy.titleLead} accent={copy.titleAccent} />}
          lead={copy.lead}
        />
        <ul className="df-videos">
          {demo.tutorials.map((tutorial, i) => {
            const art = TUTORIAL_ART[i] ?? TUTORIAL_ART[0]
            return (
              <li key={tutorial.title} className={`df-video df-tone--${art.tone}`}>
                <div className="df-video__thumb">
                  <span className="df-video__badges">
                    <Chip icon="captions">{copy.cc}</Chip>
                    <Chip icon="hand">{copy.sign}</Chip>
                  </span>
                  <span className="df-video__who" aria-hidden="true">
                    <Avatar tone={art.tone} size={104} badge={art.badge} />
                  </span>
                  <span className="df-video__play" aria-hidden="true">
                    <DfIcon name="playfill" size={26} />
                  </span>
                  <span className="df-video__soon">
                    <DfIcon name="clock" size={16} />
                    {demo.media.comingSoon}
                  </span>
                </div>
                <div className="df-video__body">
                  <span className="df-video__aud">{tutorial.audience}</span>
                  <h3 className="df-video__title">{tutorial.title}</h3>
                  <ol className="df-vsteps" aria-label={tutorial.description}>
                    {tutorial.steps.map((step, s) => (
                      <Fragment key={step}>
                        {s > 0 ? (
                          <li className="contents" aria-hidden="true">
                            <DfIcon name="chev" size={16} className="df-vstep__sep" />
                          </li>
                        ) : null}
                        <li className="df-vstep">
                          <span className="df-vstep__i">
                            <DfIcon name={art.steps[s] ?? "check"} size={22} />
                          </span>
                          <span>{step}</span>
                        </li>
                      </Fragment>
                    ))}
                  </ol>
                  <Link className="df-link" href={APP_ROUTES.translate}>
                    {demo.media.tryIt}
                    <DfIcon name="arrow" size={18} />
                  </Link>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

/** Learn more: the four pages that have their own address. */
export function DfExplore() {
  const { t } = useI18n()
  const items = t.landing.explore.items
  const copy = t.landing.home.explore

  return (
    <section className="df df-section df-section--tight" id="explore" aria-labelledby="df-explore-t">
      <div className="df-wrap">
        <SectionHead
          id="df-explore-t"
          kicker={t.landing.explore.eyebrow}
          kickerIcon="info"
          title={<AccentTitle lead={copy.titleLead} accent={copy.titleAccent} />}
        />
        <div className="df-explore">
          <PictoTile href="/pricing" icon="tag" badge="check" label={items.pricing.title} sub={items.pricing.cta} tone="sun" size="lg" />
          <PictoTile href="/faq" icon="question" badge="speech" label={items.faq.title} sub={items.faq.cta} tone="plum" size="lg" />
          <PictoTile href="/security" icon="shield" badge="lock" label={items.security.title} sub={items.security.cta} tone="ruby" size="lg" />
          <PictoTile href="/contact" icon="mail" badge="hand" label={items.contact.title} sub={items.contact.cta} tone="flame" size="lg" />
        </div>
      </div>
    </section>
  )
}
