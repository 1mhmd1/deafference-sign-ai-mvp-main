"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { APP_ROUTES } from "@/lib/constants"
import { cn } from "@/lib/utils"
import { useI18n } from "@/i18n/use-i18n"
import { BackButton } from "@/components/shared/back-button"

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-background"

/**
 * Shared frame for every auth screen (sign in, create account, forgot/reset
 * password). Borrows the landing page's light "pop" theme — glass card
 * and the real wordmark (plain background unless `backgroundImage` is passed) — so moving
 * from the marketing site into auth feels like the same product.
 */
export function AuthShell({
  children,
  aside,
  backgroundImage,
}: {
  children: ReactNode
  aside?: ReactNode
  /** Optional full-bleed photo behind the screen, softened by an overlay so the form stays readable. */
  backgroundImage?: string
}) {
  const { t, fmt } = useI18n()
  return (
    <div className="landing-pop relative isolate flex min-h-dvh flex-col text-foreground">
      {backgroundImage && (
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <img src={backgroundImage} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-background/60" />
        </div>
      )}

      <header className="flex items-center justify-between gap-3 px-4 pt-5 sm:px-8 sm:pt-6">
        <Link href={APP_ROUTES.home} className={cn("min-w-0 rounded-lg", FOCUS_RING)}>
          <img src="/deafference-wordmark.webp" width={525} height={229} alt={t.auth.shell.homeLogoAlt} className="h-9 w-auto max-w-full object-contain object-left rtl:object-right sm:h-12" />
        </Link>
        <BackButton />
      </header>

      <div className="flex flex-1 items-center justify-center px-4 py-8 sm:px-6 sm:py-14">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={cn(
            "flex w-full flex-col items-center gap-4",
            // With an aside (e.g. Judy's welcome) it sits beside the form from `lg` up, above it on smaller screens.
            aside ? "max-w-md lg:max-w-4xl lg:flex-row lg:items-center lg:gap-12" : "max-w-md",
          )}
        >
          {aside}
          <div className="flex w-full max-w-md flex-col items-center gap-4">{children}</div>
        </motion.div>
      </div>

      {/* Extra bottom space on mobile so fixed floating actions never cover the form's submit button. */}
      <footer className="px-4 pb-28 text-center text-xs text-muted-foreground sm:pb-6">
        {fmt(t.auth.shell.copyright, { year: new Date().getFullYear() })}
      </footer>
    </div>
  )
}

/** The glass card the auth forms sit in. */
export function AuthCard({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "glass-pop glow-border-pop relative w-full rounded-3xl p-5 shadow-[var(--pop-glow)] sm:p-8",
        className,
      )}
    >
      {children}
    </div>
  )
}
