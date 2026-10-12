"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import { useI18n } from "@/i18n/use-i18n"
import { JudyCharacter } from "./judy-character"

// Sign-in and sign-up keep the screen to the form alone.
const HIDDEN_ON = ["/login", "/signup"]

/**
 * Site-wide floating Judy with her random idle moves. Mounted once in the root
 * layout, so she keeps her place across page changes. Hidden below `sm`
 * (globals.css) so she never covers content on phones.
 */
export function FloatingJudy() {
  const pathname = usePathname()
  const { t, dir } = useI18n()
  // Where the visitor last dropped Judy; she returns here after her auto-play moves.
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null)

  if (HIDDEN_ON.some((path) => pathname === path || pathname.startsWith(`${path}/`))) return null

  return (
    // Rests on the start side so she never sits under the emergency button (end side).
    <JudyCharacter
      x={position?.x ?? (dir === "rtl" ? "calc(100% - 148px)" : 16)}
      y={position?.y ?? 10}
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
