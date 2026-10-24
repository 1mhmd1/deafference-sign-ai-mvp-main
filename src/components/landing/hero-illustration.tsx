"use client"

import { useRef } from "react"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { useI18n } from "@/i18n/use-i18n"

const CONNECTIONS = [
  "M118 119 C82 99 63 73 49 45",
  "M119 119 C152 97 180 78 202 64",
  "M118 119 C83 141 66 165 51 191",
  "M119 119 C158 141 183 159 205 188",
] as const

/** Rounds trig output so the server (Node) and the browser render identical attributes; their sin/cos can differ in the last digit, which breaks hydration. */
const round = (v: number, places = 3) => Math.round(v * 10 ** places) / 10 ** places

/** Front-facing half of a Fibonacci sphere, projected into the 240×240 globe: denser toward the rim, so it reads as 3D. */
const NODES = Array.from({ length: 130 }, (_, i) => {
  const y = 1 - (2 * (i + 0.5)) / 130
  const radius = Math.sqrt(1 - y * y)
  const theta = i * Math.PI * (3 - Math.sqrt(5))
  return { x: round(120 + Math.cos(theta) * radius * 104, 2), y: round(120 + y * 104, 2), z: round(Math.sin(theta) * radius) }
}).filter((n) => n.z > 0)
/** Links between nearby nodes: the "plexus" web inside the globe. */
const LINKS = NODES.flatMap((a, i) => NODES.slice(i + 1).filter((b) => Math.hypot(a.x - b.x, a.y - b.y) < 30).map((b) => [a, b] as const))
/** Every 7th link carries a travelling spark of current. */
const LIVE_LINKS = LINKS.filter((_, i) => i % 7 === 0).slice(0, 18)
/** Jagged lightning bolts from just outside the logo to the rim, at fixed angles with deterministic jitter. */
const BOLTS = [15, 75, 140, 200, 255, 320].map((deg, b) => {
  const a = (deg * Math.PI) / 180
  // Point at radius r with a sideways offset, in globe coordinates.
  const at = (r: number, side: number, angle = a) => `${(120 + Math.cos(angle) * r - Math.sin(angle) * side).toFixed(1)} ${(120 + Math.sin(angle) * r + Math.cos(angle) * side).toFixed(1)}`
  // Irregular, mostly-drifting jitter (a cheap deterministic noise) reads as lightning rather than a zig-zag.
  const noise = (s: number) => Math.sin(b * 12.9898 + s * 78.233) * 43758.5453 % 1
  let side = 0
  const trunk = Array.from({ length: 13 }, (_, s) => {
    side = s === 0 ? 0 : side * 0.55 + noise(s) * 9
    return { r: 44 + s * 5.8 + noise(s + 40) * 1.5, side }
  })
  const fork = trunk[5]
  const forkAngle = a + (b % 2 ? 0.32 : -0.32)
  return {
    trunk: `M${trunk.map((p) => at(p.r, p.side)).join("L")}`,
    branch: `M${at(fork.r, fork.side)}L${at(fork.r + 8, fork.side + noise(90) * 5, forkAngle)}L${at(fork.r + 15, fork.side + noise(91) * 6, forkAngle)}L${at(fork.r + 22, fork.side + noise(92) * 4, forkAngle)}`,
  }
})
/** Tilted orbits (degrees) that electrons travel along. */
const ORBITS = [-24, 32, 78] as const
const ORBIT_PATH = "M14 120a106 34 0 1 0 212 0a106 34 0 1 0 -212 0"

/** `tint` is the light panel behind each card's illustration. */
const CARD_DATA = [
  { id: "sign", className: "left-3 top-4 sm:left-4 sm:top-8", delay: 0, tint: "bg-[linear-gradient(135deg,#eff6ff,#dbeafe)]" },
  { id: "understands", className: "right-3 top-12 sm:right-4 sm:top-16", delay: 0.75, tint: "bg-[linear-gradient(135deg,#f5f3ff,#e7e2ff)]" },
  { id: "hear", className: "bottom-16 left-3 sm:bottom-8 sm:left-4", delay: 1.5, tint: "bg-[linear-gradient(135deg,#fff7ed,#ffe6cc)]" },
  { id: "connect", className: "right-3 bottom-3 sm:right-4 sm:bottom-6", delay: 2.25, tint: "bg-[linear-gradient(135deg,#f0fdfa,#ccf5ec)]" },
] as const

/** MediaPipe-style hand landmarks (wrist, then thumb → pinky, 4 joints each) for an open palm in a 48×48 box. */
const HAND = [
  [22, 44], [15.5, 40.5], [11, 35.5], [8, 30.5], [5.5, 26],
  [16.5, 27], [15, 19.5], [14, 13.5], [13.3, 8.5],
  [22, 25.5], [22, 17], [22, 10.5], [22, 5],
  [27.5, 26.5], [29, 19], [30, 13.5], [30.8, 9],
  [32, 30], [35, 24.5], [36.8, 20.8], [38.4, 17],
] as const
const FINGERS = [[0, 1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12], [13, 14, 15, 16], [17, 18, 19, 20]] as const
const PALM = [0, 1, 5, 9, 13, 17] as const
const TIPS: readonly number[] = [4, 8, 12, 16, 20]
const pts = (ids: readonly number[]) => ids.map((i) => HAND[i].join(",")).join(" ")

/** Solid hand shape built from thick rounded bones over a filled palm (48×48 box). */
function HandShape({ fill }: { fill: string }) {
  return <g stroke={fill} strokeLinecap="round" strokeLinejoin="round">
    <polygon points={pts(PALM)} fill={fill} strokeWidth="6" />
    {FINGERS.map((f) => <polyline key={f[0]} points={pts(f)} strokeWidth={f[0] === 0 ? 6.2 : 5.4} />)}
  </g>
}

function Sparkle({ x, y, size, color, delay = 0 }: { x: number; y: number; size: number; color: string; delay?: number }) {
  const s = size
  return <motion.path d={`M${x} ${y - s}C${x + s * 0.15} ${y - s * 0.15} ${x + s * 0.15} ${y - s * 0.15} ${x + s} ${y}C${x + s * 0.15} ${y + s * 0.15} ${x + s * 0.15} ${y + s * 0.15} ${x} ${y + s}C${x - s * 0.15} ${y + s * 0.15} ${x - s * 0.15} ${y + s * 0.15} ${x - s} ${y}C${x - s * 0.15} ${y - s * 0.15} ${x - s * 0.15} ${y - s * 0.15} ${x} ${y - s}Z`} fill={color} animate={{ opacity: [0.25, 1, 0.25], scale: [0.7, 1.1, 0.7] }} transition={{ duration: 2.4, delay, repeat: Infinity, ease: "easeInOut" }} />
}

/** You sign: a hand in a camera viewfinder, tracked by landmarks while a scan line sweeps over it. */
function SignScan() {
  return <svg viewBox="0 0 120 48" className="h-12 w-full" fill="none" aria-hidden="true">
    <defs>
      <linearGradient id="hero-hand" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse"><stop stopColor="#60a5fa" /><stop offset="1" stopColor="#4f46e5" /></linearGradient>
      <linearGradient id="hero-scan" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#fb923c" stopOpacity="0" /><stop offset="1" stopColor="#fb923c" stopOpacity=".45" /></linearGradient>
    </defs>
    <path d="M40 11V5h6M74 5h6v6M80 37v6h-6M46 43h-6v-6" stroke="#3b82f6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <g transform="translate(41 4.5) scale(.82)">
      <HandShape fill="url(#hero-hand)" />
      <g stroke="#ffffff" strokeOpacity=".85" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
        <polyline points={pts([0, 5, 9, 13, 17, 0])} />
        {FINGERS.map((f) => <polyline key={f[0]} points={pts(f)} />)}
      </g>
      {HAND.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={TIPS.includes(i) ? 1.9 : 1.2} fill={TIPS.includes(i) ? "#fb923c" : "#ffffff"} />)}
    </g>
    <motion.g animate={{ y: [0, 30, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
      <rect x="42" y="2" width="36" height="7" fill="url(#hero-scan)" />
      <rect x="42" y="8.4" width="36" height="1.3" rx=".65" fill="#f97316" />
    </motion.g>
    <Sparkle x={22} y={14} size={4} color="#93c5fd" />
    <Sparkle x={28} y={34} size={2.6} color="#fb923c" delay={0.8} />
    <motion.g animate={{ scale: [0.9, 1, 0.9] }} transition={{ duration: 2.4, repeat: Infinity }} style={{ transformOrigin: "100px 24px" }}>
      <circle cx="100" cy="24" r="8" fill="#ffffff" stroke="#3b82f6" strokeWidth="1.4" />
      <path d="m96.4 24.2 2.5 2.5 4.8-5" stroke="#3b82f6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </motion.g>
  </svg>
}

const LAYERS: ReadonlyArray<{ x: number; ys: readonly number[]; fill: string; r: number }> = [
  { x: 14, ys: [12, 24, 36], fill: "#60a5fa", r: 2.8 },
  { x: 42, ys: [7, 18, 30, 41], fill: "#8b5cf6", r: 2.6 },
  { x: 73, ys: [7, 18, 30, 41], fill: "#8b5cf6", r: 2.6 },
  { x: 104, ys: [17, 31], fill: "#f97316", r: 3.4 },
]
/** Each route is one node index per layer; a glowing signal travels along it. */
const ROUTES = [[0, 1, 2, 0], [2, 3, 1, 1], [1, 0, 3, 1], [1, 2, 0, 0]] as const

/** AI understands: a small neural network with signals flowing from input to output. */
function NeuralNet() {
  return <svg viewBox="0 0 120 48" className="h-12 w-full" fill="none" aria-hidden="true">
    <g stroke="#a78bfa" strokeOpacity=".35" strokeWidth=".7">
      {LAYERS.slice(1).map((layer, li) => LAYERS[li].ys.flatMap((y1) => layer.ys.map((y2) => <line key={`${li}-${y1}-${y2}`} x1={LAYERS[li].x} y1={y1} x2={layer.x} y2={y2} />)))}
    </g>
    {ROUTES.map((route, i) => <motion.circle key={i} r="2.1" fill="#fb923c" animate={{ cx: route.map((n, li) => LAYERS[li].x), cy: route.map((n, li) => LAYERS[li].ys[n]), opacity: [0, 1, 1, 0] }} transition={{ duration: 2.4, delay: i * 0.6, repeat: Infinity, ease: "easeInOut" }} />)}
    {LAYERS.map((layer, li) => layer.ys.map((y, ni) => <motion.circle key={`${li}-${y}`} cx={layer.x} cy={y} r={layer.r} fill={layer.fill} stroke="#ffffff" strokeWidth="1.2" animate={li === 1 || li === 2 ? { opacity: [0.65, 1, 0.65] } : undefined} transition={{ duration: 1.8, delay: (li + ni) * 0.2, repeat: Infinity }} />))}
    <Sparkle x={113} y={8} size={3.2} color="#f97316" delay={0.4} />
  </svg>
}

/** They hear you: a glowing voice orb sending out rings, flanked by a speech waveform. */
function VoiceOrb() {
  const bars = [5, 9, 15, 11, 20, 14, 8]
  return <svg viewBox="0 0 120 48" className="h-12 w-full" fill="none" aria-hidden="true">
    <defs>
      <radialGradient id="hero-orb" cx=".35" cy=".3" r=".8"><stop stopColor="#fed7aa" /><stop offset=".45" stopColor="#fb923c" /><stop offset="1" stopColor="#ea580c" /></radialGradient>
    </defs>
    {[0, 1, 2].map((i) => <motion.circle key={i} cx="60" cy="24" stroke="#fb923c" strokeWidth="1.2" animate={{ r: [12, 23], opacity: [0.55, 0] }} transition={{ duration: 2.4, delay: i * 0.8, repeat: Infinity, ease: "easeOut" }} />)}
    {[-1, 1].map((side) => bars.map((h, i) => {
      const x = 60 + side * (21 + i * 5.2)
      return <motion.rect key={`${side}-${i}`} x={x - 1.3} y={24 - h / 2} width="2.6" height={h} rx="1.3" fill={i % 2 ? "#f59e0b" : "#fb923c"} fillOpacity={1 - i * 0.1} animate={{ scaleY: [0.55, 1.15, 0.6] }} style={{ originY: "50%" }} transition={{ duration: 1.2, delay: i * 0.09, repeat: Infinity, ease: "easeInOut" }} />
    }))}
    <circle cx="60" cy="24" r="12" fill="url(#hero-orb)" />
    <circle cx="60" cy="24" r="12" stroke="#ffffff" strokeOpacity=".6" strokeWidth="1" />
    <path d="M53.5 21.5h2.5l4-3.4v11.8l-4-3.4h-2.5a.8.8 0 0 1-.8-.8v-3.4a.8.8 0 0 1 .8-.8Z" fill="#ffffff" />
    <path d="M63 21.2a4 4 0 0 1 0 5.6M65.4 18.8a7.4 7.4 0 0 1 0 10.4" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
}

/** Everyone connects: a sign bubble and a voice bubble trading messages both ways. */
function SignVoiceBubbles() {
  const wave = [6, 11, 16, 9, 14, 7, 4]
  return <svg viewBox="0 0 120 48" className="h-12 w-full" fill="none" aria-hidden="true">
    <defs>
      <linearGradient id="hero-bubble-sign" x1="6" y1="4" x2="46" y2="36" gradientUnits="userSpaceOnUse"><stop stopColor="#60a5fa" /><stop offset="1" stopColor="#4f46e5" /></linearGradient>
      <linearGradient id="hero-bubble-voice" x1="74" y1="12" x2="114" y2="44" gradientUnits="userSpaceOnUse"><stop stopColor="#fdba74" /><stop offset="1" stopColor="#ea580c" /></linearGradient>
    </defs>
    <motion.g animate={{ y: [0, -1.5, 0] }} transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}>
      <rect x="6" y="3" width="40" height="30" rx="10" fill="url(#hero-bubble-sign)" />
      <path d="M13 32.5 10 40l9-7.5Z" fill="#4f46e5" />
      <g transform="translate(14.5 5.5) scale(.52)"><HandShape fill="#ffffff" /></g>
    </motion.g>
    <motion.g animate={{ y: [0, -1.5, 0] }} transition={{ duration: 2.6, delay: 1.3, repeat: Infinity, ease: "easeInOut" }}>
      <rect x="74" y="12" width="40" height="30" rx="10" fill="url(#hero-bubble-voice)" />
      <path d="M107 41.5 110 47.5l-9.5-6Z" fill="#ea580c" />
      {wave.map((h, i) => <motion.rect key={i} x={81.5 + i * 4} y={27 - h / 2} width="2.4" height={h} rx="1.2" fill="#ffffff" animate={{ scaleY: [0.6, 1.1, 0.6] }} style={{ originY: "50%" }} transition={{ duration: 1.1, delay: i * 0.08, repeat: Infinity, ease: "easeInOut" }} />)}
    </motion.g>
    <g stroke="#0d9488" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <motion.path d="M52 19h14m-3-3 3 3-3 3" animate={{ x: [-1.5, 1.5, -1.5] }} transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }} />
      <motion.path d="M68 29H54m3-3-3 3 3 3" animate={{ x: [1.5, -1.5, 1.5] }} transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }} />
    </g>
  </svg>
}

function StoryCard({ card, label }: { card: (typeof CARD_DATA)[number]; label: string }) {
  return <motion.div className={`absolute z-30 w-[46%] max-w-[150px] rounded-[18px] border border-white/80 bg-white/82 px-3 py-2.5 shadow-[0_16px_30px_-18px_rgba(72,72,140,0.42)] backdrop-blur-md ${card.className}`} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1, y: [0, -5, 0] }} transition={{ opacity: { duration: 0.55, delay: card.delay * 0.12 }, scale: { duration: 0.55, delay: card.delay * 0.12 }, y: { duration: 4.6, delay: card.delay, repeat: Infinity, ease: "easeInOut" } }}>
    <p className="mb-1 text-xs leading-tight font-bold text-[#3f4263]">{label}</p>
    <div className={`flex h-12 items-center justify-center overflow-hidden rounded-xl shadow-[inset_0_0_0_1px_rgba(255,255,255,.8)] ${card.tint}`}>
      {card.id === "sign" && <SignScan />}{card.id === "understands" && <NeuralNet />}{card.id === "hear" && <VoiceOrb />}{card.id === "connect" && <SignVoiceBubbles />}
    </div>
  </motion.div>
}

export function HeroIllustration() {
  const { t } = useI18n()
  const cards = t.landing.hero.cards
  const wrapRef = useRef<HTMLDivElement>(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [5, -5]), { stiffness: 80, damping: 18 })
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-5, 5]), { stiffness: 80, damping: 18 })
  const updatePointer = (e: React.PointerEvent<HTMLDivElement>) => { const rect = wrapRef.current?.getBoundingClientRect(); if (rect) { mx.set((e.clientX - rect.left) / rect.width - 0.5); my.set((e.clientY - rect.top) / rect.height - 0.5) } }

  return <div ref={wrapRef} onPointerMove={updatePointer} onPointerLeave={() => { mx.set(0); my.set(0) }} className="relative mx-auto aspect-square w-full max-w-[460px] select-none" style={{ perspective: 1000 }} role="img" aria-label={t.landing.hero.illustrationLabel}>
    <div className="absolute inset-[8%] rounded-full bg-[#b9c9ff]/30 blur-3xl" />
    <motion.div className="absolute inset-[10%]" style={{ rotateX, rotateY }}>
      <motion.div className="absolute inset-0" animate={{ y: [0, -8, 0] }} transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}>
        <div className="absolute inset-[9%] overflow-hidden rounded-full border border-white/80 bg-[radial-gradient(circle_at_38%_30%,rgba(255,255,255,.98),rgba(222,224,255,.68)_42%,rgba(163,171,232,.52))] shadow-[inset_-18px_-14px_35px_rgba(92,100,181,.18),0_24px_60px_-28px_rgba(73,84,167,.6)]" />
        <motion.svg viewBox="0 0 240 240" className="absolute inset-[9%] h-[82%] w-[82%]" animate={{ rotate: 360 }} transition={{ duration: 110, repeat: Infinity, ease: "linear" }} aria-hidden="true">
          <g fill="none" stroke="#7d86cc" strokeOpacity=".25" strokeWidth=".7"><ellipse cx="120" cy="120" rx="108" ry="38" /><ellipse cx="120" cy="120" rx="108" ry="69" /><ellipse cx="120" cy="120" rx="52" ry="108" /><ellipse cx="120" cy="120" rx="81" ry="108" /><path d="M12 120h216M21 76h198M21 164h198" /></g>
          {[...Array(18)].map((_, i) => <motion.circle key={i} cx={30 + ((i * 47) % 180)} cy={25 + ((i * 71) % 185)} r={i % 3 === 0 ? 2.1 : 1.25} fill={i % 4 === 0 ? "#e8a13b" : "#7b85cf"} animate={{ opacity: [.25, 1, .25], scale: [.8, 1.35, .8] }} transition={{ duration: 2.6 + (i % 3) * .5, delay: i * .12, repeat: Infinity }} />)}
          {/* Plexus web: glowing particles linked to their neighbours, fading toward the back of the sphere. */}
          <g stroke="#8b8fe8" strokeWidth=".45">{LINKS.map(([a, b], i) => <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} strokeOpacity={round(0.12 + Math.min(a.z, b.z) * 0.3)} />)}</g>
          {/* Current running along the web: a short bright dash sweeping each live link. */}
          <g stroke="#fff7e6" strokeWidth="1.1" strokeLinecap="round" filter="url(#node-glow)">{LIVE_LINKS.map(([a, b], i) => <motion.line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} pathLength={1} strokeDasharray="0.25 1" animate={{ strokeDashoffset: [1.25, 0], opacity: [0, 1, 0] }} transition={{ duration: 1.1, delay: (i * 0.37) % 3.2, repeat: Infinity, repeatDelay: 1.6 + (i % 4) * 0.5, ease: "easeInOut" }} />)}</g>
          <g filter="url(#node-glow)">{NODES.map((n, i) => i % 5 === 0
            ? <motion.circle key={i} cx={n.x} cy={n.y} r={round(1.2 + n.z * 1.1)} fill={i % 10 === 0 ? "#f5a742" : "#ffffff"} animate={{ opacity: [0.35, 1, 0.35] }} transition={{ duration: 2.2 + (i % 4) * 0.4, delay: (i % 7) * 0.3, repeat: Infinity }} />
            : <circle key={i} cx={n.x} cy={n.y} r={round(0.7 + n.z * 0.9)} fill={i % 3 === 0 ? "#a5a9f5" : "#ffffff"} fillOpacity={round(0.45 + n.z * 0.5)} />)}</g>
          <defs><filter id="node-glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.1" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter></defs>
        </motion.svg>
        {/* Soft inner light, like a glowing glass core. */}
        <div className="pointer-events-none absolute inset-[22%] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,.75),rgba(196,190,255,.35)_45%,transparent_70%)] blur-md" />
        {/* Electrons on tilted orbits. */}
        <svg viewBox="0 0 240 240" className="pointer-events-none absolute inset-[9%] h-[82%] w-[82%]" fill="none" aria-hidden="true">
          {ORBITS.map((angle, i) => <g key={angle} transform={`rotate(${angle} 120 120)`}>
            <path d={ORBIT_PATH} stroke={i === 1 ? "#f5a742" : "#8b8fe8"} strokeOpacity=".35" strokeWidth=".7" />
            <motion.circle r="2.6" fill={i === 1 ? "#f59e0b" : "#6366f1"} filter="url(#node-glow-2)" animate={{ offsetDistance: ["0%", "100%"] }} transition={{ duration: 7 + i * 2.5, delay: i * 1.2, repeat: Infinity, ease: "linear" }} style={{ offsetPath: `path('${ORBIT_PATH}')` }} />
          </g>)}
          {/* Lightning: each bolt flashes and flickers out, staggered so only one or two fire at a time. */}
          {BOLTS.map((bolt, i) => <motion.g key={bolt.trunk} initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 0.25, 0.9, 0] }} transition={{ duration: 0.6, times: [0, 0.15, 0.35, 0.55, 1], delay: i * 0.9, repeat: Infinity, repeatDelay: 4.8 }} filter="url(#bolt-glow)" strokeLinejoin="round" strokeLinecap="round">
            <path d={bolt.trunk} stroke={i % 2 ? "#a78bfa" : "#fb923c"} strokeWidth="2.6" strokeOpacity=".55" />
            <path d={bolt.branch} stroke={i % 2 ? "#a78bfa" : "#fb923c"} strokeWidth="1.6" strokeOpacity=".45" />
            <path d={bolt.trunk} stroke="#ffffff" strokeWidth=".9" />
            <path d={bolt.branch} stroke="#ffffff" strokeWidth=".55" />
          </motion.g>)}
          <defs><filter id="bolt-glow" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="2" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter></defs>
          <defs><filter id="node-glow-2" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="1.6" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter></defs>
        </svg>
        <svg viewBox="0 0 240 240" className="absolute inset-0 size-full" fill="none" aria-hidden="true">{CONNECTIONS.map((path, i) => <g key={path}><path d={path} stroke="#f1aa45" strokeOpacity=".38" strokeWidth="1.2" /><motion.circle r="2.8" fill="#f0a53a" filter="url(#glow)" animate={{ offsetDistance: ["0%", "100%"], opacity: [0, 1, 0] }} transition={{ duration: 2.7, delay: i * .55, repeat: Infinity, ease: "easeOut" }} style={{ offsetPath: `path('${path}')` }} /></g>)}<defs><filter id="glow"><feGaussianBlur stdDeviation="1.2" /></filter></defs></svg>
        <div className="absolute inset-0 flex items-center justify-center"><motion.div className="relative flex size-[84px] items-center justify-center rounded-full border border-[rgba(255,255,255,0.8)] bg-[rgba(255,255,255,0.94)] shadow-[0_0_0_7px_rgba(255,255,255,.3),0_14px_32px_rgba(99,94,190,.24)] sm:size-[100px]" animate={{ boxShadow: ["0 0 0 7px rgba(255,255,255,.3),0 14px 32px rgba(99,94,190,.24)", "0 0 0 12px rgba(244,179,73,.16),0 14px 38px rgba(99,94,190,.34)", "0 0 0 7px rgba(255,255,255,.3),0 14px 32px rgba(99,94,190,.24)"] }} transition={{ duration: 2.5, repeat: Infinity }}><img src="/deafference-mark.png" alt="" aria-hidden="true" className="size-[64%] object-contain drop-shadow-[0_4px_10px_rgba(232,89,12,0.35)]" /></motion.div></div>
      </motion.div>
    </motion.div>
    {CARD_DATA.map(card => <StoryCard key={card.id} card={card} label={cards[card.id]} />)}
  </div>
}
