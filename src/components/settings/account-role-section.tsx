"use client"

import { useId, useState } from "react"
import Link from "next/link"
import { ShieldCheck, User as UserIcon, LogOut, ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { APP_ROUTES } from "@/lib/constants"
import { cn } from "@/lib/utils"
import { useAuth } from "@/components/auth/auth-provider"
import { useProfilePhoto } from "@/components/profile/profile-photo"
import { LogoutConfirmDialog } from "@/components/auth/logout-confirm-dialog"
import { useI18n } from "@/i18n/use-i18n"

function initialsFor(name: string, email: string) {
  const source = name.trim() || email
  const parts = source.split(/\s+/).filter(Boolean)
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
  return source.slice(0, 2).toUpperCase()
}

/**
 * Account identity + role. The user's role comes straight from the signed
 * session (issued server-side by /api/auth/*), so this panel — and the
 * admin-only block inside it — reflects real, dynamic access, not a mock.
 */
export function AccountRoleSection() {
  const { user, role } = useAuth()
  const photo = useProfilePhoto()
  const { t } = useI18n()
  const m = t.settings.account
  const idPrefix = useId()
  const [logoutOpen, setLogoutOpen] = useState(false)

  if (!user) {
    return (
      <Card>
        <section aria-labelledby={`${idPrefix}-heading`} className="flex flex-col items-start gap-3">
          <h2 id={`${idPrefix}-heading`} className="text-lg font-semibold text-foreground">
            {m.heading}
          </h2>
          <p className="max-w-md text-sm text-muted-foreground">{m.guestBody}</p>
          <div className="mt-1 flex flex-wrap gap-2">
            <Button
              size="lg"
              className="h-10 px-4"
              nativeButton={false}
              render={<Link href={APP_ROUTES.profile}>{m.signIn}</Link>}
            />
            <Button
              variant="outline"
              size="lg"
              className="h-10 px-4"
              nativeButton={false}
              render={<Link href={APP_ROUTES.profile}>{m.createAccount}</Link>}
            />
          </div>
        </section>
      </Card>
    )
  }

  const isAdmin = role === "admin"

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <section aria-labelledby={`${idPrefix}-heading`} className="flex flex-col gap-5">
          <h2 id={`${idPrefix}-heading`} className="text-lg font-semibold text-foreground">
            {m.heading}
          </h2>

          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex min-w-0 items-center gap-3.5">
              <span
                aria-hidden="true"
                className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/10 text-base font-semibold text-primary"
              >
                {photo ? <img src={photo} alt="" className="size-full object-cover" /> : initialsFor(user.name, user.email)}
              </span>
              <div className="flex min-w-0 flex-col">
                <span className="truncate text-sm font-semibold text-foreground">{user.name || user.email}</span>
                <span dir="ltr" className="truncate text-start text-sm text-muted-foreground rtl:text-end">
                  {user.email}
                </span>
              </div>
            </div>

            <Badge
              className={cn(
                "gap-1.5 py-1.5",
                isAdmin ? "border-primary/30 bg-primary/10 text-primary" : "text-muted-foreground",
              )}
            >
              {isAdmin ? (
                <ShieldCheck className="size-3.5" aria-hidden="true" />
              ) : (
                <UserIcon className="size-3.5" aria-hidden="true" />
              )}
              {isAdmin ? m.admin : m.standard}
            </Badge>
          </div>

          <div className="flex flex-wrap gap-2 border-t border-border pt-4">
            <Button type="button" variant="outline" className="h-10 px-4" onClick={() => setLogoutOpen(true)}>
              <LogOut className="size-4 rtl:-scale-x-100" aria-hidden="true" />
              {t.common.logout.trigger}
            </Button>
          </div>
        </section>
        <LogoutConfirmDialog open={logoutOpen} onOpenChange={setLogoutOpen} />
      </Card>

      {isAdmin ? (
        <Card className="border-primary/25 bg-primary/[0.04]">
          <section aria-labelledby={`${idPrefix}-admin-heading`} className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-primary" aria-hidden="true" />
              <h3 id={`${idPrefix}-admin-heading`} className="text-sm font-semibold text-foreground">
                {m.adminUnlockedTitle}
              </h3>
            </div>
            <p className="max-w-md text-sm text-muted-foreground">{m.adminUnlockedBody}</p>
            <Button
              className="h-10 w-fit px-4"
              nativeButton={false}
              render={
                <Link href={APP_ROUTES.admin}>
                  {m.openAdmin}
                  <ArrowRight className="size-3.5 rtl:-scale-x-100" aria-hidden="true" />
                </Link>
              }
            />
          </section>
        </Card>
      ) : (
        <Card className="border-dashed">
          <section aria-labelledby={`${idPrefix}-locked-heading`} className="flex flex-col gap-1.5">
            <h3 id={`${idPrefix}-locked-heading`} className="text-sm font-semibold text-foreground">
              {m.adminLockedTitle}
            </h3>
            <p className="max-w-md text-sm text-muted-foreground">{m.adminLockedBody}</p>
          </section>
        </Card>
      )}
    </div>
  )
}
