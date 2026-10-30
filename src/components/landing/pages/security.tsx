"use client"

import { cn } from "@/lib/utils"
import { useI18n } from "@/i18n/use-i18n"
import { AppGlyph, Avatar, Chip, DfIcon, SectionHead, type IconName, type Tone } from "../home/df-ui"
import { CtaBand, PageArt, PageHero, SplitTitle } from "./page-ui"

const PRIVACY_EMAIL = "fatima@deafference.com"

/** Pictures for `t.landing.privacy.principles`, in order. Decorative: each card's text says it. */
function PrincipleArt({ index }: { index: number }) {
  const { t } = useI18n()
  const visual = t.landing.privacy.visual
  switch (index) {
    // "Only when you ask": the browser's own permission prompt for the camera and microphone.
    case 0:
      return (
        <div className="df-mock">
          <div className="df-mock__q">
            <span className="df-well df-well--sm df-well--raised">
              <DfIcon name="camera" size={20} />
            </span>
            <span className="df-well df-well--sm df-well--raised">
              <DfIcon name="mic" size={20} />
            </span>
            <span>{visual.prompt}</span>
          </div>
          <div className="df-mock__btns">
            <span className="df-mock__btn">{visual.block}</span>
            <span className="df-mock__btn df-mock__btn--on">{visual.allow}</span>
          </div>
        </div>
      )
    // "No recordings saved": video in, translation out, nothing kept in the account.
    case 1:
      return (
        <div className="df-stack">
          <div className="df-pics">
            <span className="df-well df-well--raised">
              <DfIcon name="camera" size={26} />
            </span>
            <DfIcon name="arrow" size={20} />
            <AppGlyph size={52} />
            <DfIcon name="arrow" size={20} />
            <span className="df-well df-well--raised">
              <DfIcon name="captions" size={26} />
            </span>
          </div>
          <Chip icon="recoff">{t.landing.why.visual.notSaved}</Chip>
        </div>
      )
    // "Only what your account needs": a profile card with just those fields.
    case 2:
      return (
        <div className="df-account">
          <Avatar tone="ruby" size={52} />
          <div className="df-account__rows">
            <i />
            <span className="df-account__row">
              <DfIcon name="mail" size={16} />
              <i style={{ width: 96 }} />
            </span>
            <span className="df-account__row">
              <DfIcon name="lock" size={16} />
              <b>••••••</b>
            </span>
            <span className="df-account__row">
              <DfIcon name="hand" size={16} />
              <i style={{ width: 72 }} />
            </span>
            <span className="df-account__row">
              <DfIcon name="camera" size={16} />
              <i style={{ width: 48 }} />
            </span>
          </div>
        </div>
      )
    // "You're in control": the profile page's own controls: edit, change password, delete.
    default:
      return (
        <div className="df-pics">
          <Avatar tone="ruby" size={72} badge="check" />
          <DfIcon name="arrow" size={20} />
          {(["pen", "key", "trash"] as const).map((icon) => (
            <span key={icon} className="df-well df-well--raised">
              <DfIcon name={icon} size={24} />
            </span>
          ))}
        </div>
      )
  }
}

const PRINCIPLE_TONES: Tone[] = ["plum", "flame", "ruby", "sun"]
const RIGHT_LOOK: { icon: IconName; tone: Tone }[] = [
  { icon: "eye", tone: "plum" },
  { icon: "trash", tone: "ruby" },
  { icon: "mail", tone: "flame" },
  { icon: "eraser", tone: "sun" },
]

/** /security: a plain-language privacy summary, your rights, and who to ask. */
export function SecurityBody() {
  const { t } = useI18n()
  const copy = t.landing.privacy
  const visual = t.landing.why.visual

  return (
    <>
      <PageHero
        id="df-page-t"
        crumb={t.landing.nav.links.security}
        crumbIcon="shield"
        title={copy.title}
        lead={copy.description}
        videoKey="security"
        jumps={[
          { href: "#summary", label: copy.badge, icon: "paper" },
          { href: "#rights", label: copy.rights.title, icon: "check" },
        ]}
        art={
          <PageArt
            tone="ruby"
            icon="shield"
            badge="lock"
            pills={[
              { label: visual.sessionOn, icon: "camera", tone: "ruby" },
              { label: visual.sessionOff, icon: "recoff", tone: "plum" },
              { label: visual.notSaved, icon: "lock", tone: "flame" },
            ]}
          />
        }
      />

      <section className="df df-section df-section--sunken" id="summary" aria-labelledby="df-summary-t">
        <div className="df-wrap">
          <SectionHead id="df-summary-t" title={<SplitTitle text={copy.badge} />} />
          <ul className="df-grid df-grid--2">
            {copy.principles.map((item, i) => (
              <li key={item.title}>
                <article className={cn("df-card df-card--md", `df-tone--${PRINCIPLE_TONES[i] ?? "ruby"}`)}>
                  <div className="df-card__art" aria-hidden="true">
                    <PrincipleArt index={i} />
                  </div>
                  <h3 className="df-card__title">{item.title}</h3>
                  <p className="df-text">{item.description}</p>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="df df-section" id="rights" aria-labelledby="df-rights-t">
        <div className="df-wrap">
          <SectionHead id="df-rights-t" title={<SplitTitle text={copy.rights.title} />} />
          <ul className="df-rights">
            {copy.rights.items.map((right, i) => {
              const look = RIGHT_LOOK[i] ?? RIGHT_LOOK[0]
              return (
                <li key={right} className={`df-tone--${look.tone}`}>
                  <span className="df-well" aria-hidden="true">
                    <DfIcon name={look.icon} size={26} />
                  </span>
                  <span>{right}</span>
                </li>
              )
            })}
          </ul>

          <div className="df-mailband df-tone--ruby">
            <span className="df-well df-well--lg df-well--solid df-well--round" aria-hidden="true">
              <DfIcon name="mail" size={32} />
            </span>
            <p>{copy.contact}</p>
            <a className="df-btn df-btn--primary" href={`mailto:${PRIVACY_EMAIL}`} dir="ltr">
              {PRIVACY_EMAIL}
            </a>
          </div>
        </div>
      </section>
      <CtaBand />
    </>
  )
}
