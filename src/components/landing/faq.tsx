"use client"

import { useId, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { ChevronDown } from "lucide-react"
import { Container } from "@/components/shared/container"
import { SectionTitle } from "@/components/shared/section-title"
import { cn } from "@/lib/utils"
import { useI18n } from "@/i18n/use-i18n"
import { GlassPanel, GlowOrb, focusRingPop, popButtonSizes, popSecondaryButton, staggerContainer, staggerItem } from "./ui/pop"

/**
 * `revealDelay` is for questions added by "View more": they mount after the list's one-time
 * in-view stagger has run, so they fade in on their own (staggered by this delay) instead.
 */
function FaqItem({ title, content, revealDelay }: { title: string; content: React.ReactNode; revealDelay?: number }) {
  const [open, setOpen] = useState(false)
  const panelId = useId()

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
      <GlassPanel
        className={cn(
          "overflow-hidden transition-shadow duration-300",
          open && "shadow-[var(--pop-glow)]",
        )}
      >
        <h3>
          <button
            type="button"
            aria-expanded={open}
            aria-controls={panelId}
            onClick={() => setOpen((value) => !value)}
            className={cn(
              "flex w-full items-center justify-between gap-4 px-5 py-4 text-start sm:px-6 sm:py-5",
              focusRingPop,
            )}
          >
            <span className={cn("text-sm font-medium text-foreground sm:text-base", open && "font-semibold text-[#1D4ED8]")}>
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
              <div className="px-5 pb-5 text-sm leading-7 text-black sm:px-6 sm:pb-6">{content}</div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </GlassPanel>
    </motion.div>
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
      <GlowOrb className="pop-float left-[-10%] top-4 size-72" color="rgba(59,130,246,0.16)" />
      <GlowOrb className="pop-float-delay right-[-8%] bottom-6 size-80" color="rgba(167,180,255,0.2)" />

      <Container fluid className="relative">
        <SectionTitle
          headingId="faq-heading"
          eyebrow={copy.eyebrow}
          title={copy.title}
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          id={listId}
          className="mt-12 space-y-4"
        >
          {items.map((item, i) => (
            <FaqItem
              key={item.question}
              title={item.question}
              content={item.answer}
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
      </Container>
    </section>
  )
}

