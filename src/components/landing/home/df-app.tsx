"use client"

import Link from "next/link"
import { APP_ROUTES } from "@/lib/constants"
import { useI18n } from "@/i18n/use-i18n"
import { Bubble, Chip, DfIcon, HandSign, JudyArt, Kicker, Mark, type IconName } from "./df-ui"

const LIST_ICONS: IconName[] = ["globe", "phone", "clock"]

/** The final call to action on the ink band, beside a drawing of the app's listening workspace. */
export function DfApp() {
  const { t } = useI18n()
  const copy = t.landing.home.app
  const how = t.landing.home.how
  const home = t.landing.home

  return (
    <section className="df df-section" id="app" aria-labelledby="df-app-t">
      <div className="df-wrap">
        <div className="df-getapp">
          <span className="df-getapp__glow" aria-hidden="true" />
          <div className="df-getapp__copy">
            <div className="df-sechead__row">
              <Kicker icon="info" variant="on">
                {copy.kicker}
              </Kicker>
            </div>
            <h2 className="df-title" id="df-app-t">
              {copy.title}
            </h2>
            <ul className="df-getapp__list">
              {copy.list.map((item, i) => (
                <li key={item}>
                  <DfIcon name={LIST_ICONS[i] ?? "check"} size={24} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Link href={APP_ROUTES.translate} className="df-btn df-btn--light df-btn--lg">
              <DfIcon name="phone" size={24} />
              <span>{t.landing.demo.ctaButton}</span>
              <DfIcon name="arrow" size={18} className="df-btn__trail" />
            </Link>
          </div>

          <div className="df-getapp__art" role="img" aria-label={copy.imageLabel}>
            <div className="df-browser">
              <div className="df-browser__bar">
                <span className="df-browser__dots">
                  <i />
                  <i />
                  <i />
                </span>
                <span className="df-browser__title">
                  <DfIcon name="lock" size={14} />
                  <span className="df-browser__url">{copy.browserTitle}</span>
                </span>
                <span className="df-browser__sp" />
              </div>
              <div className="df-browser__body">
                <div className="df-ws">
                  <div className="df-ws__head">
                    <Mark size={30} />
                    <b>{copy.workspace}</b>
                    <Chip tone="sun" className="df-live">
                      {home.hero.live}
                    </Chip>
                  </div>
                  <div className="df-ws__modes">
                    <span className="is-on">
                      <DfIcon name="hand" size={16} />
                      {how.sign} <DfIcon name="arrow" size={14} /> {copy.textSpeech}
                    </span>
                    <span>
                      <DfIcon name="mic" size={16} />
                      {copy.textSpeech} <DfIcon name="arrow" size={14} /> {how.sign}
                    </span>
                  </div>
                  <div className="df-ws__panes">
                    <div className="df-ws__pane df-ws__pane--cam">
                      <span className="df-ws__label">
                        <DfIcon name="camera" size={15} />
                        {copy.camera}
                      </span>
                      <span className="df-app__corners" />
                      <HandSign shape="ily" size={96} motion className="df-app__camhand" />
                    </div>
                    <div className="df-ws__pane df-ws__pane--avatar">
                      <span className="df-ws__label">
                        <DfIcon name="user" size={15} />
                        {copy.avatar}
                      </span>
                      <JudyArt size={92} pose="wave" />
                    </div>
                  </div>
                  <div className="df-ws__chat">
                    <Bubble side="sign" text={copy.youSay} whoLabel={home.signed} />
                    <Bubble side="speech" whoIcon="volume" text={copy.theySay} whoLabel={home.spoken} className="df-seq df-seq--2" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
