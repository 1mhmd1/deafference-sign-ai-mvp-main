"use client"

import { useRouter } from "next/navigation"
import { AlertTriangle } from "lucide-react"
import { APP_ROUTES } from "@/lib/constants"
import { useI18n } from "@/i18n/use-i18n"
import { AuthShell } from "./auth-shell"
import { AuthForm, type SignInValues, type SignUpValues } from "./auth-form"
import { useAuth } from "./auth-provider"
import { JudyWelcome } from "./judy-welcome"

/** Only allow same-origin, path-relative redirects — never forward to an absolute or protocol-relative URL. */
function sanitizeRedirect(redirectTo: string | undefined) {
  if (!redirectTo || !redirectTo.startsWith("/") || redirectTo.startsWith("//")) return APP_ROUTES.home
  return redirectTo
}

export function AuthFlow({
  defaultMode,
  redirectTo,
  reason,
}: {
  defaultMode?: "signin" | "signup"
  redirectTo?: string
  reason?: string
}) {
  const { signIn, signUp } = useAuth()
  const router = useRouter()
  const { t, fmt } = useI18n()

  async function handleSignIn(values: SignInValues) {
    await signIn(values)
    router.push(sanitizeRedirect(redirectTo))
  }

  async function handleSignUp(values: SignUpValues) {
    await signUp(values)
    router.push(sanitizeRedirect(redirectTo))
  }

  const safeRedirect = redirectTo ? sanitizeRedirect(redirectTo) : null

  return (
    <AuthShell aside={<JudyWelcome mode={defaultMode ?? "signin"} />} backgroundImage="/login.jpg">
      {reason === "auth-required" ? (
        <div
          role="alert"
          className="flex w-full items-start gap-2 rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <p>
            {safeRedirect
              ? fmt(t.auth.authRequired.messageWithRedirect, { path: safeRedirect })
              : t.auth.authRequired.message}
          </p>
        </div>
      ) : null}

      <AuthForm defaultMode={defaultMode} onSignIn={handleSignIn} onSignUp={handleSignUp} />
    </AuthShell>
  )
}
