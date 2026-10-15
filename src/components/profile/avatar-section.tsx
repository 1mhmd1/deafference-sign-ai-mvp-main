'use client'

import { useEffect, useId, useRef, useState, type ChangeEvent } from 'react'
import { Loader2, Trash2, Upload, UserCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useI18n } from '@/i18n/use-i18n'
import { ApiError } from './api-error'

export const ACCEPTED_AVATAR_TYPES = ['image/png', 'image/jpeg']
/** Mirrors the server limit in /api/account/avatar (data URL ≤ 700,000 chars ≈ 500 KB image). */
const MAX_DATA_URL_LENGTH = 700_000

function estimatedDataUrlLength(file: File) {
  return Math.ceil(file.size / 3) * 4 + `data:${file.type};base64,`.length
}

/** Client-side check before uploading; returns the problem (a `t.profile.avatar` key) or null. */
export function validateAvatarFile(file: File): 'invalidType' | 'tooLarge' | null {
  if (!ACCEPTED_AVATAR_TYPES.includes(file.type)) return 'invalidType'
  if (estimatedDataUrlLength(file) > MAX_DATA_URL_LENGTH) return 'tooLarge'
  return null
}

export interface AvatarSectionProps {
  displayName?: string
  initialAvatarUrl?: string | null
  /** Uploads the file; may resolve to the persisted image URL. Throws on failure. */
  onUpload?: (file: File) => Promise<string | void>
  /** Removes the saved picture. Throws on failure. */
  onRemove?: () => Promise<void>
}

type Busy = 'uploading' | 'removing' | null

export function AvatarSection({ displayName, initialAvatarUrl, onUpload, onRemove }: AvatarSectionProps) {
  const { t, fmt } = useI18n()
  const m = t.profile.avatar
  const idPrefix = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const [savedUrl, setSavedUrl] = useState<string | null>(initialAvatarUrl ?? null)
  const [pendingUrl, setPendingUrl] = useState<string | null>(null)
  const [busy, setBusy] = useState<Busy>(null)
  const [error, setError] = useState<string>()
  const [success, setSuccess] = useState<string>()

  // The picture can also change from the profile header's camera button.
  useEffect(() => {
    setSavedUrl(initialAvatarUrl ?? null)
  }, [initialAvatarUrl])

  // Revoke the temporary preview object URL when it's replaced or the section unmounts.
  useEffect(() => {
    return () => {
      if (pendingUrl) URL.revokeObjectURL(pendingUrl)
    }
  }, [pendingUrl])

  const displayUrl = pendingUrl ?? savedUrl

  function uploadErrorMessage(err: unknown) {
    if (err instanceof ApiError) {
      if (err.status === 0) return t.common.errors.network
      if (err.status === 400) return /too large/i.test(err.message) ? m.tooLarge : m.invalidType
    }
    return m.uploadFailed
  }

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    setSuccess(undefined)
    const problem = validateAvatarFile(file)
    if (problem) {
      setError(m[problem])
      return
    }

    setError(undefined)
    setPendingUrl(URL.createObjectURL(file))
    setBusy('uploading')
    try {
      const persistedUrl = await onUpload?.(file)
      if (persistedUrl) setSavedUrl(persistedUrl)
      setSuccess(m.uploaded)
    } catch (err) {
      // Roll back to the previous picture — the preview was never saved.
      setError(uploadErrorMessage(err))
    } finally {
      setPendingUrl(null)
      setBusy(null)
    }
  }

  async function handleRemove() {
    setError(undefined)
    setSuccess(undefined)
    setBusy('removing')
    try {
      await onRemove?.()
      setSavedUrl(null)
      setSuccess(m.removed)
    } catch (err) {
      setError(err instanceof ApiError && err.status === 0 ? t.common.errors.network : m.removeFailed)
    } finally {
      setBusy(null)
    }
  }

  const alt = pendingUrl ? '' : displayName ? fmt(m.altSaved, { name: displayName }) : m.altFallback

  return (
    <Card id="profile-field-photo" className="scroll-mt-28">
      <section aria-labelledby={`${idPrefix}-heading`} className="flex flex-col gap-4">
        <h2 id={`${idPrefix}-heading`} className="text-lg font-semibold text-foreground">
          {m.heading}
        </h2>

        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <div
            className="relative flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-muted text-muted-foreground"
            aria-busy={busy !== null}
          >
            {displayUrl ? (
              <img src={displayUrl} alt={alt} className="size-full object-cover" />
            ) : (
              <UserCircle2 className="size-10" role="img" aria-label={m.noPhoto} />
            )}
            {busy ? (
              <span className="absolute inset-0 flex items-center justify-center bg-background/60" aria-hidden="true">
                <Loader2 className="size-6 animate-spin text-foreground" />
              </span>
            ) : null}
          </div>

          <div className="flex flex-1 flex-col gap-2">
            <input
              ref={inputRef}
              id={`${idPrefix}-file`}
              name="avatar"
              type="file"
              accept={ACCEPTED_AVATAR_TYPES.join(',')}
              onChange={handleFileChange}
              className="sr-only"
              tabIndex={-1}
              aria-hidden="true"
            />
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                className="h-10 px-4"
                disabled={busy !== null}
                aria-describedby={[`${idPrefix}-hint`, error && `${idPrefix}-error`].filter(Boolean).join(' ')}
                onClick={() => inputRef.current?.click()}
              >
                {busy === 'uploading' ? (
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                ) : (
                  <Upload className="size-4" aria-hidden="true" />
                )}
                {busy === 'uploading' ? m.uploading : savedUrl ? m.change : m.choose}
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="h-10 px-4 text-destructive hover:text-destructive"
                disabled={!savedUrl || busy !== null}
                onClick={handleRemove}
              >
                {busy === 'removing' ? (
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                ) : (
                  <Trash2 className="size-4" aria-hidden="true" />
                )}
                {busy === 'removing' ? m.removing : m.remove}
              </Button>
            </div>
            <p id={`${idPrefix}-hint`} className="text-xs text-muted-foreground">
              {m.hint}
            </p>
            {error ? (
              <p id={`${idPrefix}-error`} role="alert" className="text-sm font-medium text-destructive">
                {error}
              </p>
            ) : null}
            <p role="status" aria-live="polite" className="text-sm font-medium text-emerald-700 empty:hidden dark:text-emerald-400">
              {success}
            </p>
          </div>
        </div>
      </section>
    </Card>
  )
}
