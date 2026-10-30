"use client"

import { ArrowRight, type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

/** One stage of a visual sequence: an icon tile with a short label. `brand` draws the Deafference mark instead of an icon. */
export type FlowStep = { icon?: LucideIcon; label: string; brand?: boolean }

const TILE_SIZES = {
  sm: { tile: "size-10 rounded-xl", icon: "size-[18px]", label: "w-[4.5rem] text-[11px]", arrow: "mt-3" },
  md: { tile: "size-12 rounded-2xl", icon: "size-5", label: "w-20 text-xs", arrow: "mt-4" },
} as const

/**
 * A short left-to-right sequence of icon tiles joined by arrows (mirrored in RTL): the landing's
 * way of showing a process instead of describing it (tutorial thumbnails, the scenario exchange).
 * Decorative: the surrounding element carries the text alternative.
 */
export function FlowSteps({
  steps,
  numbered = false,
  size = "md",
  className,
}: {
  steps: FlowStep[]
  numbered?: boolean
  size?: keyof typeof TILE_SIZES
  className?: string
}) {
  const s = TILE_SIZES[size]
  return (
    <ol aria-hidden="true" className={cn("flex items-start justify-center gap-1 sm:gap-1.5", className)}>
      {steps.map((step, i) => {
        const Icon = step.icon
        return (
          <li key={step.label} className="flex items-start gap-1 sm:gap-1.5">
            {i > 0 ? <ArrowRight className={cn("size-4 shrink-0 text-[color:var(--primary)]/70 rtl:-scale-x-100", s.arrow)} /> : null}
            <div className="flex flex-col items-center text-center">
              <div
                className={cn(
                  "relative grid place-items-center bg-white shadow-[0_10px_24px_-16px_rgba(94,15,69,0.45)]",
                  s.tile,
                  step.brand ? "ring-2 ring-[#F28C1A]/45" : "ring-1 ring-[color:var(--primary)]/15",
                )}
              >
                {step.brand ? (
                  <img src="/deafference-mark.png" alt="" className="size-[62%] object-contain" />
                ) : Icon ? (
                  <Icon className={cn("text-[color:var(--primary)]", s.icon)} />
                ) : null}
                {numbered ? (
                  <b className="absolute -top-1.5 -start-1.5 grid size-5 place-items-center rounded-full bg-gradient-to-br from-[#D63C1A] to-[#B01030] text-[10px] leading-none font-bold text-white">
                    {i + 1}
                  </b>
                ) : null}
              </div>
              <div className={cn("mt-2 leading-tight font-semibold text-black", s.label)}>{step.label}</div>
            </div>
          </li>
        )
      })}
    </ol>
  )
}
