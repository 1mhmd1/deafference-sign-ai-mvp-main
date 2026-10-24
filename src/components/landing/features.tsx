"use client"

import { motion } from "framer-motion"
import { BrainCircuit, ShieldCheck, type LucideIcon } from "lucide-react"
import { Container } from "@/components/shared/container"
import { SectionTitle } from "@/components/shared/section-title"
import { IconBadge } from "@/components/shared/icon-badge"
import { cn } from "@/lib/utils"
import { useI18n } from "@/i18n/use-i18n"
import { FeatureCardGrid } from "@/components/landing/features/feature-card-grid"
import { GlassPanel } from "./ui/pop"

/** Icons zipped by index with `t.landing.features.trust`. */
const TRUST_ICONS: LucideIcon[] = [ShieldCheck, BrainCircuit]

function FeatureCard({
  icon: Icon,
  title,
  description,
  emphasized = false,
}: {
  icon: LucideIcon
  title: string
  description: string
  emphasized?: boolean
}) {
  return (
    <GlassPanel
      tilt
      className={cn(
        "relative h-full overflow-hidden p-6",
        emphasized && "bg-gradient-to-br from-[color:var(--primary)]/6 via-transparent to-brand-orange/[0.05]",
      )}
    >
      <div aria-hidden="true" className="pointer-events-none absolute top-0 end-0 -me-10 -mt-10 h-32 w-32 rounded-full bg-[color:var(--primary)]/12 blur-2xl" />
      <IconBadge icon={Icon} variant={emphasized ? "solid" : "tint"} className="relative z-10" />
      <h4 className="relative z-10 mt-5 text-lg font-semibold text-foreground">{title}</h4>
      <p className="relative z-10 mt-3 text-sm leading-7 text-black">{description}</p>
    </GlassPanel>
  )
}

export function Features() {
  const { t } = useI18n()
  const copy = t.landing.features
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="mt-5 grid gap-4 md:grid-cols-2"
          >
            {copy.trust.map((feature, i) => (
              <FeatureCard key={feature.title} icon={TRUST_ICONS[i] ?? ShieldCheck} {...feature} emphasized />
            ))}
          </motion.div>
        </div>

      </Container>
    </section>
  )
}

