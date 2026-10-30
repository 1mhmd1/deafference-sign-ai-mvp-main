"use client"

import { useState, useSyncExternalStore } from "react"
import { usePathname } from "next/navigation"
import { useI18n } from "@/i18n/use-i18n"
import { useMobile } from "@/hooks/use-mobile"
import { JudyCharacter } from "./judy-character"

// Sign-in and sign-up keep the screen to the form alone.
const HIDDEN_ON = ["/login", "/signup"]

// A phone held sideways: wide enough for her full size, but too short to spare it.
const SHORT_QUERY = "(max-height: 500px)"
function subscribeShort(onChange: () => void) {
  const query = window.matchMedia(SHORT_QUERY)
  query.addEventListener("change", onChange)
  return () => query.removeEventListener("change", onChange)
}

/**
 * Site-wide floating Judy with her random idle moves. Mounted once in the root
 * layout, so she keeps her place across page changes. On phones she is smaller
 * and rests just above the emergency button so the two never overlap; on short
 * (sideways) screens she is smaller too.
 */
export function FloatingJudy() {
  const pathname = usePathname()
  const { t, dir } = useI18n()
  // Where the visitor last dropped Judy; she returns here after her auto-play moves.
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null)
  const isPhone = useMobile(640)
  const isShort = useSyncExternalStore(subscribeShort, () => window.matchMedia(SHORT_QUERY).matches, () => false)
  const size = isPhone || isShort ? 66 : 112

  if (HIDDEN_ON.some((path) => pathname === path || pathname.startsWith(`${path}/`))) return null

  return (
    // Rests on the start side so she never sits under the emergency button (end side).
    <JudyCharacter
      x={position?.x ?? (dir === "rtl" ? `calc(100% - ${size + 16}px)` : 16)}
      y={position?.y ?? (isPhone ? 84 : 10)}
      size={size}
      draggable
      onDragEnd={setPosition}
      autoPlay
      autoPlayLines={t.common.judyLines}
      announce={false}
      label={t.landing.judy.floatingLabel}
      className="floating-judy"
    />
  )
}
