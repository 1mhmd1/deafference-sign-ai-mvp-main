"use client"

import { useEffect, useState, type CSSProperties } from "react"
import Link from "next/link"
import { MotionConfig } from "framer-motion"
import { APP_ROUTES } from "@/lib/constants"
import { cn } from "@/lib/utils"
import { useI18n } from "@/i18n/use-i18n"
import { useLandingReducedMotion } from "../calm-mode"
import { STAGES, STAGES_REVERSE, STEP_MS } from "../how-it-works-visual"
import { AppGlyph, Chip, DfIcon, HandSign, SectionHead, WaveBars, type IconName, type Tone } from "../home/df-ui"
import { TranslationExample } from "../home/df-example"
import { CtaBand, PageArt, PageHero, SplitTitle } from "./page-ui"

/** Each step's pictogram and colour: speech in plum, sign in flame (as on the home page), Deafference in ruby. */
const STEP_LOOK: Record<"forward" | "reverse", { icon: IconName; tone: Tone }[]> = {
  forward: [
    { icon: "mic", tone: "plum" },
    { icon: "cpu", tone: "ruby" },
    { icon: "monitor", tone: "flame" },
  ],
  reverse: [
    { icon: "hand", tone: "flame" },
    { icon: "cpu", tone: "ruby" },
    { icon: "captions", tone: "plum" },
  ],
}

/** The three steps in either direction, with the selected step's diagram beside them. */
function Steps() {
  const { t } = useI18n()
  const copy = t.landing.howItWorks
  const how = t.landing.home.how
  const reduceMotion = useLandingReducedMotion()
  const [active, setActive] = useState(0)
  // Auto-advance pauses while the pointer is over the steps, after a tap/click, and in calm/reduced-motion mode.
  const [hovering, setHovering] = useState(false)
  const [locked, setLocked] = useState(false)
  // false: speech → sign; true: sign → text & speech.
  const [reverse, setReverse] = useState(false)
  const paused = locked || hovering || reduceMotion
  const stages = reverse ? STAGES_REVERSE : STAGES
  const stageText = reverse ? copy.stagesReverse : copy.stages
  const look = STEP_LOOK[reverse ? "reverse" : "forward"]

  useEffect(() => {
    if (paused) return
    const id = setInterval(() => setActive((s) => (s + 1) % STAGES.length), STEP_MS)
    return () => clearInterval(id)
  }, [paused, reverse])

  function toggleDirection() {
    setReverse((r) => !r)
    // The new direction starts from its first step, running again.
    setActive(0)
    setLocked(false)
  }

  const dir = copy.direction
  const from = reverse ? { icon: "hand" as const, label: dir.sign, tone: "flame" } : { icon: "mic" as const, label: dir.speech, tone: "plum" }
  const to = reverse ? { icon: "captions" as const, label: dir.textSpeech, tone: "plum" } : { icon: "hand" as const, label: dir.sign, tone: "flame" }
  const Visual = stages[active].Visual
  const text = stageText[active]
  const current = look[active]

  return (
    <section className="df df-section df-section--sunken" id="steps" aria-labelledby="df-steps-t">
      <div className="df-wrap">
        <SectionHead
          id="df-steps-t"
          kicker={t.landing.pages.howItWorks.steps}
          kickerIcon="swap"
          title={<SplitTitle key={reverse ? "r" : "f"} text={reverse ? copy.titleReverse : copy.title} />}
          lead={copy.description}
        />

        <div className="df-dirbar">
          <span className="df-dirbar__label">{dir.label}</span>
          <button type="button" className="df-swap" onClick={toggleDirection}>
            <DfIcon name="swap" size={26} />
            <span>
              <span className="df-sr">{how.swap}: </span>
              <span className={cn("df-dirbar__end", `df-tone--${from.tone}`)}>
                <DfIcon name={from.icon} size={20} />
                {from.label}
              </span>
              <DfIcon name="arrow" size={18} label={how.to} className="df-dirbar__to" />
              <span className={cn("df-dirbar__end", `df-tone--${to.tone}`)}>
                <DfIcon name={to.icon} size={20} />
                {to.label}
              </span>
            </span>
          </button>
          {/* Announces the new direction after a switch. */}
          <span className="df-sr" aria-live="polite">
            {from.label} → {to.label}
          </span>
        </div>

        <div className="df-hiw" onMouseEnter={() => setHovering(true)} onMouseLeave={() => setHovering(false)}>
          {/* Steps are content, not controls: hovering or tapping one only moves the highlight. */}
          <ol className="df-hiw__steps">
            {stages.map((stage, i) => {
              const stepText = stageText[i]
              const stepLook = look[i]
              return (
                <li
                  key={stage.index}
                  className={cn("df-hstep", `df-tone--${stepLook.tone}`, active === i && "is-on")}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => {
                    setActive(i)
                    setLocked(true)
                  }}
                >
                  <span className="df-hstep__n" aria-hidden="true">
                    <DfIcon name={stepLook.icon} size={24} />
                  </span>
                  <div className="min-w-0">
                    <p className="df-hstep__tag">
                      <b>{stage.index}</b>
                      <span aria-hidden="true">·</span>
                      <span>{stepText?.tag}</span>
                    </p>
                    <h3 className="df-hstep__title">{stepText?.title}</h3>
                    <p className="df-hstep__text">{stepText?.caption}</p>
                  </div>
                </li>
              )
            })}
          </ol>

          {/* The selected step's diagram, large. Decorative: the list carries the content. */}
          <div className={cn("df-stage", `df-tone--${current.tone}`)} aria-hidden="true">
            <div className="df-stage__head">
              <span className="df-stage__title">
                <span className="df-well df-well--sm df-well--solid">
                  <DfIcon name={current.icon} size={22} />
                </span>
                {text?.title}
              </span>
              <span className="df-badge">
                <DfIcon name={stages[active].terminal ? "check" : "arrow"} size={14} />
                {text?.tag}
              </span>
            </div>
            <div className="df-stage__body">
              <div key={`${reverse ? "r" : "f"}-${active}`} className="df-stage__view">
                {/* The diagrams are drawn with framer-motion (this page only); calm mode stills them. */}
                <MotionConfig reducedMotion={reduceMotion ? "always" : "user"}>
                  <Visual active={!reduceMotion} />
                </MotionConfig>
              </div>
            </div>
            <div className="df-stage__bar" style={{ "--df-step-ms": `${STEP_MS}ms` } as CSSProperties}>
              {stages.map((stage, i) => (
                <span key={stage.index} className={cn("df-stage__seg", i < active && "is-done", i === active && !paused && "is-run")}>
                  {i <= active ? <i key={i === active ? `${reverse}-${active}-${paused}` : "done"} /> : null}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* The selected direction with real words, as on the home page. */}
        <TranslationExample key={reverse ? "sign" : "speech"} from={reverse ? "sign" : "speech"} />
      </div>
    </section>
  )
}

/** The four translation directions, zipped by index with `t.landing.features.cards`. */
const DIRECTIONS: { from: { icon: IconName; tone: Tone }; to: { icon: IconName; tone: Tone } }[] = [
  { from: { icon: "mic", tone: "plum" }, to: { icon: "hand", tone: "flame" } },
  { from: { icon: "hand", tone: "flame" }, to: { icon: "volume", tone: "plum" } },
  { from: { icon: "keyboard", tone: "plum" }, to: { icon: "hand", tone: "flame" } },
  { from: { icon: "hand", tone: "flame" }, to: { icon: "captions", tone: "plum" } },
]

/** "SPEECH → SIGN" / "الكلام ← الإشارة" → ["Speech", "Sign"]. */
function splitPill(pill: string): [string, string] {
  const tidy = (word: string) => word.charAt(0) + word.slice(1).toLowerCase()
  const [a = "", b = ""] = pill.split(/\s*[→←]\s*/)
  return [tidy(a), tidy(b)]
}

function Features() {
  const { t } = useI18n()
  const copy = t.landing.features
  const visual = t.landing.why.visual
  const accuracy = copy.accuracyVisual
  const [privateCard, accuracyCard] = copy.trust

  return (
    <section className="df df-section" id="features" aria-labelledby="df-features-t">
      <div className="df-wrap">
        <SectionHead
          id="df-features-t"
          kicker={copy.eyebrow}
          kickerIcon="sparkle"
          title={<SplitTitle text={copy.title} />}
          lead={copy.description}
        />
        <ul className="df-grid df-grid--4">
          {copy.cards.map((card, i) => {
            const flow = DIRECTIONS[i] ?? DIRECTIONS[0]
            const [fromLabel, toLabel] = splitPill(card.pill)
            return (
              <li key={card.title}>
                <article className="df-card df-card--md">
                  <div className="df-card__art df-card__art--sunken" aria-hidden="true">
                    <div className="df-dirflow">
                      <span className={cn("df-dirflow__end", `df-tone--${flow.from.tone}`)}>
                        <span className="df-well df-well--raised">
                          <DfIcon name={flow.from.icon} size={28} />
                        </span>
                        {fromLabel}
                      </span>
                      <span className="df-dirflow__wire" />
                      <AppGlyph size={40} />
                      <span className="df-dirflow__wire" />
                      <span className={cn("df-dirflow__end", `df-tone--${flow.to.tone}`)}>
                        <span className="df-well df-well--solid">
                          <DfIcon name={flow.to.icon} size={28} />
                        </span>
                        {toLabel}
                      </span>
                    </div>
                  </div>
                  <p className="df-sr">{card.pill}</p>
                  <div className="df-row">
                    <h3 className="df-card__title">{card.title}</h3>
                    <span className="df-badge">{card.badge}</span>
                  </div>
                  <p className="df-text df-text--ink">{card.subtitle}</p>
                  <p className="df-text">{card.detail}</p>
                  <Link className="df-link df-card__foot" href="/#demo">
                    {copy.learnMore}
                    <DfIcon name="arrow" size={18} />
                  </Link>
                </article>
              </li>
            )
          })}
        </ul>

        <h3 className="df-subhead">
          <span className="df-well df-well--sm df-tone--ruby" aria-hidden="true">
            <DfIcon name="shield" size={24} />
          </span>
          {copy.trustHeading}
        </h3>
        <ul className="df-grid df-grid--2">
          <li>
            <article className="df-card df-tone--ruby">
              <div className="df-card__art" aria-hidden="true">
                <div className="df-session">
                  <span className="df-session__state">
                    <span className="df-session__pair df-session__pair--on">
                      <span className="df-well df-well--sm df-well--round">
                        <DfIcon name="camera" size={22} />
                      </span>
                      <span className="df-well df-well--sm df-well--round">
                        <DfIcon name="mic" size={22} />
                      </span>
                    </span>
                    {visual.sessionOn}
                  </span>
                  <DfIcon name="arrow" size={20} className="df-arrowicon" />
                  <span className="df-session__state">
                    <span className="df-session__pair df-session__pair--off">
                      <span className="df-well df-well--sm df-well--round">
                        <DfIcon name="camera" size={22} />
                      </span>
                      <span className="df-well df-well--sm df-well--round">
                        <DfIcon name="mic" size={22} />
                      </span>
                    </span>
                    {visual.sessionOff}
                  </span>
                  <Chip icon="lock">{visual.notSaved}</Chip>
                </div>
              </div>
              <h4 className="df-card__title">{privateCard?.title}</h4>
              <p className="df-text">{privateCard?.description}</p>
            </article>
          </li>
          <li>
            <article className="df-card df-tone--plum">
              <div className="df-card__art" aria-hidden="true">
                <div className="df-pics">
                  <Chip icon="check">{accuracy.everyday}</Chip>
                  <Chip icon="check">{accuracy.medical}</Chip>
                  <span className="df-pics">
                    <Chip icon="alert" tone="sos">
                      {accuracy.critical}
                    </Chip>
                    <DfIcon name="arrow" size={20} />
                    <Chip icon="usercheck" tone="plum">
                      {accuracy.interpreter}
                    </Chip>
                  </span>
                </div>
              </div>
              <h4 className="df-card__title">{accuracyCard?.title}</h4>
              <p className="df-text">{accuracyCard?.description}</p>
            </article>
          </li>
        </ul>
      </div>
    </section>
  )
}

/** Pictures for `t.landing.performance.metrics`, in order: real time, any screen, two languages. */
function MetricArt({ index }: { index: number }) {
  if (index === 0) {
    return (
      <div className="df-mini df-tone--plum">
        <div className="df-mini__row">
          <span className="df-well df-well--round df-well--raised">
            <DfIcon name="mic" size={24} />
          </span>
          <WaveBars count={6} />
        </div>
        <div className="df-mini__row">
          <span className="df-well df-well--round df-well--raised">
            <DfIcon name="captions" size={24} />
          </span>
          <span className="df-bars df-bars--fill">
            <i />
            <i style={{ width: "70%" }} />
          </span>
        </div>
      </div>
    )
  }
  if (index === 1) {
    return (
      <div className="df-devices df-tone--flame">
        <span className="df-well df-well--sm df-well--raised">
          <DfIcon name="phone" size={22} />
        </span>
        <span className="df-well df-well--raised">
          <DfIcon name="tablet" size={28} />
        </span>
        <span className="df-well df-well--xl df-well--raised">
          <DfIcon name="laptop" size={44} />
        </span>
      </div>
    )
  }
  return (
    <div className="df-langs">
      <span lang="en" dir="ltr">
        English
      </span>
      <DfIcon name="swap" size={22} />
      <span lang="ar" dir="rtl">
        العربية
      </span>
    </div>
  )
}

const QUALITY_LOOK: { icon: IconName; tone: Tone }[] = [
  { icon: "globe", tone: "sun" },
  { icon: "expand", tone: "plum" },
  { icon: "sliders", tone: "flame" },
]
const METRIC_TONES: Tone[] = ["plum", "flame", "ruby"]

function Performance() {
  const { t } = useI18n()
  const copy = t.landing.performance

  return (
    <section className="df df-section df-section--sunken" id="performance" aria-labelledby="df-perf-t">
      <div className="df-wrap">
        <SectionHead
          id="df-perf-t"
          kicker={copy.eyebrow}
          kickerIcon="bolt"
          title={<SplitTitle text={copy.title} />}
          lead={copy.description}
        />
        <ul className="df-grid df-grid--3">
          {copy.metrics.map((metric, i) => (
            <li key={metric.label}>
              <div className={cn("df-card df-card--md", `df-tone--${METRIC_TONES[i] ?? "ruby"}`)}>
                <div className="df-card__art" aria-hidden="true">
                  <MetricArt index={i} />
                </div>
                <p className="df-metric">
                  <span className="df-grad">{metric.value}</span>
                </p>
                <p className="df-text">{metric.label}</p>
              </div>
            </li>
          ))}
        </ul>
        <ul className="df-grid df-grid--3" style={{ marginTop: "var(--df-space-6)" }}>
          {copy.qualities.map((item, i) => {
            const quality = QUALITY_LOOK[i] ?? QUALITY_LOOK[0]
            return (
              <li key={item.title}>
                <div className="df-card df-card--md">
                  <div className="df-card__head">
                    <span className={cn("df-well", `df-tone--${quality.tone}`)} aria-hidden="true">
                      <DfIcon name={quality.icon} size={26} />
                    </span>
                    <h3 className="df-card__title">{item.title}</h3>
                  </div>
                  <p className="df-text">{item.text}</p>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

/** /how-it-works: the steps both ways, the four directions and how it performs. */
export function HowItWorksBody() {
  const { t } = useI18n()
  const page = t.landing.pages.howItWorks
  const steps = t.landing.home.how.steps
  const STEP_TONES: Tone[] = ["flame", "ruby", "plum"]

  return (
    <>
      <PageHero
        id="df-page-t"
        crumb={t.landing.nav.links.howItWorks}
        crumbIcon="swap"
        titleLead={page.titleLead}
        titleAccent={page.titleAccent}
        lead={page.lead}
        videoKey="howItWorks"
        jumps={[
          { href: "#steps", label: page.steps, icon: "swap" },
          { href: "#features", label: t.landing.features.eyebrow, icon: "sparkle" },
          { href: "#performance", label: t.landing.performance.eyebrow, icon: "bolt" },
        ]}
        art={
          <PageArt
            tone="flame"
            center={
              <span className="df-part__core">
                <HandSign shape="ily" size={118} wave motion />
              </span>
            }
            pills={steps.map((label, i) => ({ label, n: i + 1, tone: STEP_TONES[i] ?? "ruby" }))}
          />
        }
      >
        <div className="df-row">
          <Link className="df-btn df-btn--primary df-btn--lg" href={APP_ROUTES.translate}>
            {t.landing.cta.primary}
            <DfIcon name="arrow" size={20} className="df-btn__trail" />
          </Link>
        </div>
      </PageHero>
      <Steps />
      <Features />
      <Performance />
      <CtaBand />
    </>
  )
}
