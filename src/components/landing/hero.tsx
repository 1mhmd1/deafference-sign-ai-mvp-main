"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight, Check, Play } from "lucide-react"
import { Container } from "@/components/shared/container"
import { APP_ROUTES } from "@/lib/constants"
import { useI18n } from "@/i18n/use-i18n"
import { cn } from "@/lib/utils"
import { HeroIllustration } from "./hero-illustration"
import { GlowOrb, Magnetic, popArrowIcon, popButtonSizes, popPrimaryButton, popSecondaryButton } from "./ui/pop"

const headlineContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
}
const headlineWord = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" as const } },
}

export function Hero() {
  const { t } = useI18n()
  const hero = t.landing.hero
  const words = hero.headline

  return (
    <section
      id="top"
      className="pop-atmosphere relative overflow-hidden pt-8 sm:pt-10"
    >
      <div className="pop-grid pointer-events-none absolute inset-0 -z-10 opacity-[0.05]" aria-hidden="true" />
      <GlowOrb className="-top-24 -left-24 size-[26rem] pop-float" color="rgba(59,130,246,0.22)" />
      <GlowOrb className="top-10 -right-32 size-[30rem] pop-float-delay" color="rgba(167,180,255,0.22)" />
      <GlowOrb className="bottom-0 left-1/3 size-72" color="rgba(255,138,61,0.12)" />

      <Container fluid className="pb-24 sm:pb-32">
        <div className="grid items-center gap-16 lg:grid-cols-2 lg:items-start lg:gap-12">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="glass-pop inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium text-black"
            >
              <span className="relative flex size-2" aria-hidden="true">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-brand-orange opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-brand-orange" />
              </span>
              {hero.status}
            </motion.span>

            <motion.h1
              variants={headlineContainer}
              initial="hidden"
              animate="show"
              className="mt-6 max-w-2xl text-[clamp(1.75rem,9vw,2.25rem)] leading-[1.1] font-extrabold tracking-tight text-balance break-words text-black sm:text-[min(3.75rem,8.5vw)] sm:leading-[1.05] lg:text-[min(4.75rem,4.1vw)]"
            >
              {words.map((word, i) => (
                <span key={`${i}-${word}`} className="inline-block max-w-full overflow-hidden pb-1 align-bottom">
                  <motion.span
                    variants={headlineWord}
                    className={cn("inline-block max-w-full break-words", i === words.length - 1 && "pop-gradient-text")}
                  >
                    {word}
                    {i < words.length - 1 ? " " : ""}
                  </motion.span>
                </span>
              ))}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.5 }}
              className="mt-6 max-w-lg text-lg leading-8 text-pretty text-black"
            >
              {hero.intro}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.65 }}
              className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap"
            >
              <Magnetic className="w-full sm:w-auto">
                <Link href={APP_ROUTES.translate} className={cn(popPrimaryButton, popButtonSizes.lg, "w-full sm:w-auto")}>
                  {hero.primaryCta}
                  <ArrowRight className={popArrowIcon} aria-hidden="true" />
                </Link>
              </Magnetic>
              <a href="#demo" className={cn(popSecondaryButton, popButtonSizes.lg)}>
                <Play className="size-4 fill-current text-[#C2410C] rtl:-scale-x-100" aria-hidden="true" />
                {hero.secondaryCta}
              </a>
              <a href="#scenarios" className={cn(popSecondaryButton, popButtonSizes.lg)}>
                {hero.scenariosCta}
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.85 }}
              className="mt-10 flex flex-wrap items-center gap-2.5"
            >
              {hero.badges.map((label) => (
                <span
                  key={label}
                  className="glass-pop inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium text-black"
                >
                  <Check className="size-3.5 text-[#C2410C]" aria-hidden="true" />
                  {label}
                </span>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
            className="relative"
          >
            {/* Chips sit centred above/below the illustration so they never cover its corner cards (in either text direction). */}
            <div className="pointer-events-none absolute inset-x-0 -top-6 z-40 hidden justify-center sm:flex">
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 1.1 }}
              className="glass-pop pop-float pointer-events-auto rounded-2xl px-3.5 py-2"
            >
              <p className="text-xs font-semibold tracking-[0.08em] text-black uppercase">{hero.modeLabel}</p>
              <p className="text-sm font-bold text-black">
                {hero.modeValue} <span className="text-[#C2410C]">{hero.modeAccent}</span>
              </p>
            </motion.div>
            </div>
            <div className="pointer-events-none absolute inset-x-0 -bottom-6 z-40 hidden justify-center sm:flex">
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 1.3 }}
              className="glass-pop pop-float-delay pointer-events-auto rounded-2xl px-3.5 py-2"
            >
              <p className="text-xs font-semibold tracking-[0.08em] text-black uppercase">{hero.privacyLabel}</p>
              <p className="text-sm font-bold text-black">{hero.privacyValue}</p>
            </motion.div>
            </div>
            <HeroIllustration />
          </motion.div>
        </div>
      </Container>
    </section>
  )
}

