"use client"

import { useI18n } from "@/i18n/use-i18n"
import { DisplayPanel } from "./df-display"
import { AccentTitle, Chip, DfIcon, HandSign, PictoTile, SectionHead, type IconName, type Tone } from "./df-ui"

const PLACE_TILES: { icon: IconName; tone: Tone }[] = [
  { icon: "clipboard", tone: "plum" },
  { icon: "stethoscope", tone: "plum" },
  { icon: "pill", tone: "plum" },
  { icon: "siren", tone: "sos" },
]

/** Why choose us, as the design's bento: accessibility (with the live panel), two-way, private, healthcare. */
export function DfWhy() {
  const { t } = useI18n()
  const why = t.landing.why
  const copy = t.landing.home.why
  const how = t.landing.home.how
  const [a11y, clinic, live, privacy] = why.reasons
  const CHIP_ICONS: IconName[] = ["check", "keyboard", "earoff"]
  const PRIVATE_ICONS: IconName[] = ["camera", "recoff"]

  return (
    <section className="df df-section" id="why-choose-us" aria-labelledby="df-why-t">
      <div className="df-wrap">
        <SectionHead
          id="df-why-t"
          kicker={why.eyebrow}
          kickerIcon="heart"
          title={<AccentTitle lead={copy.titleLead} accent={copy.titleAccent} />}
        />
        <div className="df-bento">
          <article className="df-feat df-feat--a11y">
            <div className="df-feat__head">
              <span className="df-feat__icon df-tone--ruby" aria-hidden="true">
                <DfIcon name="a11y" size={28} />
              </span>
              <h3 className="df-heading">{a11y.title}</h3>
            </div>
            <div className="df-feat__demo">
              <span className="df-feat__aa" aria-hidden="true">
                Aa
              </span>
              <DisplayPanel />
              <div className="df-feat__chips">
                {copy.chips.map((chip, i) => (
                  <Chip key={chip} icon={CHIP_ICONS[i] ?? "check"}>
                    {chip}
                  </Chip>
                ))}
              </div>
            </div>
          </article>

          <article className="df-feat df-feat--live">
            <div className="df-feat__head">
              <span className="df-feat__icon df-tone--flame" aria-hidden="true">
                <DfIcon name="swap" size={28} />
              </span>
              <h3 className="df-heading">{live.title}</h3>
            </div>
            <div className="df-pingpong" aria-hidden="true">
              <span className="df-pingpong__end df-tone--flame">
                <HandSign shape="open" size={58} />
              </span>
              <span className="df-pingpong__lane">
                <i className="df-pingpong__ball df-pingpong__ball--a" />
                <i className="df-pingpong__ball df-pingpong__ball--b" />
              </span>
              <span className="df-pingpong__end df-tone--plum">
                <DfIcon name="wave" size={40} />
              </span>
            </div>
            <p className="df-feat__cap">
              <DfIcon name="hand" size={18} />
              {how.sign} <DfIcon name="arrow" size={14} label={how.to} /> {how.speech}
              <span aria-hidden="true">·</span>
              <DfIcon name="mic" size={18} />
              {how.speech} <DfIcon name="arrow" size={14} label={how.to} /> {how.sign}
            </p>
          </article>

          <article className="df-feat df-feat--private">
            <div className="df-feat__head">
              <span className="df-feat__icon df-tone--plum" aria-hidden="true">
                <DfIcon name="lock" size={28} />
              </span>
              <h3 className="df-heading">{privacy.title}</h3>
            </div>
            <ul className="df-feat__list">
              {copy.private.map((item, i) => (
                <li key={item}>
                  <DfIcon name={PRIVATE_ICONS[i] ?? "lock"} size={26} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>

          <article className="df-feat df-feat--clinic">
            <div className="df-feat__head">
              <span className="df-feat__icon df-tone--sun" aria-hidden="true">
                <DfIcon name="stethoscope" size={28} />
              </span>
              <h3 className="df-heading">{clinic.title}</h3>
            </div>
            <ul className="df-feat__tiles">
              {why.visual.places.map((place, i) => (
                <li key={place} className="flex">
                  <PictoTile icon={PLACE_TILES[i]?.icon ?? "check"} label={place} tone={PLACE_TILES[i]?.tone ?? "plum"} size="sm" />
                </li>
              ))}
            </ul>
          </article>
        </div>
      </div>
    </section>
  )
}
