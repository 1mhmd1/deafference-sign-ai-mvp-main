"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth/auth-provider"
import { APP_ROUTES } from "@/lib/constants"
import { ApiError } from "./api-error"
import type { PersonalInfoValues } from "./personal-info-form"
import type { PasswordChangeValues } from "./security-form"

export interface AccountData {
  name: string
  email: string
  signLanguage: string
  hearingStatus: string
  avatarUrl: string | null
  /** True once a profile password has been set on this device. */
  hasPassword: boolean
}

export type AccountState = { kind: "loading" } | { kind: "loaded"; account: AccountData }

interface AccountContextValue {
  state: AccountState
  savePersonalInfo: (changes: Partial<PersonalInfoValues>) => Promise<AccountData>
  updatePassword: (values: PasswordChangeValues) => Promise<void>
  uploadAvatar: (file: File) => Promise<string>
  removeAvatar: () => Promise<void>
  deleteAccount: () => Promise<void>
}

/** What's kept in localStorage. The password is stored only as a SHA-256 hash. */
interface StoredProfile {
  name: string
  email: string
  signLanguage: string
  hearingStatus: string
  avatarUrl: string | null
  passwordHash: string | null
}

const STORAGE_KEY = "deafference.profile"
const EMPTY_PROFILE: StoredProfile = {
  name: "",
  email: "",
  signLanguage: "",
  hearingStatus: "",
  avatarUrl: null,
  passwordHash: null,
}

function readProfile(): StoredProfile {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? { ...EMPTY_PROFILE, ...(JSON.parse(raw) as Partial<StoredProfile>) } : EMPTY_PROFILE
  } catch {
    return EMPTY_PROFILE
  }
}

/** Throws when the browser refuses (private mode, storage full — e.g. a big photo). */
function writeProfile(profile: StoredProfile) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile))
  } catch {
    throw new ApiError("Could not save on this device.", 500)
  }
}

function toAccount(profile: StoredProfile): AccountData {
  return {
    name: profile.name,
    email: profile.email,
    signLanguage: profile.signLanguage,
    hearingStatus: profile.hearingStatus,
    avatarUrl: profile.avatarUrl,
    hasPassword: Boolean(profile.passwordHash),
  }
}

async function hashPassword(password: string) {
  const bytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(password))
  return Array.from(new Uint8Array(bytes), (b) => b.toString(16).padStart(2, "0")).join("")
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(reader.error ?? new Error("Could not read file."))
    reader.readAsDataURL(file)
  })
}

export const COMPLETION_ITEMS = ["photo", "name", "email", "hearing", "signLanguage", "password"] as const
export type CompletionItem = (typeof COMPLETION_ITEMS)[number]

/** Which profile items are filled in, and the share done (0–100). */
export function profileCompletion(account: AccountData) {
  const done: Record<CompletionItem, boolean> = {
    photo: Boolean(account.avatarUrl),
    name: Boolean(account.name.trim()),
    email: Boolean(account.email.trim()),
    hearing: Boolean(account.hearingStatus),
    signLanguage: Boolean(account.signLanguage),
    password: account.hasPassword,
  }
  const count = COMPLETION_ITEMS.filter((item) => done[item]).length
  return { done, percent: Math.round((count / COMPLETION_ITEMS.length) * 100) }
}

const AccountContext = createContext<AccountContextValue | null>(null)

/**
 * The /profile page's account, kept in this browser (no server): the identity card and the
 * edit forms share one copy and update together. Errors are thrown as `ApiError` so the forms'
 * existing error handling applies (401 = wrong current password).
 */
export function AccountProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const { updateUser } = useAuth()
  const [state, setState] = useState<AccountState>({ kind: "loading" })

  // localStorage only exists in the browser, so read it after mount.
  useEffect(() => {
    setState({ kind: "loaded", account: toAccount(readProfile()) })
  }, [])

  const commit = useCallback((patch: Partial<StoredProfile>) => {
    const next = { ...readProfile(), ...patch }
    writeProfile(next)
    setState({ kind: "loaded", account: toAccount(next) })
    return next
  }, [])

  const value = useMemo<AccountContextValue>(
    () => ({
      state,
      async savePersonalInfo(changes) {
        const next = commit({
          ...(changes.fullName !== undefined ? { name: changes.fullName.trim() } : {}),
          ...(changes.email !== undefined ? { email: changes.email.trim().toLowerCase() } : {}),
          ...(changes.signLanguage !== undefined ? { signLanguage: changes.signLanguage } : {}),
          ...(changes.hearingStatus !== undefined ? { hearingStatus: changes.hearingStatus } : {}),
        })
        updateUser({ name: next.name, email: next.email })
        return toAccount(next)
      },
      async updatePassword(values) {
        const current = readProfile()
        if (current.passwordHash && (await hashPassword(values.currentPassword)) !== current.passwordHash) {
          throw new ApiError("Current password is incorrect.", 401)
        }
        commit({ passwordHash: await hashPassword(values.newPassword) })
      },
      async uploadAvatar(file) {
        const dataUrl = await fileToDataUrl(file)
        commit({ avatarUrl: dataUrl })
        return dataUrl
      },
      async removeAvatar() {
        commit({ avatarUrl: null })
      },
      async deleteAccount() {
        try {
          window.localStorage.removeItem(STORAGE_KEY)
        } catch {
          // Nothing stored to remove.
        }
        setState({ kind: "loaded", account: toAccount(EMPTY_PROFILE) })
        router.push(APP_ROUTES.home)
      },
    }),
    [state, commit, updateUser, router],
  )

  return <AccountContext.Provider value={value}>{children}</AccountContext.Provider>
}

export function useAccount() {
  const ctx = useContext(AccountContext)
  if (!ctx) throw new Error("useAccount must be used within an AccountProvider")
  return ctx
}
