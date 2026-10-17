"use client"

import { JudyCharacter } from "@/components/judy/judy-character"
import { useI18n } from "@/i18n/use-i18n"

/**
 * Judy greeting the visitor beside the auth card (above it on small screens):
 * she signs HELLO then WELCOME on a loop, with a caption naming each sign
 * (animations in judy-character.css, `.judy-signing-welcome`).
 */
export function JudyWelcome({ mode }: { mode: "signin" | "signup" }) {
  const { t } = useI18n()
  const copy = t.auth.judy

  return (
    <div className="flex w-full items-end gap-3 sm:gap-4 lg:w-auto lg:flex-1 lg:flex-col-reverse lg:items-center lg:gap-5">
      <div className="relative flex shrink-0 flex-col items-center">
        {/* Soft halo so she reads as part of the page, not pasted on. */}
        <span
          aria-hidden="true"
          className="absolute inset-x-0 bottom-6 top-6 rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.22),transparent_70%)]"
        />
        <JudyCharacter
          inline
          pose="idle"
          mood="happy"
          announce={false}
          label={copy.label}
          className="auth-judy judy-signing-welcome"
        />
        {/* Names the sign she is making right now; synced to her animation. */}
        <div aria-hidden="true" className="relative -mt-1 grid h-7 place-items-center lg:h-9">
          {[
            { key: "hello", text: copy.signHello },
            { key: "welcome", text: copy.signWelcome },
          ].map((sign) => (
            <span
              key={sign.key}
              className={`judy-sign-caption-${sign.key} col-start-1 row-start-1 whitespace-nowrap rounded-full bg-[color:var(--primary)] px-3 py-1 text-xs font-bold uppercase tracking-wider text-white! lg:text-sm`}
            >
              {sign.text}
            </span>
          ))}
        </div>
      </div>

      <div className="relative mb-12 min-w-0 flex-1 rounded-2xl rounded-es-sm border border-[color:var(--primary)]/15 bg-white/90 px-4 py-3 shadow-[0_12px_30px_-18px_rgba(30,64,175,0.45)] lg:mb-0 lg:max-w-xs lg:flex-none lg:rounded-es-2xl lg:px-5 lg:py-4">
        {/* Bubble tail: points at Judy (start side on small screens, down from `lg`). */}
        <span
          aria-hidden="true"
          className="absolute -start-1.5 bottom-2 size-3 rotate-45 border-b border-s border-[color:var(--primary)]/15 bg-white/90 lg:start-1/2 lg:-bottom-1.5 lg:-translate-x-1/2 lg:border-s-0 lg:border-e rtl:lg:translate-x-1/2"
        />
        <p className="text-base font-bold leading-6 lg:text-lg">{copy.greeting}</p>
        <p className="text-sm leading-5 lg:text-base lg:leading-6">{mode === "signup" ? copy.signup : copy.signin}</p>
      </div>
    </div>
  )
}
