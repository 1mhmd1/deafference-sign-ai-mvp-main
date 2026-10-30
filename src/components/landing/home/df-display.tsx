"use client"

import { useEffect, useId, useState, type ReactNode } from "react"
import { useSettings, type TextSize } from "@/components/deafference/settings-provider"
import { cn } from "@/lib/utils"
import { useI18n } from "@/i18n/use-i18n"
import { useCalmMode } from "../calm-mode"
import { DfIcon, type IconName } from "./df-ui"

const SIZES: TextSize[] = ["normal", "large", "xlarge"]
type Look = "light" | "dark" | "contrast"
const LOOK_ICONS: Record<Look, IconName> = { light: "sun", dark: "moon", contrast: "contrast" }

/** Whether the page is drawn dark right now (also when the theme follows the system). */
function useIsDark() {
  const [dark, setDark] = useState(false)
  useEffect(() => {
    const root = document.documentElement
    const sync = () => setDark(root.classList.contains("dark"))
    sync()
    const observer = new MutationObserver(sync)
    observer.observe(root, { attributes: true, attributeFilter: ["class"] })
    return () => observer.disconnect()
  }, [])
  return dark
}

/** One segmented choice: native radios (keyboard and screen readers get a real radio group), drawn as pills. */
function Segmented<T extends string>({
  label,
  name,
  options,
  value,
  onChange,
}: {
  label: string
  name: string
  options: { value: T; label: string; content: ReactNode; className?: string }[]
  value: T
  onChange: (value: T) => void
}) {
  return (
    <div className="df-seg" role="radiogroup" aria-label={label}>
      {options.map((option) => (
        <label key={option.value} className={cn("df-seg__btn", option.className, value === option.value && "is-on")}>
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={() => onChange(option.value)}
            className="df-sr"
            aria-label={option.label}
          />
          <span aria-hidden="true">{option.content}</span>
        </label>
      ))}
    </div>
  )
}

/**
 * The design's display panel, working for real: text size and high contrast are the site's shared
 * settings (the header's accessibility menu and the app use the same ones), theme is light/dark, and
 * reduce motion is the landing pages' calm mode. Changes apply at once and are saved.
 */
export function DisplayPanel() {
  const { t } = useI18n()
  const copy = t.landing.home.why
  const sizes = t.app.accessibility.sizes
  const { settings, update, save, isDirty } = useSettings()
  const calmMode = useCalmMode()
  const dark = useIsDark()
  const look: Look = settings.highContrast ? "contrast" : dark ? "dark" : "light"
  // Own radio group names: the page can show this panel twice (Why choose us + the header menu), and
  // same-named radios would form one group across both.
  const groupId = useId()

  useEffect(() => {
    if (isDirty) save()
  }, [isDirty, save])

  function setLook(next: Look) {
    update("highContrast", next === "contrast")
    update("theme", next === "dark" ? "dark" : "light")
  }

  return (
    <div className="df-a11y" role="group" aria-label={copy.displayLabel}>
      <div className="df-a11y__row">
        <span className="df-a11y__label">
          <DfIcon name="textsize" size={22} />
          <span>{t.landing.a11y.textSize}</span>
        </span>
        <Segmented
          label={t.landing.a11y.textSize}
          name={`${groupId}-text-size`}
          value={settings.textSize}
          onChange={(size) => update("textSize", size)}
          options={SIZES.map((size, i) => ({ value: size, label: sizes[size], content: "A", className: `df-seg__btn--${i + 1}` }))}
        />
      </div>
      <div className="df-a11y__row">
        <span className="df-a11y__label">
          <DfIcon name="contrast" size={22} />
          <span>{copy.look}</span>
        </span>
        <Segmented
          label={copy.look}
          name={`${groupId}-look`}
          value={look}
          onChange={setLook}
          options={(["light", "dark", "contrast"] as const).map((value) => ({
            value,
            label: copy[value],
            content: <DfIcon name={LOOK_ICONS[value]} size={20} />,
          }))}
        />
      </div>
      {calmMode ? (
        <button type="button" role="switch" aria-checked={calmMode.calm} className="df-toggle" onClick={() => calmMode.setCalm(!calmMode.calm)}>
          <span className="df-toggle__icon">
            <DfIcon name="motion" size={22} />
          </span>
          <span className="df-toggle__label">{copy.motion}</span>
          <span className="df-toggle__track" aria-hidden="true">
            <span className="df-toggle__thumb">
              <DfIcon name="check" size={14} stroke={3} />
            </span>
          </span>
        </button>
      ) : null}
    </div>
  )
}
