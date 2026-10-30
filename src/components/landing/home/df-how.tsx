"use client"

import { Fragment, useState, type ReactNode } from "react"
import Link from "next/link"
import { useI18n } from "@/i18n/use-i18n"
import { AccentTitle, AppGlyph, Avatar, DfIcon, HandSign, JudyArt, PhoneMock, SectionHead, WaveBars, type Tone } from "./df-ui"
import { TranslationExample } from "./df-example"

const STEP_TONES: Tone[] = ["ruby", "flame", "plum"]

function FlowNode({ when, avatar, picto, label }: { when: "sign" | "speech"; avatar: ReactNode; picto: ReactNode; label: string }) {
  return (
    <div className={`df-flow__node df-when-${when}`}>
      {avatar}
      <span className="df-flow__picto">{picto}</span>
      <span className="df-flow__label">{label}</span>
    </div>
  )
}

/** Three steps (open, sign or speak, read or watch), then the two-way flow with a swap button. */
export function DfHow() {
  const { t, fmt } = useI18n()
  const copy = t.landing.home.how
  const [from, setFrom] = useState<"sign" | "speech">("sign")

  const arts = [
    <div key="open" className="df-art-open">
      <PhoneMock size="sm">
        <div className="df-art-open__home">
          <AppGlyph size={56} />
          <span className="df-tap">
            <i />
            <i />
          </span>
        </div>
      </PhoneMock>
    </div>,
    <div key="or" className="df-art-or">
      <HandSign shape="ily" size={104} motion />
      <span className="df-art-or__or">{copy.or}</span>
      <span className="df-art-or__mic">
        <DfIcon name="mic" size={48} stroke={1.75} />
      </span>
    </div>,
    <div key="read" className="df-art-read">
      <span className="df-art-read__card">
        <DfIcon name="captions" size={26} />
        <i />
        <i />
        <i />
      </span>
      <span className="df-art-read__signer">
        <JudyArt size={104} pose="wave" />
      </span>
    </div>,
  ]

  const wire = (
    <div className="df-flow__wire" aria-hidden="true">
      <span />
      <span />
      <span />
    </div>
  )
  const [a, b] = from === "sign" ? [copy.sign, copy.speech] : [copy.speech, copy.sign]

  return (
    <section className="df df-section" id="how" aria-labelledby="df-how-t">
      <div className="df-wrap">
        <SectionHead
          id="df-how-t"
          kicker={t.landing.howItWorks.eyebrow}
          kickerIcon="swap"
          title={<AccentTitle lead={copy.titleLead} accent={copy.titleAccent} />}
          videoKey="howItWorks"
        />
        <ol className="df-steps">
          {copy.steps.map((title, i) => (
            <Fragment key={title}>
              {i > 0 ? (
                <li className="df-steps__arrow" aria-hidden="true">
                  <DfIcon name="arrow" size={28} />
                </li>
              ) : null}
              <li className={`df-step df-tone--${STEP_TONES[i]}`}>
                <div className="df-step__art" aria-hidden="true">
                  {arts[i]}
                </div>
                <div className="df-step__foot">
                  <span className="df-step__n" aria-hidden="true">
                    {i + 1}
                  </span>
                  <h3 className="df-step__title">
                    <span className="df-sr">{fmt(copy.stepLabel, { n: i + 1 })}: </span>
                    {title}
                  </h3>
                </div>
              </li>
            </Fragment>
          ))}
        </ol>

        <div className="df-flowpanel">
          <div className="df-flowpanel__head">
            <h3 className="df-heading">{copy.flowTitle}</h3>
            <span className="df-flowpanel__hint">
              <DfIcon name="swap" size={18} />
              {copy.flowHint}
            </span>
          </div>
          <div className="df-flow" data-from={from}>
            {/* Announces the new direction after a swap. */}
            <div className="df-flow__track" aria-live="polite">
              <div className="df-flow__end">
                <FlowNode when="sign" avatar={<Avatar tone="flame" size={84} badge="hand" />} picto={<HandSign shape="ily" size={54} motion />} label={copy.youSign} />
                <FlowNode when="speech" avatar={<Avatar tone="plum" size={84} badge="mic" />} picto={<WaveBars />} label={copy.theySpeak} />
              </div>
              {wire}
              <div className="df-flow__node df-flow__node--app">
                <AppGlyph size={96} />
                <span className="df-flow__label">{copy.translates}</span>
              </div>
              {wire}
              <div className="df-flow__end">
                <FlowNode
                  when="sign"
                  avatar={<Avatar tone="plum" size={84} badge="ear" />}
                  picto={
                    <span className="df-flow__out">
                      <DfIcon name="volume" size={26} />
                      <DfIcon name="captions" size={26} />
                    </span>
                  }
                  label={copy.theyHearRead}
                />
                <FlowNode
                  when="speech"
                  avatar={<Avatar tone="flame" size={84} badge="eye" />}
                  picto={
                    <span className="df-flow__out df-flow__out--flame">
                      <DfIcon name="captions" size={26} />
                      <DfIcon name="hand" size={26} />
                    </span>
                  }
                  label={copy.youReadSee}
                />
              </div>
            </div>
            <button type="button" className="df-swap" onClick={() => setFrom((v) => (v === "sign" ? "speech" : "sign"))}>
              <DfIcon name="swap" size={22} />
              <span className="df-sr">{copy.swap}: </span>
              <span>
                {a} <DfIcon name="arrow" size={16} label={copy.to} /> {b}
              </span>
            </button>
          </div>
          {/* The same direction with real words: the hero's "Hi, I am Deaf." / "Hi! How can I help?". */}
          <TranslationExample key={from} from={from} />
        </div>

        <p className="df-center">
          <Link className="df-link" href="/how-it-works">
            {copy.more}
            <DfIcon name="arrow" size={18} />
          </Link>
        </p>
      </div>
    </section>
  )
}
