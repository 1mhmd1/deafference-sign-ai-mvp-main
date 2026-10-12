"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Moon, Sun } from "lucide-react"
import { useSettings } from "@/components/deafference/settings-provider"
import { cn } from "@/lib/utils"
import { useI18n } from "@/i18n/use-i18n"
import { focusRingPop } from "./ui/pop"

/** Sun/moon button that flips light ↔ dark (the same theme as Settings → Appearance) and remembers it. */
export function ThemeToggle({ className }: { className?: string }) {
  const { settings, toggleTheme } = useSettings()
  const { t } = useI18n()
  // The resolved theme lives on <html class="dark">, which also covers "system".
  const [dark, setDark] = useState(false)
  useEffect(() => {
    const root = document.documentElement
    const sync = () => setDark(root.classList.contains("dark"))
    sync()
    const observer = new MutationObserver(sync)
    observer.observe(root, { attributes: true, attributeFilter: ["class"] })
    return () => observer.disconnect()
  }, [settings.theme])

  const label = dark ? t.landing.theme.toLight : t.landing.theme.toDark

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      className={cn(
        "glass-pop relative inline-flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full transition-transform hover:-translate-y-0.5",
        focusRingPop,
        className,
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={dark ? "moon" : "sun"}
          initial={{ rotate: -90, scale: 0.4, opacity: 0 }}
          animate={{ rotate: 0, scale: 1, opacity: 1 }}
          exit={{ rotate: 90, scale: 0.4, opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="flex"
          aria-hidden="true"
        >
          {dark ? <Moon className="size-[18px] text-[#93c5fd]" /> : <Sun className="size-[18px] text-[#C2410C]" />}
        </motion.span>
      </AnimatePresence>
    </button>
  )
}
