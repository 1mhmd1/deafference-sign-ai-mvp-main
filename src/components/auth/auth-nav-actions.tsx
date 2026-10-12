"use client"

import { useState } from "react"
import Link from "next/link"
import { ShieldCheck, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { APP_ROUTES } from "@/lib/constants"
import { cn } from "@/lib/utils"
import { useI18n } from "@/i18n/use-i18n"
import { useAuth } from "./auth-provider"
import { LogoutConfirmDialog } from "./logout-confirm-dialog"

export function initialsFor(name: string, email: string) {
  const source = name.trim() || email
  const parts = source.split(/\s+/).filter(Boolean)
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
  return source.slice(0, 2).toUpperCase()
}

/** Login/Signup buttons for guests, or an account chip + sign out for signed-in users. Drop into any header's top-right slot. */
export function AuthNavActions({
  className,
  hideAccount = false,
}: {
  className?: string
  /** Leave out the account chip (for headers that render their own profile icon). */
  hideAccount?: boolean
}) {
  const { user, role } = useAuth()
  const { t } = useI18n()
  const [confirmOpen, setConfirmOpen] = useState(false)

  if (!user) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <Button
          variant="ghost"
          size="sm"
          className="h-10 px-3"
          nativeButton={false}
          render={<Link href={APP_ROUTES.login}>{t.auth.nav.login}</Link>}
        />
        <Button
          size="sm"
          className="h-10 px-3"
          nativeButton={false}
          render={<Link href={APP_ROUTES.signup}>{t.auth.nav.signup}</Link>}
        />
      </div>
    )
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {hideAccount ? null : (
        <Link
          href={APP_ROUTES.profile}
          aria-label={`${user.name || user.email}, ${t.auth.nav.account}`}
          className="flex min-h-10 items-center gap-2 rounded-full border border-border bg-background py-1 ps-1 pe-3 text-sm transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <span
            aria-hidden="true"
            className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary"
          >
            {initialsFor(user.name, user.email)}
          </span>
          <span className="hidden font-medium text-foreground sm:inline">{user.name || user.email}</span>
          {role === "admin" ? (
            <Badge className="hidden gap-1 border-primary/30 bg-primary/10 py-0.5 text-primary sm:inline-flex">
              <ShieldCheck className="size-3" aria-hidden="true" />
              {t.auth.nav.admin}
            </Badge>
          ) : null}
        </Link>
      )}
      <Button
        variant="ghost"
        size="icon"
        className="size-10"
        aria-label={t.common.logout.trigger}
        title={t.common.logout.trigger}
        aria-haspopup="dialog"
        onClick={() => setConfirmOpen(true)}
      >
        <LogOut className="size-4 rtl:-scale-x-100" aria-hidden="true" />
      </Button>
      <LogoutConfirmDialog open={confirmOpen} onOpenChange={setConfirmOpen} />
    </div>
  )
}
