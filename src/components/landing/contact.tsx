"use client"

import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from "react"
import { motion } from "framer-motion"
import {
  Check,
  Copy,
  HeadphonesIcon,
  Mail,
  MailOpen,
  MessageSquareText,
  PenLine,
  RefreshCw,
  Reply,
  Send,
  Users,
  Video,
  X,
  type LucideIcon,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Container } from "@/components/shared/container"
import { SectionTitle } from "@/components/shared/section-title"
import { cn } from "@/lib/utils"
import { useI18n } from "@/i18n/use-i18n"
import {
  GlassPanel,
  Magnetic,
  Reveal,
  focusRingPop,
  popBrandTile,
  popButtonSizes,
  popPrimaryButton,
  popSecondaryButton,
  popStage,
  popTile,
  staggerContainer,
  staggerItem,
} from "./ui/pop"
import { FlowSteps } from "./ui/flow"
import { SignVideoButton } from "./sign-video"
import { CONTACT_TOPICS, TOPIC_EMAIL, onContactTopic, topicFromUrl, type ContactTopic } from "./contact-intent"

const CONTACT_METHODS = ["email", "video", "chat"] as const
type ContactMethod = (typeof CONTACT_METHODS)[number]
const METHOD_ICONS: Record<ContactMethod, LucideIcon> = { email: Mail, video: Video, chat: MessageSquareText }
/** Icons for `t.landing.contact.flow`: write, the email app opens, the team replies. */
const FLOW_ICONS: LucideIcon[] = [PenLine, MailOpen, Reply]
const MESSAGE_MIN_LENGTH = 10
/** Most email apps refuse attachments over ~25 MB. */
const VIDEO_MAX_BYTES = 25 * 1024 * 1024
const toMb = (bytes: number) => (bytes / (1024 * 1024)).toFixed(1)
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Addresses/icons zipped by index with `t.landing.contact.channels`. */
const CHANNELS: { icon: LucideIcon; email: string }[] = [
  { icon: Mail, email: "fatima@deafference.com" },
  { icon: Users, email: "fatima@deafference.com" },
  { icon: HeadphonesIcon, email: "fatima@deafference.com" },
]

type Field = "name" | "email" | "message" | "video"
type Errors = Partial<Record<Field, string>>

/** Floating-label field: label shrinks/lifts and the border glows in the brand colour on focus or when filled. */
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
            focused && "shadow-[0_0_0_3px_rgba(214,60,26,0.18)]",
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
  // "Attach a sign-language video": the chosen file and a preview URL for it.
  const [video, setVideo] = useState<File | null>(null)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  // What the status box says after sending: share sheet used, or attach-it-yourself reminder.
  const [sendNote, setSendNote] = useState<"shared" | "attach" | null>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)
  const videoInputId = useId()
  const nameId = useId()
  const emailId = useId()
  const messageId = useId()
  const organizationId = useId()
  const topicId = useId()
  const contactEmail = TOPIC_EMAIL[topic]

  // "Contact sales", "Plan an integration", etc. pre-select the matching topic: through
  // /contact?topic=… when they link here from another page, or in place on /contact itself.
  useEffect(() => {
    const fromUrl = topicFromUrl()
    if (fromUrl) setTopic(fromUrl)
    return onContactTopic(setTopic)
  }, [])

  useEffect(() => {
    if (!video) {
      setVideoUrl(null)
      return
    }
    const url = URL.createObjectURL(video)
    setVideoUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [video])

  function videoError(file: File | null) {
    if (!file) return copy.errors.videoRequired
    if (file.size > VIDEO_MAX_BYTES) return fmt(copy.errors.videoTooBig, { size: toMb(file.size) })
    return undefined
  }

  function pickVideo(file: File) {
    setVideo(file)
    // A too-big file is flagged straight away; a missing one only once the visitor has tried to send.
    setErrors((prev) => ({ ...prev, video: videoError(file) }))
  }

  function chooseMethod(value: ContactMethod) {
    setMethod(value)
    if (value !== "video") setErrors((prev) => ({ ...prev, video: undefined }))
  }

  function validate(): Errors {
    const next: Errors = {}
    if (!name.trim()) next.name = copy.errors.nameRequired
    if (!email.trim()) next.email = copy.errors.emailRequired
    else if (!EMAIL_PATTERN.test(email.trim())) next.email = copy.errors.emailInvalid
    if (!message.trim()) next.message = copy.errors.messageRequired
    else if (message.trim().length < MESSAGE_MIN_LENGTH) next.message = copy.errors.messageShort
    if (method === "video") next.video = videoError(video)
    return next
  }

  // Re-validate a field as the visitor fixes it, once an error is showing.
  function clearIfFixed(field: Field) {
    if (!errors[field]) return
    const next = validate()
    setErrors((prev) => ({ ...prev, [field]: next[field] }))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const next = validate()
    setErrors(next)
    const firstInvalid = (["name", "email", "message", "video"] as const).find((field) => next[field])
    if (firstInvalid) {
      setSubmitted(false)
      const ids: Record<Field, string> = { name: nameId, email: emailId, message: messageId, video: videoInputId }
      document.getElementById(ids[firstInvalid])?.focus()
      return
    }
    // There's no contact API: hand the message to the visitor's email app.
    const subjectText = fmt(copy.mailSubject, { name: name.trim() })
    const attached = method === "video" ? video : null
    const details = [
      `${copy.mailTopic}: ${copy.topics[topic]}`,
      organization.trim() ? `${copy.mailOrganization}: ${organization.trim()}` : null,
      `${copy.mailMethod}: ${copy.methods[method]}`,
      attached ? `${copy.mailVideo}: ${attached.name}` : null,
    ].filter(Boolean)
    const bodyText = `${message.trim()}\n\n${details.join("\n")}\n\n— ${name.trim()} (${email.trim()})`

    // A mailto: link can't carry files. Where the device can share files (most phones), open the
    // share sheet with the video attached; otherwise open the email app and remind them to attach it.
    if (attached && typeof navigator.canShare === "function" && navigator.canShare({ files: [attached] })) {
      try {
        await navigator.share({ title: subjectText, text: `${contactEmail}\n\n${bodyText}`, files: [attached] })
        setSendNote("shared")
        setSubmitted(true)
        return
      } catch (error) {
        // Closing the share sheet means "not now"; any other failure falls back to email below.
        if (error instanceof DOMException && error.name === "AbortError") return
      }
    }
    setSendNote(attached ? "attach" : null)
    setSubmitted(true)
    window.location.href = `mailto:${contactEmail}?subject=${encodeURIComponent(subjectText)}&body=${encodeURIComponent(bodyText)}`
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
      <Container fluid className="relative">
        <SectionTitle headingId="contact-heading" eyebrow={copy.eyebrow} title={copy.title} />
        <SignVideoButton videoKey="contact" className="mt-6" />

        {/* Form + channel cards: stacked on mobile, side by side (in normal flow) on large screens. */}
        <div className="relative mt-16 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)] lg:items-start lg:gap-8">
          <Reveal className="relative z-10" y={26}>
            <GlassPanel className="p-6 sm:p-9">
              <p className="text-xs font-semibold tracking-[0.2em] text-[#1D4ED8] uppercase">{copy.formEyebrow}</p>
              <h3 className="mt-2 text-xl font-semibold text-foreground">{copy.formTitle}</h3>

              {/* How sending works, as a picture: there's no contact API, the visitor's own email app sends it. */}
              <div className={cn("mt-5 px-3 py-4", popStage)}>
                <FlowSteps numbered steps={copy.flow.map((label, i) => ({ label, icon: FLOW_ICONS[i] }))} className="flex-wrap gap-y-3 sm:gap-4" />
              </div>
              <ol className="sr-only">
                {copy.flow.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>

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
                  {/* One tile per way to get in touch, each with its picture; the radio stays visible. */}
                  <div className="mt-3 grid gap-2.5 sm:grid-cols-3">
                    {CONTACT_METHODS.map((value) => {
                      const Icon = METHOD_ICONS[value]
                      const selected = method === value
                      return (
                        <label
                          key={value}
                          className={cn(
                            "flex cursor-pointer items-center gap-3 rounded-2xl border p-3 text-sm font-semibold transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-[color:var(--primary)] has-[:focus-visible]:ring-offset-2",
                            selected
                              ? "border-[color:var(--primary)]/45 bg-[color:var(--primary)]/[0.06] text-black"
                              : "border-border bg-card text-black hover:border-[color:var(--primary)]/30",
                          )}
                        >
                          <span aria-hidden="true" className={cn(selected ? popBrandTile : popTile, "size-10")}>
                            <Icon className="size-5" />
                          </span>
                          <span className="min-w-0 flex-1 leading-snug">{copy.methods[value]}</span>
                          <input
                            type="radio"
                            name="method"
                            value={value}
                            checked={selected}
                            onChange={() => chooseMethod(value)}
                            className="size-4 shrink-0 accent-[#c0341b]"
                          />
                        </label>
                      )
                    })}
                  </div>
                </fieldset>

                {method === "video" ? (
                  <div>
                    {/* Visually hidden file input; the styled labels open it. On phones the picker also offers to record. */}
                    <input
                      ref={videoInputRef}
                      id={videoInputId}
                      type="file"
                      accept="video/*"
                      className="peer sr-only"
                      aria-invalid={errors.video ? true : undefined}
                      aria-describedby={errors.video ? `${videoInputId}-hint ${videoInputId}-error` : `${videoInputId}-hint`}
                      onChange={(e) => {
                        const file = e.target.files?.[0] ?? null
                        // Reset so choosing the same file again still fires a change.
                        e.target.value = ""
                        if (file) pickVideo(file)
                      }}
                    />
                    {video && videoUrl ? (
                      <div className="flex flex-col gap-4 rounded-2xl border border-[color:var(--primary)]/20 bg-[color:var(--primary)]/6 p-4 sm:flex-row sm:items-center">
                        <video
                          src={videoUrl}
                          controls
                          playsInline
                          preload="metadata"
                          aria-label={fmt(copy.video.previewLabel, { file: video.name })}
                          className="aspect-video w-full rounded-xl bg-black object-contain sm:w-56"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-foreground" dir="ltr">
                            {video.name}
                          </p>
                          <p className="mt-0.5 text-xs text-black">{toMb(video.size)} MB</p>
                          <div className="mt-3 flex flex-wrap gap-2">
                            <label
                              htmlFor={videoInputId}
                              className={cn(popSecondaryButton, popButtonSizes.sm, "cursor-pointer peer-focus-visible:ring-2 peer-focus-visible:ring-[color:var(--primary)]")}
                            >
                              <RefreshCw className="size-4" aria-hidden="true" />
                              {copy.video.change}
                            </label>
                            <button
                              type="button"
                              onClick={() => {
                                setVideo(null)
                                setErrors((prev) => ({ ...prev, video: undefined }))
                                videoInputRef.current?.focus()
                              }}
                              className={cn(popSecondaryButton, popButtonSizes.sm)}
                            >
                              <X className="size-4" aria-hidden="true" />
                              {copy.video.remove}
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <label
                        htmlFor={videoInputId}
                        className={cn(
                          "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-4 py-8 text-center transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-[color:var(--primary)] peer-focus-visible:ring-offset-2",
                          errors.video
                            ? "border-[#B91C1C]/60 bg-[#B91C1C]/5"
                            : "border-[color:var(--primary)]/30 bg-background/60 hover:border-[color:var(--primary)]/60 hover:bg-[color:var(--primary)]/5",
                        )}
                      >
                        <span className={cn(popBrandTile, "size-11 rounded-full")}>
                          <Video className="size-5" aria-hidden="true" />
                        </span>
                        <span className="text-sm font-semibold text-[#1D4ED8]">{copy.video.choose}</span>
                      </label>
                    )}
                    <p id={`${videoInputId}-hint`} className="mt-2 text-xs leading-5 text-black">
                      {copy.video.hint}
                    </p>
                    {errors.video ? (
                      <p id={`${videoInputId}-error`} className="mt-1.5 text-sm font-medium text-[#B91C1C]">
                        {errors.video}
                      </p>
                    ) : null}
                  </div>
                ) : null}

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
                      <p className="font-semibold">{sendNote === "shared" ? copy.statusShared : copy.statusTitle}</p>
                      {sendNote === "attach" && video ? (
                        <p className="mt-1 font-semibold text-[#C2410C]">{fmt(copy.statusAttach, { file: video.name })}</p>
                      ) : null}
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
                // Keyed by position: the channels can share one address, so the email isn't unique.
                <motion.div key={i} variants={staggerItem} className={i === 2 ? "sm:col-span-2 lg:col-span-1" : undefined}>
                  <GlassPanel className="p-5">
                    <div className="flex items-start gap-4">
                      <span aria-hidden="true" className={cn(popTile, "size-11")}>
                        <Icon className="size-5" />
                      </span>
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

