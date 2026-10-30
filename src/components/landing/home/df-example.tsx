"use client"

import { useI18n } from "@/i18n/use-i18n"
import { AppGlyph, Bubble, Chip, DfIcon, HandSign, JudyArt, WaveBars } from "./df-ui"

/**
 * A worked example for "How it works", in the direction shown: the hero's two lines going through the
 * app. Sign → speech: "Hi, I am Deaf." is signed to the camera, then said out loud and captioned.
 * Speech → sign: "Hi! How can I help?" is spoken, then signed by the avatar and captioned.
 * An ordered list, so it reads in order without the pictures. Give it `key={from}` so it plays again
 * after a swap.
 */
export function TranslationExample({ from }: { from: "sign" | "speech" }) {
  const { t } = useI18n()
  const how = t.landing.home.how
  const home = t.landing.home
  const said = from === "sign" ? home.hero.youSay : home.hero.theySay

  return (
    <div className="df-ex">
      <Chip icon="play" tone="sun" className="df-ex__tag">
        {how.example}
      </Chip>
      <ol className="df-ex__row">
        {from === "sign" ? (
          <li className="df-ex__card df-tone--flame">
            <span className="df-ex__who">
              <DfIcon name="hand" size={20} />
              {how.youSign}
            </span>
            <span className="df-ex__screen" aria-hidden="true">
              <span className="df-app__corners" />
              <HandSign shape="ily" size={78} wave />
            </span>
            <Bubble side="sign" text={said} whoLabel={home.signed} />
          </li>
        ) : (
          <li className="df-ex__card df-tone--plum">
            <span className="df-ex__who">
              <DfIcon name="mic" size={20} />
              {how.theySpeak}
            </span>
            <span className="df-ex__screen" aria-hidden="true">
              <span className="df-ex__mic">
                <DfIcon name="mic" size={34} />
              </span>
              <WaveBars count={6} />
            </span>
            <Bubble side="speech" text={said} whoLabel={home.spoken} />
          </li>
        )}

        <li className="df-ex__mid">
          <AppGlyph size={60} />
          <span>{how.translates}</span>
          <DfIcon name="arrow" size={22} className="df-ex__go" />
        </li>

        {from === "sign" ? (
          <li className="df-ex__card df-ex__card--out df-tone--plum">
            <span className="df-ex__who">
              <DfIcon name="ear" size={20} />
              {how.theyHearRead}
            </span>
            <span className="df-ex__screen" aria-hidden="true">
              <span className="df-ex__speaker">
                <DfIcon name="volume" size={34} />
              </span>
              <WaveBars count={6} />
            </span>
            <span className="df-ex__said">
              <DfIcon name="volume" size={18} />
              {how.saidAloud}
            </span>
            <p className="df-ex__cc">
              <DfIcon name="captions" size={20} label={how.captions} />
              <span>{said}</span>
            </p>
          </li>
        ) : (
          <li className="df-ex__card df-ex__card--out df-tone--flame">
            <span className="df-ex__who">
              <DfIcon name="eye" size={20} />
              {how.youReadSee}
            </span>
            <span className="df-ex__screen df-ex__screen--avatar" aria-hidden="true">
              <JudyArt size={92} pose="wave" />
            </span>
            <span className="df-ex__said">
              <DfIcon name="hand" size={18} />
              {how.signedBy}
            </span>
            <p className="df-ex__cc">
              <DfIcon name="captions" size={20} label={how.captions} />
              <span>{said}</span>
            </p>
          </li>
        )}
      </ol>
    </div>
  )
}
