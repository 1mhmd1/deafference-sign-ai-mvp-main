"use client"

import { useId, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight, Camera, ChevronDown, Hand, Languages, Tag, Target, UserCheck, WifiOff, type LucideIcon } from "lucide-react"
import { Container } from "@/components/shared/container"
import { SectionTitle } from "@/components/shared/section-title"
import { cn } from "@/lib/utils"
import { useI18n } from "@/i18n/use-i18n"
import {
  GlassPanel,
  Reveal,
  focusRingPop,
  popArrowIcon,
  popButtonSizes,
  popPrimaryButton,
  popSecondaryButton,
  popStage,
  popTile,
  staggerContainer,
  staggerItem,
} from "./ui/pop"
import { contactHref } from "./contact-intent"
import { SignVideoButton } from "./sign-video"

/**
 * One picture per question, zipped by index with `t.landing.faq.items`: what it is (the mark),
 * sign languages, camera, interpreters, cost, Arabic, accuracy, offline.
 */
const QUESTION_ICONS: (LucideIcon | "brand")[] = ["brand", Hand, Camera, UserCheck, Tag, Languages, Target, WifiOff]

/**
 * `revealDelay` is for questions added by "View more": they mount after the list's one-time
 * in-view stagger has run, so they fade in on their own (staggered by this delay) instead.
 */
function FaqItem({
  title,
  content,
  icon,
  revealDelay,
}: {
  title: string
  content: React.ReactNode
  icon: LucideIcon | "brand"
  revealDelay?: number
}) {
  const [open, setOpen] = useState(false)
  const panelId = useId()
  const Icon = icon === "brand" ? null : icon

  return (
    <motion.div
      {...(revealDelay === undefined
        ? { variants: staggerItem }
        : {
            initial: { opacity: 0, y: 14 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.35, ease: "easeOut", delay: revealDelay },
          })}
    >
      <GlassPanel className="overflow-hidden">
        <h3>
          <button
            type="button"
            aria-expanded={open}
            aria-controls={panelId}
            onClick={() => setOpen((value) => !value)}
            className={cn(
              "flex w-full items-center gap-4 px-4 py-3.5 text-start sm:px-5 sm:py-4",
              focusRingPop,
            )}
          >
            <span aria-hidden="true" className={cn(popTile, "size-11")}>
              {Icon ? <Icon className="size-5" /> : <img src="/deafference-mark.png" alt="" className="size-6 object-contain" />}
            </span>
            <span className={cn("flex-1 text-sm font-medium text-foreground sm:text-base", open && "font-semibold text-[#1D4ED8]")}>
              {title}
            </span>
            <span
              aria-hidden="true"
              className={cn(
                "flex size-8 shrink-0 items-center justify-center rounded-full bg-[color:var(--primary)]/8 text-[#1D4ED8] transition-all duration-300",
                open && "rotate-180 bg-[color:var(--primary)]/16",
              )}
            >
              <ChevronDown className="size-4" />
            </span>
          </button>
        </h3>
        <AnimatePresence initial={false}>
          {open ? (
            <motion.div
              key="content"
              id={panelId}
              role="region"
              aria-label={title}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ height: { duration: 0.35, ease: [0.4, 0, 0.2, 1] }, opacity: { duration: 0.25, ease: "easeInOut" } }}
              className="overflow-hidden"
            >
              {/* Indented to line up with the question text, past the icon. */}
              <div className="px-4 pb-5 text-sm leading-7 text-black sm:ps-[4.75rem] sm:pe-6">{content}</div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </GlassPanel>
    </motion.div>
  )
}

/** A question bubble answered by a reply bubble: the picture on the "Still have a question?" card. */
function AskVisual() {
  return (
    <div className="flex w-44 flex-col gap-2.5">
      <div className="flex items-center gap-2 self-start rounded-2xl rounded-es-sm bg-white px-3 py-2.5 shadow-[0_10px_24px_-16px_rgba(94,15,69,0.45)] ring-1 ring-[color:var(--primary)]/12">
        <b className="text-base font-extrabold text-[color:var(--primary)]">?</b>
        <div className="h-1.5 w-16 rounded-full bg-[color:var(--primary)]/25" />
      </div>
      <div className="flex flex-col gap-1.5 self-end rounded-2xl rounded-ee-sm bg-gradient-to-r from-[#D63C1A] to-[#B01030] px-3 py-2.5">
        <div className="h-1.5 w-20 rounded-full bg-[rgba(255,255,255,0.8)]" />
        <div className="h-1.5 w-12 rounded-full bg-[rgba(255,255,255,0.55)]" />
      </div>
    </div>
  )
}

/** How many questions show before "View more". */
const INITIAL_COUNT = 2

export function FAQ() {
  const { t, fmt } = useI18n()
  const copy = t.landing.faq
  const [showAll, setShowAll] = useState(false)
  const listId = useId()
  const hiddenCount = Math.max(0, copy.items.length - INITIAL_COUNT)
  const items = showAll ? copy.items : copy.items.slice(0, INITIAL_COUNT)
  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="relative overflow-hidden py-24 sm:py-28"
    >

      <Container fluid className="relative">
        <SectionTitle
          headingId="faq-heading"
          eyebrow={copy.eyebrow}
          title={copy.title}
        />
        <SignVideoButton videoKey="faq" className="mt-6" />

        <div className="mt-12 grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start lg:gap-8">
          <div>
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              id={listId}
              className="space-y-3"
            >
              {items.map((item, i) => (
                <FaqItem
                  key={item.question}
                  title={item.question}
                  content={item.answer}
                  icon={QUESTION_ICONS[i] ?? Target}
                  revealDelay={i < INITIAL_COUNT ? undefined : (i - INITIAL_COUNT) * 0.06}
                />
              ))}
            </motion.div>

            {hiddenCount > 0 ? (
              <div className="mt-6 flex justify-center">
                <button
                  type="button"
                  aria-expanded={showAll}
                  aria-controls={listId}
                  onClick={() => setShowAll((value) => !value)}
                  className={cn(popSecondaryButton, popButtonSizes.md)}
                >
                  {showAll ? copy.viewLess : fmt(copy.viewMore, { count: hiddenCount })}
                  <ChevronDown className={cn("size-4 transition-transform duration-300", showAll && "rotate-180")} aria-hidden="true" />
                </button>
              </div>
            ) : null}
          </div>

          <Reveal delay={0.1} className="lg:sticky lg:top-28">
            <GlassPanel className="p-5">
              <div aria-hidden="true" className={cn("flex h-36 items-center justify-center", popStage)}>
                <AskVisual />
              </div>
              <h3 className="mt-5 text-lg font-semibold text-black">{copy.ask.title}</h3>
              <p className="mt-1.5 text-sm leading-6 text-black">{copy.ask.body}</p>
              <Link href={contactHref()} className={cn(popPrimaryButton, popButtonSizes.md, "mt-5 w-full")}>
                {copy.ask.cta}
                <ArrowRight className={popArrowIcon} aria-hidden="true" />
              </Link>
            </GlassPanel>
          </Reveal>
        </div>
      </Container>
    </section>
  )
}
