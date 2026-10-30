"use client"

import { useI18n } from "@/i18n/use-i18n"
import { Scenarios } from "../scenarios"
import { DfIcon } from "../home/df-ui"
import { CtaBand, PageArt, PageHero } from "./page-ui"

/**
 * /scenarios: the scenarios map turning slowly in the page header (it stops in calm mode), then the
 * home page's walk through the places with Judy, unchanged.
 */
export function ScenariosBody() {
  const { t } = useI18n()
  const copy = t.landing.scenarios
  const page = t.landing.pages.scenarios
  const [healthcare, , , emergencies, travel] = copy.items

  return (
    <>
      <PageHero
        id="df-page-t"
        crumb={t.landing.nav.links.scenarios}
        crumbIcon="pin"
        titleLead={page.titleLead}
        titleAccent={page.titleAccent}
        lead={page.lead}
        art={
          <PageArt
            tone="ruby"
            center={
              <span className="df-part__hub">
                <img src="/scenarios-hub-960.webp" srcSet="/scenarios-hub-960.webp 960w, /scenarios-hub.webp 1672w" sizes="(max-width: 680px) 380px, 520px" alt="" width={1672} height={941} decoding="async" />
              </span>
            }
            pills={[
              { label: healthcare?.label ?? "", icon: "hospital", tone: "ruby" },
              { label: travel?.label ?? "", icon: "plane", tone: "flame" },
              { label: emergencies?.label ?? "", icon: "ambulance", tone: "sos" },
            ]}
          />
        }
      >
        <div className="df-row">
          <a className="df-btn df-btn--primary df-btn--lg" href="#scenarios">
            {copy.listLabel}
            <DfIcon name="arrowdown" size={20} />
          </a>
        </div>
      </PageHero>
      <Scenarios />
      <CtaBand />
    </>
  )
}
