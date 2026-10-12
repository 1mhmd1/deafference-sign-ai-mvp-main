"use client"

import { motion } from "framer-motion"
import { Accessibility, HeartPulse, Repeat2, ShieldCheck, type LucideIcon } from "lucide-react"
import { Container } from "@/components/shared/container"
import { SectionTitle } from "@/components/shared/section-title"
import { IconBadge } from "@/components/shared/icon-badge"
import { cn } from "@/lib/utils"
import { useI18n } from "@/i18n/use-i18n"
import { GlassPanel, GlowOrb, TiltWrap, staggerContainer, staggerItem } from "./ui/pop"

/** Icons zipped by index with `t.landing.why.reasons`. */
const REASON_ICONS: LucideIcon[] = [Accessibility, HeartPulse, Repeat2, ShieldCheck]

/** Per-card bento sizing + a gentle idle rotation so the grid reads as hand-placed, not a uniform table. */
const BENTO_LAYOUT = [
  { area: "lg:col-span-2 lg:row-span-2", idleRotate: "lg:-rotate-1", accent: true },
  { area: "lg:col-span-1 lg:row-span-1", idleRotate: "lg:rotate-1", accent: false },
  { area: "lg:col-span-1 lg:row-span-1", idleRotate: "lg:-rotate-1", accent: false },
  { area: "sm:col-span-2 lg:col-span-3 lg:row-span-1", idleRotate: "lg:rotate-0", accent: false },
] as const

function WhyCard({
  icon: Icon,
  title,
  description,
  className,
  idleRotate,
  accent,
  large,
}: {
  icon: LucideIcon
  title: string
  description: string
  className?: string
  idleRotate: string
  accent: boolean
  large: boolean
}) {
  return (
    <motion.div variants={staggerItem} className={cn("group relative h-full", className)}>
      <div className={cn("h-full transition-transform duration-500 ease-out", idleRotate, "group-hover:rotate-0")}>
        <TiltWrap className="h-full">
          <GlassPanel
            glow
            className={cn(
              "flex h-full flex-col justify-between overflow-hidden p-6 transition-all duration-400 ease-out",
              "group-hover:-translate-y-1.5 group-hover:shadow-[0_30px_70px_-24px_rgba(37,99,235,0.4)]",
              large ? "sm:p-8" : "sm:p-7",
            )}
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-10 -right-10 size-32 rounded-full bg-[color:var(--primary)]/10 blur-2xl transition-opacity duration-500 group-hover:opacity-100 opacity-0"
            />

            <div className="relative">
              <motion.div
                className="inline-flex"
                whileHover={{ rotate: 8, scale: 1.08 }}
                transition={{ type: "spring", stiffness: 320, damping: 16 }}
              >
                <IconBadge
                  icon={Icon}
                  variant={accent ? "solid" : "tint"}
                  className={large ? "size-14 rounded-2xl [&>svg]:size-6" : undefined}
                />
              </motion.div>

              <h3 className={cn("mt-5 font-semibold text-black", large ? "text-xl sm:text-2xl" : "text-lg")}>
                {title}
              </h3>
              <p className={cn("mt-3 leading-7 text-black", large ? "text-sm sm:text-base" : "text-sm")}>
                {description}
              </p>
            </div>

            <div
              aria-hidden="true"
              className="relative mt-6 h-1 w-10 origin-left scale-x-50 rtl:origin-right rounded-full bg-gradient-to-r from-[color:var(--primary)] to-brand-orange opacity-70 transition-transform duration-400 ease-out group-hover:scale-x-100"
            />
          </GlassPanel>
        </TiltWrap>
      </div>
    </motion.div>
  )
}

export function WhyChooseUs() {
  const { t } = useI18n()
  const why = t.landing.why
  return (
    <section
      id="why-choose-us"
      className="relative overflow-hidden py-24 sm:py-28"
    >
      <div className="pop-grid pointer-events-none absolute inset-0 -z-10 opacity-[0.05]" aria-hidden="true" />
      <GlowOrb className="top-10 -left-28 size-96 pop-float-delay" color="rgba(59,130,246,0.16)" />
      <GlowOrb className="-bottom-16 -right-20 size-80 pop-float" color="rgba(255,138,61,0.1)" />

      <Container fluid>
        <SectionTitle
          eyebrow={why.eyebrow}
          title={why.title}
          description={why.description}
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:grid-rows-[repeat(2,minmax(190px,1fr))_auto]"
        >
          {why.reasons.map((item, index) => {
            const layout = BENTO_LAYOUT[index] ?? BENTO_LAYOUT[1]
            return (
              <WhyCard
                key={item.title}
                icon={REASON_ICONS[index] ?? ShieldCheck}
                title={item.title}
                description={item.description}
                className={layout.area}
                idleRotate={layout.idleRotate}
                accent={layout.accent}
                large={layout.accent}
              />
            )
          })}
        </motion.div>
      </Container>
    </section>
  )
}

