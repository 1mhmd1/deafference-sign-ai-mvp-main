"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight, Check, LockKeyhole, Mail, MessageSquare, ShieldCheck } from "lucide-react"
import { Container } from "@/components/shared/container"
import { SectionTitle } from "@/components/shared/section-title"
import { cn } from "@/lib/utils"
import { useI18n } from "@/i18n/use-i18n"
import type { LandingMessages } from "@/i18n/messages/landing"
import { GlassPanel, popArrowIcon, popButtonSizes, popSecondaryButton, popStage, staggerContainer, staggerItem } from "./ui/pop"

type ExploreKey = keyof LandingMessages["explore"]["items"]

const PAGES: { key: ExploreKey; href: string }[] = [
  { key: "pricing", href: "/pricing" },
  { key: "faq", href: "/faq" },
  { key: "security", href: "/security" },
  { key: "contact", href: "/contact" },
]

const CHIP = "bg-white shadow-[0_10px_24px_-16px_rgba(94,15,69,0.45)] ring-1 ring-[color:var(--primary)]/15"

/** Two plan columns side by side, the second highlighted: "compare plans". */
function PricingVisual() {
  return (
    <div className="flex items-end gap-2.5">
      {[false, true].map((featured) => (
        <div key={String(featured)} className={cn("flex w-16 flex-col gap-1.5 rounded-xl p-2.5", featured ? "h-24 bg-gradient-to-b from-[#D63C1A] to-[#B01030]" : cn("h-20", CHIP))}>
          <div className={cn("h-1.5 w-8 rounded-full", featured ? "bg-white/80" : "bg-[color:var(--primary)]/35")} />
          {[0, 1, 2].map((row) => (
            <div key={row} className="flex items-center gap-1">
              <Check className={cn("size-3", featured ? "text-white" : "text-[color:var(--primary)]")} />
              <div className={cn("h-1 flex-1 rounded-full", featured ? "bg-white/55" : "bg-[color:var(--primary)]/20")} />
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

/** A question bubble answered by a second one: "questions and answers". */
function QuestionsVisual() {
  return (
    <div className="flex w-36 flex-col gap-2">
      <div className={cn("flex items-center gap-2 self-start rounded-2xl rounded-es-sm px-3 py-2", CHIP)}>
        <b className="text-sm font-extrabold text-[color:var(--primary)]">?</b>
        <div className="h-1.5 w-12 rounded-full bg-[color:var(--primary)]/25" />
      </div>
      <div className="flex flex-col gap-1.5 self-end rounded-2xl rounded-ee-sm bg-gradient-to-r from-[#D63C1A] to-[#B01030] px-3 py-2">
        <div className="h-1.5 w-16 rounded-full bg-white/80" />
        <div className="h-1.5 w-10 rounded-full bg-white/55" />
      </div>
    </div>
  )
}

/** A shield with a lock: "protected". */
function SecurityVisual() {
  return (
    <div className="relative">
      <ShieldCheck className="size-16 text-[color:var(--primary)]" strokeWidth={1.5} />
      <div className={cn("absolute -end-2 -bottom-1 grid size-8 place-items-center rounded-full", CHIP)}>
        <LockKeyhole className="size-4 text-[color:var(--primary)]" />
      </div>
    </div>
  )
}

/** The two ways to reach the team: email and the contact form. */
function ContactVisual() {
  return (
    <div className="flex items-center gap-3">
      <div className={cn("grid size-14 place-items-center rounded-2xl", CHIP)}>
        <Mail className="size-7 text-[color:var(--primary)]" />
      </div>
      <div className="grid size-14 place-items-center rounded-2xl bg-gradient-to-br from-[#D63C1A] to-[#B01030] shadow-[0_12px_26px_-14px_rgba(176,16,48,0.6)]">
        <MessageSquare className="size-7 text-white" />
      </div>
    </div>
  )
}

const VISUALS: Record<ExploreKey, () => React.JSX.Element> = {
  pricing: PricingVisual,
  faq: QuestionsVisual,
  security: SecurityVisual,
  contact: ContactVisual,
}

/**
 * Home page band in place of the sections that moved to their own pages (pricing, FAQ,
 * privacy & security, the contact form): one picture, a title and a link each.
 */
export function ExplorePages() {
  const { t } = useI18n()
  const copy = t.landing.explore

  return (
    <section id="explore" aria-labelledby="explore-heading" className="relative py-20 sm:py-24">
      <Container fluid>
        <SectionTitle headingId="explore-heading" eyebrow={copy.eyebrow} title={copy.title} />

        <motion.ul
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
        >
          {PAGES.map(({ key, href }) => {
            const item = copy.items[key]
            const Visual = VISUALS[key]
            return (
              <motion.li key={key} variants={staggerItem} className="flex">
                <GlassPanel className="flex w-full flex-col p-5">
                  <div aria-hidden="true" className={cn("flex h-32 items-center justify-center", popStage)}>
                    <Visual />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-black">{item.title}</h3>
                  <Link href={href} className={cn(popSecondaryButton, popButtonSizes.md, "mt-4 w-fit")}>
                    {item.cta}
                    <ArrowRight className={popArrowIcon} aria-hidden="true" />
                  </Link>
                </GlassPanel>
              </motion.li>
            )
          })}
        </motion.ul>
      </Container>
    </section>
  )
}
