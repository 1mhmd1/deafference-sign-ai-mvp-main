"use client"

import { useEffect, useId, useRef, useState, type ReactNode } from "react"
import { useI18n } from "@/i18n/use-i18n"
import { useLandingReducedMotion } from "../calm-mode"
import type { Vars } from "./df-ui"

/*
 * The hero picture: Deafference at the centre of a softly glowing globe, wired by orange rays to the four
 * steps of a conversation. Every PULSE_INTERVAL_MS the centre charges and sends an electric pulse down each
 * ray, one card after the other in story order; each card lights up as its pulse arrives, holds, then rests.
 * The globe's network is drawn on a canvas and turns slowly. Everything pauses while the picture is off
 * screen or the tab is hidden; calm mode and the OS "reduce motion" setting leave it still and softly lit.
 * The picture never mirrors (dir="ltr"); only the card labels follow the page's language.
 */

/** One cycle: the centre charges and pulses every PULSE_INTERVAL_MS (6 s: calm for a hero, still alive). */
const PULSE_INTERVAL_MS = 6000
/** The gap between the four pulses, sent in story order. */
const STAGGER_MS = 350
const CHARGE_MS = 350 // the centre charges before the first pulse leaves
const TRAVEL_MS = 700 // one pulse's run along its ray
const LIGHT_MS = 200 // a card lighting up as its pulse lands
const HOLD_MS = 1400 // how long a card stays lit
const FADE_MS = 800 // and how long it takes to go back to rest
/** The globe turns once in this time. */
const SPIN_MS = 80000

// The picture is 1.04 times as wide as it is tall, so the rays are drawn in a 104 × 100 box (circles stay
// round); card boxes are in % of the picture (left, top, width, height).
const VIEW_W = 104
const HUB = { x: 52, y: 49, r: 9.1 } // 17.5% of the width across (.df-net__node)
type Side = "top" | "right" | "left"
const CARDS = [
  { key: "sign", box: [7, 8, 25, 32], dock: ["right", 0.78], bend: 1 },
  { key: "ai", box: [64, 19, 29, 28], dock: ["left", 0.6], bend: -1 },
  { key: "hear", box: [5, 62, 30, 27], dock: ["right", 0.24], bend: -1 },
  { key: "connect", box: [56, 64, 38, 34], dock: ["top", 0.16], bend: 1 },
] as const satisfies readonly { key: string; box: readonly number[]; dock: readonly [Side, number]; bend: number }[]
type CardKey = (typeof CARDS)[number]["key"]

type Pt = { x: number; y: number }
const f2 = (n: number) => Math.round(n * 100) / 100
const bezier = (p: readonly Pt[], t: number): Pt => {
  const u = 1 - t
  const w = [u * u * u, 3 * u * u * t, 3 * u * t * t, t * t * t]
  return { x: f2(p.reduce((s, q, i) => s + q.x * w[i], 0)), y: f2(p.reduce((s, q, i) => s + q.y * w[i], 0)) }
}
const curve = (p: readonly Pt[]) => `M${p[0].x} ${p[0].y}C${p[1].x} ${p[1].y} ${p[2].x} ${p[2].y} ${p[3].x} ${p[3].y}`

// Each ray: a gentle curve from the centre's rim to a dot just outside its card's edge, a dot a third of
// the way along, and a thinner filament that bows a little further out (the pulse's crackle).
const RAYS = CARDS.map(({ box: [l, t, w, h], dock: [side, f], bend }) => {
  const x0 = l * (VIEW_W / 100)
  const x1 = (l + w) * (VIEW_W / 100)
  const edge = side === "top" ? { x: x0 + f * (x1 - x0), y: t } : { x: side === "left" ? x0 : x1, y: t + f * h }
  const len = Math.hypot(edge.x - HUB.x, edge.y - HUB.y)
  const u = { x: (edge.x - HUB.x) / len, y: (edge.y - HUB.y) / len }
  const n = { x: -u.y, y: u.x }
  const at = (d: number, k: number) => ({ x: f2(HUB.x + u.x * d + n.x * k), y: f2(HUB.y + u.y * d + n.y * k) })
  const s = HUB.r + 0.6
  const e = len - 0.9
  const k = bend * 0.13 * (e - s)
  const main = [at(s, 0), at(s + (e - s) * 0.3, k), at(s + (e - s) * 0.7, k), at(e, 0)]
  const arc = [main[0], at(s + (e - s) * 0.3, k + bend * 1.6), at(s + (e - s) * 0.7, k + bend * 1.2), main[3]]
  return { d: curve(main), arc: curve(arc), start: main[0], end: main[3], third: bezier(main, 1 / 3) }
})

// Short, faint rays around the centre (the sunburst), at angles clear of the four main rays.
const BURST = [-172, -112, -94, -72, -18, 4, 22, 78, 96, 112, 160, 178].map((deg, i) => {
  const a = (deg * Math.PI) / 180
  const r0 = HUB.r + 0.5
  const r1 = HUB.r + 2.6 + ((i * 5) % 4) * 1.5
  return { x1: f2(HUB.x + Math.cos(a) * r0), y1: f2(HUB.y + Math.sin(a) * r0), x2: f2(HUB.x + Math.cos(a) * r1), y2: f2(HUB.y + Math.sin(a) * r1) }
})

// Each pulse is a few dashes on its ray's path (pathLength 100) with their heads together: a wide soft glow,
// a long faint tail, a shorter brighter one and a white-hot core; plus a broken dash on the filament.
const PULSE_LAYERS = [
  { cls: "df-net__pz--glow", l: 14 },
  { cls: "df-net__pz--tail", l: 40 },
  { cls: "df-net__pz--mid", l: 20 },
  { cls: "df-net__pz--core", l: 5 },
] as const
const CRACKLE = { dash: "3 2 1.5 2.5 2 200", l: 11 }

// A hand as hand-tracking sees it: 21 landmarks (wrist, then thumb, index, middle, ring, little finger)
// and the bones between them.
const HAND = [
  [50, 94], [38, 86], [28, 76], [21, 66], [15, 57],
  [39, 56], [36, 40], [34, 29], [33, 19],
  [50, 53], [50, 35], [50, 23], [50, 12],
  [60, 55], [63, 39], [65, 28], [66, 19],
  [69, 61], [75, 49], [79, 41], [82, 33],
] as const
const BONES = [
  [0, 1], [1, 2], [2, 3], [3, 4], [0, 5], [5, 6], [6, 7], [7, 8], [5, 9], [9, 10], [10, 11], [11, 12],
  [9, 13], [13, 14], [14, 15], [15, 16], [13, 17], [17, 18], [18, 19], [19, 20], [0, 17],
] as const
// Each finger from the joint it grows out of: thumb, index, middle, ring, little.
const FINGERS = [[0, 1, 2, 3, 4], [0, 5, 6, 7, 8], [5, 9, 10, 11, 12], [9, 13, 14, 15, 16], [13, 17, 18, 19, 20]] as const
const ORANGE_TIPS = new Set([8, 12, 16, 20])

function HandSvg({ children }: { children: ReactNode }) {
  return (
    <svg className="df-net__hand" viewBox="0 0 100 100" aria-hidden="true" focusable="false">
      {children}
    </svg>
  )
}

const pts = (ids: readonly number[]) => ids.map((i) => HAND[i].join(",")).join(" ")

/** The tracked hand: a faint silhouette, indigo bones and joints, orange fingertips; then a copy of each
 *  finger that lights up. */
function Hand() {
  return (
    <>
      <HandSvg>
        <g className="df-net__flesh">
          <polygon points={pts([0, 1, 5, 9, 13, 17])} />
          {FINGERS.map((finger) => (
            <polyline key={finger[1]} points={pts(finger.slice(1))} />
          ))}
        </g>
        <g className="df-net__bones">
          {BONES.map(([a, b]) => (
            <line key={`${a}-${b}`} x1={HAND[a][0]} y1={HAND[a][1]} x2={HAND[b][0]} y2={HAND[b][1]} />
          ))}
        </g>
        {HAND.map(([x, y], i) => (
          <circle key={i} className={ORANGE_TIPS.has(i) ? "df-net__tip" : "df-net__joint"} cx={x} cy={y} r={ORANGE_TIPS.has(i) ? 3.4 : 2.6} />
        ))}
      </HandSvg>
      {FINGERS.map((finger) => (
        <span key={finger[1]} className="df-net__finger">
          <HandSvg>
            <polyline points={pts(finger)} />
            {finger.slice(1).map((j) => (
              <circle key={j} cx={HAND[j][0]} cy={HAND[j][1]} r={3.6} />
            ))}
          </HandSvg>
        </span>
      ))}
    </>
  )
}

// A brain in line art: the left half, mirrored for the right (x → 100 - x in a 100 × 84 box).
const BRAIN_HALF = [
  "M47 10C41 5 32 6 29 12C22 9 13 14 14 23C7 26 5 36 10 42C5 48 6 59 14 62C13 70 21 76 29 73C33 79 43 79 47 73C45 62 49 52 46 43C43 34 49 22 47 10",
  "M29 12C31 18 26 22 21 21",
  "M14 23C19 25 22 29 20 34",
  "M10 42C16 41 21 44 22 50",
  "M14 62C19 58 25 59 27 63",
  "M29 73C29 67 34 64 39 66",
  "M39 16C35 21 39 27 35 32",
  "M28 31C32 35 33 40 29 44",
  "M42 46C37 48 35 54 39 58",
]
const mirror = (d: string) => d.replace(/(-?\d+(?:\.\d+)?) (-?\d+(?:\.\d+)?)/g, (_, x, y) => `${100 - Number(x)} ${y}`)
const BRAIN = [...BRAIN_HALF, ...BRAIN_HALF.map(mirror)]

function BrainSvg({ lit }: { lit?: boolean }) {
  return (
    <svg className={lit ? "df-net__brain df-net__brain--lit" : "df-net__brain"} viewBox="0 0 100 84" aria-hidden="true" focusable="false">
      {BRAIN.map((d) => (
        <path key={d} d={d} vectorEffect="non-scaling-stroke" />
      ))}
    </svg>
  )
}

// A spoken sentence as bars: tallest in the middle, tapering to both sides (heights in % of the box).
const WAVE_HALF = [14, 24, 18, 32, 24, 44, 34, 56, 46, 72, 60, 86]
const WAVE = [...WAVE_HALF, 100, ...[...WAVE_HALF].reverse()]
// In five groups, so the bars can bounce in a sweep from left to right.
const WAVE_GROUPS = [0, 5, 10, 15, 20].map((i) => WAVE.slice(i, i + 5))

/** Two people talking, one in each colour of the conversation; `lit` fills in their speech bubbles. */
function People({ lit }: { lit?: boolean }) {
  return (
    <svg className={lit ? "df-net__people df-net__people--lit" : "df-net__people"} viewBox="0 0 120 90" aria-hidden="true" focusable="false">
      {lit ? null : (
        <>
          <circle className="df-net__p1" cx="30" cy="40" r="12" />
          <path className="df-net__p1" d="M8 90c0-17 9.8-28 22-28s22 11 22 28z" />
          <circle className="df-net__p2" cx="90" cy="40" r="12" />
          <path className="df-net__p2" d="M68 90c0-17 9.8-28 22-28s22 11 22 28z" />
        </>
      )}
      {/* A bubble each, the tail pointing at its speaker. */}
      <g className="df-net__say1">
        <path d="M44 4h12a8 8 0 0 1 8 8v2a8 8 0 0 1-8 8H46l-7 6 1-6.4A8 8 0 0 1 36 14v-2a8 8 0 0 1 8-8z" />
        <circle cx="44" cy="13" r="2" />
        <circle cx="50" cy="13" r="2" />
        <circle cx="56" cy="13" r="2" />
      </g>
      <g className="df-net__say2">
        <path d="M64 24h12a8 8 0 0 1 8 8v2a8 8 0 0 1-4 6.9l1 6.1-7-5H64a8 8 0 0 1-8-8v-2a8 8 0 0 1 8-8z" />
        <circle cx="64" cy="33" r="2" />
        <circle cx="70" cy="33" r="2" />
        <circle cx="76" cy="33" r="2" />
      </g>
    </svg>
  )
}

const ART: Record<CardKey, ReactNode> = {
  sign: <Hand />,
  ai: (
    <>
      <span className="df-net__brain-glow" />
      <BrainSvg />
      <span className="df-net__brain-lit">
        <BrainSvg lit />
      </span>
    </>
  ),
  hear: (
    <span className="df-net__wave">
      {WAVE_GROUPS.map((group, g) => (
        <span key={g} className="df-net__bars">
          {group.map((h, i) => (
            <i key={i} style={{ "--h": `${h}%` } as Vars} />
          ))}
        </span>
      ))}
    </span>
  ),
  connect: (
    <>
      <People />
      <span className="df-net__people-lit">
        <People lit />
      </span>
    </>
  ),
}

// ---------- the pulse cycle (Web Animations, so its timing comes from the constants above) ----------

const launch = (i: number) => CHARGE_MS + i * STAGGER_MS
const arrive = (i: number) => launch(i) + TRAVEL_MS
const litEnd = (i: number) => arrive(i) + LIGHT_MS + HOLD_MS
const TAIL_MS = 260 // a pulse's tail slipping into its card after the head lands

/** One cycle's animations, all started now with their own delays. Each one runs only while it changes and
 *  then holds its last frame, so between pulses (and while a card holds) the browser has nothing to update. */
function startCycle(root: HTMLElement): Animation[] {
  const anims: Animation[] = []
  const run = (el: Element | null | undefined, keyframes: Keyframe[], start: number, duration: number, easing = "linear") => {
    if (el) anims.push(el.animate(keyframes, { delay: start, duration, easing, fill: "forwards" }))
  }
  /** Fades `el` in as card `i` lights up (from `at`) and out again as the card goes back to rest. */
  const light = (el: Element | null | undefined, i: number, at = arrive(i)) => {
    run(el, [{ opacity: 0 }, { opacity: 1 }], at, LIGHT_MS, "ease-out")
    run(el, [{ opacity: 1 }, { opacity: 0 }], litEnd(i), FADE_MS, "ease-in-out")
  }
  const all = (sel: string) => Array.from(root.querySelectorAll(sel))

  // The centre charges: a brighter aura swells, and the logo glows.
  run(
    root.querySelector(".df-net__charge"),
    [
      { opacity: 0, transform: "scale(1)", easing: "ease-out" },
      { opacity: 1, transform: "scale(1.25)", offset: CHARGE_MS / (CHARGE_MS + 900), easing: "ease-in-out" },
      { opacity: 0, transform: "scale(1.1)" },
    ],
    0,
    CHARGE_MS + 900,
  )
  run(
    root.querySelector(".df-net__logo-glow"),
    [{ opacity: 0, easing: "ease-out" }, { opacity: 1, offset: CHARGE_MS / (CHARGE_MS + 800), easing: "ease-in-out" }, { opacity: 0 }],
    0,
    CHARGE_MS + 800,
  )

  all(".df-net__pulse").forEach((pulse, i) => {
    // Each dash's head runs from the centre to the card, then its tail slips into the dock as it fades.
    pulse.querySelectorAll<SVGPathElement>("[data-l]").forEach((path) => {
      const l = Number(path.dataset.l)
      run(
        path,
        [
          { strokeDashoffset: l, easing: "cubic-bezier(.45, 0, .25, 1)" },
          { strokeDashoffset: l - 100, offset: TRAVEL_MS / (TRAVEL_MS + TAIL_MS) },
          { strokeDashoffset: -100 },
        ],
        launch(i),
        TRAVEL_MS + TAIL_MS,
      )
    })
    run(pulse, [{ opacity: 0 }, { opacity: 1 }], launch(i), 60)
    run(pulse, [{ opacity: 1 }, { opacity: 0 }], arrive(i) + 40, TAIL_MS)
  })
  // A small ring bursts where each pulse lands.
  all(".df-net__ring").forEach((ring, i) =>
    run(
      ring,
      [
        { opacity: 0, transform: "scale(.4)", easing: "ease-out" },
        { opacity: 0.95, transform: "scale(.8)", offset: 0.12, easing: "ease-out" },
        { opacity: 0, transform: "scale(2.6)" },
      ],
      arrive(i) - 20,
      670,
    ),
  )
  // Each card lights up: a warm border and glow, and its picture wakes.
  all(".df-net__glow").forEach((glow, i) => light(glow, i))
  all(".df-net__finger").forEach((finger, j) => light(finger, 0, arrive(0) + j * 90))
  light(root.querySelector(".df-net__brain-lit"), 1)
  light(root.querySelector(".df-net__brain-glow"), 1)
  all(".df-net__bars").forEach((bars, j) =>
    run(
      bars,
      [1, 1.32, 0.82, 1.14, 0.95, 1].map((s) => ({ transform: `scaleY(${s})`, easing: "ease-in-out" })),
      arrive(2) + j * 70,
      880,
    ),
  )
  light(root.querySelector(".df-net__people-lit"), 3)
  return anims
}

// ---------- the globe's network (canvas) ----------

// A seeded random source, so the network is the same on every visit.
function seeded(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const RING_PTS = 49 // points per latitude/longitude ring (the last one closes it)
// p: the points (x, y, z); rings: every ring's points, one after another; twinkle: for each point, its
// twinkle's number, or -1 for a steady dot.
type Mesh = { p: Float32Array; size: Float32Array; edges: Uint16Array; rings: Float32Array; twinkle: Int16Array }
let MESH: Mesh | null = null

/** About 240 points spread over a sphere (Fibonacci, lightly jittered), each linked to its 2–3 nearest
 *  neighbours, plus faint latitude and longitude rings; built once, on first draw. */
function getMesh(): Mesh {
  if (MESH) return MESH
  const N = 240
  const rand = seeded(11)
  const p = new Float32Array(N * 3)
  const size = new Float32Array(N)
  for (let i = 0; i < N; i++) {
    const y = Math.max(-0.999, Math.min(0.999, 1 - (2 * (i + 0.5)) / N + (rand() - 0.5) * 0.012))
    const r = Math.sqrt(1 - y * y)
    const th = i * Math.PI * (3 - Math.sqrt(5)) + (rand() - 0.5) * 0.3
    p.set([Math.cos(th) * r, y, Math.sin(th) * r], i * 3)
    size[i] = rand()
  }
  const seen = new Set<number>()
  const edges: number[] = []
  for (let i = 0; i < N; i++) {
    const near: Array<[number, number]> = []
    for (let j = 0; j < N; j++) {
      if (j === i) continue
      const dx = p[i * 3] - p[j * 3]
      const dy = p[i * 3 + 1] - p[j * 3 + 1]
      const dz = p[i * 3 + 2] - p[j * 3 + 2]
      near.push([dx * dx + dy * dy + dz * dz, j])
    }
    near.sort((a, b) => a[0] - b[0])
    near.slice(0, 3).forEach(([, j], k) => {
      if (k === 2 && rand() > 0.55) return
      const key = Math.min(i, j) * N + Math.max(i, j)
      if (seen.has(key)) return
      seen.add(key)
      edges.push(i, j)
    })
  }
  const rings: number[] = []
  const ring = (fn: (a: number) => [number, number, number]) => {
    for (let k = 0; k < RING_PTS; k++) rings.push(...fn((k / (RING_PTS - 1)) * Math.PI * 2))
  }
  for (const lat of [-60, -30, 0, 30, 60]) {
    const y = Math.sin((lat * Math.PI) / 180)
    const r = Math.cos((lat * Math.PI) / 180)
    ring((a) => [Math.cos(a) * r, y, Math.sin(a) * r])
  }
  for (let m = 0; m < 6; m++) {
    const lon = (m / 6) * Math.PI
    ring((a) => [Math.cos(a) * Math.cos(lon), Math.sin(a), Math.cos(a) * Math.sin(lon)])
  }
  const twinkle = Int16Array.from({ length: N }, (_, i) => (i % 14 === 3 ? (i - 3) / 14 : -1))
  MESH = { p, size, edges: Uint16Array.from(edges), rings: Float32Array.from(rings), twinkle }
  return MESH
}

const TILT = (17 * Math.PI) / 180
const COS_T = Math.cos(TILT)
const SIN_T = Math.sin(TILT)
const FRAME_MS = 28 // ~30 frames a second is plenty for a turn this slow, and half the work of 60
const smooth = (a: number, b: number, x: number) => {
  const t = Math.max(0, Math.min(1, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}

/** A dot with a soft glow, drawn once and stamped for every node. */
function makeSprite(dot: string, glow: string) {
  const c = document.createElement("canvas")
  c.width = c.height = 64
  const g = c.getContext("2d")
  if (!g) return c
  const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32)
  grad.addColorStop(0, `rgba(${dot}, 1)`)
  grad.addColorStop(0.3, `rgba(${dot}, 1)`)
  grad.addColorStop(0.45, `rgba(${glow}, .55)`)
  grad.addColorStop(1, `rgba(${glow}, 0)`)
  g.fillStyle = grad
  g.fillRect(0, 0, 64, 64)
  return c
}

/** The globe's network: front lines and dots strong, the back faint, everything fading toward the rim. */
function GlobeMesh({ running }: { running: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const angle = useRef(0.6)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx) return
    const mesh = getMesh()
    const n = mesh.size.length
    const ringN = mesh.rings.length / 3
    const pts = new Float32Array(n * 3) // projected: screen x, y and depth (z > 0 faces us)
    const ringPts = new Float32Array(ringN * 3)
    const alpha = new Float32Array(n)
    let colors = { mesh: "", dot: "", glow: "" }
    let sprite: HTMLCanvasElement | null = null
    const readColors = () => {
      const css = getComputedStyle(canvas)
      const next = {
        mesh: css.getPropertyValue("--df-net-mesh").trim() || "150, 150, 222",
        dot: css.getPropertyValue("--df-net-dot").trim() || "255, 255, 255",
        glow: css.getPropertyValue("--df-net-dot-glow").trim() || "222, 224, 255",
      }
      if (!sprite || next.dot !== colors.dot || next.glow !== colors.glow) sprite = makeSprite(next.dot, next.glow)
      colors = next
    }

    const draw = (now: number) => {
      const w = canvas.width
      const h = canvas.height
      if (!w || !h || !sprite) return
      const dpr = w / Math.max(1, canvas.clientWidth)
      const R = (Math.min(w, h) / 2) * 0.95
      const cx = w / 2
      const cy = h / 2
      const ca = Math.cos(angle.current)
      const sa = Math.sin(angle.current)
      // Turn about the vertical axis, then tilt toward the viewer.
      const project = (src: Float32Array, count: number, out: Float32Array) => {
        for (let i = 0; i < count * 3; i += 3) {
          const x = src[i]
          const y = src[i + 1]
          const z1 = -x * sa + src[i + 2] * ca
          out[i] = cx + (x * ca + src[i + 2] * sa) * R
          out[i + 1] = cy + (y * COS_T - z1 * SIN_T) * R
          out[i + 2] = y * SIN_T + z1 * COS_T
        }
      }
      ctx.clearRect(0, 0, w, h)
      ctx.lineCap = "round"

      // Faint latitude and longitude rings, as texture only (the back half fainter still).
      project(mesh.rings, ringN, ringPts)
      ctx.lineWidth = 0.7 * dpr
      for (const front of [false, true]) {
        ctx.beginPath()
        for (let k = 0; k < ringN - 1; k++) {
          if (k % RING_PTS === RING_PTS - 1) continue
          if (ringPts[k * 3 + 2] + ringPts[k * 3 + 5] > 0 !== front) continue
          ctx.moveTo(ringPts[k * 3], ringPts[k * 3 + 1])
          ctx.lineTo(ringPts[k * 3 + 3], ringPts[k * 3 + 4])
        }
        ctx.strokeStyle = `rgba(${colors.mesh}, ${front ? 0.12 : 0.05})`
        ctx.stroke()
      }

      project(mesh.p, n, pts)
      for (let i = 0; i < n; i++) {
        const z = pts[i * 3 + 2]
        const rim = Math.hypot(pts[i * 3] - cx, pts[i * 3 + 1] - cy) / R
        alpha[i] = z > 0 ? (0.45 + 0.55 * z) * (1 - 0.55 * smooth(0.7, 1, rim)) : 0.24 * (1 + z * 0.5)
      }

      // Links, in a few strength bands (one stroke per band keeps the canvas fast).
      ctx.lineWidth = 0.75 * dpr
      const BANDS = 6
      for (let band = 0; band < BANDS; band++) {
        ctx.beginPath()
        let any = false
        for (let e = 0; e < mesh.edges.length; e += 2) {
          const a = mesh.edges[e]
          const b = mesh.edges[e + 1]
          if (Math.min(BANDS - 1, Math.floor(Math.min(alpha[a], alpha[b]) * BANDS)) !== band) continue
          ctx.moveTo(pts[a * 3], pts[a * 3 + 1])
          ctx.lineTo(pts[b * 3], pts[b * 3 + 1])
          any = true
        }
        if (!any) continue
        ctx.strokeStyle = `rgba(${colors.mesh}, ${(0.3 * (band + 0.5)) / BANDS + 0.03})`
        ctx.stroke()
      }

      // Dots: 1.5–3 px across the front, with a soft glow; the twinkling ones also shine a little larger.
      const t = now / 1000
      for (let i = 0; i < n; i++) {
        let a = alpha[i]
        if (a < 0.03) continue
        const tw = mesh.twinkle[i]
        if (tw >= 0) a *= 0.6 + 0.4 * Math.sin(t * (1.2 + (tw % 4) * 0.35) + tw * 1.7)
        // r: the white core is ~0.8 r in radius (0.75–1.5 px), its glow reaches 2.75 r.
        const r = (0.9 + mesh.size[i] * 0.9) * dpr * (0.7 + 0.3 * Math.max(0, alpha[i])) * (tw >= 0 ? 1.4 : 1)
        const s = r * 5.5
        ctx.globalAlpha = Math.min(1, a)
        ctx.drawImage(sprite, pts[i * 3] - s / 2, pts[i * 3 + 1] - s / 2, s, s)
      }
      ctx.globalAlpha = 1
    }

    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1)
      const w = Math.round(canvas.clientWidth * dpr)
      const h = Math.round(canvas.clientHeight * dpr)
      if (w !== canvas.width || h !== canvas.height) {
        canvas.width = w
        canvas.height = h
      }
      draw(performance.now())
    }
    readColors()
    const sizer = new ResizeObserver(resize)
    sizer.observe(canvas)
    // The accessibility menu switches light/dark on <html>: pick up the new colours.
    const theme = new MutationObserver(() => {
      readColors()
      draw(performance.now())
    })
    theme.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })

    // Paced by a timer, so the page isn't asked for a frame 60 times a second just to skip half of them.
    let raf = 0
    let timer = 0
    let last = performance.now()
    const frame = (now: number) => {
      angle.current += (Math.min(now - last, 100) / SPIN_MS) * Math.PI * 2
      last = now
      draw(now)
      timer = window.setTimeout(() => (raf = requestAnimationFrame(frame)), FRAME_MS)
    }
    if (running) raf = requestAnimationFrame(frame)

    return () => {
      window.clearTimeout(timer)
      cancelAnimationFrame(raf)
      sizer.disconnect()
      theme.disconnect()
    }
  }, [running])

  return <canvas ref={ref} className="df-net__mesh" aria-hidden="true" />
}

// ---------- the picture ----------

export function HeroNetwork() {
  const { t, dir } = useI18n()
  const net = t.landing.hero.net
  const reduced = useLandingReducedMotion()
  const gid = `df-net${useId().replace(/[^a-zA-Z0-9]/g, "")}`

  // The loop only runs while the picture is on screen and the tab is visible.
  const ref = useRef<HTMLDivElement>(null)
  const [onScreen, setOnScreen] = useState(true)
  const [tabShown, setTabShown] = useState(true)
  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === "undefined") return
    const observer = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting))
    observer.observe(el)
    return () => observer.disconnect()
  }, [])
  useEffect(() => {
    const update = () => setTabShown(!document.hidden)
    update()
    document.addEventListener("visibilitychange", update)
    return () => document.removeEventListener("visibilitychange", update)
  }, [])
  const running = !reduced && onScreen && tabShown

  // A fresh cycle every PULSE_INTERVAL_MS while running; stopping drops the one in flight (the picture rests),
  // and coming back on screen starts again with the centre charging.
  useEffect(() => {
    const root = ref.current
    if (!root || !running || typeof root.animate !== "function") return
    let anims: Animation[] = []
    let timer = 0
    const cycle = () => {
      for (const a of anims) a.cancel()
      anims = startCycle(root)
      timer = window.setTimeout(cycle, PULSE_INTERVAL_MS)
    }
    cycle()
    return () => {
      window.clearTimeout(timer)
      for (const a of anims) a.cancel()
    }
  }, [running])

  return (
    <div ref={ref} className="df-net" dir="ltr" role="img" aria-label={net.label}>
      <div className="df-net__haze" aria-hidden="true" />
      <div className="df-net__globe" aria-hidden="true">
        <GlobeMesh running={running} />
      </div>

      {/* The rays, their dots and the sunburst: still, so their glow is drawn once. */}
      <svg className="df-net__rays" viewBox={`0 0 ${VIEW_W} 100`} aria-hidden="true" focusable="false">
        <defs>
          {RAYS.map((ray, i) => (
            <linearGradient key={i} id={`${gid}-${i}`} gradientUnits="userSpaceOnUse" x1={ray.start.x} y1={ray.start.y} x2={ray.end.x} y2={ray.end.y}>
              <stop offset="0" stopColor="#ffa94d" />
              <stop offset="1" stopColor="#f26a2e" />
            </linearGradient>
          ))}
        </defs>
        <g className="df-net__burst">
          {BURST.map((b, i) => (
            <line key={i} {...b} vectorEffect="non-scaling-stroke" />
          ))}
          {BURST.map((b, i) => (
            <circle key={i} cx={b.x2} cy={b.y2} r={0.28} />
          ))}
        </g>
        {RAYS.map((ray, i) => (
          <path key={i} className="df-net__ray" d={ray.d} stroke={`url(#${gid}-${i})`} vectorEffect="non-scaling-stroke" />
        ))}
        <g className="df-net__dots">
          {RAYS.map((ray, i) => (
            <g key={i}>
              <circle cx={ray.third.x} cy={ray.third.y} r={0.55} />
              <circle cx={ray.end.x} cy={ray.end.y} r={0.6} />
            </g>
          ))}
        </g>
      </svg>

      {/* The pulses, all drawn at rest (hidden) and run by startCycle. */}
      <svg className="df-net__pulses" viewBox={`0 0 ${VIEW_W} 100`} aria-hidden="true" focusable="false">
        {RAYS.map((ray, i) => (
          <g key={i} className="df-net__pulse">
            {PULSE_LAYERS.map((layer) => (
              <path key={layer.cls} className={`df-net__pz ${layer.cls}`} d={ray.d} pathLength={100} strokeDasharray={`${layer.l} 200`} strokeDashoffset={layer.l} data-l={layer.l} />
            ))}
            <path className="df-net__pz df-net__pz--arc" d={ray.arc} pathLength={100} strokeDasharray={CRACKLE.dash} strokeDashoffset={CRACKLE.l} data-l={CRACKLE.l} />
          </g>
        ))}
      </svg>
      {RAYS.map((ray, i) => (
        <span key={i} className="df-net__ring" style={{ "--x": `${(ray.end.x / VIEW_W) * 100}%`, "--y": `${ray.end.y}%` } as Vars} aria-hidden="true" />
      ))}

      {CARDS.map(({ key, box: [x, y, w, h] }) => (
        <div key={key} className={`df-net__card df-net__card--${key}`} style={{ "--x": `${x}%`, "--y": `${y}%`, "--w": `${w}%`, "--h": `${h}%` } as Vars}>
          <b className="df-net__title" dir={dir}>
            {net[key]}
          </b>
          <span className="df-net__art" aria-hidden="true">
            {ART[key]}
          </span>
          <span className="df-net__glow" aria-hidden="true" />
        </div>
      ))}

      <div className="df-net__node" aria-hidden="true">
        <span className="df-net__aura" />
        <span className="df-net__charge" />
        <span className="df-net__disc">
          <span className="df-net__logo-glow" />
          <img className="df-net__logo" src="/deafference-mark.webp" alt="" width={96} height={96} decoding="async" />
        </span>
      </div>
    </div>
  )
}
