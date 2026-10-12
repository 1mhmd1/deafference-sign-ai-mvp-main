"use client"

import { useRef } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { AudioLines, Hand, MessageSquareText } from "lucide-react"
import { Container } from "@/components/shared/container"
import { cn } from "@/lib/utils"
import { useI18n } from "@/i18n/use-i18n"
import { DeafferenceApp } from "./deafference-app"
import { AvatarStudio } from "./avatar-studio"
import { SpeechStudio } from "./speech-studio"
import { TranslateHeader } from "./translate-header"
import "@/components/shared/app-pop.css"

export type TranslateMode = "sign" | "avatar" | "speech"

const MODES: { id: TranslateMode; icon: typeof Hand }[] = [
  { id: "sign", icon: Hand },
  { id: "avatar", icon: MessageSquareText },
  { id: "speech", icon: AudioLines },
]

export function parseTranslateMode(value: string | null): TranslateMode {
  return value === "avatar" || value === "speech" ? value : "sign"
}

/** /translate: one route, three modes, synced to `?mode=sign|avatar|speech`. */
export function TranslateWorkspace() {
  const { t, dir } = useI18n()
  const s = t.studio.modes
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const mode = parseTranslateMode(searchParams.get("mode"))
  const initialText = mode === "avatar" ? searchParams.get("text") ?? "" : ""
  const tabRefs = useRef<Record<TranslateMode, HTMLButtonElement | null>>({ sign: null, avatar: null, speech: null })

  function select(next: TranslateMode) {
    if (next === mode) return
    // Drop ?text= when switching: it only prefills the avatar studio once.
    router.replace(`${pathname}?mode=${next}`, { scroll: false })
  }

  // Manual activation: arrows move focus, Enter/Space selects — so passing over
  // "Sign" doesn't start the camera.
  function handleKeyDown(event: React.KeyboardEvent<HTMLButtonElement>, index: number) {
    const forward = dir === "rtl" ? "ArrowLeft" : "ArrowRight"
    const back = dir === "rtl" ? "ArrowRight" : "ArrowLeft"
    let next: number
    if (event.key === forward) next = index + 1
    else if (event.key === back) next = index - 1
    else if (event.key === "Home") next = 0
    else if (event.key === "End") next = MODES.length - 1
    else return
    event.preventDefault()
    tabRefs.current[MODES[(next + MODES.length) % MODES.length].id]?.focus()
  }

  const label = { sign: s.sign, avatar: s.avatar, speech: s.speech }
  const hint = { sign: s.signHint, avatar: s.avatarHint, speech: s.speechHint }
  const title = { sign: t.app.header.title, avatar: s.avatar, speech: s.speech }

  return (
    <div className="landing-pop app-pop relative min-h-dvh text-foreground">
      <TranslateHeader title={title[mode]} />

      <Container fluid className="pt-6 sm:pt-8">
        <div className="flex flex-col items-center gap-3 text-center">
          <div
            role="tablist"
            aria-label={s.label}
            className="glass-pop grid w-full max-w-3xl grid-cols-1 gap-1.5 rounded-3xl p-1.5 sm:grid-cols-3 sm:rounded-full"
          >
            {MODES.map(({ id, icon: Icon }, index) => {
              const selected = id === mode
              return (
                <button
                  key={id}
                  ref={(node) => {
                    tabRefs.current[id] = node
                  }}
                  type="button"
                  role="tab"
                  id={`translate-tab-${id}`}
                  aria-selected={selected}
                  aria-controls="translate-panel"
                  tabIndex={selected ? 0 : -1}
                  onClick={() => select(id)}
                  onKeyDown={(event) => handleKeyDown(event, index)}
                  className={cn(
                    "flex min-h-12 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold whitespace-nowrap transition-all sm:text-base",
                    "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none",
                    selected
                      ? "bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] text-white shadow-[0_14px_32px_-12px_rgba(37,99,235,0.55)]"
                      : "text-brand-navy hover:bg-white/80",
                  )}
                >
                  <Icon className="size-5" aria-hidden="true" />
                  {label[id]}
                </button>
              )
            })}
          </div>
          <p className="text-sm text-muted-foreground sm:text-base">{hint[mode]}</p>
        </div>
      </Container>

      <div id="translate-panel" role="tabpanel" aria-labelledby={`translate-tab-${mode}`}>
        {mode === "sign" ? (
          <DeafferenceApp />
        ) : (
          <main className="py-6 sm:py-8">
            <Container fluid>{mode === "avatar" ? <AvatarStudio key={initialText} initialText={initialText} /> : <SpeechStudio />}</Container>
          </main>
        )}
      </div>
    </div>
  )
}
