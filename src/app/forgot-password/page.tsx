import type { Metadata } from "next"
import { AuthShell } from "@/components/auth/auth-shell"
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form"

export const metadata: Metadata = {
  title: "Reset your password",
  robots: { index: false },
  description: "Request a password reset link for your Deafference account.",
}

export default function ForgotPasswordPage() {
  return (
    <main>
      <AuthShell>
        <ForgotPasswordForm />
      </AuthShell>
    </main>
  )
}
