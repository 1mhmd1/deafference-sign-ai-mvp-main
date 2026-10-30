"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"
import { useI18n } from "@/i18n/use-i18n"
import { contactHref } from "../contact-intent"
import { Avatar, Chip, DfIcon, Mark, SectionHead, type IconName, type Tone } from "../home/df-ui"
import { CtaBand, PageArt, PageHero, SplitTitle } from "./page-ui"

const pad2 = (n: number) => String(n).padStart(2, "0")

/** Mission and vision: what we want now, and the world it leads to, each with the places or things it names. */
function MissionVision() {
  const { t } = useI18n()
  const about = t.landing.about
  const missionIcons: IconName[] = ["clipboard", "ambulance", "building"]
  const visionIcons: IconName[] = ["captions", "a11y"]
  const cards = [
    { key: "mission", tone: "ruby", icon: "target", label: about.tabs.mission, title: about.missionTitle, body: about.missionBody },
    { key: "vision", tone: "plum", icon: "compass", label: about.tabs.vision, title: about.visionTitle, body: about.visionBody },
  ] as const

  return (
    <section className="df df-section" id="mission" aria-label={`${about.tabs.mission}, ${about.tabs.vision}`}>
      <div className="df-wrap">
        <div className="df-mv">
          {cards.map((card) => (
            <article key={card.key} className={cn("df-mv__card", `df-tone--${card.tone}`)} aria-labelledby={`df-${card.key}-t`}>
              <div className="df-mv__top">
                <span className="df-well df-well--lg df-well--solid" aria-hidden="true">
                  <DfIcon name={card.icon} size={36} />
                </span>
                <div>
                  <span className="df-mv__label">{card.label}</span>
                  <h2 id={`df-${card.key}-t`} className="df-mv__title">
                    {card.title}
                  </h2>
                </div>
              </div>
              <p className="df-mv__body">{card.body}</p>
              {/* The places (mission) and everyday things (vision) the text names, as a picture. */}
              <ul className="df-mv__chips" aria-hidden="true">
                {card.key === "mission"
                  ? about.missionPlaces.map((place, i) => (
                      <li key={place}>
                        <Chip icon={missionIcons[i] ?? "building"}>{place}</Chip>
                      </li>
                    ))
                  : about.visionItems.map((item, i) =>
                      visionIcons[i] ? (
                        <li key={item}>
                          <Chip icon={visionIcons[i]}>{item}</Chip>
                        </li>
                      ) : (
                        <li key={item}>
                          <span className="df-chip">
                            <Mark size={20} />
                            <span>{item}</span>
                          </span>
                        </li>
                      ),
                    )}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

const VALUE_TONES: Tone[] = ["ruby", "plum", "flame", "sun", "ruby"]

/** A small picture for each value, in the order of `t.landing.about.values`. Decorative: the card says it. */
function ValueArt({ index }: { index: number }) {
  switch (index) {
    // Accessibility first: the Deaf person's signing in the middle, the display settings around it.
    case 0:
      return (
        <div className="df-pics">
          <span className="df-well df-well--raised">
            <DfIcon name="textsize" size={26} />
          </span>
          <span className="df-well df-well--xl df-well--solid">
            <DfIcon name="hand" size={48} />
          </span>
          <span className="df-well df-well--raised">
            <DfIcon name="contrast" size={26} />
          </span>
        </div>
      )
    // Patient safety: the clinician's words come out as one clear, checked message.
    case 1:
      return (
        <div className="df-pics">
          <span className="df-well df-well--lg df-well--raised">
            <DfIcon name="stethoscope" size={34} />
          </span>
          <DfIcon name="arrow" size={22} />
          <span className="df-msg">
            <i />
            <i />
            <span className="df-well__badge">
              <DfIcon name="shield" size={18} />
            </span>
          </span>
        </div>
      )
    // Cultural respect: sign languages around the world, each with its own grammar.
    case 2:
      return (
        <div className="df-pics">
          <span className="df-well df-well--raised df-tilt-l">
            <DfIcon name="hand" size={26} />
          </span>
          <span className="df-well df-well--xl df-well--solid">
            <DfIcon name="globe" size={48} />
          </span>
          <span className="df-well df-well--raised df-tilt-r">
            <DfIcon name="hand" size={26} className="df-mirror" />
          </span>
        </div>
      )
    // Technical care: speed and accuracy as one requirement.
    case 3:
      return (
        <div className="df-pics">
          <span className="df-well df-well--lg df-well--raised">
            <DfIcon name="clock" size={34} />
          </span>
          <DfIcon name="plus" size={24} />
          <span className="df-well df-well--lg df-well--raised">
            <DfIcon name="target" size={34} />
          </span>
        </div>
      )
    // Honest about limits: Deafference hands over to a qualified interpreter when that's the right choice.
    default:
      return (
        <div className="df-pics">
          <span className="df-well df-well--lg df-well--raised df-well--round">
            <Mark size={40} />
          </span>
          <DfIcon name="swap" size={24} />
          <span className="df-well df-well--lg df-well--raised df-well--round">
            <DfIcon name="usercheck" size={34} />
          </span>
        </div>
      )
  }
}

function Values() {
  const { t } = useI18n()
  const about = t.landing.about
  return (
    <section className="df df-section df-section--sunken" id="values" aria-labelledby="df-values-t">
      <div className="df-wrap">
        <SectionHead id="df-values-t" title={<SplitTitle text={about.tabs.values} />} />
        <ol className="df-values">
          {about.values.map((value, i) => {
            const tone = VALUE_TONES[i] ?? "ruby"
            return (
              <li key={value.title}>
                <div className={cn("df-card df-card--md", `df-tone--${tone}`)}>
                  <div className="df-card__art" aria-hidden="true">
                    <ValueArt index={i} />
                  </div>
                  <div className="df-card__head">
                    <span className="df-num" aria-hidden="true">
                      {i + 1}
                    </span>
                    <h3 className="df-card__title">{value.title}</h3>
                  </div>
                  <p className="df-text">{value.description}</p>
                </div>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}

/** Teams by what they do (no names or photos), with each role's pictogram. */
const TEAM_LOOK: { icon: IconName; tone: Tone; roles: IconName[] }[] = [
  { icon: "target", tone: "flame", roles: ["compass", "stethoscope"] },
  { icon: "code", tone: "ruby", roles: ["cpu", "laptop"] },
  { icon: "heart", tone: "plum", roles: ["hand", "languages"] },
]

function Team() {
  const { t } = useI18n()
  const about = t.landing.about
  return (
    <section className="df df-section" id="team" aria-labelledby="df-team-t">
      <div className="df-wrap">
        <SectionHead id="df-team-t" title={<SplitTitle text={about.tabs.team} />} lead={about.teamIntro} />
        <ul className="df-grid df-grid--3">
          {about.teamGroups.map((group, g) => {
            const look = TEAM_LOOK[g] ?? TEAM_LOOK[0]
            return (
              <li key={group.heading}>
                <div className={cn("df-card df-card--md", `df-tone--${look.tone}`)}>
                  <div className="df-card__head">
                    <span className="df-well df-well--solid" aria-hidden="true">
                      <DfIcon name={look.icon} size={26} />
                    </span>
                    <h3 className="df-card__title">{group.heading}</h3>
                  </div>
                  <ul className="df-roles">
                    {group.roles.map((member, r) => (
                      <li key={member.role}>
                        <span className="df-well df-well--sm df-well--raised" aria-hidden="true">
                          <DfIcon name={look.roles[r] ?? "user"} size={22} />
                        </span>
                        <div>
                          <b>{member.role}</b>
                          <p>{member.note}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            )
          })}
        </ul>

        {/* Hiring: the team's faces with an open seat. */}
        <div className="df-hire">
          <div className="df-hire__faces" aria-hidden="true">
            <Avatar tone="flame" size={64} />
            <Avatar tone="plum" size={64} />
            <Avatar tone="ruby" size={64} />
            <span className="df-well df-well--round df-well--solid df-tone--sun">
              <DfIcon name="userplus" size={28} />
            </span>
          </div>
          <div className="df-hire__copy">
            <h3 className="df-card__title">{about.hiring.title}</h3>
            <p className="df-text">{about.hiring.body}</p>
          </div>
          <Link className="df-btn df-btn--outline" href={contactHref()}>
            <DfIcon name="mail" size={20} />
            {about.hiring.cta}
          </Link>
        </div>
      </div>
    </section>
  )
}

const GOAL_LOOK: { icon: IconName; tone: Tone }[] = [
  { icon: "languages", tone: "flame" },
  { icon: "building", tone: "ruby" },
  { icon: "wifioff", tone: "plum" },
]

/** Future goals as a road with three stops. */
function Roadmap() {
  const { t } = useI18n()
  const about = t.landing.about
  return (
    <section className="df df-section df-section--sunken" id="future" aria-labelledby="df-future-t">
      <div className="df-wrap">
        <SectionHead id="df-future-t" title={<SplitTitle text={about.tabs.future} />} />
        <ol className="df-road">
          {about.goals.map((goal, i) => {
            const look = GOAL_LOOK[i] ?? GOAL_LOOK[0]
            return (
              <li key={goal.title} className={`df-tone--${look.tone}`}>
                <span className="df-road__stop" aria-hidden="true">
                  <DfIcon name={look.icon} size={34} />
                </span>
                <div className="df-card df-card--md">
                  <span className="df-when">
                    {pad2(i + 1)} · {goal.timeframe}
                  </span>
                  <h3 className="df-card__title">{goal.title}</h3>
                  <p className="df-text">{goal.description}</p>
                </div>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}

/** /about: mission and vision, values, the team and future goals (the story stays on the home page). */
export function AboutBody() {
  const { t } = useI18n()
  const about = t.landing.about
  const VALUE_ICONS: IconName[] = ["a11y", "shield", "globe"]
  const PILL_TONES: Tone[] = ["ruby", "plum", "flame"]

  return (
    <>
      <PageHero
        id="df-page-t"
        crumb={t.landing.nav.links.about}
        crumbIcon="heart"
        title={about.title}
        lead={about.description}
        videoKey="about"
        jumps={[
          { href: "#mission", label: about.tabs.mission, icon: "target" },
          { href: "#values", label: about.tabs.values, icon: "heart" },
          { href: "#team", label: about.tabs.team, icon: "users" },
          { href: "#future", label: about.tabs.future, icon: "compass" },
        ]}
        art={
          <PageArt
            tone="ruby"
            center={
              <span className="df-part__core">
                <Mark size={104} />
              </span>
            }
            pills={about.values.slice(0, 3).map((value, i) => ({ label: value.title, icon: VALUE_ICONS[i], tone: PILL_TONES[i] ?? "ruby" }))}
          />
        }
      />
      <MissionVision />
      <Values />
      <Team />
      <Roadmap />
      <CtaBand />
    </>
  )
}
