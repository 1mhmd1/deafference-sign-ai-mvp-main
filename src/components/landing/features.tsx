"use client"

import { motion } from "framer-motion"
import { BrainCircuit, CodeXml, FileText, PhoneCall, Plug, Radio, ShieldCheck, Video, type LucideIcon } from "lucide-react"
import { Container } from "@/components/shared/container"
import { SectionTitle } from "@/components/shared/section-title"
import { IconBadge } from "@/components/shared/icon-badge"
import { cn } from "@/lib/utils"
import { useI18n } from "@/i18n/use-i18n"
import { FeatureCardGrid } from "@/components/landing/features/feature-card-grid"
import { GlassPanel, popButtonSizes, popSecondaryButton, staggerContainer, staggerItem } from "./ui/pop"
import { requestContactTopic } from "./contact-intent"

/** Icons zipped by index with `t.landing.features.trust`. */
const TRUST_ICONS: LucideIcon[] = [ShieldCheck, BrainCircuit]

/** Icons zipped by index with `t.landing.features.integrations.items`. */
const INTEGRATION_ICONS: LucideIcon[] = [FileText, Video, PhoneCall, CodeXml]

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
          description={copy.description}
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.55, ease: "easeOut", delay: 0.05 }}
          className="mt-6"
        >
          <GlassPanel className="relative overflow-hidden p-6 sm:p-8">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[color:var(--primary)]/10 via-transparent to-[color:var(--pop-lavender)]/10" />
            <div className="pointer-events-none absolute -top-10 -right-10 h-56 w-56 rounded-full bg-[color:var(--primary)]/18 blur-3xl" />
            <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="flex items-start gap-4">
                <IconBadge icon={Radio} variant="solid" />
                <div>
                  <h3 className="text-lg font-semibold text-foreground sm:text-xl">{copy.live.title}</h3>
                  <p className="mt-2 max-w-xl text-sm leading-7 text-black sm:text-base">{copy.live.body}</p>
                </div>
              </div>
              <span className="inline-flex w-fit shrink-0 items-center gap-2 rounded-full bg-[color:var(--primary)]/10 px-3 py-1.5 text-xs font-semibold text-[#1D4ED8]">
                <span className="pop-pulse size-1.5 rounded-full bg-brand-orange" aria-hidden="true" />
                {copy.live.chip}
              </span>
            </div>
          </GlassPanel>
        </motion.div>

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

        <div className="mt-12">
          <h3 className="text-sm font-semibold tracking-[0.18em] text-black uppercase">
            {copy.integrations.heading}
          </h3>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-black">{copy.integrations.description}</p>
          <motion.ul
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
          >
            {copy.integrations.items.map((item, i) => (
              <motion.li key={item.title} variants={staggerItem}>
                <GlassPanel className="h-full p-5 transition-transform duration-300 hover:-translate-y-1">
                  <IconBadge icon={INTEGRATION_ICONS[i] ?? Plug} size="compact" />
                  <p className="mt-4 text-base font-semibold text-foreground">{item.title}</p>
                  <p className="mt-1.5 text-sm leading-6 text-black">{item.text}</p>
                </GlassPanel>
              </motion.li>
            ))}
          </motion.ul>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm leading-6 text-black">{copy.integrations.note}</p>
            <a
              href="#contact"
              onClick={() => requestContactTopic("partnership")}
              className={cn(popSecondaryButton, popButtonSizes.sm, "w-fit shrink-0")}
            >
              <Plug className="size-4" aria-hidden="true" />
              {copy.integrations.cta}
            </a>
          </div>
        </div>
      </Container>
    </section>
  )
}

