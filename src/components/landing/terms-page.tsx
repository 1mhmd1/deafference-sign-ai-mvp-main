"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"
import { useI18n } from "@/i18n/use-i18n"
import { DfIcon, Mark, type IconName, type Tone } from "./home/df-ui"
import { PageArt, PageHero } from "./pages/page-ui"
import { SubpageShell } from "./subpage-shell"

// The terms are a short English placeholder until the full legal text is published.
const SECTIONS: { title: string; body: string; icon: IconName | "brand"; tone: Tone }[] = [
  {
    title: "Using Deafference",
    body: "Deafference is provided for real-time sign-and-speech translation assistance. You agree to use it lawfully and not to attempt to disrupt, reverse-engineer, or overload the service.",
    icon: "brand",
    tone: "ruby",
  },
  {
    title: "Accounts",
    body: "You're responsible for keeping your account credentials secure and for activity that happens under your account. Let us know right away if you suspect unauthorized access.",
    icon: "key",
    tone: "plum",
  },
  {
    title: "Content & translations",
    body: "Translations are generated automatically and may contain errors — don't rely on them for decisions where mistranslation could cause harm (e.g. medical or legal contexts) without human verification.",
    icon: "languages",
    tone: "flame",
  },
  {
    title: "Changes",
    body: "We may update these terms as the product evolves. Continued use after a change means you accept the updated terms.",
    icon: "repeat",
    tone: "sun",
  },
]

/** /terms: the placeholder terms of service, drawn like the landing's other pages. */
export function TermsPage() {
  return (
    <SubpageShell>
      <TermsBody />
    </SubpageShell>
  )
}

function TermsBody() {
  const { t } = useI18n()
  return (
    <>
      <PageHero
        id="df-page-t"
        crumb={t.landing.footer.terms}
        crumbIcon="paper"
        titleLead="Terms of"
        titleAccent="Service"
        lead={
          <>
            This is a placeholder overview — the full legal terms will be published before general availability. See also our{" "}
            <Link href="/security">privacy summary</Link>.
          </>
        }
        art={
          <PageArt
            tone="plum"
            icon="paper"
            badge="check"
            pills={SECTIONS.slice(0, 3).map((section) => ({
              label: section.title,
              icon: section.icon === "brand" ? "hand" : section.icon,
              tone: section.tone,
            }))}
          />
        }
      />
      <section className="df df-section df-section--sunken">
        <div className="df-wrap">
          <ol className="df-terms">
            {SECTIONS.map(({ title, body, icon, tone }, i) => (
              <li key={title} className={`df-tone--${tone}`}>
                <span className={cn("df-well df-well--lg", icon === "brand" && "df-well--raised")} aria-hidden="true">
                  {icon === "brand" ? <Mark size={40} /> : <DfIcon name={icon} size={34} />}
                  <span className="df-well__badge">{i + 1}</span>
                </span>
                <div>
                  <h2>{title}</h2>
                  <p className="df-text">{body}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="df-updated df-small">
            <DfIcon name="calendar" size={20} />
            Last updated August 2026
          </p>
        </div>
      </section>
    </>
  )
}
