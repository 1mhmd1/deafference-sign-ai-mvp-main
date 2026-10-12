"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { OTPInput } from "@/components/auth/otp-input"
import { OTPTimer } from "@/components/auth/otp-timer"
import { ErrorAlert } from "@/components/auth/error-alert"
import { ClockIcon, MailIcon } from "@/components/landing/icons"
import styles from "./verify.module.css"

export default function VerifyPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get("email") || ""

  const [otp, setOTP] = useState("")
  const [error, setError] = useState("")
  const [errorType, setErrorType] = useState<"invalid" | "expired" | "network" | "generic">("generic")
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [codeExpired, setCodeExpired] = useState(false)
  const [attemptCount, setAttemptCount] = useState(0)

  // Demo: auto-fill OTP for testing (remove in production)
  useEffect(() => {
    const demoOTP = localStorage.getItem("demo-otp")
    if (demoOTP && !otp) setOTP(demoOTP)
  }, [otp])

  const handleSubmit = async (code: string) => {
    setError("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      })

      const data = await response.json()

      if (!response.ok) {
        const newAttempts = attemptCount + 1
        setAttemptCount(newAttempts)

        if (response.status === 401) {
          setErrorType("invalid")
          setError(newAttempts >= 3 ? "Too many incorrect attempts. Request a new code." : "The code you entered is incorrect. Please try again.")
        } else if (response.status === 410) {
          setErrorType("expired")
          setError("This code has expired. A new code has been sent to your email.")
          setCodeExpired(true)
        } else if (response.status === 429) {
          setErrorType("expired")
          setError("You've made too many attempts. Please request a new code.")
          setCodeExpired(true)
        } else {
          setErrorType("generic")
          setError(data.error || "Verification failed. Please try again.")
        }
        return
      }

      router.push("/dashboard")
    } catch (error) {
      setErrorType("network")
      setError("Network error. Please check your connection and try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResend = async () => {
    setError("")
    setCodeExpired(false)
    setOTP("")
    setAttemptCount(0)
    setIsResending(true)

    try {
      const response = await fetch("/api/auth/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()
      if (!response.ok) {
        if (response.status === 429) {
          setErrorType("expired")
          setError("Too many requests. Please wait before requesting a new code.")
        } else {
          setErrorType("generic")
          setError(data.error || "Failed to send a new code. Please try again.")
        }
      } else {
        setError("")
      }
    } catch (error) {
      setErrorType("network")
      setError("Network error. Please check your connection and try again.")
    } finally {
      setIsResending(false)
    }
  }

  // Auto-submit when all 6 digits filled
  useEffect(() => {
    if (otp.length === 6 && !isLoading && !codeExpired) {
      handleSubmit(otp)
    }
  }, [otp, isLoading, codeExpired])

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>Verify your email</h1>
          <p className={styles.description}>
            We sent a 6-digit code to <span className={styles.emailHighlight}>{email}</span>. Enter it below to continue.
          </p>
        </div>

        {error && (
          <ErrorAlert
            message={error}
            type={errorType === "expired" || errorType === "network" ? "warning" : "error"}
            icon={
              errorType === "expired" ? (
                <ClockIcon size={18} />
              ) : undefined
            }
            action={errorType === "expired" || attemptCount >= 3 ? {
              label: "Request new code",
              onClick: handleResend,
            } : undefined}
          />
        )}

        <OTPInput
          value={otp}
          onChange={(val) => {
            setOTP(val)
            if (error) setError("")
          }}
          onComplete={handleSubmit}
          isLoading={isLoading || isResending}
          error={codeExpired ? "Code expired" : ""}
          autoFocus={true}
          disabled={codeExpired && !isResending}
        />

        <OTPTimer
          initialSeconds={60}
          onExpire={() => setCodeExpired(true)}
          onResendClick={handleResend}
        />

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.backLink}
            onClick={() => router.back()}
          >
            ← Change email
          </button>
        </div>

        <div className={styles.helpText}>
          <p>
            <strong>Check your spam folder</strong> if you don't see the code in a few minutes.
          </p>
        </div>
      </div>

      {/* Demo notice */}
      <div className={styles.demo}>
        <p>
          <strong>Demo mode:</strong> Check your browser's localStorage for a demo OTP code. In production, codes are sent via email only.
        </p>
      </div>
    </div>
  )
}
