"use client"

import { useEffect, useId, useRef, useState } from "react"
import { useSettings } from "@/components/deafference/settings-provider"
import { openEmergencyPhrases } from "@/components/deafference/emergency-quick-actions"
import { useI18n } from "@/i18n/use-i18n"
import { useCalmMode } from "./calm-mode"
import { DisplayPanel } from "./home/df-display"
import { DfIcon } from "./home/df-ui"

/**
 * The website's accessibility menu (header button), drawn as the design's display panel: text size and
 * high contrast are the app's own settings (shared with /settings and saved in a cookie), light/dark is
 * the site theme, and reduce motion is the landing pages' calm mode. A non-modal popover under the
 * button: Escape or a click outside closes it and focus returns to the button.
 */
export function AccessibilityMenu() {
  const { t } = useI18n()
  const copy = t.landing.a11y
  const { settings, update } = useSettings()
  const calmMode = useCalmMode()
  const [open, setOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const panelId = useId()
  const titleId = useId()

  useEffect(() => {
    if (!open) return
    panelRef.current?.querySelector<HTMLInputElement>("input:checked")?.focus()
    function onPointerDown(event: PointerEvent) {
      const target = event.target as Node
      if (panelRef.current?.contains(target) || buttonRef.current?.contains(target)) return
      setOpen(false)
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return
      setOpen(false)
      buttonRef.current?.focus()
    }
    document.addEventListener("pointerdown", onPointerDown)
    document.addEventListener("keydown", onKeyDown)
    return () => {
      document.removeEventListener("pointerdown", onPointerDown)
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [open])

  const changed = settings.textSize !== "normal" || settings.highContrast || Boolean(calmMode?.calm)

  function resetAll() {
    // Only the accessibility settings; the theme and the app's other preferences stay as they are.
    update("textSize", "normal")
    update("highContrast", false)
    calmMode?.setCalm(false)
  }

  function close() {
    setOpen(false)
    buttonRef.current?.focus()
  }

  return (
    <div className="df-nav__a11y">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={copy.button}
        title={copy.button}
        className="df-btn df-btn--soft df-btn--icon"
      >
        <DfIcon name="a11y" size={22} />
      </button>

      {open ? (
        <div ref={panelRef} id={panelId} role="dialog" aria-labelledby={titleId} className="df-a11ymenu">
          <div className="df-a11ymenu__head">
            <div>
              <h2 id={titleId} className="df-a11ymenu__title">
                {copy.title}
              </h2>
              <p className="df-a11ymenu__sub">{copy.subtitle}</p>
            </div>
            <button type="button" onClick={close} aria-label={copy.close} className="df-btn df-btn--ghost df-btn--icon">
              <DfIcon name="x" size={20} />
            </button>
          </div>

          <DisplayPanel />

          <div className="df-a11ymenu__foot">
            <button
              type="button"
              onClick={() => {
                setOpen(false)
                openEmergencyPhrases()
              }}
              className="df-btn df-btn--sos-outline df-btn--sm"
            >
              <DfIcon name="siren" size={18} />
              <span>{copy.emergency}</span>
            </button>
            <button type="button" onClick={resetAll} disabled={!changed} className="df-btn df-btn--ghost df-btn--sm">
              <DfIcon name="repeat" size={18} />
              <span>{copy.reset}</span>
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
