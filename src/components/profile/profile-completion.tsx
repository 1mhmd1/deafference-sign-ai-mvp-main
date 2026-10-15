"use client"

import { useId } from "react"
import { CheckCircle2, ChevronDown, Circle, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { useI18n } from "@/i18n/use-i18n"
import { COMPLETION_ITEMS, profileCompletion, type AccountData, type CompletionItem } from "./account-context"

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"

/** Where each checklist item lives in the Profile tab (ids set on the form sections). */
export const COMPLETION_TARGETS: Record<CompletionItem, string> = {
  photo: "profile-field-photo",
  name: "profile-field-name",
  email: "profile-field-email",
  hearing: "profile-field-hearing",
  signLanguage: "profile-field-sign-language",
  password: "profile-field-password",
}

/** The "Complete profile · 50%" pill on the identity card; toggles the checklist panel. */
export function ProfileCompletionButton({
  account,
  open,
  onToggle,
  panelId,
}: {
  account: AccountData
  open: boolean
  onToggle: () => void
  panelId: string
}) {
  const { t, fmt } = useI18n()
  const m = t.profile.hub.complete
  const { percent } = profileCompletion(account)
  const complete = percent === 100

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={open}
      aria-controls={panelId}
      className={cn(
        "inline-flex h-10 items-center justify-center gap-2 rounded-full px-4 text-sm font-semibold transition-all hover:-translate-y-0.5",
        complete
          ? "border border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
          : "bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] text-white shadow-[0_14px_32px_-12px_rgba(37,99,235,0.55)]",
        FOCUS_RING,
      )}
    >
      {complete ? <CheckCircle2 className="size-4" aria-hidden="true" /> : <Sparkles className="size-4" aria-hidden="true" />}
      {complete ? m.done : fmt(m.button, { percent })}
      <ChevronDown className={cn("size-4 transition-transform", open && "rotate-180")} aria-hidden="true" />
    </button>
  )
}

/** Linear progress bar + checklist; each unfinished item jumps to its field. */
export function ProfileCompletionPanel({
  account,
  id,
  onGo,
}: {
  account: AccountData
  id: string
  onGo: (item: CompletionItem) => void
}) {
  const { t, fmt } = useI18n()
  const m = t.profile.hub.complete
  const labelId = useId()
  const { done, percent } = profileCompletion(account)

  return (
    <div id={id} className="border-t border-[color:var(--primary)]/10 px-6 py-5 sm:px-8">
      <div className="flex items-center justify-between gap-3">
        <h2 id={labelId} className="text-base font-semibold text-brand-navy">
          {percent === 100 ? m.doneTitle : m.title}
        </h2>
        <span className="text-sm font-bold text-[#1D4ED8] tabular-nums">{fmt(m.progress, { percent })}</span>
      </div>

      <div
        role="progressbar"
        aria-labelledby={labelId}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-[color:var(--primary)]/10"
      >
        <div
          className={cn(
            "h-full rounded-full transition-[width] duration-500 ease-out motion-reduce:transition-none",
            percent === 100 ? "bg-emerald-500" : "bg-gradient-to-r from-[#2563EB] to-[#38bdf8]",
          )}
          style={{ width: `${percent}%` }}
        />
      </div>

      <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {COMPLETION_ITEMS.map((item) => {
          const isDone = done[item]
          return (
            <li key={item}>
              <button
                type="button"
                onClick={() => onGo(item)}
                className={cn(
                  "flex min-h-11 w-full items-center gap-2.5 rounded-xl border px-3 py-2 text-start text-sm transition-colors",
                  isDone
                    ? "border-emerald-500/25 bg-emerald-500/5 text-muted-foreground"
                    : "border-[color:var(--primary)]/20 bg-white/60 font-medium text-brand-navy hover:bg-white/90 dark:bg-white/5 dark:hover:bg-white/10",
                  FOCUS_RING,
                )}
              >
                {isDone ? (
                  <CheckCircle2 className="size-5 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                ) : (
                  <Circle className="size-5 shrink-0 text-[#1D4ED8]/50" aria-hidden="true" />
                )}
                <span className={cn(isDone && "line-through decoration-1")}>{m.items[item]}</span>
                <span className="sr-only">{isDone ? m.itemDone : m.itemTodo}</span>
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
