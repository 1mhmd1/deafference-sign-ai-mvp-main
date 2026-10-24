"use client"

import { useEffect, useId, useState, type ReactNode } from "react"
import { AnimatePresence, LayoutGroup, motion } from "framer-motion"
import { ArrowLeftRight, ArrowRight, AudioLines, Cpu, Hand, MessageSquareText, Mic, MonitorPlay, type LucideIcon } from "lucide-react"
import { Container } from "@/components/shared/container"
import { cn } from "@/lib/utils"
import { useI18n } from "@/i18n/use-i18n"
import { useLandingReducedMotion } from "./calm-mode"
import { GlowOrb, PopEyebrow, Reveal } from "./ui/pop"

// Shared look for the three step diagrams: hairline strokes, neutral ink for structure,
// and a colour story: orange is speech, blue is sign. Step 1 is orange, step 2 turns
// orange into blue, step 3 is blue. No characters or faces.
const INK = "var(--brand-navy)"
const ACCENT = "var(--primary)"
const SOUND = "var(--brand-orange)"

function DiagramPanel({ children }: { children: ReactNode }) {
  return (
    <svg viewBox="0 0 240 104" fill="none" className="h-auto w-full max-w-[520px]" aria-hidden="true">
      {children}
    </svg>
  )
}

// Fixed bar heights (no randomness) so server and client render the same waveform.
const WAVEFORM = [6, 10, 16, 9, 22, 30, 18, 26, 38, 24, 32, 44, 28, 36, 22, 30, 40, 26, 18, 28, 14, 20, 10, 16, 8, 12, 6] as const

/** Step 1: a recording panel: microphone input and a live waveform with a moving playhead. */
function SpeechCaptureVisual({ active }: { active: boolean }) {
  const startX = 66
  const step = 5.6
  return (
    <DiagramPanel>
      {/* Microphone input */}
      <circle cx="34" cy="52" r="18" stroke={SOUND} strokeOpacity="0.35" strokeWidth="1.5" />
      <rect x="29" y="39" width="10" height="17" rx="5" stroke={SOUND} strokeWidth="1.75" />
      <path d="M25 51a9 9 0 0 0 18 0M34 60v5" stroke={SOUND} strokeWidth="1.75" strokeLinecap="round" />
      <motion.circle
        cx="34"
        cy="52"
        r="18"
        stroke={SOUND}
        strokeWidth="1"
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
        initial={{ scale: 1, opacity: 0 }}
        animate={active ? { scale: [1, 1.35], opacity: [0.5, 0] } : { scale: 1, opacity: 0 }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
      />

      {/* Waveform on a baseline */}
      <path d={`M${startX - 4} 52H${startX + WAVEFORM.length * step}`} stroke={INK} strokeOpacity="0.12" strokeWidth="1" />
      {WAVEFORM.map((h, i) => (
        <motion.rect
          key={i}
          x={startX + i * step}
          y={52 - h / 2}
          width="2"
          height={h}
          rx="1"
          fill={SOUND}
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
          initial={{ scaleY: 0.55, opacity: 0.55 }}
          animate={active ? { scaleY: [0.55, 1, 0.7, 1], opacity: [0.55, 1, 0.8, 1] } : { scaleY: 0.55, opacity: 0.55 }}
          transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.04, ease: "easeInOut" }}
        />
      ))}
      <motion.line
        y1="24"
        y2="80"
        stroke={SOUND}
        strokeWidth="1"
        initial={{ x1: startX, x2: startX, opacity: 0 }}
        animate={
          active
            ? { x1: [startX, startX + WAVEFORM.length * step], x2: [startX, startX + WAVEFORM.length * step], opacity: [0, 0.8, 0.8, 0] }
            : { x1: startX, x2: startX, opacity: 0 }
        }
        transition={{ duration: 2.6, repeat: Infinity, ease: "linear" }}
      />

      {/* Input level */}
      <rect x="66" y="88" width="150" height="3" rx="1.5" fill={INK} fillOpacity="0.08" />
      <motion.rect
        x="66"
        y="88"
        height="3"
        rx="1.5"
        fill={SOUND}
        initial={{ width: 60 }}
        animate={active ? { width: [40, 120, 70, 110, 40] } : { width: 60 }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
      />
    </DiagramPanel>
  )
}

// Widths of the sign-structure blocks the model emits (one row per sign in order).
const SIGN_TOKENS = [
  { x: 168, y: 30, w: 46 },
  { x: 168, y: 47, w: 34 },
  { x: 168, y: 64, w: 54 },
] as const

/**
 * Step 2: audio enters a processing unit and leaves as an ordered set of sign blocks.
 * `reverse` mirrors the whole diagram (sign blocks in, audio out) for the sign → speech
 * direction; the gradient is in the mirrored user space, so its colours flip too.
 */
function AIProcessingVisual({ active, reverse = false }: { active: boolean; reverse?: boolean }) {
  const gradientId = `hiw-convert-${useId().replace(/:/g, "")}`
  return (
    <DiagramPanel>
      <g transform={reverse ? "translate(240 0) scale(-1 1)" : undefined}>
      <defs>
        <linearGradient id={gradientId} x1="96" y1="28" x2="144" y2="76" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="var(--brand-orange)" />
          <stop offset="1" stopColor="var(--primary)" />
        </linearGradient>
      </defs>
      {/* Audio in */}
      <path
        d="M16 52h8l3-8 4 16 4-24 4 30 4-20 3 10 2-4h6"
        stroke={SOUND}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M62 52h30" stroke={INK} strokeOpacity="0.18" strokeWidth="1.25" strokeDasharray="3 3" />
      <motion.circle
        cy="52"
        r="2.5"
        fill={SOUND}
        initial={{ cx: 62, opacity: 0 }}
        animate={active ? { cx: [62, 92], opacity: [0, 1, 0] } : { cx: 62, opacity: 0 }}
        transition={{ duration: 1.1, repeat: Infinity, ease: "easeIn" }}
      />

      {/* Processing unit */}
      <rect x="96" y="28" width="48" height="48" rx="10" fill={`url(#${gradientId})`} fillOpacity="0.1" stroke={`url(#${gradientId})`} strokeWidth="1.75" />
      <rect x="108" y="40" width="24" height="24" rx="4" stroke={`url(#${gradientId})`} strokeWidth="1.5" />
      <path
        d="M114 28v-5M120 28v-5M126 28v-5M114 81v-5M120 81v-5M126 81v-5M96 46h-5M96 52h-5M96 58h-5M149 46h-5M149 52h-5M149 58h-5"
        stroke={`url(#${gradientId})`}
        strokeOpacity="0.6"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <motion.rect
        x="109"
        width="22"
        height="1.5"
        fill={SOUND}
        initial={{ y: 42, opacity: 0 }}
        animate={active ? { y: [42, 61, 42], opacity: [0.9, 0.9, 0.9] } : { y: 42, opacity: 0 }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Ordered sign structure out */}
      <path d="M149 52h11M160 35v34M160 35h6M160 52h6M160 69h6" stroke={INK} strokeOpacity="0.18" strokeWidth="1.25" />
      {SIGN_TOKENS.map((token, i) => (
        <motion.g
          key={i}
          initial={{ opacity: 1 }}
          animate={active ? { opacity: [0.25, 1, 1, 0.25] } : { opacity: 1 }}
          transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.3, ease: "easeInOut" }}
        >
          <rect x={token.x} y={token.y} width={token.w} height="10" rx="5" fill={ACCENT} fillOpacity={i === 0 ? 0.9 : 0.55} />
          <circle cx={token.x + 5} cy={token.y + 5} r="2" fill="white" />
        </motion.g>
      ))}
      </g>
    </DiagramPanel>
  )
}

function AIProcessingReverseVisual({ active }: { active: boolean }) {
  return <AIProcessingVisual active={active} reverse />
}

// Hand landmarks (wrist, then thumb → pinky tips) for the sign-capture diagram, in a 48×48 box.
const HAND_POINTS = [
  [22, 44], [15.5, 40.5], [11, 35.5], [8, 30.5], [5.5, 26],
  [16.5, 27], [15, 19.5], [14, 13.5], [13.3, 8.5],
  [22, 25.5], [22, 17], [22, 10.5], [22, 5],
  [27.5, 26.5], [29, 19], [30, 13.5], [30.8, 9],
  [32, 30], [35, 24.5], [36.8, 20.8], [38.4, 17],
] as const
const HAND_CHAINS = [[0, 1, 2, 3, 4], [0, 5, 6, 7, 8], [9, 10, 11, 12], [13, 14, 15, 16], [0, 17, 18, 19, 20], [5, 9, 13, 17]] as const
const handLine = (chain: readonly number[]) => chain.map((i) => HAND_POINTS[i].join(",")).join(" ")

// Face-mesh points (eyes, brows, nose, mouth corners, jaw) around the signer's head at (120, 34).
const FACE_POINTS = [
  [115, 31], [125, 31], [113, 28], [117, 27.5], [123, 27.5], [127, 28],
  [120, 35], [116, 39], [124, 39], [120, 40.5], [111, 36], [129, 36], [114, 43], [126, 43], [120, 45],
] as const
const TIP_INDEXES: readonly number[] = [4, 8, 12, 16, 20]

/** One tracked hand: skeleton lines and joints, fingertips in orange. */
function TrackedHand({ transform }: { transform: string }) {
  return (
    <g transform={transform}>
      {HAND_CHAINS.map((chain) => (
        <polyline key={chain.join("-")} points={handLine(chain)} stroke={ACCENT} strokeOpacity="0.7" strokeWidth="1.1" strokeLinejoin="round" />
      ))}
      {HAND_POINTS.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={TIP_INDEXES.includes(i) ? 2 : 1.4} fill={TIP_INDEXES.includes(i) ? SOUND : "white"} stroke={TIP_INDEXES.includes(i) ? "none" : ACCENT} strokeWidth="0.9" />
      ))}
    </g>
  )
}

/**
 * Reverse step 1: a computer-vision camera view. The signer is tracked live (face mesh,
 * both hands with joint skeletons, the signing hand boxed with its confidence) while a scan
 * sweeps the frame; a readout shows hand / face / body tracking, and recognised signs stack
 * up as tokens ready for step 2.
 */
function SignCaptureVisual({ active }: { active: boolean }) {
  const uid = useId().replace(/:/g, "")
  const clipId = `hiw-cam-${uid}`
  const sweepId = `hiw-sweep-${uid}`
  // Viewport of the camera.
  const vx = 58, vy = 8, vw = 124, vh = 88
  return (
    <DiagramPanel>
      <defs>
        <clipPath id={clipId}>
          <rect x={vx} y={vy} width={vw} height={vh} rx="8" />
        </clipPath>
        <linearGradient id={sweepId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--primary)" stopOpacity="0" />
          <stop offset="1" stopColor="var(--primary)" stopOpacity="0.22" />
        </linearGradient>
      </defs>

      {/* Recognised signs, stacking up to the right as they are read (they feed step 2). */}
      {[0, 1, 2].map((i) => (
        <motion.g
          key={i}
          initial={{ opacity: 1, x: 0 }}
          animate={active ? { opacity: [0, 0, 1, 1, 0], x: [-6, -6, 0, 0, 0] } : { opacity: 1, x: 0 }}
          transition={{ duration: 4.2, repeat: Infinity, times: [0, 0.15 + i * 0.18, 0.25 + i * 0.18, 0.92, 1], ease: "easeOut" }}
        >
          <rect x="194" y={30 + i * 15} width={[40, 30, 36][i]} height="10" rx="5" fill={ACCENT} fillOpacity={0.9 - i * 0.2} />
          <circle cx="199" cy={35 + i * 15} r="2" fill="white" />
        </motion.g>
      ))}
      <path d="M184 52h6" stroke={INK} strokeOpacity="0.2" strokeWidth="1.25" strokeDasharray="2 2" />

      {/* Camera viewport */}
      <rect x={vx} y={vy} width={vw} height={vh} rx="8" fill={INK} fillOpacity="0.05" stroke={INK} strokeOpacity="0.16" strokeWidth="1.25" />
      <g clipPath={`url(#${clipId})`}>
        {/* Rule-of-thirds guides */}
        <path d={`M${vx + vw / 3} ${vy}v${vh}M${vx + (2 * vw) / 3} ${vy}v${vh}M${vx} ${vy + vh / 3}h${vw}M${vx} ${vy + (2 * vh) / 3}h${vw}`} stroke={INK} strokeOpacity="0.05" strokeWidth="1" />

        {/* Signer silhouette */}
        <circle cx="120" cy="35" r="12" fill={ACCENT} fillOpacity="0.1" />
        <path d="M86 98c2-22 16-34 34-34s32 12 34 34Z" fill={ACCENT} fillOpacity="0.1" />

        {/* Face mesh inside its detection box */}
        {FACE_POINTS.map(([x, y], i) => (
          <motion.circle
            key={i}
            cx={x}
            cy={y}
            r="0.9"
            fill={ACCENT}
            initial={{ opacity: 0.8 }}
            animate={active ? { opacity: [0.35, 0.9, 0.35] } : { opacity: 0.8 }}
            transition={{ duration: 1.6, repeat: Infinity, delay: (i % 5) * 0.12 }}
          />
        ))}
        <path d="M106 26v-5h5M129 21h5v5M134 44v5h-5M111 49h-5v-5" stroke={ACCENT} strokeOpacity="0.55" strokeWidth="1" strokeLinecap="round" />

        {/* Both hands, signing near the chin */}
        <motion.g
          initial={{ x: 0, y: 0 }}
          animate={active ? { x: [0, -3, 2, 0], y: [0, -3, 1, 0] } : { x: 0, y: 0 }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        >
          <TrackedHand transform="translate(134 24) scale(0.82)" />
          {/* Detection box and confidence for the signing hand */}
          <path d="M136 26v-5h5M166 21h5v5M171 58v5h-5M141 63h-5v-5" stroke={SOUND} strokeWidth="1.25" strokeLinecap="round" />
          <rect x="136" y="13" width="22" height="7" rx="3.5" fill={SOUND} />
          <text x="147" y="18.4" textAnchor="middle" fontSize="5.2" fontWeight="700" fill="white" fontFamily="ui-monospace, monospace">
            98%
          </text>
        </motion.g>
        <motion.g
          initial={{ x: 0, y: 0 }}
          animate={active ? { x: [0, 2, -2, 0], y: [0, 2, -2, 0] } : { x: 0, y: 0 }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
        >
          <TrackedHand transform="translate(108 58) scale(-0.62 0.62)" />
        </motion.g>

        {/* Scan sweep */}
        <motion.rect
          x={vx}
          width={vw}
          height="16"
          fill={`url(#${sweepId})`}
          initial={{ y: vy - 16, opacity: 0 }}
          animate={active ? { y: [vy - 16, vy + vh], opacity: [1, 1] } : { y: vy - 16, opacity: 0 }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "linear" }}
        />
      </g>

      {/* HUD: recording dot and timecode */}
      <circle cx={vx + 9} cy={vy + 8} r="2.4" fill="#EF4444" />
      <motion.circle
        cx={vx + 9}
        cy={vy + 8}
        r="2.4"
        fill="#EF4444"
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
        initial={{ scale: 1, opacity: 0 }}
        animate={active ? { scale: [1, 2.4], opacity: [0.5, 0] } : { scale: 1, opacity: 0 }}
        transition={{ duration: 1.4, repeat: Infinity, ease: "easeOut" }}
      />
      <text x={vx + 15} y={vy + 10} fontSize="5.5" fontWeight="600" fill={INK} fillOpacity="0.6" fontFamily="ui-monospace, monospace">
        00:12
      </text>

      {/* Tracking readout: hands, face, body */}
      {[
        { y: 30, color: SOUND, pct: "98%" },
        { y: 47, color: ACCENT, pct: "95%" },
        { y: 64, color: INK, pct: "91%" },
      ].map((row, i) => (
        <g key={row.y}>
          <circle cx="12" cy={row.y + 2} r="2.4" fill={row.color} fillOpacity={i === 2 ? 0.45 : 1} />
          <text x="50" y={row.y + 4} textAnchor="end" fontSize="5.2" fontWeight="600" fill={INK} fillOpacity="0.55" fontFamily="ui-monospace, monospace">
            {row.pct}
          </text>
          <rect x="18" y={row.y + 7} width="32" height="3" rx="1.5" fill={INK} fillOpacity="0.08" />
          <motion.rect
            x="18"
            y={row.y + 7}
            height="3"
            rx="1.5"
            fill={row.color}
            fillOpacity={i === 2 ? 0.45 : 1}
            initial={{ width: 28 }}
            animate={active ? { width: [24, 31, 27, 30] } : { width: 28 }}
            transition={{ duration: 2.2, repeat: Infinity, delay: i * 0.25, ease: "easeInOut" }}
          />
        </g>
      ))}
    </DiagramPanel>
  )
}

/** Reverse step 3: the sentence types out in a caption bubble while a speaker voices it. */
function TextSpeechVisual({ active }: { active: boolean }) {
  const lines = [{ y: 32, w: 100 }, { y: 44, w: 84 }, { y: 56, w: 56 }]
  return (
    <DiagramPanel>
      {/* Caption bubble with lines typing in */}
      <path d="M28 18h112a10 10 0 0 1 10 10v34a10 10 0 0 1-10 10H52l-12 10v-10H28a10 10 0 0 1-10-10V28a10 10 0 0 1 10-10Z" fill={INK} fillOpacity="0.05" stroke={INK} strokeOpacity="0.18" strokeWidth="1.25" />
      {lines.map((line, i) => (
        <motion.rect
          key={line.y}
          x="30"
          y={line.y}
          height="5"
          rx="2.5"
          fill={i === 0 ? ACCENT : INK}
          fillOpacity={i === 0 ? 0.8 : 0.35}
          initial={{ width: line.w }}
          animate={active ? { width: [0, 0, line.w, line.w] } : { width: line.w }}
          transition={{ duration: 3.2, repeat: Infinity, times: [0, i * 0.22, i * 0.22 + 0.25, 1], ease: "easeOut" }}
        />
      ))}

      {/* Speaker voicing it */}
      <path d="M170 40h7l9-8v32l-9-8h-7a2 2 0 0 1-2-2V42a2 2 0 0 1 2-2Z" fill={SOUND} />
      {[0, 1, 2].map((i) => (
        <motion.path
          key={i}
          d={`M${193 + i * 7} ${38 - i * 4}a${12 + i * 6} ${12 + i * 6} 0 0 1 0 ${20 + i * 8}`}
          stroke={SOUND}
          strokeWidth="1.75"
          strokeLinecap="round"
          initial={{ opacity: 0.6 }}
          animate={active ? { opacity: [0.15, 1, 0.15] } : { opacity: 0.6 }}
          transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.2, ease: "easeInOut" }}
        />
      ))}

      {/* Spoken waveform */}
      {WAVEFORM.slice(0, 14).map((h, i) => (
        <motion.rect
          key={i}
          x={164 + i * 4.4}
          y={88 - h / 4}
          width="2"
          height={h / 2}
          rx="1"
          fill={SOUND}
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
          initial={{ scaleY: 0.6 }}
          animate={active ? { scaleY: [0.5, 1, 0.6] } : { scaleY: 0.6 }}
          transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.05, ease: "easeInOut" }}
        />
      ))}
    </DiagramPanel>
  )
}

/** Step 3: a video frame with a signer silhouette, timeline and captions underneath. */
function SignStreamVisual({ active }: { active: boolean }) {
  return (
    <DiagramPanel>
      {/* Video frame */}
      <rect x="64" y="12" width="112" height="62" rx="8" fill={INK} fillOpacity="0.06" stroke={INK} strokeOpacity="0.18" strokeWidth="1.25" />
      {/* Live indicator */}
      <circle cx="74" cy="21" r="2.5" fill="#10B981" />
      <motion.circle
        cx="74"
        cy="21"
        r="2.5"
        fill="#10B981"
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
        initial={{ scale: 1, opacity: 0 }}
        animate={active ? { scale: [1, 2.6], opacity: [0.5, 0] } : { scale: 1, opacity: 0 }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
      />

      {/* Signer silhouette */}
      <circle cx="120" cy="34" r="8" fill={ACCENT} fillOpacity="0.85" />
      <path d="M100 74c0-16 9-25 20-25s20 9 20 25Z" fill={ACCENT} fillOpacity="0.85" />
      <motion.g
        initial={{ x: 0, y: 0 }}
        animate={active ? { x: [0, -3, 2, 0], y: [0, -4, 1, 0] } : { x: 0, y: 0 }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
      >
        <path d="M104 58l-6-16" stroke={ACCENT} strokeOpacity="0.85" strokeWidth="5" strokeLinecap="round" />
        <circle cx="97" cy="39" r="4" fill={ACCENT} />
      </motion.g>
      <motion.g
        initial={{ x: 0, y: 0 }}
        animate={active ? { x: [0, 3, -2, 0], y: [0, 2, -5, 0] } : { x: 0, y: 0 }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
      >
        <path d="M136 58l7-14" stroke={ACCENT} strokeOpacity="0.85" strokeWidth="5" strokeLinecap="round" />
        <circle cx="144" cy="41" r="4" fill={ACCENT} />
      </motion.g>

      {/* Timeline */}
      <rect x="64" y="80" width="112" height="2.5" rx="1.25" fill={INK} fillOpacity="0.1" />
      <motion.rect
        x="64"
        y="80"
        height="2.5"
        rx="1.25"
        fill={SOUND}
        initial={{ width: 48 }}
        animate={active ? { width: [0, 112] } : { width: 48 }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "linear" }}
      />

      {/* Captions */}
      <rect x="78" y="88" width="84" height="3" rx="1.5" fill={INK} fillOpacity="0.35" />
      <motion.rect
        x="92"
        y="95"
        height="3"
        rx="1.5"
        fill={INK}
        fillOpacity="0.2"
        initial={{ width: 56 }}
        animate={active ? { width: [0, 56, 56] } : { width: 56 }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeOut", times: [0, 0.5, 1] }}
      />
    </DiagramPanel>
  )
}

type Stage = { Icon: LucideIcon; index: string; Visual: (props: { active: boolean }) => ReactNode; terminal: boolean; tile: string }

/** Speech → sign. Visuals zipped by index with `t.landing.howItWorks.stages`. */
const STAGES: Stage[] = [
  { Icon: AudioLines, index: "01", Visual: SpeechCaptureVisual, terminal: false, tile: "from-[#F97316] to-[#C2410C]" },
  { Icon: Cpu, index: "02", Visual: AIProcessingVisual, terminal: false, tile: "from-[#F97316] to-[#2563EB]" },
  { Icon: MonitorPlay, index: "03", Visual: SignStreamVisual, terminal: true, tile: "from-[#2563EB] to-[#1D4ED8]" },
]

/** Sign → text & speech: the colour story runs the other way (blue in, orange out). Zipped with `stagesReverse`. */
const STAGES_REVERSE: Stage[] = [
  { Icon: Hand, index: "01", Visual: SignCaptureVisual, terminal: false, tile: "from-[#2563EB] to-[#1D4ED8]" },
  { Icon: Cpu, index: "02", Visual: AIProcessingReverseVisual, terminal: false, tile: "from-[#2563EB] to-[#F97316]" },
  { Icon: MessageSquareText, index: "03", Visual: TextSpeechVisual, terminal: true, tile: "from-[#F97316] to-[#C2410C]" },
]

const STEP_MS = 2800

type DirectionCopy = { label: string; speech: string; sign: string; textSpeech: string; switchTo: string }

/**
 * The direction switch: two chips (speech, orange; sign, blue) with a swap button between
 * them. Pressing it slides the chips past each other into their new order and spins the
 * arrows, and the whole section flips direction. The full pill is one button.
 */
function DirectionSwitch({ reverse, onToggle, copy }: { reverse: boolean; onToggle: () => void; copy: DirectionCopy }) {
  const speechChip = (
    <motion.span
      key="speech"
      layout
      transition={{ type: "spring", stiffness: 380, damping: 30 }}
      className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-br from-[#F97316] to-[#C2410C] px-3.5 py-2 text-sm font-semibold whitespace-nowrap text-white shadow-[0_8px_18px_-10px_rgba(234,88,12,0.7)]"
    >
      {reverse ? <MessageSquareText className="size-4" aria-hidden="true" /> : <Mic className="size-4" aria-hidden="true" />}
      {reverse ? copy.textSpeech : copy.speech}
    </motion.span>
  )
  const signChip = (
    <motion.span
      key="sign"
      layout
      transition={{ type: "spring", stiffness: 380, damping: 30 }}
      className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] px-3.5 py-2 text-sm font-semibold whitespace-nowrap text-white shadow-[0_8px_18px_-10px_rgba(37,99,235,0.7)]"
    >
      <Hand className="size-4" aria-hidden="true" />
      {copy.sign}
    </motion.span>
  )
  const swap = (
    <motion.span
      key="swap"
      layout
      className="relative flex size-9 shrink-0 items-center justify-center rounded-full bg-card text-black ring-1 ring-[color:var(--primary)]/20 transition-shadow group-hover:shadow-[0_0_0_4px_rgba(37,99,235,0.12)]"
    >
      <motion.span animate={{ rotate: reverse ? 180 : 0 }} transition={{ type: "spring", stiffness: 260, damping: 18 }} className="flex">
        <ArrowLeftRight className="size-4" aria-hidden="true" />
      </motion.span>
    </motion.span>
  )
  const from = reverse ? copy.sign : copy.speech
  const to = reverse ? copy.textSpeech : copy.sign
  const nextFrom = reverse ? copy.speech : copy.sign
  const nextTo = reverse ? copy.sign : copy.textSpeech

  return (
    <div className="mt-7 flex flex-wrap items-center gap-3">
      <span className="text-xs font-semibold tracking-[0.08em] text-muted-foreground uppercase">{copy.label}</span>
      <button
        type="button"
        onClick={onToggle}
        aria-label={copy.switchTo.replace("{from}", nextFrom).replace("{to}", nextTo)}
        className="group inline-flex items-center gap-2 rounded-full border border-[color:var(--primary)]/15 bg-card/80 p-1.5 shadow-[0_1px_2px_rgba(16,24,40,0.05),0_14px_30px_-20px_rgba(30,64,175,0.45)] backdrop-blur transition-transform active:scale-[0.97] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8]"
      >
        <LayoutGroup>{reverse ? [signChip, swap, speechChip] : [speechChip, swap, signChip]}</LayoutGroup>
      </button>
      {/* Announces the new direction after a switch. */}
      <span className="sr-only" aria-live="polite">
        {from} → {to}
      </span>
    </div>
  )
}

export function HowItWorksVisual() {
  const { t } = useI18n()
  const copy = t.landing.howItWorks
  const reduceMotion = useLandingReducedMotion()
  const [active, setActive] = useState(0)
  // Auto-advance pauses while the pointer is over the steps, after a tap/click, and in calm/reduced-motion mode.
  const [hovering, setHovering] = useState(false)
  const [locked, setLocked] = useState(false)
  // false: speech → sign; true: sign → text & speech.
  const [reverse, setReverse] = useState(false)
  const paused = locked || hovering || reduceMotion
  const stages = reverse ? STAGES_REVERSE : STAGES
  const stageText = reverse ? copy.stagesReverse : copy.stages

  useEffect(() => {
    if (paused) return
    const id = setInterval(() => setActive((s) => (s + 1) % STAGES.length), STEP_MS)
    return () => clearInterval(id)
  }, [paused, reverse])

  function toggleDirection() {
    setReverse((r) => !r)
    // Start the new direction from its first step, running again.
    setActive(0)
    setLocked(false)
  }

  const current = stages[active]
  const currentText = stageText[active]
  const CurrentVisual = current.Visual

  return (
    <section
      id="how-it-works"
      aria-labelledby="how-it-works-heading"
      className="pop-atmosphere relative overflow-hidden py-24 sm:py-28"
    >
      <div className="pop-grid pointer-events-none absolute inset-0 -z-10 opacity-[0.05]" aria-hidden="true" />
      <GlowOrb className="-top-20 -left-16 size-[24rem] pop-float" color="rgba(59,130,246,0.16)" />
      <GlowOrb className="top-24 -right-24 size-[26rem] pop-float-delay" color="rgba(167,180,255,0.18)" />

      <Container fluid>
        <Reveal className="max-w-2xl">
          <PopEyebrow>{copy.eyebrow}</PopEyebrow>
          <h2 id="how-it-works-heading" className="mt-5 text-3xl font-bold tracking-tight text-balance text-black sm:text-4xl">
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={reverse ? "reverse" : "forward"}
                className="block"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
              >
                {reverse ? copy.titleReverse : copy.title}
              </motion.span>
            </AnimatePresence>
          </h2>
          <DirectionSwitch reverse={reverse} onToggle={toggleDirection} copy={copy.direction} />
        </Reveal>

        <div
          className="mt-14 grid gap-8 lg:grid-cols-12 lg:items-stretch lg:gap-10"
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
        >
          {/* Step list. Steps are content, not controls: hovering/tapping only moves the highlight. */}
          <Reveal className="lg:col-span-5">
            <ol className="relative flex h-full flex-col justify-between gap-3">
              {/* Spine joining the step icons (centred on the 44px tiles inside the 16px row padding). */}
              {/* Orange (speech) to blue (sign), flipped for sign → speech. */}
              <span
                aria-hidden="true"
                className={cn(
                  "absolute start-[37px] top-10 bottom-10 w-0.5 -translate-x-1/2 rounded-full bg-gradient-to-b via-[color:var(--primary)]/40 rtl:translate-x-1/2",
                  reverse ? "from-[color:var(--primary)]/70 to-brand-orange/70" : "from-brand-orange/70 to-[color:var(--primary)]/70",
                )}
              />
              {stages.map((stage, i) => {
                const isActive = active === i
                const text = stageText[i]
                return (
                  <li
                    key={stage.index}
                    onMouseEnter={() => setActive(i)}
                    onClick={() => {
                      setActive(i)
                      setLocked(true)
                    }}
                    className={cn(
                      "relative flex gap-4 rounded-2xl border p-4 text-start transition-[background-color,border-color,box-shadow] duration-300",
                      isActive
                        ? "border-brand-orange/25 bg-card bg-gradient-to-r from-brand-orange/[0.06] to-transparent shadow-[0_1px_2px_rgba(16,24,40,0.05),0_16px_36px_-24px_rgba(234,88,12,0.3)] rtl:bg-gradient-to-l"
                        : "border-transparent hover:bg-card/60",
                    )}
                  >
                    {/* Orange accent: a short bar on the inline-start edge of the active step. */}
                    <span
                      aria-hidden="true"
                      className={cn(
                        "absolute inset-y-5 -start-px w-0.5 rounded-full bg-brand-orange transition-opacity duration-300",
                        isActive ? "opacity-100" : "opacity-0",
                      )}
                    />
                    <span
                      aria-hidden="true"
                      className={cn(
                        "relative z-10 flex size-11 shrink-0 items-center justify-center rounded-xl transition-colors duration-300",
                        isActive
                          ? cn("bg-gradient-to-br text-white shadow-[0_10px_22px_-10px_rgba(234,88,12,0.55)]", stage.tile)
                          : "bg-card text-[#1D4ED8] ring-1 ring-[color:var(--primary)]/20",
                      )}
                    >
                      <stage.Icon className="size-5" strokeWidth={1.75} />
                    </span>
                    <div className="min-w-0 pt-0.5">
                      <p className="flex flex-wrap items-center gap-x-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                        <span
                          className={cn("font-mono font-semibold transition-colors duration-300", isActive && "text-[#C2410C]")}
                        >
                          {stage.index}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{text?.tag}</span>
                      </p>
                      <h3 className="mt-1 text-lg font-semibold tracking-tight text-black">{text?.title}</h3>
                      <p className="mt-1.5 text-sm leading-6 text-muted-foreground">{text?.caption}</p>
                    </div>
                  </li>
                )
              })}
            </ol>
          </Reveal>

          {/* Stage: the active step's diagram, large. Decorative — the list above carries the content. */}
          <Reveal delay={0.1} className="lg:col-span-7">
            <div
              aria-hidden="true"
              className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-[0_1px_2px_rgba(16,24,40,0.05),0_30px_60px_-30px_rgba(30,64,175,0.3)]"
            >
              <span className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-brand-orange via-[#F59E0B] to-[color:var(--primary)] rtl:bg-gradient-to-l" />
              <div className="flex items-center justify-between gap-4 border-b border-border px-5 py-3.5 sm:px-6">
                <div className="flex min-w-0 items-center gap-3">
                  <span className={cn("flex size-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br text-white", current.tile)}>
                    <current.Icon className="size-4" strokeWidth={1.75} />
                  </span>
                  <span className="truncate text-sm font-semibold text-black">{currentText?.title}</span>
                </div>
                <span className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-border bg-muted/40 px-2.5 py-1 text-xs font-medium text-black">
                  {current.terminal ? (
                    <span className="size-1.5 rounded-full bg-emerald-500" />
                  ) : (
                    <ArrowRight className="size-3 rtl:-scale-x-100" />
                  )}
                  {currentText?.tag}
                </span>
              </div>

              <div className="relative min-h-64 flex-1 overflow-hidden bg-[radial-gradient(circle,rgba(37,99,235,0.14)_1px,transparent_1px)] [background-size:18px_18px] sm:min-h-72">
                <span className="pointer-events-none absolute -top-24 -start-24 size-72 rounded-full bg-[radial-gradient(circle,rgba(249,115,22,0.18),transparent_70%)]" />
                <span className="pointer-events-none absolute -bottom-24 -end-24 size-72 rounded-full bg-[radial-gradient(circle,rgba(37,99,235,0.14),transparent_70%)]" />
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={`${reverse ? "r" : "f"}-${active}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="absolute inset-0 flex items-center justify-center p-6 sm:p-10"
                  >
                    <CurrentVisual active={!reduceMotion} />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Progress: one segment per step; done steps in soft orange, the running one fills in orange. */}
              <div className="flex gap-2 border-t border-border px-5 py-4 sm:px-6">
                {stages.map((stage, i) => (
                  <span key={stage.index} className="relative h-1 flex-1 overflow-hidden rounded-full bg-border">
                    {i < active && <span className="absolute inset-0 rounded-full bg-brand-orange/45" />}
                    {i === active && (
                      <motion.span
                        key={paused ? "still" : `run-${active}`}
                        className="absolute inset-0 origin-[left] rounded-full bg-brand-orange rtl:origin-[right]"
                        initial={{ scaleX: paused ? 1 : 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: paused ? 0 : STEP_MS / 1000, ease: "linear" }}
                      />
                    )}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  )
}
