"use client"

import { Fragment, useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from "react"
import { cn } from "@/lib/utils"
import { useI18n } from "@/i18n/use-i18n"
import { CONTACT_TOPICS, TOPIC_EMAIL, onContactTopic, topicFromUrl, type ContactTopic } from "../contact-intent"
import { DfIcon, Kicker, type IconName, type Tone } from "../home/df-ui"
import { PageArt, PageHero } from "./page-ui"

const CONTACT_METHODS = ["email", "video", "chat"] as const
type ContactMethod = (typeof CONTACT_METHODS)[number]
const METHOD_ICONS: Record<ContactMethod, IconName> = { email: "mail", video: "camera", chat: "speech" }
/** Pictograms for `t.landing.contact.flow`: write, the email app opens, the team replies. */
const FLOW_ICONS: IconName[] = ["pen", "mail", "reply"]
const FLOW_TONES: Tone[] = ["flame", "ruby", "plum"]
const MESSAGE_MIN_LENGTH = 10
/** Most email apps refuse attachments over ~25 MB. */
const VIDEO_MAX_BYTES = 25 * 1024 * 1024
const toMb = (bytes: number) => (bytes / (1024 * 1024)).toFixed(1)
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Addresses and pictures zipped by index with `t.landing.contact.channels`. */
const CHANNELS: { icon: IconName; tone: Tone; email: string }[] = [
  { icon: "mail", tone: "ruby", email: "fatima@deafference.com" },
  { icon: "users", tone: "plum", email: "fatima@deafference.com" },
  { icon: "headset", tone: "flame", email: "fatima@deafference.com" },
]

type Field = "name" | "email" | "message" | "video"
type Errors = Partial<Record<Field, string>>

/** A label above its field (always visible), and the field's error underneath. */
function FormField({ id, label, error, children }: { id: string; label: string; error?: string; children: ReactNode }) {
  return (
    <div className="df-field">
      <label htmlFor={id} className="df-field__label">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="df-error">
          <DfIcon name="alert" size={18} />
          {error}
        </p>
      ) : null}
    </div>
  )
}

function ContactForm() {
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

  const describedBy = (field: Field, id: string) => (errors[field] ? `${id}-error` : undefined)

  return (
    <div className="df-card">
      <Kicker icon="pen">{copy.formEyebrow}</Kicker>
      <h2 id="df-form-t" className="df-mv__title">
        {copy.formTitle}
      </h2>

      {/* How sending works: there's no contact API, the visitor's own email app sends it. */}
      <ol className="df-steps3">
        {copy.flow.map((step, i) => (
          <Fragment key={step}>
            {i > 0 ? (
              <li className="df-steps3__arrow" aria-hidden="true">
                <DfIcon name="arrow" size={20} />
              </li>
            ) : null}
            <li className={`df-tone--${FLOW_TONES[i] ?? "ruby"}`}>
              <span className="df-well df-well--round df-well--raised" aria-hidden="true">
                <DfIcon name={FLOW_ICONS[i] ?? "check"} size={24} />
                <span className="df-well__badge">{i + 1}</span>
              </span>
              <span>{step}</span>
            </li>
          </Fragment>
        ))}
      </ol>

      <form onSubmit={handleSubmit} noValidate className="df-form">
        <div className="df-form__row">
          <FormField id={nameId} label={copy.name} error={errors.name}>
            <input
              id={nameId}
              name="name"
              autoComplete="name"
              required
              aria-required="true"
              aria-invalid={errors.name ? true : undefined}
              aria-describedby={describedBy("name", nameId)}
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={() => clearIfFixed("name")}
              className="df-input"
            />
          </FormField>
          <FormField id={emailId} label={copy.email} error={errors.email}>
            <input
              id={emailId}
              name="email"
              type="email"
              autoComplete="email"
              dir="ltr"
              required
              aria-required="true"
              aria-invalid={errors.email ? true : undefined}
              aria-describedby={describedBy("email", emailId)}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => clearIfFixed("email")}
              className="df-input rtl:text-right"
            />
          </FormField>
        </div>

        <div className="df-form__row">
          <FormField id={organizationId} label={copy.organization}>
            <input
              id={organizationId}
              name="organization"
              autoComplete="organization"
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
              className="df-input"
            />
          </FormField>
          <FormField id={topicId} label={copy.topic}>
            <select id={topicId} name="topic" value={topic} onChange={(e) => setTopic(e.target.value as ContactTopic)} className="df-input">
              {CONTACT_TOPICS.map((value) => (
                <option key={value} value={value}>
                  {copy.topics[value]}
                </option>
              ))}
            </select>
          </FormField>
        </div>

        <fieldset className="df-fieldset">
          <legend className="df-field__label">{copy.method}</legend>
          {/* One tile per way to get in touch, each with its picture; the radio stays visible. */}
          <div className="df-radios">
            {CONTACT_METHODS.map((value) => {
              const selected = method === value
              return (
                <label key={value} className={cn("df-radio df-tone--ruby", selected && "is-on")}>
                  <span className={cn("df-well df-well--sm", selected && "df-well--solid")} aria-hidden="true">
                    <DfIcon name={METHOD_ICONS[value]} size={22} />
                  </span>
                  <span>{copy.methods[value]}</span>
                  <input type="radio" name="method" value={value} checked={selected} onChange={() => chooseMethod(value)} />
                </label>
              )
            })}
          </div>
        </fieldset>

        {method === "video" ? (
          <div className="df-field">
            {/* Visually hidden file input; the styled labels open it. On phones the picker also offers to record. */}
            <input
              ref={videoInputRef}
              id={videoInputId}
              type="file"
              accept="video/*"
              className="df-sr df-sr-input"
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
              <div className="df-preview">
                <video src={videoUrl} controls playsInline preload="metadata" aria-label={fmt(copy.video.previewLabel, { file: video.name })} />
                <div className="df-preview__meta">
                  <p className="df-preview__name" dir="ltr">
                    {video.name}
                  </p>
                  <p className="df-small">{toMb(video.size)} MB</p>
                  <div className="df-row" style={{ marginTop: "var(--df-space-3)" }}>
                    <label htmlFor={videoInputId} className="df-btn df-btn--soft df-btn--sm df-drop-change">
                      <DfIcon name="repeat" size={18} />
                      {copy.video.change}
                    </label>
                    <button
                      type="button"
                      className="df-btn df-btn--soft df-btn--sm"
                      onClick={() => {
                        setVideo(null)
                        setErrors((prev) => ({ ...prev, video: undefined }))
                        videoInputRef.current?.focus()
                      }}
                    >
                      <DfIcon name="x" size={18} />
                      {copy.video.remove}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <label htmlFor={videoInputId} className={cn("df-drop", errors.video && "df-drop--error")}>
                <span className="df-well df-well--lg df-well--round df-well--solid df-tone--flame" aria-hidden="true">
                  <DfIcon name="camera" size={32} />
                </span>
                {copy.video.choose}
              </label>
            )}
            <p id={`${videoInputId}-hint`} className="df-small">
              {copy.video.hint}
            </p>
            {errors.video ? (
              <p id={`${videoInputId}-error`} className="df-error">
                <DfIcon name="alert" size={18} />
                {errors.video}
              </p>
            ) : null}
          </div>
        ) : null}

        <FormField id={messageId} label={copy.message} error={errors.message}>
          <textarea
            id={messageId}
            name="message"
            required
            aria-required="true"
            aria-invalid={errors.message ? true : undefined}
            aria-describedby={describedBy("message", messageId)}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onBlur={() => clearIfFixed("message")}
            className="df-input"
          />
        </FormField>

        <div>
          <button type="submit" className="df-btn df-btn--primary df-btn--lg">
            <DfIcon name="send" size={20} />
            {copy.submit}
          </button>
        </div>

        {/* Honest outcome: we can only open the visitor's email app, so say so and offer the address. */}
        <div role="status" aria-live="polite">
          {submitted ? (
            <div className="df-status">
              <p className="df-text--ink">{sendNote === "shared" ? copy.statusShared : copy.statusTitle}</p>
              {sendNote === "attach" && video ? <p className="df-status__warn">{fmt(copy.statusAttach, { file: video.name })}</p> : null}
              <p>
                {copy.statusBody}{" "}
                <a href={`mailto:${contactEmail}`} dir="ltr">
                  {contactEmail}
                </a>
              </p>
              <button type="button" onClick={copyAddress} className="df-btn df-btn--soft df-btn--sm">
                <DfIcon name={copied ? "check" : "copy"} size={18} />
                {copied ? copy.copied : copy.copy}
              </button>
            </div>
          ) : null}
        </div>
      </form>
    </div>
  )
}

/** /contact: the message form (it opens the visitor's email app) beside the team's addresses. Accepts ?topic=. */
export function ContactBody() {
  const { t } = useI18n()
  const copy = t.landing.contact

  return (
    <>
      <PageHero
        id="df-page-t"
        crumb={t.landing.nav.links.contact}
        crumbIcon="mail"
        title={copy.title}
        lead={copy.description}
        videoKey="contact"
        art={
          <PageArt
            tone="flame"
            icon="mail"
            badge="hand"
            pills={copy.flow.map((label, i) => ({ label, n: i + 1, tone: FLOW_TONES[i] ?? "ruby" }))}
          />
        }
      />
      <section className="df df-section df-section--sunken" id="message" aria-labelledby="df-form-t">
        <div className="df-wrap">
          <div className="df-contact">
            <ContactForm />
            <ul className="df-channels">
              {CHANNELS.map((channel, i) => {
                const text = copy.channels[i]
                return (
                  // Keyed by position: the channels can share one address.
                  <li key={i} className={cn("df-channel", `df-tone--${channel.tone}`)}>
                    <span className="df-well" aria-hidden="true">
                      <DfIcon name={channel.icon} size={26} />
                    </span>
                    <div className="min-w-0">
                      <h3>{text?.title}</h3>
                      <p className="df-text">{text?.description}</p>
                      <a href={`mailto:${channel.email}`} dir="ltr">
                        {channel.email}
                      </a>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </section>
    </>
  )
}
