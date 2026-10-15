"use client"

import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { useAuth } from "@/components/auth/auth-provider"
import { APP_ROUTES } from "@/lib/constants"
import { useI18n } from "@/i18n/use-i18n"
import { useAccount } from "./account-context"
import { ProfileSettings } from "./profile-settings"

/** Profile tab of /profile: every editable account field (data comes from AccountProvider, saved in this browser). */
export function ProfilePageClient() {
  const { t } = useI18n()
  const router = useRouter()
  const { user } = useAuth()
  const { state, savePersonalInfo, updatePassword, uploadAvatar, removeAvatar, deleteAccount } = useAccount()

  let body: React.ReactNode
  if (state.kind === "loading") {
    body = (
      <div aria-busy="true" className="flex max-w-2xl flex-col gap-6">
        <p role="status" className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          {t.profile.load.loading}
        </p>
        {[0, 1, 2].map((i) => (
          <Card key={i} aria-hidden="true" className="flex flex-col gap-4">
            <div className="h-5 w-40 animate-pulse rounded-md bg-muted" />
            <div className="h-11 w-full animate-pulse rounded-xl bg-muted" />
            <div className="h-11 w-full animate-pulse rounded-xl bg-muted" />
          </Card>
        ))}
      </div>
    )
  } else {
    const { account } = state
    body = (
      <ProfileSettings
        defaultValues={{ fullName: account.name, email: account.email, signLanguage: account.signLanguage, hearingStatus: account.hearingStatus }}
        displayName={account.name || account.email}
        initialAvatarUrl={account.avatarUrl}
        hasPassword={account.hasPassword}
        onSavePersonalInfo={savePersonalInfo}
        onUpdatePassword={updatePassword}
        onUploadAvatar={uploadAvatar}
        onRemoveAvatar={removeAvatar}
        // Sign out only applies to a real signed-in session; the local profile has none.
        onSignedOut={user ? () => router.push(APP_ROUTES.home) : undefined}
        onDeleteAccount={deleteAccount}
      />
    )
  }

  return (
    <>
      {/* The identity card above already holds the page's h1. */}
      <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">{t.profile.page.title}</h2>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{t.profile.page.subtitle}</p>
      <div className="mt-8">{body}</div>
    </>
  )
}
