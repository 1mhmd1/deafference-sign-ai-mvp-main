"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useState, useSyncExternalStore, type ReactNode } from "react"

/**
 * Landing-only "calm mode": a real, page-scoped motion reduction.
 * When on, the landing wrapper gets the existing `.reduce-motion` class (stops
 * CSS animations/transitions inside it) and auto-advancing sections stop rotating.
 * With calm mode off, the OS "reduce motion" preference is still respected.
 * (No animation library here, so the landing pages don't download one.)
 */
type CalmModeValue = { calm: boolean; setCalm: (calm: boolean) => void }

const CalmModeContext = createContext<CalmModeValue | null>(null)
const STORAGE_KEY = "deafference.landing.calm"

export function CalmModeProvider({ children }: { children: ReactNode }) {
  const [calm, setCalmState] = useState(false)

  useEffect(() => {
    try {
      if (window.localStorage.getItem(STORAGE_KEY) === "1") setCalmState(true)
    } catch {
      // Storage unavailable (private mode etc.) — calm mode just isn't remembered.
    }
  }, [])

  const setCalm = useCallback((next: boolean) => {
    setCalmState(next)
    try {
      window.localStorage.setItem(STORAGE_KEY, next ? "1" : "0")
    } catch {
      // ignore
    }
  }, [])

  const value = useMemo(() => ({ calm, setCalm }), [calm, setCalm])

  return <CalmModeContext.Provider value={value}>{children}</CalmModeContext.Provider>
}

/** Null outside the landing page (e.g. /terms reuses the navbar), where the toggle hides itself. */
export function useCalmMode() {
  return useContext(CalmModeContext)
}

const REDUCE_QUERY = "(prefers-reduced-motion: reduce)"
const subscribeReduce = (onChange: () => void) => {
  const query = window.matchMedia(REDUCE_QUERY)
  query.addEventListener("change", onChange)
  return () => query.removeEventListener("change", onChange)
}

/**
 * True when calm mode is on or the OS asks for reduced motion. The OS preference
 * only applies after hydration (server snapshot is false) so the first client
 * render matches the server HTML.
 */
export function useLandingReducedMotion() {
  const ctx = useContext(CalmModeContext)
  const prefersReduced = useSyncExternalStore(subscribeReduce, () => window.matchMedia(REDUCE_QUERY).matches, () => false)
  return Boolean(ctx?.calm || prefersReduced)
}
