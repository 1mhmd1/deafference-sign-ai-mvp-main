"use client"

import { useCallback, useEffect, useId, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { Hand, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { useI18n } from "@/i18n/use-i18n"
import { focusRingPop, popBrandTile, popSecondaryButton } from "./ui/pop"
import { SIGN_VIDEOS, type SignVideoKey } from "./sign-videos"

const FOCUSABLE = 'button, [href], video[controls], [tabindex]:not([tabindex="-1"])'

/**
 * "Watch in sign language": opens the page's signed video (by a Deaf signer) in a dialog, with
 * captions in the page's language. Renders nothing until a video is listed in sign-videos.ts, so
 * no placeholder ever shows. `className` is for the wrapper's spacing/alignment where it's placed;
 * `look="df"` draws it as the home page design's small "Watch in sign" chip (df.css `.df-signbtn`).
 */
export function SignVideoButton({
  videoKey,
  className,
  look = "pop",
}: {
  videoKey: SignVideoKey
  className?: string
  look?: "pop" | "df"
}) {
  const { t, locale } = useI18n()
  const copy = t.landing.signVideo
  const video = SIGN_VIDEOS[videoKey]?.[locale]
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const close = useCallback(() => {
    setOpen(false)
    triggerRef.current?.focus()
  }, [])

  if (!video) return null

  return (
    <div className={className}>
      {look === "df" ? (
        <button ref={triggerRef} type="button" onClick={() => setOpen(true)} aria-haspopup="dialog" className="df-signbtn">
          <Hand className="df-icon size-[18px]" aria-hidden="true" />
          <span>{copy.watch}</span>
          <small>· {video.signLanguage}</small>
        </button>
      ) : (
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setOpen(true)}
          aria-haspopup="dialog"
          className={cn(popSecondaryButton, "h-12 ps-1.5 pe-5 text-sm")}
        >
          <span aria-hidden="true" className={cn(popBrandTile, "size-9 rounded-full")}>
            <Hand className="size-[18px]" />
          </span>
          {copy.watch}
          <small className="text-xs font-semibold text-[color:var(--primary)]">· {video.signLanguage}</small>
        </button>
      )}
      {open ? (
        <SignVideoDialog
          src={video.src}
          captions={video.captions}
          poster={video.poster}
          signLanguage={video.signLanguage}
          onClose={close}
        />
      ) : null}
    </div>
  )
}

/**
 * The player, portalled to <body> so no transformed section can trap it. Modal: Escape or the close
 * button closes it, Tab stays inside, and the page behind doesn't scroll. It plays straight away
 * because the visitor asked for it; captions are on by default.
 */
function SignVideoDialog({
  src,
  captions,
  poster,
  signLanguage,
  onClose,
}: {
  src: string
  captions?: string
  poster?: string
  signLanguage: string
  onClose: () => void
}) {
  const { t, locale, dir } = useI18n()
  const copy = t.landing.signVideo
  const titleId = useId()
  const panelRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    closeRef.current?.focus()
    const previous = document.body.style.overflow
    document.body.style.overflow = "hidden"
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault()
        onClose()
        return
      }
      if (event.key !== "Tab") return
      const items = Array.from(panelRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? [])
      if (items.length === 0) return
      const first = items[0]
      const last = items[items.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    document.addEventListener("keydown", onKeyDown)
    return () => {
      document.body.style.overflow = previous
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [onClose])

  return createPortal(
    <div dir={dir} className="fixed inset-0 z-[80] flex items-center justify-center p-3 sm:p-6">
      <div aria-hidden="true" className="absolute inset-0 bg-[rgba(10,6,12,0.72)]" onClick={onClose} />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative flex max-h-full w-full max-w-3xl flex-col overflow-hidden rounded-3xl bg-[#fff] shadow-2xl dark:bg-[#1e151d]"
      >
        <div className="flex items-center justify-between gap-3 px-5 py-4">
          {/* Divs, not headings/paragraphs: outside the landing wrapper, globals.css forces those black. */}
          <div className="flex min-w-0 items-center gap-3">
            <div aria-hidden="true" className={cn(popBrandTile, "size-10 rounded-full")}>
              <Hand className="size-5" />
            </div>
            <div className="min-w-0">
              <div id={titleId} role="heading" aria-level={2} className="text-base font-bold text-[#24222f] dark:text-[#f3e9ec]">
                {copy.title}
              </div>
              <div className="text-xs font-semibold text-[#a3260f] dark:text-[#ffb38a]">{signLanguage}</div>
            </div>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label={copy.close}
            className={cn(
              "grid size-10 shrink-0 place-items-center rounded-full bg-[rgba(15,23,42,0.06)] text-[#24222f] hover:bg-[rgba(15,23,42,0.12)] dark:bg-[rgba(255,255,255,0.1)] dark:text-[#f3e9ec]",
              focusRingPop,
            )}
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>
        {failed ? (
          <div role="alert" className="mx-5 mb-5 rounded-2xl bg-[rgba(15,23,42,0.05)] p-6 text-center text-sm font-semibold text-[#24222f] dark:bg-[rgba(255,255,255,0.06)] dark:text-[#f3e9ec]">
            {copy.error}
          </div>
        ) : (
          <video
            src={src}
            poster={poster}
            controls
            autoPlay
            playsInline
            preload="metadata"
            aria-labelledby={titleId}
            onError={() => setFailed(true)}
            className="aspect-video max-h-[75vh] w-full bg-black object-contain"
          >
            {captions ? <track kind="captions" src={captions} srcLang={locale} label={copy.captions} default /> : null}
          </video>
        )}
      </div>
    </div>,
    document.body,
  )
}
