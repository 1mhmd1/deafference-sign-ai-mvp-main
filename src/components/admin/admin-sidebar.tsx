"use client"

import { useRef } from "react"
import Link from "next/link"
import { LayoutDashboard, Mail, MessageSquare, Users, Edit3, BarChart3, Activity, type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import type { AdminView } from "./admin-shell"

const NAV_ITEMS: Array<{ value: AdminView; label: string; icon: LucideIcon }> = [
  { value: "overview", label: "System Overview", icon: LayoutDashboard },
  { value: "analytics", label: "Analytics & Metrics", icon: BarChart3 },
  { value: "activity", label: "Activity Log", icon: Activity },
  { value: "users", label: "Users Management", icon: Users },
  { value: "feedback", label: "User Feedback", icon: MessageSquare },
  { value: "contacts", label: "Contact Submissions", icon: Mail },
]

export function AdminSidebar({
  active,
  onChange,
  onNavigate,
}: {
  active: AdminView
  onChange: (view: AdminView) => void
  onNavigate?: () => void
}) {
  const tabRefs = useRef<Record<AdminView, HTMLButtonElement | null>>({
    overview: null,
    analytics: null,
    activity: null,
    users: null,
    feedback: null,
    contacts: null,
  })

  function activateAt(index: number) {
    const item = NAV_ITEMS[(index + NAV_ITEMS.length) % NAV_ITEMS.length]
    onChange(item.value)
    tabRefs.current[item.value]?.focus()
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLButtonElement>, index: number) {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault()
        activateAt(index + 1)
        break
      case "ArrowUp":
        event.preventDefault()
        activateAt(index - 1)
        break
      case "Home":
        event.preventDefault()
        activateAt(0)
        break
      case "End":
        event.preventDefault()
        activateAt(NAV_ITEMS.length - 1)
        break
      default:
        break
    }
  }

  return (
    <nav aria-label="Admin panel sections" className="flex h-full flex-col px-4 py-6">
      <p className="px-3 text-xs font-semibold tracking-[0.18em] text-muted-foreground uppercase">Admin Panel</p>
      <div
        role="tablist"
        aria-label="Admin views"
        aria-orientation="vertical"
        className="mt-4 flex flex-col gap-1"
      >
        {NAV_ITEMS.map((item, index) => {
          const selected = item.value === active
          const Icon = item.icon

          return (
            <button
              key={item.value}
              ref={(node) => {
                tabRefs.current[item.value] = node
              }}
              type="button"
              role="tab"
              id={`admin-tab-${item.value}`}
              aria-selected={selected}
              aria-controls={`admin-panel-${item.value}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => {
                onChange(item.value)
                onNavigate?.()
              }}
              onKeyDown={(event) => handleKeyDown(event, index)}
              className={cn(
                "flex items-center gap-3 rounded-xl border border-transparent px-3 py-2.5 text-left text-sm font-medium transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                selected
                  ? "border-brand-red/30 bg-brand-orange/10 text-brand-red"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <Icon className="size-4 shrink-0" aria-hidden="true" />
              {item.label}
            </button>
          )
        })}
      </div>

      {/* Content Editor Link */}
      <div className="mt-auto border-t pt-4">
        <p className="px-3 text-xs font-semibold tracking-[0.18em] text-muted-foreground uppercase mb-2">Content</p>
        <Link
          href="/admin/content-editor"
          className={cn(
            "flex items-center gap-3 rounded-xl border border-transparent px-3 py-2.5 text-left text-sm font-medium transition-colors",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            "text-muted-foreground hover:bg-muted hover:text-foreground",
          )}
        >
          <Edit3 className="size-4 shrink-0" aria-hidden="true" />
          Landing Page Editor
        </Link>
      </div>
    </nav>
  )
}
