"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight, Mail, Sparkles } from "lucide-react"
import { Container } from "@/components/shared/container"
import { APP_ROUTES } from "@/lib/constants"
import { cn } from "@/lib/utils"
import { useI18n } from "@/i18n/use-i18n"
import {
  ConnectorPath,
  GlassPanel,
  GlowOrb,
  Magnetic,
  popArrowIcon,
  popButtonSizes,
  popPrimaryButton,
  popSecondaryButton,
} from "./ui/pop"
import { requestContactTopic } from "./contact-intent"

export function CTA() {
  const { t } = useI18n()
  const copy = t.landing.cta
  return (
    <section
      id="cta"
      aria-labelledby="cta-heading"
      className="pop-atmosphere relative overflow-hidden py-28 sm:py-32"
    >
      {/* Large soft-blue gradient environment + drifting depth */}
      <div className="pop-grid pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
      <GlowOrb className="pop-float top-[-8rem] left-[6%] size-96" color="rgba(59,130,246,0.28)" />
      <GlowOrb className="pop-float-delay right-[4%] bottom-[-10rem] size-[26rem]" color="rgba(167,180,255,0.26)" />
      <GlowOrb className="pop-pulse top-1/2 left-1/2 size-24 -translate-x-1/2 -translate-y-1/2" color="rgba(255,138,61,0.16)" />

      {/* Animated connection paths crossing the background */}
      <ConnectorPath
        d="M 40 60 C 220 10, 420 140, 680 40"
        className="left-[6%] top-10 h-40 w-[70%] hidden sm:block"
        delay={0.2}
      />
      <ConnectorPath
        d="M 20 20 C 160 120, 360 -20, 560 90"
        className="right-[4%] bottom-6 h-40 w-[55%] hidden lg:block"
        delay={1.4}
      />

      <Container fluid className="relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
        >
          <GlassPanel glow className="relative overflow-hidden p-8 sm:p-10 lg:p-14">
            {/* Floating decorative chips around the headline */}
            <span
              className="pop-float absolute -top-4 end-10 hidden items-center gap-1.5 rounded-full border border-[color:var(--primary)]/25 bg-white/70 px-3 py-1.5 text-xs font-semibold text-[#1D4ED8] shadow-sm backdrop-blur sm:inline-flex"
              aria-hidden="true"
            >
              <Sparkles className="size-3.5 text-[#C2410C]" />
              {copy.chip}
            </span>
            <span
              className="pop-float-delay absolute top-1/2 -end-3 hidden size-14 rounded-2xl border border-dashed border-[color:var(--primary)]/30 sm:block"
              aria-hidden="true"
            />
            <span
              className="pop-orbit absolute -bottom-6 start-10 hidden size-20 rounded-full border border-[color:var(--primary)]/15 lg:block"
              aria-hidden="true"
            />

            <div className="relative grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div>
                <p className="text-sm font-semibold tracking-[0.24em] text-[#1D4ED8] uppercase">{copy.eyebrow}</p>
                <h2 id="cta-heading" className="mt-4 text-3xl font-semibold tracking-tight text-balance text-foreground sm:text-4xl">
                  {copy.title}
                </h2>
                <p className="mt-4 max-w-2xl text-base leading-8 text-black">{copy.body}</p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
                <Magnetic className="w-full sm:w-auto">
                  <Link href={APP_ROUTES.translate} className={cn(popPrimaryButton, popButtonSizes.lg, "w-full sm:w-auto")}>
                    {copy.primary}
                    <ArrowRight className={popArrowIcon} aria-hidden="true" />
                  </Link>
                </Magnetic>
                <a href="#contact" onClick={() => requestContactTopic("general")} className={cn(popSecondaryButton, popButtonSizes.lg)}>
                  <Mail className="size-4" aria-hidden="true" />
                  {copy.secondary}
                </a>
              </div>
            </div>
          </GlassPanel>
        </motion.div>
      </Container>
    </section>
  )
}

