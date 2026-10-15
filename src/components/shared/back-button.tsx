"use client"

import { useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { APP_ROUTES } from "@/lib/constants"
import { cn } from "@/lib/utils"
import { useI18n } from "@/i18n/use-i18n"

/** In-app pages visited this tab (sessionStorage, so it survives a reload like the browser history does). */
const STACK_KEY = "deafference.navStack"

function readStack(): string[] {
  try {
    return JSON.parse(window.sessionStorage.getItem(STACK_KEY) ?? "[]") as string[]
  } catch {
    return []
  }
}

function writeStack(stack: string[]) {
  try {
    window.sessionStorage.setItem(STACK_KEY, JSON.stringify(stack.slice(-50)))
  } catch {
    // Storage blocked: BackButton just falls back to the home page.
  }
}

/** Mounted once in the root layout: records page changes so BackButton knows whether there is a page to go back to. */
export function NavigationTracker() {
  const pathname = usePathname()

  useEffect(() => {
    const stack = readStack()
    if (stack[stack.length - 1] === pathname) return
    // Arriving on the page before the current one means the user went back.
    if (stack[stack.length - 2] === pathname) stack.pop()
    else stack.push(pathname)
    writeStack(stack)
  }, [pathname])

  return null
}

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"

/**
 * Glass "Back" pill used in every app top bar (translate, profile, auth), always first in the
 * right-hand group. Returns to the page the user really came from; with no earlier in-app page
 * (opened directly / from another site) it goes to the home page instead.
 */
export function BackButton({ className }: { className?: string }) {
  const router = useRouter()
  const { t } = useI18n()

  function handleClick() {
    if (readStack().length > 1) router.back()
    else router.push(APP_ROUTES.home)
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={t.common.actions.back}
      title={t.common.actions.back}
      className={cn(
        "glass-pop group inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-full px-3.5 text-sm font-semibold text-brand-navy transition-all hover:-translate-y-0.5 hover:bg-white/90 sm:px-4",
        FOCUS_RING,
        className,
      )}
    >
      <ArrowLeft className="size-4 transition-transform ltr:group-hover:-translate-x-0.5 rtl:-scale-x-100" aria-hidden="true" />
      <span className="hidden md:inline">{t.common.actions.back}</span>
    </button>
  )
}
