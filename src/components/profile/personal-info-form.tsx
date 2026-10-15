'use client'

import { useId, useState, type SubmitEvent } from 'react'
import { Check, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { FieldError } from '@/components/shared/field-error'
import { EMAIL_PATTERN } from '@/lib/validation'
import { cn } from '@/lib/utils'
import { useI18n } from '@/i18n/use-i18n'
import { ApiError } from './api-error'

const SIGN_LANGUAGE_VALUES = ['', 'arsl', 'asl', 'bsl', 'isl', 'lsf', 'dgs', 'other'] as const
export const HEARING_STATUS_VALUES = ['deaf', 'hardOfHearing', 'hearing'] as const

export interface PersonalInfoValues {
  fullName: string
  email: string
  signLanguage: string
  /** One of HEARING_STATUS_VALUES, or '' when not answered yet. */
  hearingStatus: string
}

export interface PersonalInfoFormProps {
  defaultValues?: Partial<PersonalInfoValues>
  /** Receives only the changed fields. May resolve to the saved account; throws `ApiError` on failure. */
  onSave?: (changes: Partial<PersonalInfoValues>) => Promise<unknown>
}

interface PersonalInfoErrors {
  fullName?: string
  email?: string
}

type SubmitStatus = 'idle' | 'submitting' | 'success'

function normalize(values: PersonalInfoValues): PersonalInfoValues {
  return {
    fullName: values.fullName.trim(),
    email: values.email.trim(),
    signLanguage: values.signLanguage,
    hearingStatus: values.hearingStatus,
  }
}

function diff(current: PersonalInfoValues, saved: PersonalInfoValues): Partial<PersonalInfoValues> {
  const a = normalize(current)
  const b = normalize(saved)
  const changes: Partial<PersonalInfoValues> = {}
  if (a.fullName !== b.fullName) changes.fullName = a.fullName
  if (a.email.toLowerCase() !== b.email.toLowerCase()) changes.email = a.email
  if (a.signLanguage !== b.signLanguage) changes.signLanguage = a.signLanguage
  if (a.hearingStatus !== b.hearingStatus) changes.hearingStatus = a.hearingStatus
  return changes
}

export function PersonalInfoForm({ defaultValues, onSave }: PersonalInfoFormProps) {
  const { t } = useI18n()
  const m = t.profile.personal
  const idPrefix = useId()
  const initial: PersonalInfoValues = {
    fullName: defaultValues?.fullName ?? '',
    email: defaultValues?.email ?? '',
    signLanguage: defaultValues?.signLanguage ?? '',
    hearingStatus: defaultValues?.hearingStatus ?? '',
  }
  const [saved, setSaved] = useState<PersonalInfoValues>(initial)
  const [values, setValues] = useState<PersonalInfoValues>(initial)
  const [errors, setErrors] = useState<PersonalInfoErrors>({})
  const [formError, setFormError] = useState<string>()
  const [status, setStatus] = useState<SubmitStatus>('idle')

  const changes = diff(values, saved)
  const isDirty = Object.keys(changes).length > 0
  const submitting = status === 'submitting'

  // Keep an unknown stored value selectable instead of silently showing the first option.
  const signLanguageValues: string[] = SIGN_LANGUAGE_VALUES.includes(
    values.signLanguage as (typeof SIGN_LANGUAGE_VALUES)[number],
  )
    ? [...SIGN_LANGUAGE_VALUES]
    : [...SIGN_LANGUAGE_VALUES, values.signLanguage]

  function signLanguageLabel(value: string) {
    if (value === '') return t.profile.signLanguages.none
    const labels = t.profile.signLanguages as Record<string, string>
    return labels[value] ?? value
  }

  function setField<K extends keyof PersonalInfoValues>(key: K, value: PersonalInfoValues[K]) {
    setValues((v) => ({ ...v, [key]: value }))
    if (status === 'success') setStatus('idle')
    setFormError(undefined)
    if (key === 'fullName' || key === 'email') setErrors((e) => ({ ...e, [key]: undefined }))
  }

  function validate(current: PersonalInfoValues): PersonalInfoErrors {
    const next: PersonalInfoErrors = {}
    if (!current.fullName.trim()) next.fullName = m.nameRequired
    if (!current.email.trim()) {
      next.email = m.emailRequired
    } else if (!EMAIL_PATTERN.test(current.email.trim())) {
      next.email = m.emailInvalid
    }
    return next
  }

  function applyServerError(error: unknown) {
    if (error instanceof ApiError) {
      if (error.status === 409) return setErrors({ email: m.emailInUse })
      if (error.status === 401) return setFormError(m.sessionExpired)
      if (error.status === 400) {
        // Known server validation messages map onto translated field errors.
        if (error.message === 'Enter your full name.') return setErrors({ fullName: m.nameRequired })
        if (error.message === 'Enter a valid email address.') return setErrors({ email: m.emailInvalid })
        return setFormError(error.message || t.common.errors.generic)
      }
      if (error.status === 0) return setFormError(t.common.errors.network)
    }
    setFormError(t.common.errors.generic)
  }

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    setFormError(undefined)
    const nextErrors = validate(values)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return
    if (!isDirty) return

    setStatus('submitting')
    try {
      const result = (await onSave?.(changes)) as
        | Partial<{ name: string; email: string; signLanguage: string; hearingStatus: string }>
        | undefined
      const next = normalize(values)
      const savedValues: PersonalInfoValues = {
        fullName: result?.name ?? next.fullName,
        email: result?.email ?? next.email,
        signLanguage: result?.signLanguage ?? next.signLanguage,
        hearingStatus: result?.hearingStatus ?? next.hearingStatus,
      }
      setSaved(savedValues)
      setValues(savedValues)
      setStatus('success')
    } catch (error) {
      setStatus('idle')
      applyServerError(error)
    }
  }

  return (
    <Card>
      <section aria-labelledby={`${idPrefix}-heading`} className="flex flex-col gap-4">
        <h2 id={`${idPrefix}-heading`} className="text-lg font-semibold text-foreground">
          {m.heading}
        </h2>

        <form onSubmit={handleSubmit} noValidate>
          <fieldset className="flex flex-col gap-4" disabled={submitting} aria-busy={submitting}>
            <legend className="sr-only">{m.legend}</legend>

            <div id="profile-field-name" className="flex scroll-mt-28 flex-col gap-1.5">
              <label htmlFor={`${idPrefix}-name`} className="text-sm font-medium">
                {m.fullName}
              </label>
              <Input
                id={`${idPrefix}-name`}
                name="fullName"
                type="text"
                autoComplete="name"
                required
                value={values.fullName}
                onChange={(event) => setField('fullName', event.target.value)}
                aria-invalid={Boolean(errors.fullName) || undefined}
                aria-describedby={errors.fullName ? `${idPrefix}-name-error` : undefined}
              />
              <FieldError id={`${idPrefix}-name-error`} message={errors.fullName} />
            </div>

            <div id="profile-field-email" className="flex scroll-mt-28 flex-col gap-1.5">
              <label htmlFor={`${idPrefix}-email`} className="text-sm font-medium">
                {m.email}
              </label>
              <Input
                id={`${idPrefix}-email`}
                name="email"
                type="email"
                dir="ltr"
                autoComplete="email"
                required
                value={values.email}
                onChange={(event) => setField('email', event.target.value)}
                aria-invalid={Boolean(errors.email) || undefined}
                aria-describedby={errors.email ? `${idPrefix}-email-error` : undefined}
                className="text-start rtl:text-end"
              />
              <FieldError id={`${idPrefix}-email-error`} message={errors.email} />
            </div>

            <fieldset id="profile-field-hearing" className="flex scroll-mt-28 flex-col gap-2">
              <legend className="mb-1.5 text-sm font-medium">{m.hearingStatus}</legend>
              <div className="grid gap-2 sm:grid-cols-3">
                {HEARING_STATUS_VALUES.map((value) => {
                  const selected = values.hearingStatus === value
                  return (
                    <label
                      key={value}
                      className={cn(
                        'flex min-h-11 cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition-colors',
                        'has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-card',
                        selected ? 'border-primary bg-primary/10 text-primary' : 'border-border text-foreground hover:bg-muted',
                      )}
                    >
                      <input
                        type="radio"
                        name="hearingStatus"
                        value={value}
                        checked={selected}
                        onChange={() => setField('hearingStatus', value)}
                        className="sr-only"
                      />
                      {selected ? <Check className="size-4 shrink-0" aria-hidden="true" /> : null}
                      {m.hearingOptions[value]}
                    </label>
                  )
                })}
              </div>
            </fieldset>

            <div id="profile-field-sign-language" className="flex scroll-mt-28 flex-col gap-1.5">
              <label htmlFor={`${idPrefix}-sign-language`} className="text-sm font-medium">
                {m.signLanguage}
              </label>
              <select
                id={`${idPrefix}-sign-language`}
                name="signLanguage"
                value={values.signLanguage}
                onChange={(event) => setField('signLanguage', event.target.value)}
                className="flex h-11 w-full rounded-xl border border-input bg-background px-4 text-sm text-foreground shadow-sm focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:outline-none"
              >
                {signLanguageValues.map((value) => (
                  <option key={value} value={value}>
                    {signLanguageLabel(value)}
                  </option>
                ))}
              </select>
            </div>

            {formError ? (
              <p role="alert" className="rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {formError}
              </p>
            ) : null}

            <div className="mt-2 flex flex-wrap items-center gap-3">
              <Button type="submit" className="h-10 px-4" disabled={!isDirty || submitting}>
                {submitting ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : null}
                {submitting ? m.saving : m.save}
              </Button>
              <p
                role="status"
                aria-live="polite"
                className={status === 'success' ? 'text-sm font-medium text-emerald-700 dark:text-emerald-400' : 'text-sm text-muted-foreground'}
              >
                {status === 'success' ? m.saved : !isDirty && !submitting ? m.noChanges : ''}
              </p>
            </div>
          </fieldset>
        </form>
      </section>
    </Card>
  )
}
