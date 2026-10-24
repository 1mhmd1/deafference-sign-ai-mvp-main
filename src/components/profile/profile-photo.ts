"use client"

import { useSyncExternalStore } from "react"

/** Where the /profile page keeps the account (incl. the photo) in this browser; see account-context.tsx. */
export const PROFILE_STORAGE_KEY = "deafference.profile"

/** Fired in this tab when the saved profile changes (the `storage` event covers other tabs). */
const PROFILE_CHANGED_EVENT = "deafference:profile-changed"

export function notifyProfileChanged() {
  window.dispatchEvent(new Event(PROFILE_CHANGED_EVENT))
}

function readPhoto(): string | null {
  try {
    const raw = window.localStorage.getItem(PROFILE_STORAGE_KEY)
    if (!raw) return null
    const url = (JSON.parse(raw) as { avatarUrl?: unknown }).avatarUrl
    return typeof url === "string" && url ? url : null
  } catch {
    return null
  }
}

function subscribe(onChange: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key === null || event.key === PROFILE_STORAGE_KEY) onChange()
  }
  window.addEventListener(PROFILE_CHANGED_EVENT, onChange)
  window.addEventListener("storage", onStorage)
  return () => {
    window.removeEventListener(PROFILE_CHANGED_EVENT, onChange)
    window.removeEventListener("storage", onStorage)
  }
}

/**
 * The profile picture saved on /profile (a data URL), or null. Updates live when it's changed or
 * removed, in this tab or another. Always null during server rendering.
 */
export function useProfilePhoto(): string | null {
  return useSyncExternalStore(subscribe, readPhoto, () => null)
}
