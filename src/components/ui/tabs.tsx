"use client"

import { useId, useRef, useState } from "react"
import { cn } from "@/lib/utils"

type TabItem = {
  value: string
  label: string
  content: React.ReactNode
}

const TAB_FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"

export function Tabs({
  tabs,
  defaultValue,
  label,
  className,
}: {
  tabs: TabItem[]
  defaultValue?: string
  /** Accessible name for the tablist, e.g. "About us subsections". */
  label: string
  className?: string
}) {
  const [active, setActive] = useState(defaultValue ?? tabs[0]?.value)
  const baseId = useId()
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({})
  const current = tabs.find((tab) => tab.value === active) ?? tabs[0]

  function focusTabAt(index: number) {
    const target = tabs[(index + tabs.length) % tabs.length]
    if (!target) return
    setActive(target.value)
    tabRefs.current[target.value]?.focus()
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLButtonElement>, index: number) {
    // Arrow keys follow visual order, which is reversed in right-to-left layouts.
    const step = getComputedStyle(event.currentTarget).direction === "rtl" ? -1 : 1
    switch (event.key) {
      case "ArrowRight":
        event.preventDefault()
        focusTabAt(index + step)
        break
      case "ArrowLeft":
        event.preventDefault()
        focusTabAt(index - step)
        break
      case "Home":
        event.preventDefault()
        focusTabAt(0)
        break
      case "End":
        event.preventDefault()
        focusTabAt(tabs.length - 1)
        break
      default:
        break
    }
  }

  return (
    <div className={cn("space-y-6", className)}>
      <div role="tablist" aria-label={label} className="flex flex-wrap gap-1 rounded-2xl border border-border bg-muted p-1">
        {tabs.map((tab, index) => {
          const selected = tab.value === current?.value
          return (
            <button
              key={tab.value}
              ref={(node) => {
                tabRefs.current[tab.value] = node
              }}
              type="button"
              role="tab"
              id={`${baseId}-tab-${tab.value}`}
              aria-selected={selected}
              aria-controls={`${baseId}-panel-${tab.value}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(tab.value)}
              onKeyDown={(event) => handleKeyDown(event, index)}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors",
                selected ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
                TAB_FOCUS_RING,
              )}
            >
              {tab.label}
            </button>
          )
        })}
      </div>

      {tabs.map((tab) => (
        <div
          key={tab.value}
          role="tabpanel"
          id={`${baseId}-panel-${tab.value}`}
          aria-labelledby={`${baseId}-tab-${tab.value}`}
          hidden={tab.value !== current?.value}
          tabIndex={0}
          className={TAB_FOCUS_RING}
        >
          {tab.value === current?.value ? tab.content : null}
        </div>
      ))}
    </div>
  )
}
