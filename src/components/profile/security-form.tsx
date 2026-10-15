'use client'

import { useId, useMemo, useState, type SubmitEvent } from 'react'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { FieldError } from '@/components/shared/field-error'
import { PasswordField } from '@/components/shared/password-field'
import { MIN_PASSWORD_LENGTH, getPasswordStrength } from '@/lib/validation'
import { useI18n } from '@/i18n/use-i18n'
import { ApiError } from './api-error'

export interface PasswordChangeValues {
  currentPassword: string
  newPassword: string
  confirmNewPassword: string
}

export interface SecurityFormProps {
  /** Throws `ApiError` on failure. */
  onUpdatePassword?: (values: PasswordChangeValues) => Promise<void>
  /** False when no password is set yet: the current-password field is hidden and the form sets one. */
  hasPassword?: boolean
}

interface PasswordChangeErrors {
  currentPassword?: string
  newPassword?: string
  confirmNewPassword?: string
}

type SubmitStatus = 'idle' | 'submitting' | 'success'

const initialValues: PasswordChangeValues = {
  currentPassword: '',
  newPassword: '',
  confirmNewPassword: '',
}

export function SecurityForm({ onUpdatePassword, hasPassword = true }: SecurityFormProps) {
  const { t, fmt } = useI18n()
  const m = t.profile.security
  const idPrefix = useId()
  const [values, setValues] = useState<PasswordChangeValues>(initialValues)
  const [errors, setErrors] = useState<PasswordChangeErrors>({})
  const [formError, setFormError] = useState<string>()
  const [status, setStatus] = useState<SubmitStatus>('idle')

  const strength = useMemo(() => getPasswordStrength(values.newPassword), [values.newPassword])
  const submitting = status === 'submitting'
  const minVars = { min: MIN_PASSWORD_LENGTH }

  function setField(key: keyof PasswordChangeValues, value: string) {
    setValues((v) => ({ ...v, [key]: value }))
    setErrors((e) => ({ ...e, [key]: undefined }))
    setFormError(undefined)
    if (status === 'success') setStatus('idle')
  }

  function validate(current: PasswordChangeValues): PasswordChangeErrors {
    const next: PasswordChangeErrors = {}
    if (hasPassword && !current.currentPassword) next.currentPassword = m.currentRequired
    if (!current.newPassword) {
      next.newPassword = m.newRequired
    } else if (current.newPassword.length < MIN_PASSWORD_LENGTH) {
      next.newPassword = fmt(m.tooShort, minVars)
    }
    if (!current.confirmNewPassword) {
      next.confirmNewPassword = m.confirmRequired
    } else if (current.confirmNewPassword !== current.newPassword) {
      next.confirmNewPassword = m.mismatch
    }
    return next
  }

  function applyServerError(error: unknown) {
    if (error instanceof ApiError) {
      if (error.status === 401) {
        if (error.message === 'Current password is incorrect.') return setErrors({ currentPassword: m.currentIncorrect })
        return setFormError(t.profile.personal.sessionExpired)
      }
      if (error.status === 404) return setFormError(m.noPassword)
      if (error.status === 400) {
        if (error.message === 'Enter your current password.') return setErrors({ currentPassword: m.currentRequired })
        if (error.message.startsWith('Password must be at least')) return setErrors({ newPassword: fmt(m.tooShort, minVars) })
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

    setStatus('submitting')
    try {
      await onUpdatePassword?.(values)
      setStatus('success')
      setValues(initialValues)
    } catch (error) {
      setStatus('idle')
      applyServerError(error)
    }
  }

  const passwordDescribedBy = [`${idPrefix}-strength`, errors.newPassword && `${idPrefix}-new-error`]
    .filter(Boolean)
    .join(' ')

  return (
    <Card id="profile-field-password" className="scroll-mt-28">
      <section aria-labelledby={`${idPrefix}-heading`} className="flex flex-col gap-4">
        <h2 id={`${idPrefix}-heading`} className="text-lg font-semibold text-foreground">
          {m.heading}
        </h2>

        <form onSubmit={handleSubmit} noValidate>
          <fieldset className="flex flex-col gap-4" disabled={submitting} aria-busy={submitting}>
            <legend className="sr-only">{m.legend}</legend>

            {hasPassword ? (
              <div className="flex flex-col gap-1.5">
                <label htmlFor={`${idPrefix}-current`} className="text-sm font-medium">
                  {m.current}
                </label>
                <PasswordField
                  id={`${idPrefix}-current`}
                  autoComplete="current-password"
                  value={values.currentPassword}
                  onChange={(value) => setField('currentPassword', value)}
                  invalid={Boolean(errors.currentPassword)}
                  describedBy={errors.currentPassword ? `${idPrefix}-current-error` : undefined}
                />
                <FieldError id={`${idPrefix}-current-error`} message={errors.currentPassword} />
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">{m.setFirst}</p>
            )}

            <div className="flex flex-col gap-1.5">
              <label htmlFor={`${idPrefix}-new`} className="text-sm font-medium">
                {m.new}
              </label>
              <PasswordField
                id={`${idPrefix}-new`}
                autoComplete="new-password"
                minLength={MIN_PASSWORD_LENGTH}
                value={values.newPassword}
                onChange={(value) => setField('newPassword', value)}
                invalid={Boolean(errors.newPassword)}
                describedBy={passwordDescribedBy}
              />
              <div className="flex items-center gap-2">
                <meter
                  min={0}
                  max={4}
                  low={2}
                  high={3}
                  optimum={4}
                  value={values.newPassword ? strength.score : 0}
                  className="h-1.5 w-full"
                  aria-hidden="true"
                />
                <span
                  id={`${idPrefix}-strength`}
                  aria-live="polite"
                  className="whitespace-nowrap text-xs text-muted-foreground"
                >
                  {values.newPassword ? (m.strength[strength.score] ?? strength.label) : fmt(m.minHint, minVars)}
                </span>
              </div>
              <FieldError id={`${idPrefix}-new-error`} message={errors.newPassword} />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor={`${idPrefix}-confirm`} className="text-sm font-medium">
                {m.confirm}
              </label>
              <PasswordField
                id={`${idPrefix}-confirm`}
                autoComplete="new-password"
                value={values.confirmNewPassword}
                onChange={(value) => setField('confirmNewPassword', value)}
                invalid={Boolean(errors.confirmNewPassword)}
                describedBy={errors.confirmNewPassword ? `${idPrefix}-confirm-error` : undefined}
              />
              <FieldError id={`${idPrefix}-confirm-error`} message={errors.confirmNewPassword} />
            </div>

            {formError ? (
              <p role="alert" className="rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {formError}
              </p>
            ) : null}

            <div className="mt-2 flex flex-wrap items-center gap-3">
              <Button type="submit" className="h-10 px-4">
                {submitting ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : null}
                {submitting ? m.submitting : hasPassword ? m.submit : m.setSubmit}
              </Button>
              <p role="status" aria-live="polite" className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
                {status === 'success' ? m.success : ''}
              </p>
            </div>
          </fieldset>
        </form>
      </section>
    </Card>
  )
}
