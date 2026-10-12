"use client"

import { ArrowDown, ArrowRight, Camera, Hand, Languages, Sparkles } from "lucide-react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { useI18n } from "@/i18n/use-i18n"

const PIPELINE_ICONS = [Camera, Hand, Sparkles, Languages] as const

// Centralized switch for the mock-data disclosure badge below. Flip to
// `false` once the pipeline is wired to a real recognition model — the
// badge (and its tooltip) disappear entirely, no other changes needed.
function MockModeBadge() {
  const { t } = useI18n()
  const tooltipId = "pipeline-mock-tooltip"
  return (
    <div className="group relative inline-flex">
      <span
        tabIndex={0}
        aria-describedby={tooltipId}
        className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/40 bg-amber-400/10 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-amber-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring dark:text-amber-400"
      >
        <span className="relative flex size-1.5" aria-hidden="true">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-amber-400 opacity-75" />
          <span className="relative inline-flex size-1.5 rounded-full bg-amber-500" />
        </span>
        {t.app.pipeline.mockBadge}
      </span>
      <div
        id={tooltipId}
        role="tooltip"
        className="pointer-events-none absolute start-0 top-full z-20 mt-2 w-[min(16rem,calc(100vw-4rem))] rounded-lg border border-border bg-popover px-3 py-2 text-start text-xs leading-5 text-popover-foreground opacity-0 shadow-lg transition-opacity duration-150 group-focus-within:opacity-100 group-hover:opacity-100"
      >
        {t.app.pipeline.mockTooltip}
      </div>
    </div>
  )
}

export function Pipeline({
  currentStep = 0,
  isMockMode = true,
}: {
  currentStep?: number
  isMockMode?: boolean
}) {
  const { t } = useI18n()
  const steps = t.app.pipeline.steps
  return (
    <Card className="p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          <p className="text-sm font-bold tracking-[0.12em] text-[#1D4ED8] uppercase">
            {t.app.pipeline.eyebrow}
          </p>
          {isMockMode && <MockModeBadge />}
        </div>
        <span className="text-xs font-medium text-muted-foreground">{t.app.pipeline.workflow}</span>
      </div>
      <motion.ol
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="mt-5 grid gap-3 sm:grid-cols-4"
      >
        {steps.map((step, index) => {
          const Icon = PIPELINE_ICONS[index]
          const done = currentStep > index
          const active = currentStep === index
          return (
            <li key={index} className="relative" aria-current={active ? "step" : undefined}>
              <div
                className={cn(
                  "flex h-full flex-col items-center justify-center rounded-2xl border p-4 text-center transition-shadow",
                  done || active
                    ? "border-brand-orange/30 bg-brand-orange/10 shadow-sm"
                    : "border-border bg-background/70",
                )}
              >
                <div
                  className={cn(
                    "flex size-11 items-center justify-center rounded-full transition-colors",
                    done || active ? "brand-gradient text-white" : "bg-muted text-muted-foreground",
                    active && !done && "state-active-pulse",
                  )}
                >
                  <Icon className="size-5" aria-hidden="true" />
                </div>
                <p
                  className={cn(
                    "mt-3 text-sm font-semibold",
                    done || active ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  {step.label}
                </p>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">{step.description}</p>
              </div>
              {index < steps.length - 1 ? (
                <>
                  <ArrowRight
                    aria-hidden="true"
                    className="absolute -end-2 top-1/2 hidden size-4 -translate-y-1/2 text-muted-foreground rtl:-scale-x-100 sm:block"
                  />
                  <ArrowDown aria-hidden="true" className="mx-auto mt-2 size-4 text-muted-foreground sm:hidden" />
                </>
              ) : null}
            </li>
          )
        })}
      </motion.ol>
    </Card>
  )
}
