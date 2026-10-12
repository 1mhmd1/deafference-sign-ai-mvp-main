"use client"

import { motion } from "framer-motion"
import { CheckCircle2, Database, Eye, Lock, ShieldCheck, UserCheck, type LucideIcon } from "lucide-react"
import { Container } from "@/components/shared/container"
import { SectionTitle } from "@/components/shared/section-title"
import { IconBadge } from "@/components/shared/icon-badge"
import { cn } from "@/lib/utils"
import { useI18n } from "@/i18n/use-i18n"
import { ConnectorPath, GlassPanel, GlowOrb, Reveal, focusRingPop, staggerContainer, staggerItem } from "./ui/pop"

/** Icons zipped by index with `t.landing.privacy.principles` (a plain-language summary, not the legal policy). */
const PRINCIPLE_ICONS: LucideIcon[] = [Eye, Lock, Database, UserCheck]

export function PrivacyPolicy() {
  const { t } = useI18n()
  const copy = t.landing.privacy
  return (
    <section
      id="privacy"
      aria-labelledby="privacy-heading"
      className="relative overflow-hidden py-24 sm:py-28"
    >
      <GlowOrb className="pop-float left-[-10%] top-6 size-72" color="rgba(59,130,246,0.16)" />
      <GlowOrb className="pop-float-delay right-[-8%] bottom-0 size-80" color="rgba(167,180,255,0.2)" />

      <Container fluid className="relative">
        <SectionTitle
          headingId="privacy-heading"
          eyebrow={copy.eyebrow}
          title={copy.title}
          description={copy.description}
        />

        {/* Trust hub: a pulsing shield with a small "verified" accent, gesturing at a
            connected, transparent system rather than a wall of legal text. */}
        <Reveal className="mt-14 flex flex-col items-center" delay={0.05}>
          <div className="relative flex size-24 items-center justify-center rounded-full" aria-hidden="true">
            <div className="pop-pulse absolute inset-0 rounded-full bg-[color:var(--primary)]/15" />
            <div className="glass-pop glow-border-pop relative flex size-20 items-center justify-center rounded-full">
              <ShieldCheck className="size-9 text-[#2563EB]" />
            </div>
          </div>
          <span className="mt-4 inline-flex items-center gap-2 rounded-full border border-[color:var(--primary)]/20 bg-[color:var(--primary)]/8 px-3.5 py-1.5 text-xs font-semibold tracking-[0.14em] text-[#1D4ED8] uppercase">
            <span className="size-1.5 rounded-full bg-brand-orange" aria-hidden="true" />
            {copy.badge}
          </span>

          <div className="relative mt-4 hidden h-16 w-full max-w-xs sm:block" aria-hidden="true">
            <ConnectorPath d="M 30 0 C 90 45, 130 45, 165 60" className="left-1/2 top-0 h-16 w-[340px] -translate-x-1/2" delay={0} />
            <ConnectorPath d="M 310 0 C 250 45, 210 45, 175 60" className="left-1/2 top-0 h-16 w-[340px] -translate-x-1/2" delay={0.8} />
          </div>
        </Reveal>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="mt-2 grid gap-5 sm:grid-cols-2"
        >
          {copy.principles.map((item, i) => {
            const Icon = PRINCIPLE_ICONS[i] ?? ShieldCheck
            return (
              <motion.div key={item.title} variants={staggerItem} className="h-full">
                <GlassPanel className="h-full p-6 transition-transform duration-300 hover:-translate-y-1" glow>
                  <div className="flex items-start gap-4">
                    <IconBadge icon={Icon} className="bg-[color:var(--primary)]/10 text-[#1D4ED8]" />
                    <div>
                      <h3 className="text-base font-semibold text-foreground">{item.title}</h3>
                      <p className="mt-2 text-sm leading-7 text-black">{item.description}</p>
                    </div>
                  </div>
                </GlassPanel>
              </motion.div>
            )
          })}
        </motion.div>

        <Reveal delay={0.05} className="mt-5">
          <GlassPanel className="p-6 sm:p-8">
            <h3 className="text-base font-semibold text-foreground">{copy.rights.title}</h3>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {copy.rights.items.map((right) => (
                <li key={right} className="flex gap-3 text-sm leading-6 text-black">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-[#2563EB]" aria-hidden="true" />
                  <span>{right}</span>
                </li>
              ))}
            </ul>
          </GlassPanel>
        </Reveal>

        <Reveal delay={0.1} className="mt-4">
          <GlassPanel className="p-6">
            <p className="text-sm leading-7 text-black">
              {copy.contact}{" "}
              <a
                href="mailto:privacy@deafference.ai"
                dir="ltr"
                className={cn("rounded-sm font-semibold text-[#1D4ED8] underline-offset-4 hover:underline", focusRingPop)}
              >
                privacy@deafference.ai
              </a>
            </p>
          </GlassPanel>
        </Reveal>
      </Container>
    </section>
  )
}

