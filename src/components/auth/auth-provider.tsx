"use client"

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import type { SessionRole } from "@/lib/auth/session"
import type { SignInValues, SignUpValues } from "./auth-form"

export interface AuthUser {
  name: string
  email: string
  role: Exclude<SessionRole, "guest">
}

interface AuthApiError {
  error?: string
}

export interface AuthContextValue {
  role: SessionRole
  user: AuthUser | null
  /** Dev-only: flips the signed-in account's own role via the backend. No-ops (and hidden) in production. */
  setRole: (role: Exclude<SessionRole, "guest">) => Promise<void>
  /** Calls POST /api/auth/login. Throws an Error with a user-facing message on failure. */
  signIn: (values: SignInValues) => Promise<void>
  /** Calls POST /api/auth/signup. Throws an Error with a user-facing message on failure. */
  signUp: (values: SignUpValues) => Promise<void>
  signOut: () => Promise<void>
  /** Mirrors a profile edit (name/email) the server already saved, so the nav updates without a reload. */
  updateUser: (patch: Partial<Pick<AuthUser, "name" | "email">>) => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

/**
 * Thrown by auth requests. `status` is the HTTP status (0 when the request never
 * reached the server, e.g. offline) so the UI can show a translated message;
 * `message` keeps the server's (English) error text as a fallback.
 */
export class AuthRequestError extends Error {
  readonly status: number
  constructor(message: string, status: number) {
    super(message)
    this.name = "AuthRequestError"
    this.status = status
  }
}

async function postJson(url: string, body: unknown) {
  let response: Response
  try {
    response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
  } catch {
    throw new AuthRequestError("Network request failed.", 0)
  }
  const data = (await response.json().catch(() => ({}))) as AuthApiError & { user?: AuthUser }
  if (!response.ok) {
    throw new AuthRequestError(data.error ?? "Something went wrong. Please try again.", response.status)
  }
  return data
}

export function AuthProvider({ initialUser, children }: { initialUser: AuthUser | null; children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(initialUser)
  const router = useRouter()

  const signIn = useCallback(
    async (values: SignInValues) => {
      const data = await postJson("/api/auth/login", values)
      if (data.user) setUser(data.user)
      router.refresh()
    },
    [router],
  )

  const signUp = useCallback(
    async (values: SignUpValues) => {
      const data = await postJson("/api/auth/signup", {
        fullName: values.fullName,
        email: values.email,
        password: values.password,
      })
      if (data.user) setUser(data.user)
      router.refresh()
    },
    [router],
  )

  const signOut = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    setUser(null)
    router.refresh()
  }, [router])

  const setRole = useCallback(
    async (role: Exclude<SessionRole, "guest">) => {
      if (process.env.NODE_ENV === "production") return
      const data = await postJson("/api/auth/dev-role", { role })
      if (data.user) setUser(data.user)
      router.refresh()
    },
    [router],
  )

  const updateUser = useCallback((patch: Partial<Pick<AuthUser, "name" | "email">>) => {
    setUser((current) => (current ? { ...current, ...patch } : current))
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      role: user?.role ?? "guest",
      user,
      setRole,
      signIn,
      signUp,
      signOut,
      updateUser,
    }),
    [user, setRole, signIn, signUp, signOut, updateUser],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider")
  return ctx
}
