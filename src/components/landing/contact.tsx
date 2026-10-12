"use client"

import { useEffect, useId, useState, type FormEvent, type ReactNode } from "react"
import { motion } from "framer-motion"
import { Check, Copy, HeadphonesIcon, Mail, Send, Users, type LucideIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Container } from "@/components/shared/container"
import { SectionTitle } from "@/components/shared/section-title"
import { IconBadge } from "@/components/shared/icon-badge"
import { cn } from "@/lib/utils"
import { useI18n } from "@/i18n/use-i18n"
import {
  GlassPanel,
  GlowOrb,
  Magnetic,
  Reveal,
  focusRingPop,
  popButtonSizes,
  popPrimaryButton,
  popSecondaryButton,
  staggerContainer,
  staggerItem,
} from "./ui/pop"
import { CONTACT_TOPICS, TOPIC_EMAIL, onContactTopic, type ContactTopic } from "./contact-intent"

const CONTACT_METHODS = ["email", "video", "chat"] as const
type ContactMethod = (typeof CONTACT_METHODS)[number]
const MESSAGE_MIN_LENGTH = 10
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Addresses/icons zipped by index with `t.landing.contact.channels`. */
const CHANNELS: { icon: LucideIcon; email: string }[] = [
  { icon: Mail, email: "hello@deafference.ai" },
  { icon: Users, email: "partners@deafference.ai" },
  { icon: HeadphonesIcon, email: "support@deafference.ai" },
]

type Field = "name" | "email" | "message"
type Errors = Partial<Record<Field, string>>

/** Floating-label field: label shrinks/lifts and the border glows soft blue on focus or when filled. */
function FloatingField({
  id,
  label,
  value,
  error,
  multiline = false,
  children,
}: {
  id: string
  label: string
  value: string
  error?: string
  multiline?: boolean
  children: (props: { onFocus: () => void; onBlur: () => void; describedBy?: string }) => ReactNode
}) {
  const [focused, setFocused] = useState(false)
  const active = focused || value.length > 0
  const errorId = `${id}-error`

  return (
    <div>
      <div className="relative">
        <label
          htmlFor={id}
          className={cn(
            "pointer-events-none absolute start-4 z-10 origin-left transition-all duration-200 ease-out rtl:origin-right",
            active
              ? "top-0 -translate-y-1/2 scale-75 bg-card px-1.5 font-semibold text-[#1D4ED8]"
              : multiline
                ? "top-3 scale-100 text-black"
                : "top-1/2 -translate-y-1/2 scale-100 text-black",
            error && "text-[#B91C1C]",
          )}
        >
          {label}
        </label>
        <div
          className={cn(
            "rounded-xl transition-shadow duration-200",
            focused && "shadow-[0_0_0_3px_rgba(59,130,246,0.18)]",
            error && "ring-1 ring-[#B91C1C]/60",
          )}
        >
          {children({
            onFocus: () => setFocused(true),
            onBlur: () => setFocused(false),
            describedBy: error ? errorId : undefined,
          })}
        </div>
      </div>
      {error ? (
        <p id={errorId} className="mt-1.5 text-sm font-medium text-[#B91C1C]">
          {error}
        </p>
      ) : null}
    </div>
  )
}

export function Contact() {
  const { t, fmt } = useI18n()
  const copy = t.landing.contact
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [organization, setOrganization] = useState("")
  const [topic, setTopic] = useState<ContactTopic>("general")
  const [method, setMethod] = useState<ContactMethod>("email")
  const [errors, setErrors] = useState<Errors>({})
  const [submitted, setSubmitted] = useState(false)
  const [copied, setCopied] = useState(false)
  const nameId = useId()
  const emailId = useId()
  const messageId = useId()
  const organizationId = useId()
  const topicId = useId()
  const contactEmail = TOPIC_EMAIL[topic]

  // "Contact sales", "Plan an integration", etc. pre-select the matching topic.
  useEffect(() => onContactTopic(setTopic), [])

  function validate(): Errors {
    const next: Errors = {}
    if (!name.trim()) next.name = copy.errors.nameRequired
    if (!email.trim()) next.email = copy.errors.emailRequired
    else if (!EMAIL_PATTERN.test(email.trim())) next.email = copy.errors.emailInvalid
    if (!message.trim()) next.message = copy.errors.messageRequired
    else if (message.trim().length < MESSAGE_MIN_LENGTH) next.message = copy.errors.messageShort
    return next
  }

  // Re-validate a field as the visitor fixes it, once an error is showing.
  function clearIfFixed(field: Field) {
    if (!errors[field]) return
    const next = validate()
    setErrors((prev) => ({ ...prev, [field]: next[field] }))
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const next = validate()
    setErrors(next)
    const firstInvalid = (["name", "email", "message"] as const).find((field) => next[field])
    if (firstInvalid) {
      setSubmitted(false)
      const ids: Record<Field, string> = { name: nameId, email: emailId, message: messageId }
      document.getElementById(ids[firstInvalid])?.focus()
      return
    }
    // There's no contact API: hand the message to the visitor's email app.
    const subject = encodeURIComponent(fmt(copy.mailSubject, { name: name.trim() }))
    const details = [
      `${copy.mailTopic}: ${copy.topics[topic]}`,
      organization.trim() ? `${copy.mailOrganization}: ${organization.trim()}` : null,
      `${copy.mailMethod}: ${copy.methods[method]}`,
    ].filter(Boolean)
    const body = encodeURIComponent(`${message.trim()}\n\n${details.join("\n")}\n\n— ${name.trim()} (${email.trim()})`)
    setSubmitted(true)
    window.location.href = `mailto:${contactEmail}?subject=${subject}&body=${body}`
  }

  async function copyAddress() {
    try {
      await navigator.clipboard.writeText(contactEmail)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard blocked: the address stays visible and selectable.
    }
  }

  const inputClass = "h-12 border-transparent bg-background/70"

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="relative overflow-hidden border-y border-border/60 py-28 sm:py-32"
    >
      {/* Ambient ground + drifting orbs behind the whole workspace */}
      <div className="pop-atmosphere pop-grid absolute inset-0 opacity-70" aria-hidden="true" />
      <GlowOrb className="pop-float top-[-6rem] left-[-4rem] size-72" color="rgba(59,130,246,0.22)" />
      <GlowOrb className="pop-float-delay right-[-5rem] bottom-[-4rem] size-80" color="rgba(167,180,255,0.24)" />
      <GlowOrb className="pop-float top-1/3 right-[8%] size-40" color="rgba(255,138,61,0.14)" />

      <Container fluid className="relative">
        <SectionTitle headingId="contact-heading" eyebrow={copy.eyebrow} title={copy.title} description={copy.description} />

        {/* Form + channel cards: stacked on mobile, side by side (in normal flow) on large screens. */}
        <div className="relative mt-16 grid gap-6 lg:grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)] lg:items-start lg:gap-8">
          <Reveal className="relative z-10" y={26}>
            <GlassPanel glow className="p-6 sm:p-9">
              <span
                className="pop-orbit absolute end-6 top-6 hidden size-16 rounded-full border border-dashed border-[color:var(--primary)]/25 sm:block"
                aria-hidden="true"
              />
              <p className="text-xs font-semibold tracking-[0.2em] text-[#1D4ED8] uppercase">{copy.formEyebrow}</p>
              <h3 className="mt-2 text-xl font-semibold text-foreground">{copy.formTitle}</h3>

              <form onSubmit={handleSubmit} noValidate className="mt-6 grid gap-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <FloatingField id={nameId} label={copy.name} value={name} error={errors.name}>
                    {({ onFocus, onBlur, describedBy }) => (
                      <Input
                        id={nameId}
                        name="name"
                        autoComplete="name"
                        required
                        aria-required="true"
                        aria-invalid={errors.name ? true : undefined}
                        aria-describedby={describedBy}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onFocus={onFocus}
                        onBlur={() => {
                          onBlur()
                          clearIfFixed("name")
                        }}
                        className={inputClass}
                      />
                    )}
                  </FloatingField>
                  <FloatingField id={emailId} label={copy.email} value={email} error={errors.email}>
                    {({ onFocus, onBlur, describedBy }) => (
                      <Input
                        id={emailId}
                        name="email"
                        type="email"
                        autoComplete="email"
                        dir="ltr"
                        required
                        aria-required="true"
                        aria-invalid={errors.email ? true : undefined}
                        aria-describedby={describedBy}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onFocus={onFocus}
                        onBlur={() => {
                          onBlur()
                          clearIfFixed("email")
                        }}
                        className={cn(inputClass, "rtl:text-right")}
                      />
                    )}
                  </FloatingField>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <FloatingField id={organizationId} label={copy.organization} value={organization}>
                    {({ onFocus, onBlur }) => (
                      <Input
                        id={organizationId}
                        name="organization"
                        autoComplete="organization"
                        value={organization}
                        onChange={(e) => setOrganization(e.target.value)}
                        onFocus={onFocus}
                        onBlur={onBlur}
                        className={inputClass}
                      />
                    )}
                  </FloatingField>
                  {/* Always has a value, so its label stays lifted like a filled field. */}
                  <FloatingField id={topicId} label={copy.topic} value={topic}>
                    {({ onFocus, onBlur }) => (
                      <select
                        id={topicId}
                        name="topic"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value as ContactTopic)}
                        onFocus={onFocus}
                        onBlur={onBlur}
                        className="h-12 w-full cursor-pointer rounded-xl border border-transparent bg-background/70 px-3 text-sm text-foreground outline-none"
                      >
                        {CONTACT_TOPICS.map((value) => (
                          <option key={value} value={value}>
                            {copy.topics[value]}
                          </option>
                        ))}
                      </select>
                    )}
                  </FloatingField>
                </div>

                <fieldset>
                  <legend className="text-sm font-semibold text-foreground">{copy.method}</legend>
                  <div className="mt-3 flex flex-wrap gap-2.5">
                    {CONTACT_METHODS.map((value) => (
                      <label
                        key={value}
                        className={cn(
                          "inline-flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-[color:var(--primary)] has-[:focus-visible]:ring-offset-2",
                          method === value
                            ? "border-[color:var(--primary)]/40 bg-[color:var(--primary)]/10 text-[#1D4ED8]"
                            : "border-border/70 bg-background/60 text-black hover:text-foreground",
                        )}
                      >
                        <input
                          type="radio"
                          name="method"
                          value={value}
                          checked={method === value}
                          onChange={() => setMethod(value)}
                          className="size-3.5 accent-[#2563EB]"
                        />
                        {copy.methods[value]}
                      </label>
                    ))}
                  </div>
                </fieldset>

                <FloatingField id={messageId} label={copy.message} value={message} error={errors.message} multiline>
                  {({ onFocus, onBlur, describedBy }) => (
                    <Textarea
                      id={messageId}
                      name="message"
                      required
                      aria-required="true"
                      aria-invalid={errors.message ? true : undefined}
                      aria-describedby={describedBy}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onFocus={onFocus}
                      onBlur={() => {
                        onBlur()
                        clearIfFixed("message")
                      }}
                      className="min-h-32 border-transparent bg-background/70 pt-4"
                    />
                  )}
                </FloatingField>

                <Magnetic className="mt-1 w-full sm:w-fit">
                  <button type="submit" className={cn(popPrimaryButton, popButtonSizes.lg, "w-full sm:w-fit sm:px-8")}>
                    <Send className="size-4 rtl:-scale-x-100" aria-hidden="true" />
                    {copy.submit}
                  </button>
                </Magnetic>

                {/* Honest outcome: we can only open the visitor's email app, so say so and offer the address. */}
                <div role="status" aria-live="polite">
                  {submitted ? (
                    <div className="rounded-2xl border border-[color:var(--primary)]/20 bg-[color:var(--primary)]/6 p-4 text-sm leading-6 text-black">
                      <p className="font-semibold">{copy.statusTitle}</p>
                      <p className="mt-1">
                        {copy.statusBody}{" "}
                        <a
                          href={`mailto:${contactEmail}`}
                          dir="ltr"
                          className={cn("rounded-sm font-semibold text-[#1D4ED8] underline underline-offset-4", focusRingPop)}
                        >
                          {contactEmail}
                        </a>
                      </p>
                      <button type="button" onClick={copyAddress} className={cn(popSecondaryButton, popButtonSizes.sm, "mt-3")}>
                        {copied ? <Check className="size-4" aria-hidden="true" /> : <Copy className="size-4" aria-hidden="true" />}
                        {copied ? copy.copied : copy.copy}
                      </button>
                    </div>
                  ) : null}
                </div>
              </form>
            </GlassPanel>
          </Reveal>

          {/* Contact channels */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="relative z-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-1 lg:pt-6"
          >
            {CHANNELS.map((channel, i) => {
              const Icon = channel.icon
              const text = copy.channels[i]
              return (
                <motion.div key={channel.email} variants={staggerItem} className={i === 2 ? "sm:col-span-2 lg:col-span-1" : undefined}>
                  <GlassPanel className="p-5" tilt>
                    <div className="flex items-start gap-4">
                      <IconBadge icon={Icon} size="compact" />
                      <div className="min-w-0">
                        <h3 className="text-base font-semibold text-foreground">{text?.title}</h3>
                        <p className="mt-1 text-sm leading-6 text-black">{text?.description}</p>
                        <a
                          href={`mailto:${channel.email}`}
                          dir="ltr"
                          className={cn(
                            "mt-2 inline-block rounded-sm text-sm font-semibold break-all text-[#1D4ED8] underline-offset-4 transition-colors hover:underline",
                            focusRingPop,
                          )}
                        >
                          {channel.email}
                        </a>
                      </div>
                    </div>
                  </GlassPanel>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </Container>
    </section>
  )
}

