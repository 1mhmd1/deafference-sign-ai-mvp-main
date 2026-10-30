"use client"

import { useId, type CSSProperties, type ReactNode } from "react"
import Link from "next/link"
import { JudyCharacter, type JudyPose } from "@/components/judy/judy-character"
import { cn } from "@/lib/utils"
import { SignVideoButton } from "../sign-video"
import type { SignVideoKey } from "../sign-videos"

/*
 * The building blocks of the website design (deafference-website.html), as React components that
 * render the same markup and classes as the design, so df.css styles them as drawn.
 * The design's stand-in drawing of Judy is replaced by Judy herself (JudyArt).
 */

export type Tone = "ruby" | "flame" | "plum" | "sun" | "sos"

/** CSS custom properties in a style prop. */
export type Vars = CSSProperties & Record<`--${string}`, string | number>

/* ---------- Icon: one stroke pictogram set, 24px grid, 2px round strokes ---------- */
const dot = (x: number, y: number) => `<circle cx="${x}" cy="${y}" r=".7" fill="currentColor"/>`
const ICONS = {
  hand: '<path d="M8 13V5.5a1.5 1.5 0 0 1 3 0V12"/><path d="M11 11.5V4a1.5 1.5 0 0 1 3 0v7.5"/><path d="M14 11.5V5.5a1.5 1.5 0 0 1 3 0V13"/><path d="M17 13v-2.5a1.5 1.5 0 0 1 3 0V15a7 7 0 0 1-7 7h-1.2a6 6 0 0 1-4.9-2.6l-3.1-4.6a1.6 1.6 0 0 1 2.6-1.9L8 15"/>',
  speech: '<path d="M4 4h16a1.5 1.5 0 0 1 1.5 1.5v10A1.5 1.5 0 0 1 20 17h-8l-5 4v-4H4a1.5 1.5 0 0 1-1.5-1.5v-10A1.5 1.5 0 0 1 4 4z"/><path d="M7 9h10M7 12.5h6"/>',
  mic: '<rect x="9" y="2.5" width="6" height="12" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21M9 21h6"/>',
  ear: '<path d="M6.5 9a5.5 5.5 0 0 1 11 0c0 3.5-3.5 4.5-3.5 8a3 3 0 0 1-6 0"/><path d="M9.5 9a2.5 2.5 0 0 1 5 0c0 1.5-1.5 2-2.5 2.5"/>',
  earoff: '<path d="M6.5 9a5.5 5.5 0 0 1 11 0c0 3.5-3.5 4.5-3.5 8a3 3 0 0 1-6 0"/><path d="M9.5 9a2.5 2.5 0 0 1 5 0c0 1.5-1.5 2-2.5 2.5"/><path d="M3 3l18 18"/>',
  volume: '<path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="M15.5 9a4 4 0 0 1 0 6M18.5 6.5a7.5 7.5 0 0 1 0 11"/>',
  wave: '<path d="M3 10.5v3M7 8v8M11 4.5v15M15 7.5v9M19 10v4"/>',
  phone: '<rect x="6" y="2" width="12" height="20" rx="3"/><path d="M10.5 18.5h3"/>',
  captions: '<rect x="2.5" y="5" width="19" height="14" rx="3"/><path d="M10.5 10.2a2.2 2.2 0 1 0 0 3.6M17 10.2a2.2 2.2 0 1 0 0 3.6"/>',
  eye: '<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  hospital: '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M12 7v6M9 10h6M10 21v-3.5h4V21"/>',
  siren: '<path d="M6.5 18v-5.5a5.5 5.5 0 0 1 11 0V18"/><rect x="4" y="18" width="16" height="3" rx="1"/><path d="M12 2.5v2M4 5.5l1.5 1.5M20 5.5L18.5 7M12 11v3"/>',
  ambulance: '<path d="M5 17H3V7h11v10M9 17h5.5M18.5 17H21v-4l-2.5-3H14"/><circle cx="7" cy="17" r="2"/><circle cx="16.5" cy="17" r="2"/><path d="M8.5 9.5v4M6.5 11.5h4"/>',
  playfill: '<path d="M8 5.5l11 6.5-11 6.5z" fill="currentColor"/>',
  play: '<circle cx="12" cy="12" r="9.5"/><path d="M10 8.5l5.5 3.5-5.5 3.5z" fill="currentColor"/>',
  lock: '<rect x="5" y="10.5" width="14" height="10.5" rx="2.5"/><path d="M8 10.5V7a4 4 0 0 1 8 0v3.5M12 14.5v2.5"/>',
  camera: '<rect x="2.5" y="6" width="13" height="12" rx="2.5"/><path d="M15.5 10l6-3v10l-6-3z"/>',
  recoff: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3.5" fill="currentColor"/><path d="M5.6 5.6l12.8 12.8"/>',
  clock: '<circle cx="12" cy="12" r="9.5"/><path d="M12 7v5l3.5 2"/>',
  paper: '<path d="M6 2.5h8.5L19 7v14.5H6z"/><path d="M14 2.5V7h5M9 12h7M9 16h7"/>',
  globe: '<circle cx="12" cy="12" r="9.5"/><ellipse cx="12" cy="12" rx="4" ry="9.5"/><path d="M2.5 12h19"/>',
  mail: '<rect x="2.5" y="5" width="19" height="14" rx="2.5"/><path d="M3 7l9 6.5L21 7"/>',
  question: '<circle cx="12" cy="12" r="9.5"/><path d="M9.3 9.3a2.8 2.8 0 1 1 3.9 2.6c-.7.3-1.2.9-1.2 1.7v.6"/>' + dot(12, 17.3),
  shield: '<path d="M12 2.5l8 3v6c0 5-3.4 8.6-8 10-4.6-1.4-8-5-8-10v-6z"/><path d="M8.5 12l2.5 2.5 4.5-5"/>',
  tag: '<path d="M3 12.5V4a1 1 0 0 1 1-1h8.5l8.5 8.5-9.5 9.5z"/><circle cx="7.5" cy="7.5" r="1.5"/>',
  contrast: '<circle cx="12" cy="12" r="9.5"/><path d="M12 2.5a9.5 9.5 0 0 1 0 19z" fill="currentColor"/>',
  textsize: '<path d="M3 19L8 5h1l5 14M4.8 14.5h7.4"/><path d="M15 19l3-8 3 8M16 16.5h4"/>',
  motion: '<path d="M2.5 8h6M2.5 12h4M2.5 16h6"/><circle cx="15.5" cy="12" r="5.5"/>',
  moon: '<path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5z"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8"/>',
  check: '<path d="M4.5 12.5l5 5L19.5 7"/>',
  x: '<path d="M6 6l12 12M18 6L6 18"/>',
  arrow: '<path d="M4 12h16M14 6l6 6-6 6"/>',
  arrowup: '<path d="M12 20V4M6 10l6-6 6 6"/>',
  chev: '<path d="M9 5l7 7-7 7"/>',
  swap: '<path d="M4 8h15M15 4l4 4-4 4M20 16H5M9 12l-4 4 4 4"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  useroff: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/><path d="M3 3l18 18"/>',
  pill: '<g transform="rotate(-35 12 12)"><rect x="2.5" y="8" width="19" height="8" rx="4"/><path d="M12 8H6.5a4 4 0 0 0 0 8H12z" fill="currentColor"/></g>',
  alert: '<path d="M12 3.5L21.5 20h-19z"/><path d="M12 10v4.5"/>' + dot(12, 17.2),
  stethoscope: '<path d="M5 3v5a4.5 4.5 0 0 0 9 0V3"/><path d="M9.5 12.5v2a5 5 0 0 0 10 0V12"/><circle cx="19.5" cy="10" r="2"/>',
  pen: '<path d="M4 20l1-4.5L16 4.5l3.5 3.5-11 11z"/><path d="M14 7l3.5 3.5"/>',
  bolt: '<path d="M13 2.5L4.5 13.5H11l-1 8L19.5 10H13z"/>',
  sliders: '<path d="M4 7h16M4 17h16"/><circle cx="9" cy="7" r="2.5" style="fill:var(--df-surface-raised)"/><circle cx="15" cy="17" r="2.5" style="fill:var(--df-surface-raised)"/>',
  info: '<circle cx="12" cy="12" r="9.5"/><path d="M12 11v6"/>' + dot(12, 7.6),
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  a11y: '<circle cx="12" cy="4.5" r="1.8"/><path d="M4.5 8.5l7.5 1.5 7.5-1.5M12 10v4.5M12 14.5L8.5 21M12 14.5l3.5 6.5"/>',
  keyboard: '<rect x="2.5" y="6" width="19" height="12" rx="2.5"/><path d="M6.5 10h1M10.5 10h1M14.5 10h1M8 14h8"/>',
  heart: '<path d="M12 20.5s-8.5-5-8.5-11A4.8 4.8 0 0 1 12 6.6a4.8 4.8 0 0 1 8.5 2.9c0 6-8.5 11-8.5 11z"/>',
  clipboard: '<rect x="5" y="4" width="14" height="17.5" rx="2"/><path d="M9 4V2.5h6V4M8.5 11l2 2 4-4M8.5 17h7"/>',
  expand: '<path d="M14 3.5h6.5V10M10 20.5H3.5V14M20.5 3.5l-7 7M3.5 20.5l7-7"/>',
  pin: '<path d="M12 21.5s-7-6.2-7-11.5a7 7 0 0 1 14 0c0 5.3-7 11.5-7 11.5z"/><circle cx="12" cy="10" r="2.5"/>',
  // Places and their little conversations (the scenarios panel).
  bed: '<path d="M3 5v15M3 16h18v4M21 16v-3a3 3 0 0 0-3-3h-7v6"/><circle cx="7" cy="12.5" r="2"/>',
  briefcase: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M3 13h18"/>',
  plane: '<path d="M12 2.5c.9 0 1.5.8 1.5 1.7V9l7.5 4.5v2L13.5 13v4.6l2.5 2V21L12 20l-4 1v-1.4l2.5-2V13L3 15.5v-2L10.5 9V4.2c0-.9.6-1.7 1.5-1.7z"/>',
  building: '<path d="M3 9.5L12 4l9 5.5z"/><path d="M5.5 10v8M10 10v8M14 10v8M18.5 10v8M3 21h18M4 18h16"/>',
  cap: '<path d="M2 9.5L12 5l10 4.5L12 14z"/><path d="M6 11.5V16c0 1.4 2.7 3 6 3s6-1.6 6-3v-4.5M22 9.5V15"/>',
  bell: '<path d="M3 19h18M5 19a7 7 0 0 1 14 0M12 12V9.5M10 9.5h4"/>',
  users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 4.6a3.5 3.5 0 0 1 0 6.8M18 13.6a6.5 6.5 0 0 1 3.5 6.4"/>',
  key: '<circle cx="8" cy="15" r="4.5"/><path d="M11.2 11.8L20 3M16.5 6.5l3 3M14 9l2 2"/>',
  idcard: '<rect x="2.5" y="5" width="19" height="14" rx="2.5"/><circle cx="8.5" cy="11" r="2"/><path d="M5.5 16a3 3 0 0 1 6 0M14 10h4.5M14 13.5h4.5"/>',
  book: '<path d="M12 6.5C10 5 7 4.5 3 4.5v14c4 0 7 .5 9 2 2-1.5 5-2 9-2v-14c-4 0-7 .5-9 2z"/><path d="M12 6.5v14"/>',
  repeat: '<path d="M17 2.5l3.5 3.5-3.5 3.5"/><path d="M3.5 11V9.5A3.5 3.5 0 0 1 7 6h13.5"/><path d="M7 21.5L3.5 18 7 14.5"/><path d="M20.5 13v1.5a3.5 3.5 0 0 1-3.5 3.5H3.5"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2.5"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  door: '<path d="M6 21V3.5h12V21M3.5 21h17"/><circle cx="14.5" cy="12.5" r=".9" fill="currentColor"/>',
  // The landing's own pages (pages/): about, pricing, security, contact and the rest.
  home: '<path d="M3.5 11L12 4l8.5 7"/><path d="M6 9.5V20h12V9.5"/><path d="M10 20v-5.5h4V20"/>',
  arrowdown: '<path d="M12 4v16M6 14l6 6 6-6"/>',
  back: '<path d="M20 12H4M10 6l-6 6 6 6"/>',
  chevdown: '<path d="M5 9l7 7 7-7"/>',
  cpu: '<rect x="6" y="6" width="12" height="12" rx="2.5"/><rect x="9.5" y="9.5" width="5" height="5" rx="1"/><path d="M9.5 2.5V6M14.5 2.5V6M9.5 18v3.5M14.5 18v3.5M2.5 9.5H6M2.5 14.5H6M18 9.5h3.5M18 14.5h3.5"/>',
  monitor: '<rect x="2.5" y="4" width="19" height="13" rx="2"/><path d="M8 21h8M12 17v4"/><path d="M10 8l4.5 2.5L10 13z" fill="currentColor"/>',
  target: '<circle cx="12" cy="12" r="9.5"/><circle cx="12" cy="12" r="5.5"/><circle cx="12" cy="12" r="1.6" fill="currentColor"/>',
  compass: '<circle cx="12" cy="12" r="9.5"/><path d="M15.8 8.2l-2.3 5.3-5.3 2.3 2.3-5.3z"/>',
  code: '<path d="M8 7l-5 5 5 5M16 7l5 5-5 5M13.5 4.5l-3 15"/>',
  laptop: '<rect x="4.5" y="5" width="15" height="10.5" rx="1.5"/><path d="M2.5 19h19"/>',
  tablet: '<rect x="5" y="2.5" width="14" height="19" rx="2.5"/><path d="M10.5 18.5h3"/>',
  languages: '<path d="M3 5.5h10M8 3v2.5M5 5.5c.6 3.4 3 6.4 6.5 8M11 5.5c-.8 4-3.6 7.4-8 9.5"/><path d="M13 21l4-10 4 10M14.5 17.5h5"/>',
  wifioff: '<path d="M3 3l18 18"/><path d="M2.5 9a14 14 0 0 1 5-3M21.5 9a14 14 0 0 0-9.8-4M5.5 12.5A9.5 9.5 0 0 1 9 10.2M18.5 12.5a9.5 9.5 0 0 0-2.4-1.8M9 16a4.5 4.5 0 0 1 6 0"/>' + dot(12, 19.5),
  plus: '<path d="M12 5v14M5 12h14"/>',
  userplus: '<circle cx="10" cy="8" r="4"/><path d="M2.5 21a7.5 7.5 0 0 1 15 0M19 8v6M16 11h6"/>',
  usercheck: '<circle cx="10" cy="8" r="4"/><path d="M2.5 21a7.5 7.5 0 0 1 15 0M15.5 11l2 2 4-4"/>',
  trash: '<path d="M4 6.5h16M9.5 6.5V4h5v2.5M6.5 6.5l1 14h9l1-14M10 10.5v6M14 10.5v6"/>',
  eraser: '<path d="M8.5 20.5l-5-5a2 2 0 0 1 0-2.8l8.7-8.7a2 2 0 0 1 2.8 0l5.2 5.2a2 2 0 0 1 0 2.8l-8 8.5zM8.5 20.5H20M9 10l6 6"/>',
  send: '<path d="M21 3L10.5 13.5M21 3l-6.5 18-4-7.5-7.5-4z"/>',
  reply: '<path d="M9.5 6.5L4 12l5.5 5.5"/><path d="M4 12h10a6 6 0 0 1 6 6v1.5"/>',
  copy: '<rect x="8" y="8" width="13" height="13" rx="2.5"/><path d="M16 8V5.5A2.5 2.5 0 0 0 13.5 3h-8A2.5 2.5 0 0 0 3 5.5v8A2.5 2.5 0 0 0 5.5 16H8"/>',
  headset: '<path d="M3.5 14.5V12a8.5 8.5 0 0 1 17 0v2.5"/><rect x="2.5" y="13.5" width="5" height="7" rx="2"/><rect x="16.5" y="13.5" width="5" height="7" rx="2"/>',
  sparkle: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M18.5 15.5l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7z"/>',
}
export type IconName = keyof typeof ICONS
/** Direction icons mirror in Arabic. */
const FLIP = new Set<IconName>(["arrow", "chev", "back", "send"])

export function DfIcon({
  name,
  size = 24,
  stroke = 2,
  label,
  className,
}: {
  name: IconName
  size?: number
  stroke?: number
  /** Accessible name; without one the icon is decorative. */
  label?: string
  className?: string
}) {
  return (
    <svg
      className={cn("df-icon", FLIP.has(name) && "df-icon--flip", className)}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...(label ? { role: "img", "aria-label": label } : { "aria-hidden": true, focusable: false })}
      // Constant path data from the design's icon set above.
      dangerouslySetInnerHTML={{ __html: ICONS[name] }}
    />
  )
}

/* ---------- HandSign: a geometric hand in real handshapes ---------- */
const FINGERS = [
  { x: 26, y: 14, w: 12, h: 54 },
  { x: 40, y: 8, w: 12, h: 60 },
  { x: 54, y: 12, w: 12, h: 56 },
  { x: 67, y: 24, w: 11, h: 44 },
]
const SHAPES = {
  open: { up: [1, 1, 1, 1], thumb: "out" },
  ily: { up: [1, 0, 0, 1], thumb: "out" },
  flat: { up: [1, 1, 1, 1], thumb: "in" },
} as const

export function HandSign({
  shape = "open",
  size = 120,
  wave,
  motion,
  className,
}: {
  shape?: keyof typeof SHAPES
  size?: number
  /** Waves gently (stops in calm mode). */
  wave?: boolean
  /** Two short motion lines beside the fingers. */
  motion?: boolean
  className?: string
}) {
  const s = SHAPES[shape]
  // The logo's gradient, unique per hand; useId's delimiters aren't safe inside url(#…).
  const id = `df-hg${useId().replace(/[^a-zA-Z0-9]/g, "")}`
  const fill = `url(#${id})`
  return (
    <svg
      className={cn("df-hand", wave && "df-hand--wave", className)}
      style={{ "--df-tone": "var(--df-flame)" } as Vars}
      width={size}
      height={Math.round(size * 1.1)}
      viewBox="-12 0 124 136"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2=".35" y2="1">
          <stop offset="0" style={{ stopColor: "var(--df-sun)" }} />
          <stop offset=".5" style={{ stopColor: "var(--df-flame)" }} />
          <stop offset="1" style={{ stopColor: "var(--df-ruby)" }} />
        </linearGradient>
      </defs>
      <rect className="df-hand__sleeve" x="31" y="100" width="40" height="34" rx="12" />
      {s.thumb === "out" ? (
        <rect className="df-hand__grad" fill={fill} x="-6.5" y="-40" width="13" height="44" rx="6.5" transform="translate(30 88) rotate(-44)" />
      ) : null}
      {FINGERS.map((f, i) =>
        s.up[i] ? <rect key={i} className="df-hand__grad" fill={fill} x={f.x} y={f.y} width={f.w} height={f.h} rx={f.w / 2} /> : null,
      )}
      <rect className="df-hand__grad" fill={fill} x="24" y="54" width="54" height="54" rx="22" />
      {FINGERS.map((f, i) =>
        s.up[i] ? null : (
          <rect key={i} className="df-hand__grad df-hand__fold" fill={fill} x={f.x} y="46" width={f.w} height="28" rx={f.w / 2} />
        ),
      )}
      {s.thumb === "in" ? <rect className="df-hand__grad df-hand__fold" fill={fill} x="22" y="74" width="40" height="14" rx="7" /> : null}
      {motion ? <path className="df-hand__motion" d="M88 22a16 16 0 0 1 7 15M94 6a30 30 0 0 1 12 27" /> : null}
    </svg>
  )
}

/* ---------- Avatar: an abstract person, toned by their side of the conversation ---------- */
export function Avatar({
  tone = "flame",
  size = 72,
  badge,
  label,
  className,
}: {
  tone?: Tone
  size?: number
  badge?: IconName
  label?: string
  className?: string
}) {
  return (
    <span
      className={cn("df-avatar", className)}
      style={{ "--df-tone": `var(--df-${tone})`, "--df-tone-soft": `var(--df-${tone}-soft)`, "--df-s": `${size}px` } as Vars}
    >
      <svg viewBox="0 0 64 64" aria-hidden="true" focusable="false">
        <circle className="df-avatar__bg" cx="32" cy="32" r="32" />
        <circle className="df-avatar__fig" cx="32" cy="25" r="10.5" />
        <path className="df-avatar__fig" d="M12 64a20 20 0 0 1 40 0z" />
      </svg>
      {badge ? (
        <span className="df-avatar__badge">
          <DfIcon name={badge} size={Math.max(14, Math.round(size * 0.24))} />
        </span>
      ) : null}
      {label ? <span className="df-sr">{label}</span> : null}
    </span>
  )
}

/** The Deafference ear mark on its own. */
export function Mark({ size = 40, className }: { size?: number; className?: string }) {
  return <img className={cn("df-mark", className)} src="/deafference-mark.webp" alt="" width={size} height={size} decoding="async" style={{ height: size }} />
}

/** The mark on a white app-icon tile. */
export function AppGlyph({ size = 56 }: { size?: number }) {
  return (
    <span className="df-appglyph" style={{ "--df-s": `${size}px` } as Vars} aria-hidden="true">
      <Mark size={Math.round(size * 0.66)} />
    </span>
  )
}

/** Judy herself where the design drew a stand-in. Decorative unless given a label. */
export function JudyArt({ size, pose = "wave", label }: { size: number; pose?: JudyPose; label?: string }) {
  return (
    <span className="df-judy-slot" style={{ width: size }} aria-hidden={label ? undefined : true}>
      <JudyCharacter inline size={size} pose={pose} announce={false} label={label} />
    </span>
  )
}

/* ---------- Chips, kickers, section heads ---------- */
export function Chip({
  icon,
  icons,
  joiner,
  tone,
  className,
  children,
}: {
  icon?: IconName
  icons?: IconName[]
  joiner?: IconName
  tone?: Tone
  className?: string
  children?: ReactNode
}) {
  const list = icons ?? (icon ? [icon] : [])
  return (
    <span className={cn("df-chip", tone && `df-chip--${tone}`, className)}>
      {list.map((name, i) => (
        <span key={`${name}-${i}`} className="contents">
          <DfIcon name={name} size={18} />
          {joiner && i < list.length - 1 ? <DfIcon name={joiner} size={14} className="df-chip__join" /> : null}
        </span>
      ))}
      {children ? <span>{children}</span> : null}
    </span>
  )
}

export function Kicker({ icon = "info", variant, children }: { icon?: IconName; variant?: "sos" | "on"; children: ReactNode }) {
  return (
    <span className={cn("df-kicker", variant && `df-kicker--${variant}`)}>
      <span className="df-kicker__icon">
        <DfIcon name={icon} size={16} />
      </span>
      {children}
    </span>
  )
}

/** A heading with the logo-gradient accent on its last words. */
export function AccentTitle({ lead, accent }: { lead: string; accent: string }) {
  return (
    <>
      {lead} <span className="df-grad">{accent}</span>
    </>
  )
}

export function SectionHead({
  id,
  kicker,
  kickerIcon,
  title,
  lead,
  videoKey,
  className,
}: {
  id: string
  /** Optional on the landing's own pages, where the page header already names the page. */
  kicker?: string
  kickerIcon?: IconName
  title: ReactNode
  lead?: string
  /** "Watch in sign language" appears beside the kicker once this section has a signed video. */
  videoKey?: SignVideoKey
  className?: string
}) {
  return (
    <header className={cn("df-sechead", className)}>
      {kicker || videoKey ? (
        <div className="df-sechead__row">
          {kicker ? <Kicker icon={kickerIcon}>{kicker}</Kicker> : null}
          {videoKey ? <SignVideoButton videoKey={videoKey} look="df" /> : null}
        </div>
      ) : null}
      <h2 className="df-title" id={id}>
        {title}
      </h2>
      {lead ? <p className="df-lead">{lead}</p> : null}
    </header>
  )
}

/* ---------- Conversation bubbles: who is talking is shown by colour, tail side and icon ---------- */
export function Bubble({
  side,
  text,
  icons,
  whoIcon,
  whoLabel,
  className,
}: {
  side: "sign" | "speech"
  text: string
  icons?: IconName[]
  whoIcon?: IconName
  /** "Signed" / "Spoken", read before the text. */
  whoLabel: string
  className?: string
}) {
  return (
    <div className={cn("df-bubble", `df-bubble--${side}`, className)}>
      <span className="df-bubble__who">
        <DfIcon name={side === "sign" ? "hand" : (whoIcon ?? "mic")} size={18} label={whoLabel} />
      </span>
      <span className="df-bubble__body">
        {icons?.length ? (
          <span className="df-bubble__icons">
            {icons.map((name) => (
              <DfIcon key={name} name={name} size={22} />
            ))}
          </span>
        ) : null}
        <span className="df-bubble__text">{text}</span>
      </span>
    </div>
  )
}

/* ---------- Picture tiles: a big picture and one or two words ---------- */
export function PictoTile({
  href,
  icon,
  badge,
  label,
  sub,
  tone = "ruby",
  size,
}: {
  href?: string
  icon: IconName
  badge?: IconName
  label: string
  sub?: string
  tone?: Tone
  size?: "sm" | "lg"
}) {
  const body = (
    <>
      <span className="df-tile__well" aria-hidden="true">
        <DfIcon name={icon} size={size === "sm" ? 28 : size === "lg" ? 52 : 40} stroke={size === "lg" ? 1.75 : 2} />
        {badge ? (
          <span className="df-tile__badge">
            <DfIcon name={badge} size={size === "lg" ? 22 : 16} />
          </span>
        ) : null}
      </span>
      <span className="df-tile__label">{label}</span>
      {sub ? (
        <span className="df-tile__sub">
          {sub}
          {href ? <DfIcon name="arrow" size={16} /> : null}
        </span>
      ) : null}
    </>
  )
  const className = cn("df-tile", `df-tone--${tone}`, size && `df-tile--${size}`)
  return href ? (
    <Link href={href} className={className}>
      {body}
    </Link>
  ) : (
    <div className={className}>{body}</div>
  )
}

export function PhoneMock({ size, children }: { size?: "sm"; children: ReactNode }) {
  return (
    <div className={cn("df-phone", size && `df-phone--${size}`)}>
      <div className="df-phone__screen">
        <div className="df-phone__bar">
          <span className="df-phone__cam" />
        </div>
        {children}
      </div>
    </div>
  )
}

/** Five bars that pulse like a voice. */
export function WaveBars({ tone = "plum", count = 5 }: { tone?: "plum" | "flame"; count?: number }) {
  return (
    <span className={cn("df-wavebars", `df-wavebars--${tone}`)} aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <i key={i} />
      ))}
    </span>
  )
}

/* ---------- TimeRing: minutes made visible ---------- */
export function TimeRing({ minutes, tone, unit }: { minutes: number; tone: Tone; unit: string }) {
  const r = 52
  const c = 2 * Math.PI * r
  const len = Math.min(1, minutes / 60) * c
  return (
    <figure className={cn("df-ring", `df-tone--${tone}`)} style={{ "--df-ring-len": len.toFixed(1), "--df-ring-c": c.toFixed(1) } as Vars}>
      <svg viewBox="0 0 128 128" aria-hidden="true" focusable="false">
        <circle className="df-ring__track" cx="64" cy="64" r={r} />
        {[0, 1, 2, 3].map((i) => {
          const a = (i * Math.PI) / 2
          return <circle key={i} className="df-ring__tick" cx={(64 + 52 * Math.sin(a)).toFixed(1)} cy={(64 - 52 * Math.cos(a)).toFixed(1)} r="2" />
        })}
        <circle className="df-ring__arc" cx="64" cy="64" r={r} transform="rotate(-90 64 64)" />
      </svg>
      <figcaption>
        <b>{minutes}</b>
        <span>{unit}</span>
      </figcaption>
    </figure>
  )
}
