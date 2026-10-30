"use client"

import { motion } from "framer-motion"
import {
  ArchiveX,
  ArrowRight,
  Camera,
  Captions,
  Eraser,
  Eye,
  Hand,
  KeyRound,
  Lock,
  Mail,
  Mic,
  Pencil,
  ShieldCheck,
  Trash2,
  UserRound,
  Video,
  type LucideIcon,
} from "lucide-react"
import { Container } from "@/components/shared/container"
import { SectionTitle } from "@/components/shared/section-title"
import { cn } from "@/lib/utils"
import { useI18n } from "@/i18n/use-i18n"
import type { LandingMessages } from "@/i18n/messages/landing"
import { GlassPanel, Reveal, focusRingPop, popBrandTile, popStage, popTile, staggerContainer, staggerItem } from "./ui/pop"
import { PrivacyVisual } from "./why-choose-us"
import { SignVideoButton } from "./sign-video"

type PrivacyCopy = LandingMessages["privacy"]

/** Icons zipped by index with `t.landing.privacy.rights.items`. */
const RIGHT_ICONS: LucideIcon[] = [Eye, Trash2, Mail, Eraser]

const ARROW = "size-4 shrink-0 text-[color:var(--primary)] rtl:-scale-x-100"

/** "Only when you ask": the browser's own permission prompt for the camera and microphone. */
function PermissionVisual({ copy }: { copy: PrivacyCopy["visual"] }) {
  return (
    <div className="w-full max-w-[17rem] rounded-2xl bg-white p-3.5 shadow-[0_14px_30px_-18px_rgba(94,15,69,0.5)] ring-1 ring-[color:var(--primary)]/12">
      <div className="flex items-center gap-2.5">
        <div className="flex gap-1.5">
          <div className={cn(popTile, "size-8")}>
            <Camera className="size-4" />
          </div>
          <div className={cn(popTile, "size-8")}>
            <Mic className="size-4" />
          </div>
        </div>
        <div className="text-xs leading-snug font-semibold text-black">{copy.prompt}</div>
      </div>
      <div className="mt-3 flex justify-end gap-2">
        <div className="rounded-full px-3 py-1 text-xs font-semibold text-black ring-1 ring-[rgba(15,23,42,0.15)] dark:ring-[rgba(255,255,255,0.2)]">{copy.block}</div>
        <div className="on-brand rounded-full bg-gradient-to-r from-[#D63C1A] to-[#B01030] px-3 py-1 text-xs font-semibold text-white">{copy.allow}</div>
      </div>
    </div>
  )
}

/** "No recordings saved": video in, translation out, and nothing kept in the account. */
function NoRecordingsVisual({ notSaved }: { notSaved: string }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex items-center gap-2">
        <div className={cn(popTile, "size-11")}>
          <Video className="size-5" />
        </div>
        <ArrowRight className={ARROW} />
        <div className="grid size-11 place-items-center rounded-full bg-white shadow-[0_0_0_4px_rgba(242,140,26,0.16)]">
          <img src="/deafference-mark.png" alt="" className="size-6 object-contain" />
        </div>
        <ArrowRight className={ARROW} />
        <div className={cn(popTile, "size-11")}>
          <Captions className="size-5" />
        </div>
      </div>
      <div className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-black ring-1 ring-[color:var(--primary)]/15">
        <ArchiveX className="size-4 text-[color:var(--primary)]" />
        {notSaved}
      </div>
    </div>
  )
}

/** "Only what your account needs": a profile card with just those fields (email, encrypted password, sign language, camera choice). */
function AccountDataVisual() {
  const rows: { icon: LucideIcon; width: string; secret?: boolean }[] = [
    { icon: Mail, width: "w-20" },
    { icon: Lock, width: "w-14", secret: true },
    { icon: Hand, width: "w-16" },
    { icon: Camera, width: "w-10" },
  ]
  return (
    <div className="flex w-full max-w-[15rem] items-start gap-3 rounded-2xl bg-white p-3.5 shadow-[0_14px_30px_-18px_rgba(94,15,69,0.5)] ring-1 ring-[color:var(--primary)]/12">
      <div className={cn(popBrandTile, "size-10 rounded-full")}>
        <UserRound className="size-5" />
      </div>
      <div className="flex flex-1 flex-col gap-2 pt-0.5">
        {/* Arbitrary colours: the dark theme remaps `bg-white/…` classes. */}
        <div className="h-2 w-24 rounded-full bg-[rgba(15,23,42,0.7)] dark:bg-[rgba(255,255,255,0.7)]" />
        {rows.map(({ icon: Icon, width, secret }, i) => (
          <div key={i} className="flex items-center gap-2">
            <Icon className="size-3.5 text-[color:var(--primary)]" />
            {secret ? (
              <b className="text-[10px] leading-none tracking-[0.2em] text-black">••••••</b>
            ) : (
              <div className={cn("h-1.5 rounded-full bg-[color:var(--primary)]/20", width)} />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

/** "You're in control": the profile page's own controls: edit, change password, delete. */
function ControlVisual() {
  const tools: LucideIcon[] = [Pencil, KeyRound, Trash2]
  return (
    // Wraps onto two lines on a phone with large text.
    <div className="flex flex-wrap items-center justify-center gap-3">
      <div className={cn(popBrandTile, "size-14 rounded-full")}>
        <UserRound className="size-7" />
      </div>
      <ArrowRight className={ARROW} />
      <div className="flex gap-2">
        {tools.map((Icon, i) => (
          <div key={i} className={cn(popTile, "size-11")}>
            <Icon className="size-5" />
          </div>
        ))}
      </div>
    </div>
  )
}

export function PrivacyPolicy() {
  const { t } = useI18n()
  const copy = t.landing.privacy
  const principleVisuals = [
    <PermissionVisual key="ask" copy={copy.visual} />,
    <NoRecordingsVisual key="kept" notSaved={t.landing.why.visual.notSaved} />,
    <AccountDataVisual key="data" />,
    <ControlVisual key="control" />,
  ]
  return (
    <section
      id="privacy"
      aria-labelledby="privacy-heading"
      className="relative overflow-hidden py-24 sm:py-28"
    >

      <Container fluid className="relative">
        <SectionTitle
          headingId="privacy-heading"
          eyebrow={copy.eyebrow}
          title={copy.title}
        />
        <SignVideoButton videoKey="security" className="mt-6" />

        {/* The whole idea in one picture: camera and mic on during a session, off after it, nothing kept. */}
        <Reveal className="mt-10" delay={0.05}>
          <GlassPanel className="flex flex-col gap-6 p-6 sm:p-8 lg:flex-row lg:items-center lg:gap-10">
            <div className="lg:max-w-sm">
              <div className={cn(popBrandTile, "size-12 rounded-2xl")} aria-hidden="true">
                <ShieldCheck className="size-6" />
              </div>
              <p className="mt-4 text-xs font-semibold tracking-[0.14em] text-[color:var(--primary)] uppercase">{copy.badge}</p>
              <p className="mt-2 text-sm leading-7 text-black sm:text-base">{copy.description}</p>
            </div>
            <div aria-hidden="true" className={cn("flex min-h-44 flex-1 items-center justify-center p-5", popStage)}>
              <PrivacyVisual copy={t.landing.why.visual} />
            </div>
          </GlassPanel>
        </Reveal>

        <motion.ul
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="mt-5 grid gap-5 sm:grid-cols-2"
        >
          {copy.principles.map((item, i) => (
            <motion.li key={item.title} variants={staggerItem} className="flex">
              <GlassPanel className="flex w-full flex-col p-5 sm:p-6">
                <div aria-hidden="true" className={cn("flex h-40 items-center justify-center p-4", popStage)}>
                  {principleVisuals[i]}
                </div>
                <h3 className="mt-5 text-lg font-semibold text-black">{item.title}</h3>
                <p className="mt-1.5 text-sm leading-7 text-black">{item.description}</p>
              </GlassPanel>
            </motion.li>
          ))}
        </motion.ul>

        <Reveal delay={0.05} className="mt-5">
          <GlassPanel className="p-6 sm:p-8">
            <h3 className="text-lg font-semibold text-black">{copy.rights.title}</h3>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {copy.rights.items.map((right, i) => {
                const Icon = RIGHT_ICONS[i] ?? ShieldCheck
                return (
                  <li key={right} className={cn("flex items-start gap-3 p-3.5 text-sm leading-6 text-black", popStage)}>
                    <span aria-hidden="true" className={cn(popTile, "size-10")}>
                      <Icon className="size-5" />
                    </span>
                    <span className="pt-2">{right}</span>
                  </li>
                )
              })}
            </ul>
          </GlassPanel>
        </Reveal>

        <Reveal delay={0.1} className="mt-5">
          <GlassPanel className="flex items-center gap-4 p-6">
            <span aria-hidden="true" className={cn(popBrandTile, "size-11 rounded-xl")}>
              <Mail className="size-5" />
            </span>
            <p className="text-sm leading-7 text-black">
              {copy.contact}{" "}
              <a
                href="mailto:fatima@deafference.com"
                dir="ltr"
                className={cn("rounded-sm font-semibold text-[color:var(--primary)] underline underline-offset-4", focusRingPop)}
              >
                fatima@deafference.com
              </a>
            </p>
          </GlassPanel>
        </Reveal>
      </Container>
    </section>
  )
}
