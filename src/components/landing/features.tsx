"use client"

import { motion } from "framer-motion"
import { ArrowRight, Check, CircleAlert, UserCheck } from "lucide-react"
import { Container } from "@/components/shared/container"
import { SectionTitle } from "@/components/shared/section-title"
import { cn } from "@/lib/utils"
import { useI18n } from "@/i18n/use-i18n"
import type { LandingMessages } from "@/i18n/messages/landing"
import { FeatureCardGrid } from "@/components/landing/features/feature-card-grid"
import { GlassPanel, popStage, popTile, staggerContainer, staggerItem } from "./ui/pop"
import { PrivacyVisual } from "./why-choose-us"

/**
 * "Careful accuracy" as a picture: everyday and medical words are handled with care, and a
 * critical decision goes to a qualified interpreter.
 */
function AccuracyVisual({ copy }: { copy: LandingMessages["features"]["accuracyVisual"] }) {
  const chip = "inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-black ring-1 ring-[color:var(--primary)]/15"
  return (
    <div className="flex w-full flex-col items-center gap-4">
      <div className="flex flex-wrap justify-center gap-2">
        {[copy.everyday, copy.medical].map((label) => (
          <div key={label} className={chip}>
            <Check className="size-4 text-[color:var(--primary)]" strokeWidth={2.5} />
            {label}
          </div>
        ))}
      </div>
      <div className="flex flex-wrap items-center justify-center gap-2">
        <div className={chip}>
          <CircleAlert className="size-4 text-[color:var(--primary)]" />
          {copy.critical}
        </div>
        <ArrowRight className="size-4 text-[color:var(--primary)] rtl:-scale-x-100" />
        <div className="flex items-center gap-2">
          <div className={cn(popTile, "size-9")}>
            <UserCheck className="size-[18px]" />
          </div>
          <div className="text-xs font-semibold text-black">{copy.interpreter}</div>
        </div>
      </div>
    </div>
  )
}

export function Features() {
  const { t } = useI18n()
  const copy = t.landing.features
  const trustVisuals = [<PrivacyVisual key="privacy" copy={t.landing.why.visual} />, <AccuracyVisual key="accuracy" copy={copy.accuracyVisual} />]
  return (
    <section
      id="features"
      aria-labelledby="features-heading"
      className="py-24 sm:py-28"
    >
      <Container fluid>
        <SectionTitle
          headingId="features-heading"
          eyebrow={copy.eyebrow}
          title={copy.title}
        />

        <div className="mt-12">
          <h3 className="text-sm font-semibold tracking-[0.18em] text-black uppercase">
            {copy.coreHeading}
          </h3>
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="mt-5"
          >
            <FeatureCardGrid />
          </motion.div>
        </div>

        <div className="mt-12">
          <h3 className="text-sm font-semibold tracking-[0.18em] text-black uppercase">
            {copy.trustHeading}
          </h3>
          <motion.ul
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="mt-5 grid gap-4 md:grid-cols-2"
          >
            {copy.trust.map((feature, i) => (
              <motion.li key={feature.title} variants={staggerItem} className="flex">
                <GlassPanel className="flex w-full flex-col p-5 sm:p-6">
                  <div aria-hidden="true" className={cn("flex min-h-44 items-center justify-center p-4", popStage)}>
                    {trustVisuals[i]}
                  </div>
                  <h4 className="mt-5 text-lg font-semibold text-black">{feature.title}</h4>
                  <p className="mt-1.5 text-sm leading-7 text-black">{feature.description}</p>
                </GlassPanel>
              </motion.li>
            ))}
          </motion.ul>
        </div>

      </Container>
    </section>
  )
}
