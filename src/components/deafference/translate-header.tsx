"use client"

import Link from "next/link"
import { UserCircle2 } from "lucide-react"
import { initialsFor } from "@/components/auth/auth-nav-actions"
import { useAuth } from "@/components/auth/auth-provider"
import { useProfilePhoto } from "@/components/profile/profile-photo"
import { BackButton } from "@/components/shared/back-button"
import { LanguageToggle } from "@/components/shared/language-toggle"
import { APP_ROUTES } from "@/lib/constants"
import { cn } from "@/lib/utils"
import { useI18n } from "@/i18n/use-i18n"
import { Wordmark } from "@/components/shared/wordmark"

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"

/** Top bar for /translate: logo (home), page title, language and the profile icon. */
export function TranslateHeader({ title }: { title: string }) {
  const { user } = useAuth()
  const photo = useProfilePhoto()
  const { t } = useI18n()
  const profileLabel = t.profile.hub.tabs.profile.label

  return (
    <header className="sticky top-0 z-40 px-3 pt-3 sm:px-4 sm:pt-4">
      <div className="glass-pop flex min-h-16 items-center justify-between gap-2 rounded-[1.75rem] px-3 py-2.5 min-[380px]:gap-3 min-[380px]:px-4 sm:gap-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-3 sm:gap-4">
          <Link href={APP_ROUTES.home} aria-label={t.profile.hub.backToSite} className={cn("shrink-0 rounded-lg", FOCUS_RING)}>
            <Wordmark />
          </Link>
          <div className="sr-only min-w-0 border-s border-[color:var(--primary)]/15 text-start min-[480px]:not-sr-only min-[480px]:ps-3 sm:ps-4">
            <p className="hidden truncate text-[11px] font-semibold tracking-[0.18em] text-[#1D4ED8] uppercase sm:block">
              {t.app.header.eyebrow}
            </p>
            <h1 className="truncate text-base font-bold tracking-tight text-brand-navy sm:text-xl">{title}</h1>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <BackButton />
          <LanguageToggle />
          <Link
            href={APP_ROUTES.profile}
            aria-label={user ? `${user.name || user.email}, ${profileLabel}` : profileLabel}
            title={profileLabel}
            className={cn(
              "inline-flex size-11 items-center justify-center overflow-hidden rounded-full border border-[color:var(--primary)]/20 bg-white/80 text-brand-navy transition-colors hover:bg-[color:var(--primary)]/10",
              FOCUS_RING,
            )}
          >
            {/* The profile picture from /profile when there is one; otherwise initials, or the icon when signed out. */}
            {photo ? (
              <img src={photo} alt="" className="size-full object-cover" />
            ) : user ? (
              <span aria-hidden="true" className="text-xs font-bold text-[#1D4ED8]">
                {initialsFor(user.name, user.email)}
              </span>
            ) : (
              <UserCircle2 className="size-5" aria-hidden="true" />
            )}
          </Link>
        </div>
      </div>
    </header>
  )
}
