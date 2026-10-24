"use client"

import { useEffect, useRef, useState, useSyncExternalStore } from "react"
import { AlertTriangle, ArrowLeft, Volume2, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { useI18n } from "@/i18n/use-i18n"
import { getServerSnapshot, getSnapshot, speak, stop, subscribe } from "@/lib/speech"
import {
  EMERGENCY_CATEGORY_MAP,
  EMERGENCY_FILTERS,
  EMERGENCY_PHRASES,
  type EmergencyFilterId,
  type EmergencyPhrase,
} from "./emergency-data"

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'

/**
 * Persistent, zero-latency "Emergency Quick-Action" panel.
 *
 * Everything (phrases, categories, colors) lives in local memory — no
 * network round-trip stands between a tap and a displayed phrase, which is
 * the entire point in an urgent situation. Mount once near the app root
 * (see app/layout.tsx) so the trigger is available from every screen.
 */
export function EmergencyQuickActions() {
  const { t, fmt } = useI18n()
  const copy = t.app.emergency
  // Phrase data stays English in emergency-data.ts; localized copy is looked up by id.
  const labelOf = (phrase: EmergencyPhrase) => copy.phrases[phrase.id]?.label ?? phrase.label
  const textOf = (phrase: EmergencyPhrase) => copy.phrases[phrase.id]?.text ?? phrase.text
  const [isSelectOpen, setIsSelectOpen] = useState(false)
  const [activeFilter, setActiveFilter] = useState<EmergencyFilterId>("all")
  const [activePhrase, setActivePhrase] = useState<EmergencyPhrase | null>(null)

  const triggerRef = useRef<HTMLButtonElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const readAloudButtonRef = useRef<HTMLButtonElement>(null)

  const speech = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  const isFullscreen = activePhrase !== null

  function openSelect() {
    setIsSelectOpen(true)
  }

  function closeSelect() {
    setIsSelectOpen(false)
    triggerRef.current?.focus()
  }

  function openPhrase(phrase: EmergencyPhrase) {
    setActivePhrase(phrase)
  }

  function closePhrase() {
    stop()
    setActivePhrase(null)
  }

  function closeEverything() {
    stop()
    setActivePhrase(null)
    setIsSelectOpen(false)
    triggerRef.current?.focus()
  }

  // ESC: fullscreen closes back to the grid first; a second ESC closes the panel.
  useEffect(() => {
    if (!isSelectOpen && !isFullscreen) return
    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== "Escape") return
      if (isFullscreen) {
        closePhrase()
      } else if (isSelectOpen) {
        closeSelect()
      }
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [isSelectOpen, isFullscreen])

  // Lock background scroll while any overlay is open.
  useEffect(() => {
    if (!isSelectOpen && !isFullscreen) return
    const previous = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = previous
    }
  }, [isSelectOpen, isFullscreen])

  // Focus trap for the select dialog.
  useEffect(() => {
    if (!isSelectOpen || isFullscreen) return
    closeButtonRef.current?.focus()

    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== "Tab") return
      const node = dialogRef.current
      if (!node) return
      const focusables = Array.from(node.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR))
      if (focusables.length === 0) return
      const first = focusables[0]
      const last = focusables[focusables.length - 1]

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [isSelectOpen, isFullscreen])

  // Focus trap for the fullscreen flashcard.
  useEffect(() => {
    if (!isFullscreen) return
    readAloudButtonRef.current?.focus()

    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== "Tab") return
      const node = document.getElementById("emergency-flashcard")
      if (!node) return
      const focusables = Array.from(node.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR))
      if (focusables.length === 0) return
      const first = focusables[0]
      const last = focusables[focusables.length - 1]

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [isFullscreen])

  const filteredPhrases =
    activeFilter === "all"
      ? EMERGENCY_PHRASES
      : EMERGENCY_PHRASES.filter((p) => p.category === activeFilter)

  return (
    <>
      {/* Floating trigger */}
      <button
        ref={triggerRef}
        type="button"
        onClick={openSelect}
        aria-haspopup="dialog"
        aria-expanded={isSelectOpen}
        aria-controls="emergency-select-dialog"
        tabIndex={isSelectOpen || isFullscreen ? -1 : 0}
        className={cn(
          // Icon-only circle; Judy's launcher sits beside it on the same line (JudyChatLauncher.css).
          "fixed bottom-5 end-5 z-50 grid size-16 place-items-center rounded-full border border-white/80 bg-gradient-to-br from-[#EE6C2B] to-[#F59E0B] sm:bottom-6 sm:end-6 text-white shadow-[0_10px_40px_-10px_rgba(238,108,43,0.7)] transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#F59E0B]/60 active:scale-95",
          "emergency-fab-pulse",
          (isSelectOpen || isFullscreen) && "pointer-events-none opacity-0",
        )}
      >
        <AlertTriangle className="size-7 shrink-0" strokeWidth={2.4} aria-hidden="true" />
        <span className="sr-only">{copy.trigger}</span>
      </button>

      {/* Select panel backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm transition-opacity duration-200",
          isSelectOpen && !isFullscreen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={closeSelect}
        aria-hidden="true"
      />

      {/* Select panel */}
      <div
        ref={dialogRef}
        id="emergency-select-dialog"
        role="dialog"
        aria-modal="true"
        aria-label={copy.title}
        aria-hidden={!(isSelectOpen && !isFullscreen)}
        inert={!(isSelectOpen && !isFullscreen)}
        className={cn(
          "fixed inset-x-0 bottom-0 z-[60] flex max-h-[92vh] flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl transition-transform duration-300 ease-out",
          "sm:inset-x-6 sm:bottom-6 sm:rounded-3xl",
          "lg:inset-x-0 lg:mx-auto lg:w-full lg:max-w-5xl",
          isSelectOpen && !isFullscreen
            ? "translate-y-0"
            : "pointer-events-none translate-y-[calc(100%+2rem)]",
        )}
      >
        <div className="flex items-start justify-between gap-4 border-b border-black/10 px-5 py-4 sm:px-6">
          <div>
            <h2 className="text-lg font-extrabold tracking-tight text-[#1A1A1A] uppercase sm:text-xl">
              {copy.title}
            </h2>
            <p className="mt-0.5 text-xs text-black/60 sm:text-sm">{copy.subtitle}</p>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={closeEverything}
            aria-label={copy.close}
            className="flex size-10 shrink-0 items-center justify-center rounded-full bg-black/5 text-[#1A1A1A] transition-colors hover:bg-black/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EE6C2B]"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>

        <div
          role="tablist"
          aria-label={copy.categoryLabel}
          className="flex flex-wrap gap-2 border-b border-black/10 px-5 py-3 sm:px-6"
        >
          {EMERGENCY_FILTERS.map((f) => {
            const active = activeFilter === f.id
            return (
              <button
                key={f.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setActiveFilter(f.id)}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EE6C2B]",
                  active
                    ? "bg-gradient-to-r from-[#EE6C2B] to-[#F59E0B] text-white shadow-sm"
                    : "bg-black/5 text-[#1A1A1A]/70 hover:bg-black/10 hover:text-[#1A1A1A]",
                )}
              >
                {copy.filters[f.id]}
              </button>
            )
          })}
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {filteredPhrases.map((phrase) => {
              const meta = EMERGENCY_CATEGORY_MAP[phrase.category]
              const Icon = phrase.icon
              const iconColor = phrase.iconColor ?? meta.color
              return (
                <button
                  key={phrase.id}
                  type="button"
                  onClick={() => openPhrase(phrase)}
                  style={{ borderTopColor: meta.color }}
                  className={cn(
                    "flex aspect-square flex-col items-center justify-center gap-3 rounded-2xl border border-black/10 border-t-4 bg-white p-6 text-center shadow-md transition-all hover:-translate-y-0.5 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EE6C2B]",
                    phrase.xl && "sm:col-span-2 lg:col-span-2",
                  )}
                >
                  <Icon
                    className={cn("shrink-0", phrase.xl ? "size-24" : "size-16 md:size-20")}
                    style={{ color: iconColor }}
                    strokeWidth={1.75}
                    aria-hidden="true"
                  />
                  <span
                    className={cn(
                      "font-extrabold leading-tight text-[#1A1A1A]",
                      phrase.xl ? "text-3xl" : "text-base md:text-lg",
                    )}
                  >
                    {labelOf(phrase)}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Fullscreen broadcast flashcard */}
      {activePhrase && (
        <div
          id="emergency-flashcard"
          role="dialog"
          aria-modal="true"
          aria-label={fmt(copy.broadcasting, { text: textOf(activePhrase) })}
          className="fixed inset-0 z-[70] flex flex-col bg-slate-950 text-white"
        >
          <div
            className="h-2 w-full shrink-0"
            style={{ backgroundColor: EMERGENCY_CATEGORY_MAP[activePhrase.category].color }}
            aria-hidden="true"
          />

          <div className="flex items-center justify-between px-5 py-4 sm:px-8">
            <button
              type="button"
              onClick={closePhrase}
              className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <ArrowLeft className="size-4 rtl:-scale-x-100" aria-hidden="true" />
              {copy.back}
            </button>
            <button
              type="button"
              onClick={closeEverything}
              aria-label={copy.close}
              className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <X className="size-5" />
            </button>
          </div>

          <div className="flex flex-1 flex-col items-center justify-center gap-10 px-6 py-8 text-center sm:px-12">
            <activePhrase.icon
              className="size-32 shrink-0"
              style={{ color: activePhrase.iconColor ?? EMERGENCY_CATEGORY_MAP[activePhrase.category].color }}
              strokeWidth={1.5}
              aria-hidden="true"
            />

            <p className="text-balance text-4xl font-extrabold leading-tight md:text-6xl">
              {textOf(activePhrase)}
            </p>

            <button
              ref={readAloudButtonRef}
              type="button"
              onClick={() => speak(textOf(activePhrase))}
              disabled={!speech.supported}
              className="flex items-center gap-3 rounded-full bg-gradient-to-r from-[#EE6C2B] to-[#F59E0B] px-8 py-4 text-lg font-extrabold text-white shadow-lg transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/60 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Volume2 className="size-6" aria-hidden="true" />
              {speech.speaking ? copy.speaking : copy.readAloud}
            </button>

            {!speech.supported && (
              <p className="max-w-sm text-sm text-white/70">{copy.unsupported}</p>
            )}
          </div>
        </div>
      )}
    </>
  )
}
