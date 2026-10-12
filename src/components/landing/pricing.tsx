"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Building, Building2, Check, HeartPulse, UserRound, type LucideIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Container } from "@/components/shared/container"
import { SectionTitle } from "@/components/shared/section-title"
import { APP_ROUTES } from "@/lib/constants"
import { cn } from "@/lib/utils"
import { useI18n } from "@/i18n/use-i18n"
import {
  GlassPanel,
  GlowOrb,
  Magnetic,
  popButtonSizes,
  popPrimaryButton,
  popSecondaryButton,
  staggerContainer,
  staggerItem,
} from "./ui/pop"
import { requestContactTopic, type ContactTopic } from "./contact-intent"

/**
 * Plan copy and prices live in `t.landing.pricing.plans` (zipped by index).
 * The old Monthly/Annual switch was removed: no annual prices exist, so it
 * changed nothing on screen. Re-add it only alongside real annual pricing.
 */
const PLAN_META: { id: string; icon: LucideIcon; href: string; highlighted?: boolean; topic?: ContactTopic }[] = [
  { id: "free", icon: UserRound, href: APP_ROUTES.translate },
  { id: "basic", icon: Building, href: APP_ROUTES.signup },
  { id: "premium", icon: HeartPulse, href: APP_ROUTES.signup, highlighted: true },
  { id: "enterprise", icon: Building2, href: "#contact", topic: "sales" },
]

export function Pricing() {
  const { t } = useI18n()
  const copy = t.landing.pricing

  return (
    <section
      id="pricing"
      aria-labelledby="pricing-heading"
      className="relative border-y border-border/60 py-24 sm:py-28"
    >
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
        <div className="pop-atmosphere absolute inset-0" />
        <div className="pop-grid absolute inset-0 opacity-30" />
        <GlowOrb className="left-[-10%] top-10 size-80" color="rgba(59,130,246,0.16)" />
        <GlowOrb className="right-[-8%] bottom-10 size-72" color="rgba(109,124,246,0.16)" />
      </div>

      <Container fluid className="relative">
        <SectionTitle
          headingId="pricing-heading"
          eyebrow={copy.eyebrow}
          title={copy.title}
          description={copy.description}
          align="center"
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:items-start"
        >
          {PLAN_META.map((meta, index) => {
            const plan = copy.plans[index]
            if (!plan) return null
            const Icon = meta.icon
            const headingId = `plan-${meta.id}-heading`

            return (
              <motion.div
                key={meta.id}
                variants={staggerItem}
                whileHover={{ y: -10 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                className={cn("relative h-full", meta.highlighted && "z-10 lg:-translate-y-4 lg:scale-[1.05]")}
              >
                {meta.highlighted ? (
                  <span className="absolute -top-3.5 left-1/2 z-20 -translate-x-1/2">
                    <Badge className="border-[#C2410C]/30 bg-orange-50 text-[#C2410C] shadow-sm">{copy.mostPopular}</Badge>
                  </span>
                ) : null}

                <GlassPanel
                  as="article"
                  glow={meta.highlighted}
                  className={cn(
                    "flex h-full flex-col p-6 transition-shadow duration-300",
                    meta.highlighted && "ring-1 ring-[color:var(--primary)]/35",
                  )}
                >
                  <div aria-labelledby={headingId} className="flex flex-1 flex-col">
                    <div className="flex items-center gap-2.5">
                      <span
                        className={cn(
                          "flex size-10 shrink-0 items-center justify-center rounded-xl",
                          meta.highlighted ? "bg-orange-50 text-[#C2410C]" : "bg-blue-accent/12 text-[#1D4ED8]",
                        )}
                        aria-hidden="true"
                      >
                        <Icon className="size-5" />
                      </span>
                      <h3 id={headingId} className="text-lg font-semibold text-foreground">
                        {plan.name}
                      </h3>
                    </div>

                    <p className="mt-3 text-sm leading-6 text-black">{plan.audience}</p>

                    <div className="mt-5 flex flex-wrap items-baseline gap-x-1.5">
                      <span
                        className={cn(
                          "pop-gradient-text max-w-full font-semibold tracking-tight break-words",
                          plan.price.length > 8 ? "text-2xl" : "text-3xl",
                        )}
                        dir="ltr"
                      >
                        {plan.price}
                      </span>
                      <span className="text-sm text-black">{plan.cadence}</span>
                    </div>

                    <ul className="mt-6 flex-1 space-y-3 text-sm leading-6 text-black">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex gap-3">
                          <Check className="mt-0.5 size-4 shrink-0 text-[#2563EB]" aria-hidden="true" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Magnetic strength={8} className="mt-8 block w-full">
                      <Link
                        href={meta.href}
                        onClick={meta.topic ? () => requestContactTopic(meta.topic!) : undefined}
                        className={cn(
                          meta.highlighted ? popPrimaryButton : popSecondaryButton,
                          popButtonSizes.md,
                          "w-full",
                        )}
                      >
                        {plan.cta}
                      </Link>
                    </Magnetic>
                  </div>
                </GlassPanel>
              </motion.div>
            )
          })}
        </motion.div>

        <p className="mx-auto mt-10 max-w-2xl text-center text-sm leading-6 text-black">{copy.note}</p>
      </Container>
    </section>
  )
}

