"use client"

import { Fragment, useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react"
import { createPortal } from "react-dom"
import { openEmergencyPhrases } from "@/components/deafference/emergency-quick-actions"
import { getServerSnapshot, getSnapshot, speak, stop, subscribe } from "@/lib/speech"
import { useI18n } from "@/i18n/use-i18n"
import { DfIcon, Kicker, type IconName } from "./df-ui"
import { landingFonts } from "./fonts"

/** The eight phrases of the design, in both languages: the page's language large, the other one under it. */
const PHRASES: { icon: IconName; en: string; ar: string }[] = [
  { icon: "earoff", en: "I am Deaf", ar: "أنا أصم" },
  { icon: "hand", en: "I need help", ar: "أحتاج إلى مساعدة" },
  { icon: "ambulance", en: "Call an ambulance", ar: "اتصل بالإسعاف" },
  { icon: "bolt", en: "I am in pain", ar: "أشعر بألم" },
  { icon: "alert", en: "I have an allergy", ar: "لدي حساسية" },
  { icon: "pen", en: "Please write it down", ar: "من فضلك اكتبها" },
  { icon: "shield", en: "Call the police", ar: "اتصل بالشرطة" },
  { icon: "hospital", en: "Where is the hospital?", ar: "أين المستشفى؟" },
]
type Phrase = (typeof PHRASES)[number]

const FOCUSABLE = 'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'

/** Emergency phrases on the home page: tap a card and it fills the screen, to hold up to someone. */
export function DfSos() {
  const { t, locale } = useI18n()
  const copy = t.landing.home.sos
  const [shown, setShown] = useState<Phrase | null>(null)
  const openerRef = useRef<HTMLButtonElement | null>(null)
  const other = locale === "ar" ? "en" : "ar"
  const HOW_ICONS: IconName[] = ["hand", "expand", "check"]
  // Stable, so the open sheet's focus/scroll-lock effect doesn't re-run on every render.
  const closeSheet = useCallback(() => {
    stop()
    setShown(null)
    openerRef.current?.focus()
  }, [])

  return (
    <section className="df df-section" id="emergency" aria-labelledby="df-sos-t">
      <div className="df-wrap">
        <div className="df-sos">
          <div className="df-sos__intro">
            <span className="df-sos__siren" aria-hidden="true">
              <DfIcon name="siren" size={56} stroke={1.75} />
            </span>
            <div className="df-sos__titles">
              <div className="df-sechead__row">
                <Kicker icon="bolt" variant="sos">
                  {copy.kicker}
                </Kicker>
              </div>
              <h2 className="df-title" id="df-sos-t">
                {copy.title}
              </h2>
              <ul className="df-facts df-facts--sm">
                <li>
                  <DfIcon name="user" size={20} />
                  <span>{copy.noSignup}</span>
                </li>
                <li>
                  <DfIcon name="globe" size={20} />
                  <span>
                    <span lang="en">English</span> + <span lang="ar">عربي</span>
                  </span>
                </li>
              </ul>
            </div>
            <ol className="df-sos__how">
              {copy.how.map((step, i) => (
                <Fragment key={step}>
                  {i > 0 ? (
                    <li className="df-sos__arrow" aria-hidden="true">
                      <DfIcon name="arrow" size={20} className="df-sos__step" />
                    </li>
                  ) : null}
                  <li>
                    <DfIcon name={HOW_ICONS[i] ?? "check"} size={28} />
                    <span>{step}</span>
                  </li>
                </Fragment>
              ))}
            </ol>
          </div>

          <ul className="df-sos__grid">
            {PHRASES.map((phrase) => (
              <li key={phrase.en} className="flex">
                <button
                  type="button"
                  className="df-phrase df-tone--sos"
                  aria-haspopup="dialog"
                  onClick={(event) => {
                    openerRef.current = event.currentTarget
                    setShown(phrase)
                  }}
                >
                  <span className="df-phrase__well" aria-hidden="true">
                    <DfIcon name={phrase.icon} size={40} />
                  </span>
                  <span className="df-phrase__text" lang={locale}>
                    {phrase[locale]}
                  </span>
                  <span className="df-phrase__ar" lang={other} dir={other === "ar" ? "rtl" : "ltr"}>
                    {phrase[other]}
                  </span>
                  <span className="df-phrase__show" title={copy.show}>
                    <DfIcon name="expand" size={18} />
                    <span className="df-sr">{copy.show}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>

          <p className="df-sos__more">
            <button type="button" className="df-btn df-btn--sos" onClick={openEmergencyPhrases} aria-haspopup="dialog">
              <DfIcon name="siren" size={20} />
              <span>{copy.more}</span>
            </button>
          </p>
        </div>
      </div>

      {shown ? <PhraseSheet phrase={shown} onClose={closeSheet} /> : null}
    </section>
  )
}

/**
 * The phrase full screen, on the design's bright yellow card: large in the page's language with the other
 * language under it, plus "Read aloud" for a hearing person. Modal: Escape or Close shuts it, Tab stays
 * inside, the page behind doesn't scroll. Portalled to <body> (above the floating buttons), so it
 * carries the design tokens and fonts itself (`df-tokens`).
 */
function PhraseSheet({ phrase, onClose }: { phrase: Phrase; onClose: () => void }) {
  const { t, locale } = useI18n()
  const copy = t.landing.home.sos
  const speech = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  const cardRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const other = locale === "ar" ? "en" : "ar"

  useEffect(() => {
    closeRef.current?.focus()
    const previous = document.body.style.overflow
    document.body.style.overflow = "hidden"
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault()
        onClose()
        return
      }
      if (event.key !== "Tab") return
      const items = Array.from(cardRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? [])
      if (!items.length) return
      const first = items[0]
      const last = items[items.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    document.addEventListener("keydown", onKeyDown)
    return () => {
      document.removeEventListener("keydown", onKeyDown)
      document.body.style.overflow = previous
    }
  }, [onClose])

  return createPortal(
    <div
      className={`df df-tokens df-sheet ${landingFonts}`}
      role="dialog"
      aria-modal="true"
      aria-label={copy.sheetLabel}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div ref={cardRef} className="df-sheet__card">
        <span className="df-sheet__icon" aria-hidden="true">
          <DfIcon name={phrase.icon} size={112} stroke={1.75} />
        </span>
        <p className="df-sheet__text" lang={locale}>
          {phrase[locale]}
        </p>
        <p className="df-sheet__ar" lang={other} dir={other === "ar" ? "rtl" : "ltr"}>
          {phrase[other]}
        </p>
        <div className="df-sheet__actions">
          <button type="button" className="df-btn df-btn--primary df-btn--lg" onClick={() => speak(phrase[locale])} disabled={!speech.supported}>
            <DfIcon name="volume" size={22} />
            <span>{speech.speaking ? t.app.emergency.speaking : t.app.emergency.readAloud}</span>
          </button>
          <button ref={closeRef} type="button" className="df-btn df-btn--outline df-btn--lg" onClick={onClose}>
            <DfIcon name="x" size={22} />
            <span>{copy.close}</span>
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}
