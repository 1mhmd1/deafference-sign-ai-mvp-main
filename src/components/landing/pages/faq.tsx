"use client"

import { useId, useState } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { useI18n } from "@/i18n/use-i18n"
import { contactHref } from "../contact-intent"
import { DfIcon, Mark, type IconName, type Tone } from "../home/df-ui"
import { CtaBand, PageArt, PageHero } from "./page-ui"

/**
 * One picture per question, zipped by index with `t.landing.faq.items`: what it is (the mark), sign
 * languages, camera, interpreters, cost, Arabic, accuracy, offline.
 */
const QUESTION_LOOK: { icon: IconName | "brand"; tone: Tone }[] = [
  { icon: "brand", tone: "ruby" },
  { icon: "hand", tone: "flame" },
  { icon: "camera", tone: "plum" },
  { icon: "usercheck", tone: "ruby" },
  { icon: "tag", tone: "sun" },
  { icon: "languages", tone: "flame" },
  { icon: "target", tone: "plum" },
  { icon: "wifioff", tone: "ruby" },
]

/** How many questions show before "View more". */
const INITIAL_COUNT = 2

/**
 * Every question and answer is in the page from the start (search engines read them, and so does
 * find-in-page once shown); closed answers and the questions behind "View more" are only hidden.
 */
function Question({
  question,
  answer,
  look,
  hidden,
}: {
  question: string
  answer: string
  look: (typeof QUESTION_LOOK)[number]
  hidden?: boolean
}) {
  const [open, setOpen] = useState(false)
  const panelId = useId()
  return (
    <li className={cn("df-qa", `df-tone--${look.tone}`, open && "is-open")} hidden={hidden}>
      <h2>
        <button type="button" className="df-qa__q" aria-expanded={open} aria-controls={panelId} onClick={() => setOpen((value) => !value)}>
          <span className="df-well" aria-hidden="true">
            {look.icon === "brand" ? <Mark size={30} /> : <DfIcon name={look.icon} size={26} />}
          </span>
          <span className="df-qa__text">{question}</span>
          <span className="df-qa__chev" aria-hidden="true">
            <DfIcon name="chevdown" size={22} />
          </span>
        </button>
      </h2>
      <p id={panelId} className="df-qa__a" hidden={!open}>
        {answer}
      </p>
    </li>
  )
}

/** /faq: the questions (two first, the rest on request) beside "Still have a question?". */
export function FaqBody() {
  const { t, fmt } = useI18n()
  const copy = t.landing.faq
  const page = t.landing.pages.faq
  const [showAll, setShowAll] = useState(false)
  const listId = useId()
  const hiddenCount = Math.max(0, copy.items.length - INITIAL_COUNT)
  const PILL_ICONS: IconName[] = ["clock", "speech", "languages"]
  const PILL_TONES: Tone[] = ["flame", "plum", "ruby"]

  return (
    <>
      <PageHero
        id="df-page-t"
        crumb={t.landing.nav.links.faq}
        crumbIcon="question"
        title={copy.title}
        lead={copy.description}
        videoKey="faq"
        art={
          <PageArt
            tone="plum"
            icon="question"
            badge="speech"
            pills={page.pills.map((label, i) => ({ label, icon: PILL_ICONS[i], tone: PILL_TONES[i] ?? "ruby" }))}
          />
        }
      />
      <section className="df df-section df-section--sunken" id="questions" aria-label={t.landing.nav.links.faq}>
        <div className="df-wrap">
          <div className="df-faq">
            <div>
              <ul id={listId} className="df-faq__list">
                {copy.items.map((item, i) => (
                  <Question
                    key={item.question}
                    question={item.question}
                    answer={item.answer}
                    look={QUESTION_LOOK[i] ?? QUESTION_LOOK[0]}
                    hidden={!showAll && i >= INITIAL_COUNT}
                  />
                ))}
              </ul>
              {hiddenCount > 0 ? (
                <div className="df-faq__more">
                  <button type="button" className="df-btn df-btn--outline" aria-expanded={showAll} aria-controls={listId} onClick={() => setShowAll((value) => !value)}>
                    {showAll ? copy.viewLess : fmt(copy.viewMore, { count: hiddenCount })}
                    <DfIcon name="chevdown" size={20} />
                  </button>
                </div>
              ) : null}
            </div>

            <div className="df-faq__aside">
              <div className="df-card df-card--md df-tone--flame">
                <div className="df-card__art df-card__art--sunken" aria-hidden="true">
                  <div className="df-ask">
                    <div className="df-bubble df-bubble--sign">
                      <span className="df-bubble__who">
                        <DfIcon name="hand" size={18} />
                      </span>
                      <span className="df-ask__q">?</span>
                    </div>
                    <div className="df-bubble df-bubble--speech">
                      <span className="df-bubble__who">
                        <DfIcon name="mail" size={18} />
                      </span>
                      <span className="df-bars">
                        <i />
                        <i style={{ width: "65%" }} />
                      </span>
                    </div>
                  </div>
                </div>
                <h2 className="df-card__title">{copy.ask.title}</h2>
                <p className="df-text">{copy.ask.body}</p>
                <Link className="df-btn df-btn--primary df-btn--lg" href={contactHref()}>
                  {copy.ask.cta}
                  <DfIcon name="arrow" size={20} className="df-btn__trail" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      <CtaBand />
    </>
  )
}
