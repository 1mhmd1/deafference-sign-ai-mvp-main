"use client"

import { useEffect, useRef, useState } from "react"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAdminData } from "@/hooks/useAdminData"
import { AdminSidebar } from "./admin-sidebar"
import { ContactSubmissions } from "./contact-submissions"
import { SystemOverview } from "./system-overview"
import { UserFeedback } from "./user-feedback"
import { UsersManagement } from "./users-management"
import { Analytics } from "./analytics"
import { ActivityLog } from "./activity-log"
import {
  MOCK_ACTIVITY_LOG,
  MOCK_ANALYTICS_METRICS,
  MOCK_DAILY_SIGNUPS,
  MOCK_TRANSLATION_USAGE,
} from "@/lib/mock-analytics-data"

export type AdminView = "users" | "feedback" | "contacts" | "overview" | "analytics" | "activity"

const VIEW_TITLES: Record<AdminView, string> = {
  users: "Users Management",
  feedback: "User Feedback",
  contacts: "Contact Submissions",
  overview: "System Overview",
  analytics: "Analytics & Metrics",
  activity: "Activity Log",
}

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"

export function AdminShell() {
  const [activeView, setActiveView] = useState<AdminView>("overview")
  const [isOpen, setIsOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const wasOpenRef = useRef(false)

  const data = useAdminData()

  useEffect(() => {
    if (!isOpen) return

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false)
    }

    document.addEventListener("keydown", handleKeyDown)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = ""
    }
  }, [isOpen])

  useEffect(() => {
    if (isOpen) {
      wasOpenRef.current = true
      panelRef.current?.querySelector<HTMLButtonElement>("button")?.focus()
    } else if (wasOpenRef.current) {
      wasOpenRef.current = false
      toggleRef.current?.focus()
    }
  }, [isOpen])

  return (
    <div className="min-h-dvh lg:flex">
      {/* Desktop: persistent sidebar */}
      <aside className="hidden shrink-0 border-r border-border bg-background lg:block lg:w-72">
        <div className="sticky top-0 h-dvh">
          <AdminSidebar active={activeView} onChange={setActiveView} />
        </div>
      </aside>

      {/* Mobile: off-canvas sidebar + backdrop */}
      <div
        inert={!isOpen}
        className={cn("fixed inset-0 z-50 lg:hidden", isOpen ? "pointer-events-auto" : "pointer-events-none")}
      >
        <div
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
          className={cn(
            "absolute inset-0 bg-black/50 transition-opacity duration-300",
            isOpen ? "opacity-100" : "opacity-0",
          )}
        />
        <div
          id="admin-sidebar-panel"
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Admin panel sections"
          className={cn(
            "absolute inset-y-0 left-0 w-72 max-w-[80vw] border-r border-border bg-background shadow-2xl transition-transform duration-300",
            isOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <AdminSidebar active={activeView} onChange={setActiveView} onNavigate={() => setIsOpen(false)} />
        </div>
      </div>

      {/* Mobile: floating toggle */}
      <button
        ref={toggleRef}
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-controls="admin-sidebar-panel"
        aria-label={isOpen ? "Close admin navigation" : "Open admin navigation"}
        className={cn(
          "fixed bottom-5 left-5 z-50 inline-flex size-12 items-center justify-center rounded-full bg-foreground text-background shadow-lg transition-transform hover:scale-105 lg:hidden",
          FOCUS_RING,
        )}
      >
        {isOpen ? <X className="size-5" /> : <Menu className="size-5" />}
      </button>

      <div className="min-w-0 flex-1">
        <header className="border-b border-border/70 bg-background/85 px-4 py-6 backdrop-blur-xl sm:px-6 lg:px-8">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            {VIEW_TITLES[activeView]}
          </h1>
        </header>

        <main className="flex flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
          <div id="admin-panel-users" role="tabpanel" aria-labelledby="admin-tab-users" hidden={activeView !== "users"}>
            <UsersManagement
              users={data.users}
              loading={data.usersLoading}
              error={data.usersError}
              onUpdateRole={data.updateUserRole}
              onToggleStatus={data.toggleUserStatus}
              onDeleteUser={data.deleteUser}
            />
          </div>

          <div
            id="admin-panel-feedback"
            role="tabpanel"
            aria-labelledby="admin-tab-feedback"
            hidden={activeView !== "feedback"}
          >
            <UserFeedback feedback={data.feedback} onUpdateStatus={data.updateFeedbackStatus} />
          </div>

          <div
            id="admin-panel-contacts"
            role="tabpanel"
            aria-labelledby="admin-tab-contacts"
            hidden={activeView !== "contacts"}
          >
            <ContactSubmissions
              contacts={data.contacts}
              onMarkRead={data.markContactRead}
              onDelete={data.deleteContact}
            />
          </div>

          <div
            id="admin-panel-overview"
            role="tabpanel"
            aria-labelledby="admin-tab-overview"
            hidden={activeView !== "overview"}
          >
            <SystemOverview stats={data.stats} />
          </div>

          <div
            id="admin-panel-analytics"
            role="tabpanel"
            aria-labelledby="admin-tab-analytics"
            hidden={activeView !== "analytics"}
          >
            <Analytics
              metrics={MOCK_ANALYTICS_METRICS}
              dailySignups={MOCK_DAILY_SIGNUPS}
              translationUsage={MOCK_TRANSLATION_USAGE}
            />
          </div>

          <div
            id="admin-panel-activity"
            role="tabpanel"
            aria-labelledby="admin-tab-activity"
            hidden={activeView !== "activity"}
          >
            <ActivityLog entries={MOCK_ACTIVITY_LOG} />
          </div>
        </main>
      </div>
    </div>
  )
}
