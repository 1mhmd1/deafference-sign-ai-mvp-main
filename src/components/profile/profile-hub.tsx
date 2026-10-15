"use client"

import { useId, useRef, useState, type ChangeEvent, type KeyboardEvent } from "react"
import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Camera, History, Loader2, LogOut, Mic, Pencil, Settings2, ShieldCheck, UserCircle2, type LucideIcon } from "lucide-react"
import { useAuth } from "@/components/auth/auth-provider"
import { LogoutConfirmDialog } from "@/components/auth/logout-confirm-dialog"
import { TranslationHistory } from "@/components/deafference/translation-history"
import { SettingsView } from "@/components/settings/settings-view"
import { Wordmark } from "@/components/shared/wordmark"
import { Container } from "@/components/shared/container"
import { BackButton } from "@/components/shared/back-button"
import { LanguageToggle } from "@/components/shared/language-toggle"
import { APP_ROUTES } from "@/lib/constants"
import { cn } from "@/lib/utils"
import { useI18n } from "@/i18n/use-i18n"
import { AccountProvider, useAccount, type CompletionItem } from "./account-context"
import { ApiError } from "./api-error"
import { ACCEPTED_AVATAR_TYPES, validateAvatarFile } from "./avatar-section"
import { COMPLETION_TARGETS, ProfileCompletionButton, ProfileCompletionPanel } from "./profile-completion"
import { ProfilePageClient } from "./profile-page-client"
import "@/components/shared/app-pop.css"

const TAB_IDS = ["profile", "history", "settings"] as const
export type ProfileTab = (typeof TAB_IDS)[number]

const ICONS: Record<ProfileTab, LucideIcon> = {
  profile: UserCircle2,
  history: History,
  settings: Settings2,
}

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"

// Same button looks as the landing (components/landing/ui/pop.tsx, which is landing-only).
const PRIMARY_BUTTON = cn(
  "inline-flex h-10 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] px-4 text-sm font-semibold text-white shadow-[0_14px_32px_-12px_rgba(37,99,235,0.55)] transition-all hover:-translate-y-0.5",
  FOCUS_RING,
)
const SECONDARY_BUTTON = cn(
  "glass-pop inline-flex h-10 items-center justify-center gap-2 rounded-full px-4 text-sm font-semibold text-brand-navy transition-all hover:-translate-y-0.5 hover:bg-white/90",
  FOCUS_RING,
)

export function parseProfileTab(tab: string | null): ProfileTab {
  return tab && (TAB_IDS as readonly string[]).includes(tab) ? (tab as ProfileTab) : "profile"
}

function initialsFor(name: string, email: string) {
  const source = name.trim() || email
  const parts = source.split(/\s+/).filter(Boolean)
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
  return source.slice(0, 2).toUpperCase()
}

/** /profile: one page holding the account, history and settings, switched in place. */
export function ProfileHub() {
  return (
    <AccountProvider>
      <ProfileHubContent />
    </AccountProvider>
  )
}

function ProfileHubContent() {
  const { user, role } = useAuth()
  const { state: accountState, uploadAvatar } = useAccount()
  const account = accountState.kind === "loaded" ? accountState.account : null
  const photoInputRef = useRef<HTMLInputElement>(null)
  const [photoBusy, setPhotoBusy] = useState(false)
  const [photoMessage, setPhotoMessage] = useState<{ tone: "error" | "success"; text: string }>()
  const [completionOpen, setCompletionOpen] = useState(false)
  const completionPanelId = useId()
  const { t, fmt } = useI18n()
  const copy = t.profile.hub
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const active = parseProfileTab(searchParams.get("tab"))
  const [confirmOpen, setConfirmOpen] = useState(false)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

  function select(tab: ProfileTab) {
    if (tab !== active) router.replace(`${pathname}?tab=${tab}`, { scroll: false })
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const index = TAB_IDS.indexOf(active)
    const rtl = document.dir === "rtl"
    let next: number | null = null
    if (event.key === (rtl ? "ArrowLeft" : "ArrowRight")) next = (index + 1) % TAB_IDS.length
    else if (event.key === (rtl ? "ArrowRight" : "ArrowLeft")) next = (index - 1 + TAB_IDS.length) % TAB_IDS.length
    else if (event.key === "Home") next = 0
    else if (event.key === "End") next = TAB_IDS.length - 1
    if (next === null) return
    event.preventDefault()
    select(TAB_IDS[next])
    tabRefs.current[next]?.focus()
  }

  const panels: Record<ProfileTab, React.ReactNode> = {
    profile: <ProfilePageClient />,
    history: <TranslationHistory />,
    settings: <SettingsView />,
  }

  // The profile lives in this browser (account-context.tsx); fall back to a signed-in session's name.
  const name = account?.name || user?.name || ""
  const email = account?.email || user?.email || ""
  const hasIdentity = Boolean(name || email)
  const displayName = name || email || copy.guestName

  // Checklist item → open the Profile tab, then scroll to that field and focus it (it may not be mounted yet).
  function goToCompletionItem(item: CompletionItem) {
    select("profile")
    let tries = 0
    const reveal = () => {
      const target = document.getElementById(COMPLETION_TARGETS[item])
      if (!target) {
        if (++tries < 60) requestAnimationFrame(reveal)
        return
      }
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" })
      target.querySelector<HTMLElement>("input:not([type=file]):not([tabindex='-1']), select, button")?.focus({ preventScroll: true })
    }
    requestAnimationFrame(reveal)
  }

  // Camera button on the identity card: same checks and messages as the Profile Picture section.
  async function handlePhotoChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ""
    if (!file) return
    const problem = validateAvatarFile(file)
    if (problem) {
      setPhotoMessage({ tone: "error", text: t.profile.avatar[problem] })
      return
    }
    setPhotoMessage(undefined)
    setPhotoBusy(true)
    try {
      await uploadAvatar(file)
      setPhotoMessage({ tone: "success", text: copy.photoUpdated })
    } catch (error) {
      let text = t.profile.avatar.uploadFailed
      if (error instanceof ApiError && error.status === 0) text = t.common.errors.network
      else if (error instanceof ApiError && error.status === 400) {
        text = /too large/i.test(error.message) ? t.profile.avatar.tooLarge : t.profile.avatar.invalidType
      }
      setPhotoMessage({ tone: "error", text })
    } finally {
      setPhotoBusy(false)
    }
  }

  return (
    <div className="landing-pop app-pop relative min-h-dvh text-foreground">
      {/* Glass top bar, same as the landing navbar and /translate. */}
      <header className="sticky top-0 z-40 px-3 pt-3 sm:px-4 sm:pt-4">
        <div className="glass-pop flex min-h-16 items-center justify-between gap-3 rounded-[1.75rem] px-4 py-2.5 sm:px-6">
          <Link href={APP_ROUTES.home} aria-label={copy.backToSite} className={cn("flex shrink-0 items-center gap-3 rounded-lg", FOCUS_RING)}>
            <Wordmark />
          </Link>
          <div className="flex items-center gap-2">
            <BackButton />
            <Link href={APP_ROUTES.translate} className={cn(PRIMARY_BUTTON, "hidden sm:inline-flex")}>
              <Mic className="size-4" aria-hidden="true" />
              {t.app.shell.nav.translate}
            </Link>
            <LanguageToggle />
            {user ? (
              <button
                type="button"
                onClick={() => setConfirmOpen(true)}
                aria-haspopup="dialog"
                aria-label={t.common.logout.trigger}
                className={SECONDARY_BUTTON}
              >
                <LogOut className="size-4 rtl:-scale-x-100" aria-hidden="true" />
                <span className="hidden md:inline">{t.common.logout.trigger}</span>
              </button>
            ) : null}
          </div>
        </div>
      </header>

      <Container fluid className="pt-6 pb-16 sm:pt-8">
        {/* Identity card: blue banner with the avatar overlapping it. */}
        <section className="glass-pop glow-border-pop relative overflow-hidden rounded-[2rem]">
          <div aria-hidden="true" className="relative h-28 overflow-hidden bg-gradient-to-r from-[#2563EB] via-[#3b82f6] to-[#38bdf8] sm:h-36">
            <div className="absolute -top-16 start-1/4 size-64 rounded-full bg-[rgba(255,255,255,0.25)] blur-3xl" />
            <div className="absolute -bottom-24 end-10 size-72 rounded-full bg-[rgba(255,138,61,0.35)] blur-3xl" />
          </div>
          <div className="flex flex-col gap-4 px-6 pb-6 sm:flex-row sm:items-end sm:gap-6 sm:px-8 sm:pb-8">
            <div className="relative z-10 -mt-12 flex size-24 shrink-0 items-center justify-center rounded-full bg-white p-1.5 shadow-[var(--pop-glow)] sm:-mt-14 sm:size-28">
              {account?.avatarUrl ? (
                <img
                  src={account.avatarUrl}
                  alt={fmt(t.profile.avatar.altSaved, { name: displayName })}
                  className="size-full rounded-full object-cover"
                />
              ) : (
                <span
                  aria-hidden="true"
                  className="flex size-full items-center justify-center rounded-full bg-[color:var(--primary)]/10 text-2xl font-bold text-[#1D4ED8] sm:text-3xl"
                >
                  {hasIdentity ? initialsFor(name, email) : <UserCircle2 className="size-12" />}
                </span>
              )}
              {photoBusy ? (
                <span aria-hidden="true" className="absolute inset-1.5 flex items-center justify-center rounded-full bg-black/40">
                  <Loader2 className="size-6 animate-spin text-white" />
                </span>
              ) : null}
              {account ? (
                <>
                  <input
                    ref={photoInputRef}
                    type="file"
                    accept={ACCEPTED_AVATAR_TYPES.join(",")}
                    onChange={handlePhotoChange}
                    className="sr-only"
                    tabIndex={-1}
                    aria-hidden="true"
                  />
                  <button
                    type="button"
                    onClick={() => photoInputRef.current?.click()}
                    disabled={photoBusy}
                    aria-label={copy.changePhoto}
                    title={copy.changePhoto}
                    className={cn(
                      "absolute -bottom-0.5 -end-0.5 flex size-9 items-center justify-center rounded-full border-2 border-white bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] text-white shadow-md transition-transform hover:scale-105 disabled:opacity-60",
                      FOCUS_RING,
                    )}
                  >
                    <Camera className="size-4" aria-hidden="true" />
                  </button>
                </>
              ) : null}
            </div>
            <div className="min-w-0 flex-1">
              {hasIdentity ? <p className="text-sm font-semibold tracking-[0.12em] text-[#1D4ED8] uppercase">{copy.welcome}</p> : null}
              <h1 className="mt-1 truncate text-2xl font-extrabold tracking-tight text-brand-navy sm:text-4xl">{displayName}</h1>
              {hasIdentity ? null : <p className="mt-1 text-sm text-muted-foreground sm:text-base">{copy.guestHint}</p>}
              {email || role === "admin" ? (
                <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-muted-foreground sm:text-base">
                  <span className="truncate">{email}</span>
                  {role === "admin" ? (
                    <Link
                      href={APP_ROUTES.admin}
                      className={cn(
                        "inline-flex items-center gap-1 rounded-full border border-[color:var(--primary)]/30 bg-[color:var(--primary)]/10 px-2.5 py-0.5 text-xs font-semibold text-[#1D4ED8]",
                        FOCUS_RING,
                      )}
                    >
                      <ShieldCheck className="size-3" aria-hidden="true" />
                      {t.auth.nav.admin}
                    </Link>
                  ) : null}
                </div>
              ) : null}
              <p
                role="status"
                aria-live="polite"
                className={cn(
                  "mt-2 text-sm font-medium empty:hidden",
                  photoMessage?.tone === "error" ? "text-destructive" : "text-emerald-700 dark:text-emerald-400",
                )}
              >
                {photoMessage?.text}
              </p>
            </div>
            {account ? (
              <div className="flex flex-wrap gap-2 self-start sm:self-end">
                {active !== "profile" ? (
                  <button type="button" onClick={() => select("profile")} className={SECONDARY_BUTTON}>
                    <Pencil className="size-4" aria-hidden="true" />
                    {copy.editProfile}
                  </button>
                ) : null}
                <ProfileCompletionButton
                  account={account}
                  open={completionOpen}
                  onToggle={() => setCompletionOpen((open) => !open)}
                  panelId={completionPanelId}
                />
              </div>
            ) : null}
          </div>
          {account && completionOpen ? (
            <ProfileCompletionPanel account={account} id={completionPanelId} onGo={goToCompletionItem} />
          ) : null}
        </section>

        {/* Section switcher: landing-style pill tabs. */}
        <div className="mt-6 flex justify-center">
          <div
            role="tablist"
            aria-label={copy.sections}
            onKeyDown={handleKeyDown}
            className="glass-pop grid w-full max-w-3xl grid-cols-3 gap-1.5 rounded-full p-1.5"
          >
            {TAB_IDS.map((id, index) => {
              const Icon = ICONS[id]
              const selected = id === active
              return (
                <button
                  key={id}
                  ref={(el) => {
                    tabRefs.current[index] = el
                  }}
                  id={`profile-tab-${id}`}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-controls={`profile-panel-${id}`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => select(id)}
                  title={copy.tabs[id].description}
                  className={cn(
                    "flex min-h-12 items-center justify-center gap-2 rounded-full px-3 text-sm font-semibold whitespace-nowrap transition-all sm:px-5 sm:text-base",
                    selected
                      ? "bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] text-white shadow-[0_14px_32px_-12px_rgba(37,99,235,0.55)]"
                      : "text-brand-navy hover:bg-white/80",
                    FOCUS_RING,
                  )}
                >
                  <Icon className="size-5 shrink-0" aria-hidden="true" />
                  {copy.tabs[id].label}
                </button>
              )
            })}
          </div>
        </div>

        <div
          id={`profile-panel-${active}`}
          role="tabpanel"
          aria-labelledby={`profile-tab-${active}`}
          tabIndex={0}
          className="mt-8 focus-visible:outline-none"
        >
          {panels[active]}
        </div>
      </Container>

      <LogoutConfirmDialog open={confirmOpen} onOpenChange={setConfirmOpen} onSignedOut={() => router.push(APP_ROUTES.home)} />
    </div>
  )
}
