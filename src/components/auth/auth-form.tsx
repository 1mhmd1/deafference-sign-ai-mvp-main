'use client'

import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent, type SubmitEvent } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Check, Info, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FieldError } from '@/components/shared/field-error'
import { PasswordField } from '@/components/shared/password-field'
import { EMAIL_PATTERN, MIN_PASSWORD_LENGTH, getPasswordStrength } from '@/lib/validation'
import { cn } from '@/lib/utils'
import { useI18n } from '@/i18n/use-i18n'
import { fmt } from '@/i18n/locale'
import { AuthCard } from './auth-shell'
import { AuthRequestError } from './auth-provider'

type AuthMode = 'signin' | 'signup'
type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error'
type Provider = 'google' | 'apple'

export interface SignInValues {
  identifier: string
  password: string
}

export interface SignUpValues {
  fullName: string
  email: string
  password: string
  confirmPassword: string
  agreeToTerms: boolean
}

export interface AuthFormProps {
  /** Which tab is active on first render. Defaults to "signin" per spec. */
  defaultMode?: AuthMode
  onSignIn?: (values: SignInValues) => void | Promise<void>
  onSignUp?: (values: SignUpValues) => void | Promise<void>
  onFederatedAuth?: (provider: Provider, mode: AuthMode) => void | Promise<void>
}

interface SignInErrors {
  identifier?: string
  password?: string
}

interface SignUpErrors {
  fullName?: string
  email?: string
  password?: string
  confirmPassword?: string
  agreeToTerms?: string
}

const PRIMARY_BUTTON_CLASS =
  'mt-2 h-12 w-full justify-center rounded-xl bg-gradient-to-r from-[#2563EB] to-[#3B82F6] text-base font-bold text-white shadow-[0_18px_36px_-14px_rgba(37,99,235,0.55)] hover:-translate-y-0.5 hover:shadow-[0_22px_44px_-14px_rgba(37,99,235,0.65)]'

const SOCIAL_BUTTON_CLASS =
  'h-12 min-w-0 w-full justify-center gap-2.5 sm:flex-1 rounded-xl text-sm font-semibold shadow-sm hover:-translate-y-0.5'

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
      <path fill="#4285F4" d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.46a5.52 5.52 0 0 1-2.4 3.62v3h3.88c2.27-2.09 3.58-5.17 3.58-8.81Z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.94-2.91l-3.88-3.01c-1.07.72-2.45 1.15-4.06 1.15-3.13 0-5.78-2.11-6.72-4.95H1.27v3.11A12 12 0 0 0 12 24Z" />
      <path fill="#FBBC05" d="M5.28 14.28A7.2 7.2 0 0 1 4.9 12c0-.79.14-1.56.38-2.28V6.61H1.27a12 12 0 0 0 0 10.78l4.01-3.11Z" />
      <path fill="#EA4335" d="M12 4.77c1.76 0 3.34.61 4.59 1.8l3.44-3.44A11.53 11.53 0 0 0 12 0 12 12 0 0 0 1.27 6.61l4.01 3.11C6.22 6.88 8.87 4.77 12 4.77Z" />
    </svg>
  )
}

function AppleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        d="M16.36 1.43c.1 1.02-.29 2.02-.9 2.75-.63.75-1.66 1.34-2.67 1.26-.12-1 .34-2.04.93-2.72.65-.76 1.78-1.34 2.64-1.29Zm2.7 17.53c-.5 1.14-.98 1.66-1.6 2.53-.86 1.2-2.08 2.7-3.59 2.71-1.34.02-1.68-.87-3.5-.86-1.82.01-2.2.88-3.54.86-1.51-.02-2.66-1.36-3.52-2.56-2.42-3.35-2.68-7.28-1.18-9.38.9-1.27 2.36-2.06 3.71-2.06 1.38 0 2.24.86 3.38.86 1.11 0 1.78-.86 3.38-.86 1.03 0 2.42.48 3.34 1.42-2.98 1.63-2.5 5.87.12 7.34Z"
      />
    </svg>
  )
}

type Translations = ReturnType<typeof useI18n>['t']

/**
 * Maps an auth request failure onto a translated, user-facing message.
 * Status 0 = the request never reached the server (offline / DNS / CORS).
 */
function authErrorMessage(err: unknown, t: Translations, flow: 'signin' | 'signup'): string {
  const fallback = flow === 'signin' ? t.auth.errors.signinFailed : t.auth.errors.signupFailed
  if (!(err instanceof AuthRequestError)) {
    // fetch() itself rejects with a TypeError ("Failed to fetch") when offline.
    return err instanceof TypeError ? t.common.errors.network : fallback
  }
  if (err.status === 0) return t.common.errors.network
  // No route rate-limits yet; handled so the UI is ready when the backend adds 429s.
  if (err.status === 429) return t.auth.errors.rateLimited
  if (err.status >= 500) return t.common.errors.generic
  if (flow === 'signin' && err.status === 401) return t.auth.errors.invalidCredentials
  if (flow === 'signin' && err.status === 403) return t.auth.errors.suspended
  if (flow === 'signup' && err.status === 409) return t.auth.errors.accountExists
  if (err.status === 400) return translateServerValidation(err.message, t) ?? t.auth.errors.invalidInput
  return fallback
}

/** The API returns English zod messages; map the known ones onto the active locale. */
function translateServerValidation(message: string, t: Translations): string | null {
  const v = t.auth.validation
  const known: Record<string, string> = {
    'Enter your email or username.': v.emailRequired,
    'Enter your email address.': v.emailRequired,
    'Enter a valid email address.': v.emailInvalid,
    'Enter your password.': v.passwordRequired,
    'Enter your full name.': v.fullNameRequired,
    [`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`]: fmt(v.passwordMin, { min: MIN_PASSWORD_LENGTH }),
  }
  return known[message] ?? null
}

function SubmitButton({ submitting, idleLabel, busyLabel }: { submitting: boolean; idleLabel: string; busyLabel: string }) {
  return (
    <Button type="submit" size="lg" className={PRIMARY_BUTTON_CLASS} aria-busy={submitting || undefined}>
      {submitting ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : null}
      {submitting ? busyLabel : idleLabel}
    </Button>
  )
}

const UNAVAILABLE_NOTICE_DELAY_MS = 600

function FederatedButtons({
  mode,
  onFederatedAuth,
}: {
  mode: AuthMode
  onFederatedAuth?: AuthFormProps['onFederatedAuth']
}) {
  const { t } = useI18n()
  const [pending, setPending] = useState<Provider | null>(null)
  const [unavailable, setUnavailable] = useState<Provider | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current)
  }, [])

  async function handleClick(provider: Provider) {
    if (pending) return
    setUnavailable(null)
    setPending(provider)
    if (onFederatedAuth) {
      try {
        await onFederatedAuth(provider, mode)
      } finally {
        setPending(null)
      }
      return
    }
    // No OAuth backend exists yet: say so honestly instead of failing silently.
    timerRef.current = setTimeout(() => {
      setPending(null)
      setUnavailable(provider)
    }, UNAVAILABLE_NOTICE_DELAY_MS)
  }

  const providerName = (provider: Provider) => (provider === 'google' ? t.auth.federated.google : t.auth.federated.apple)

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          type="button"
          variant="outline"
          size="lg"
          className={cn(SOCIAL_BUTTON_CLASS, 'border-border bg-white text-[#1f1f1f] hover:bg-white hover:border-[#3B82F6]/40')}
          aria-label={t.auth.federated.googleLabel}
          aria-busy={pending === 'google' || undefined}
          disabled={pending !== null}
          onClick={() => handleClick('google')}
        >
          {pending === 'google' ? <Loader2 className="size-5 animate-spin" aria-hidden="true" /> : <GoogleIcon />}
          {pending === 'google' ? t.auth.federated.connecting : t.auth.federated.google}
        </Button>
        <Button
          type="button"
          size="lg"
          className={cn(SOCIAL_BUTTON_CLASS, 'bg-black text-white! hover:bg-black/85')}
          aria-label={t.auth.federated.appleLabel}
          aria-busy={pending === 'apple' || undefined}
          disabled={pending !== null}
          onClick={() => handleClick('apple')}
        >
          {pending === 'apple' ? <Loader2 className="size-5 animate-spin" aria-hidden="true" /> : <AppleIcon />}
          {pending === 'apple' ? t.auth.federated.connecting : t.auth.federated.apple}
        </Button>
      </div>
      <div role="status" aria-live="polite">
        {unavailable ? (
          <p className="flex items-start gap-2 rounded-lg border border-primary/25 bg-primary/5 px-3 py-2 text-sm text-foreground">
            <Info className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
            <span>{fmt(t.auth.federated.unavailable, { provider: providerName(unavailable) })}</span>
          </p>
        ) : null}
      </div>
    </div>
  )
}

function Divider({ label }: { label: string }) {
  return (
    <div
      role="separator"
      aria-label={label}
      className="flex items-center gap-3 text-xs text-muted-foreground"
    >
      <span aria-hidden="true" className="h-px flex-1 bg-border" />
      <span aria-hidden="true">{label}</span>
      <span aria-hidden="true" className="h-px flex-1 bg-border" />
    </div>
  )
}

const initialSignIn: SignInValues = { identifier: '', password: '' }

const FORM_ERROR_CLASS = 'rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive'

/** Skip the round trip when the browser already knows it's offline. */
function isOffline() {
  return typeof navigator !== 'undefined' && navigator.onLine === false
}

function SignInForm({
  onSignIn,
  onFederatedAuth,
}: {
  onSignIn?: AuthFormProps['onSignIn']
  onFederatedAuth?: AuthFormProps['onFederatedAuth']
}) {
  const { t } = useI18n()
  const idPrefix = useId()
  const [values, setValues] = useState<SignInValues>(initialSignIn)
  const [errors, setErrors] = useState<SignInErrors>({})
  // Typing into a field clears its error, so stale messages don't linger.
  function update<K extends keyof SignInValues>(key: K, value: SignInValues[K]) {
    setValues((v) => ({ ...v, [key]: value }))
    setErrors((e) => (e[key] ? { ...e, [key]: undefined } : e))
  }
  const [status, setStatus] = useState<SubmitStatus>('idle')
  const [formError, setFormError] = useState<string | null>(null)

  function validate(current: SignInValues): SignInErrors {
    const next: SignInErrors = {}
    // The API looks accounts up by email only (the request field stays `identifier`).
    if (!current.identifier.trim()) next.identifier = t.auth.validation.emailRequired
    else if (!EMAIL_PATTERN.test(current.identifier.trim())) next.identifier = t.auth.validation.emailInvalid
    if (!current.password) next.password = t.auth.validation.passwordRequired
    return next
  }

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors = validate(values)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return
    if (isOffline()) {
      setStatus('error')
      setFormError(t.common.errors.network)
      return
    }

    setFormError(null)
    setStatus('submitting')
    try {
      await onSignIn?.(values)
      setStatus('success')
    } catch (err) {
      setStatus('error')
      setFormError(authErrorMessage(err, t, 'signin'))
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <FederatedButtons mode="signin" onFederatedAuth={onFederatedAuth} />
      <Divider label={t.auth.federated.divider} />

      <form onSubmit={handleSubmit} noValidate>
        <fieldset className="flex flex-col gap-4" disabled={status === 'submitting'}>
          <legend className="sr-only">{t.auth.signin.legend}</legend>

          {formError ? (
            <div role="alert" className={FORM_ERROR_CLASS}>
              <p>{formError}</p>
              {/* Wrong password is the likeliest cause: offer the way out right in the alert. */}
              {formError === t.auth.errors.invalidCredentials ? (
                <Link href="/forgot-password" className="mt-1 inline-block font-medium underline underline-offset-2">
                  {t.auth.signin.resetAction}
                </Link>
              ) : null}
            </div>
          ) : null}

          <div className="flex flex-col gap-1.5">
            <label htmlFor={`${idPrefix}-identifier`} className="text-sm font-medium">
              {t.auth.signin.emailLabel}
            </label>
            <Input
              id={`${idPrefix}-identifier`}
              name="identifier"
              type="email"
              inputMode="email"
              dir="ltr"
              autoComplete="username"
              required
              value={values.identifier}
              onChange={(event) => update('identifier', event.target.value)}
              aria-invalid={Boolean(errors.identifier) || undefined}
              aria-describedby={errors.identifier ? `${idPrefix}-identifier-error` : undefined}
            />
            <FieldError id={`${idPrefix}-identifier-error`} message={errors.identifier} />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-1">
              <label htmlFor={`${idPrefix}-password`} className="text-sm font-medium">
                {t.auth.signin.passwordLabel}
              </label>
              <Link
                href="/forgot-password"
                className="rounded text-xs font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {t.auth.signin.forgotPassword}
              </Link>
            </div>
            <PasswordField
              id={`${idPrefix}-password`}
              autoComplete="current-password"
              value={values.password}
              onChange={(value) => update('password', value)}
              invalid={Boolean(errors.password)}
              describedBy={[`${idPrefix}-password-hint`, errors.password && `${idPrefix}-password-error`]
                .filter(Boolean)
                .join(' ')}
            />
            <p id={`${idPrefix}-password-hint`} className="text-xs text-muted-foreground">
              {t.auth.signin.passwordHint}
            </p>
            <FieldError id={`${idPrefix}-password-error`} message={errors.password} />
          </div>

          <SubmitButton
            submitting={status === 'submitting'}
            idleLabel={t.auth.signin.submit}
            busyLabel={t.auth.signin.submitting}
          />

          <p aria-live="polite" className="sr-only">
            {status === 'submitting' && t.auth.signin.statusSubmitting}
            {status === 'success' && t.auth.signin.statusSuccess}
          </p>
        </fieldset>
      </form>
    </div>
  )
}

const initialSignUp: SignUpValues = {
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
  agreeToTerms: false,
}

function SignUpForm({
  onSignUp,
  onFederatedAuth,
}: {
  onSignUp?: AuthFormProps['onSignUp']
  onFederatedAuth?: AuthFormProps['onFederatedAuth']
}) {
  const { t } = useI18n()
  const idPrefix = useId()
  const [values, setValues] = useState<SignUpValues>(initialSignUp)
  const [errors, setErrors] = useState<SignUpErrors>({})
  function update<K extends keyof SignUpValues>(key: K, value: SignUpValues[K]) {
    setValues((v) => ({ ...v, [key]: value }))
    setErrors((e) => (e[key] ? { ...e, [key]: undefined } : e))
  }
  const [status, setStatus] = useState<SubmitStatus>('idle')
  const [formError, setFormError] = useState<string | null>(null)

  const strength = useMemo(() => getPasswordStrength(values.password), [values.password])

  function validate(current: SignUpValues): SignUpErrors {
    const v = t.auth.validation
    const next: SignUpErrors = {}
    if (!current.fullName.trim()) next.fullName = v.fullNameRequired
    if (!current.email.trim()) {
      next.email = v.emailRequired
    } else if (!EMAIL_PATTERN.test(current.email.trim())) {
      next.email = v.emailInvalid
    }
    if (!current.password) {
      next.password = v.passwordCreate
    } else if (current.password.length < MIN_PASSWORD_LENGTH) {
      next.password = fmt(v.passwordMin, { min: MIN_PASSWORD_LENGTH })
    }
    if (!current.confirmPassword) {
      next.confirmPassword = v.confirmRequired
    } else if (current.confirmPassword !== current.password) {
      next.confirmPassword = v.passwordsMismatch
    }
    if (!current.agreeToTerms) {
      next.agreeToTerms = v.termsRequired
    }
    return next
  }

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors = validate(values)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return
    if (isOffline()) {
      setStatus('error')
      setFormError(t.common.errors.network)
      return
    }

    setFormError(null)
    setStatus('submitting')
    try {
      await onSignUp?.(values)
      setStatus('success')
    } catch (err) {
      setStatus('error')
      setFormError(authErrorMessage(err, t, 'signup'))
    }
  }

  const passwordDescribedBy = [
    `${idPrefix}-password-strength`,
    errors.password && `${idPrefix}-password-error`,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className="flex flex-col gap-6">
      <FederatedButtons mode="signup" onFederatedAuth={onFederatedAuth} />
      <Divider label={t.auth.federated.divider} />

      <form onSubmit={handleSubmit} noValidate>
        <fieldset className="flex flex-col gap-4" disabled={status === 'submitting'}>
          <legend className="sr-only">{t.auth.signup.legend}</legend>

          {formError ? (
            <p role="alert" className={FORM_ERROR_CLASS}>
              {formError}
            </p>
          ) : null}

          <div className="flex flex-col gap-1.5">
            <label htmlFor={`${idPrefix}-name`} className="text-sm font-medium">
              {t.auth.signup.fullNameLabel}
            </label>
            <Input
              id={`${idPrefix}-name`}
              name="fullName"
              type="text"
              autoComplete="name"
              required
              value={values.fullName}
              onChange={(event) => update('fullName', event.target.value)}
              aria-invalid={Boolean(errors.fullName) || undefined}
              aria-describedby={errors.fullName ? `${idPrefix}-name-error` : undefined}
            />
            <FieldError id={`${idPrefix}-name-error`} message={errors.fullName} />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor={`${idPrefix}-email`} className="text-sm font-medium">
              {t.auth.signup.emailLabel}
            </label>
            <Input
              id={`${idPrefix}-email`}
              name="email"
              type="email"
              dir="ltr"
              autoComplete="email"
              required
              value={values.email}
              onChange={(event) => update('email', event.target.value)}
              aria-invalid={Boolean(errors.email) || undefined}
              aria-describedby={errors.email ? `${idPrefix}-email-error` : undefined}
            />
            <FieldError id={`${idPrefix}-email-error`} message={errors.email} />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor={`${idPrefix}-password`} className="text-sm font-medium">
              {t.auth.signup.passwordLabel}
            </label>
            <PasswordField
              id={`${idPrefix}-password`}
              autoComplete="new-password"
              minLength={MIN_PASSWORD_LENGTH}
              value={values.password}
              onChange={(value) => update('password', value)}
              invalid={Boolean(errors.password)}
              describedBy={passwordDescribedBy}
            />
            <div className="flex items-center gap-2">
              <meter
                min={0}
                max={4}
                low={2}
                high={3}
                optimum={4}
                value={values.password ? strength.score : 0}
                className="h-1.5 w-full"
                aria-hidden="true"
              />
              <span
                id={`${idPrefix}-password-strength`}
                aria-live="polite"
                className="whitespace-nowrap text-xs text-muted-foreground"
              >
                {values.password
                  ? t.auth.password.strength[strength.score]
                  : fmt(t.auth.password.hint, { min: MIN_PASSWORD_LENGTH })}
              </span>
            </div>
            <FieldError id={`${idPrefix}-password-error`} message={errors.password} />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor={`${idPrefix}-confirm-password`} className="text-sm font-medium">
              {t.auth.signup.confirmPasswordLabel}
            </label>
            <PasswordField
              id={`${idPrefix}-confirm-password`}
              autoComplete="new-password"
              value={values.confirmPassword}
              onChange={(value) => update('confirmPassword', value)}
              invalid={Boolean(errors.confirmPassword)}
              describedBy={errors.confirmPassword ? `${idPrefix}-confirm-password-error` : undefined}
            />
            <FieldError id={`${idPrefix}-confirm-password-error`} message={errors.confirmPassword} />
            <p aria-live="polite" className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
              {values.confirmPassword && values.confirmPassword === values.password && !errors.confirmPassword ? (
                <span className="inline-flex items-center gap-1">
                  <Check className="size-3.5" aria-hidden="true" />
                  {t.auth.password.match}
                </span>
              ) : null}
            </p>
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-start gap-2.5">
              <input
                id={`${idPrefix}-terms`}
                name="agreeToTerms"
                type="checkbox"
                required
                checked={values.agreeToTerms}
                onChange={(event) => update('agreeToTerms', event.target.checked)}
                aria-invalid={Boolean(errors.agreeToTerms) || undefined}
                aria-describedby={errors.agreeToTerms ? `${idPrefix}-terms-error` : undefined}
                className={cn(
                  'mt-0.5 h-5 w-5 shrink-0 rounded border-input accent-[#3B82F6]',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                )}
              />
              <label htmlFor={`${idPrefix}-terms`} className="text-sm">
                {t.auth.signup.termsPrefix}{' '}
                <Link href="/terms" className="font-medium text-primary underline-offset-4 hover:underline">
                  {t.auth.signup.termsLink}
                </Link>{' '}
                {t.auth.signup.termsAnd}{' '}
                <Link href="/#privacy" className="font-medium text-primary underline-offset-4 hover:underline">
                  {t.auth.signup.privacyLink}
                </Link>
              </label>
            </div>
            <FieldError id={`${idPrefix}-terms-error`} message={errors.agreeToTerms} />
          </div>

          <SubmitButton
            submitting={status === 'submitting'}
            idleLabel={t.auth.signup.submit}
            busyLabel={t.auth.signup.submitting}
          />

          <p aria-live="polite" className="sr-only">
            {status === 'submitting' && t.auth.signup.statusSubmitting}
            {status === 'success' && t.auth.signup.statusSuccess}
          </p>
        </fieldset>
      </form>
    </div>
  )
}

const MODES: AuthMode[] = ['signin', 'signup']

export function AuthForm({ defaultMode = 'signin', onSignIn, onSignUp, onFederatedAuth }: AuthFormProps) {
  const { t } = useI18n()
  const [mode, setMode] = useState<AuthMode>(defaultMode)
  const baseId = useId()
  const tabRefs = useRef<Record<AuthMode, HTMLButtonElement | null>>({ signin: null, signup: null })
  const copy = mode === 'signin' ? t.auth.signin : t.auth.signup

  function handleTabKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return
    event.preventDefault()
    const next: AuthMode =
      event.key === 'Home' ? 'signin' : event.key === 'End' ? 'signup' : mode === 'signin' ? 'signup' : 'signin'
    setMode(next)
    tabRefs.current[next]?.focus()
  }

  return (
    <AuthCard>
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-extrabold tracking-tight text-brand-navy sm:text-3xl">{copy.title}</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">{copy.subtitle}</p>
      </div>

      <div
        role="tablist"
        aria-label={t.auth.tabs.label}
        className="mb-6 grid grid-cols-2 gap-1 rounded-full border border-border bg-[color:var(--primary)]/[0.06] p-1"
      >
        {MODES.map((value) => {
          const selected = value === mode
          return (
            <button
              key={value}
              ref={(node) => {
                tabRefs.current[value] = node
              }}
              type="button"
              role="tab"
              id={`${baseId}-tab-${value}`}
              aria-selected={selected}
              aria-controls={`${baseId}-panel`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setMode(value)}
              onKeyDown={handleTabKeyDown}
              className={cn(
                'relative min-h-10 rounded-full px-2 py-2 text-[0.8125rem] leading-tight font-semibold transition-colors sm:px-4 sm:py-2.5 sm:text-sm',
                selected ? 'text-white' : 'text-muted-foreground hover:text-brand-navy',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
              )}
            >
              {selected ? (
                <motion.span
                  layoutId={`${baseId}-tab-indicator`}
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-[#2563EB] to-[#3B82F6] shadow-[0_10px_24px_-10px_rgba(37,99,235,0.6)]"
                  transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                />
              ) : null}
              <span className="relative">{t.auth.tabs[value]}</span>
            </button>
          )
        })}
      </div>

      <div role="tabpanel" id={`${baseId}-panel`} aria-labelledby={`${baseId}-tab-${mode}`}>
        {mode === 'signin' ? (
          <SignInForm onSignIn={onSignIn} onFederatedAuth={onFederatedAuth} />
        ) : (
          <SignUpForm onSignUp={onSignUp} onFederatedAuth={onFederatedAuth} />
        )}
      </div>
    </AuthCard>
  )
}
