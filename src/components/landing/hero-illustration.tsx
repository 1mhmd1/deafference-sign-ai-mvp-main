"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useInView } from "framer-motion"
import { AudioLines, Hand } from "lucide-react"
import { cn } from "@/lib/utils"
import { useI18n } from "@/i18n/use-i18n"
import { useLandingReducedMotion } from "./calm-mode"

/* ----------------------------------------------------------------------------------------------
 * The Earth: simplified continent outlines as [longitude, latitude] rings, sampled into dots and
 * drawn on a canvas as a slowly turning globe (orthographic projection, tilted 15° toward us).
 * -------------------------------------------------------------------------------------------- */
const LAND: [number, number][][] = [
  // North America (with Alaska and Central America)
  [[-168, 66], [-162, 70], [-140, 70], [-120, 72], [-95, 72], [-80, 68], [-65, 60], [-55, 52], [-66, 45], [-70, 42], [-76, 35], [-81, 25], [-82, 30], [-90, 29], [-97, 26], [-97, 20], [-90, 16], [-84, 10], [-80, 8], [-87, 14], [-95, 16], [-105, 20], [-110, 23], [-117, 32], [-124, 40], [-124, 48], [-135, 58], [-150, 60], [-165, 60]],
  // Baffin Island, Greenland, Iceland, Cuba
  [[-90, 72], [-80, 73], [-68, 70], [-62, 66], [-72, 64], [-80, 64]],
  [[-50, 82], [-30, 83], [-20, 75], [-22, 70], [-40, 62], [-50, 64], [-55, 72], [-60, 78]],
  [[-24, 64], [-14, 64], [-14, 66], [-22, 66.5]],
  [[-85, 22], [-80, 23], [-74, 20], [-78, 20]],
  // South America
  [[-80, 9], [-75, 11], [-62, 10], [-50, 0], [-35, -6], [-38, -13], [-40, -22], [-48, -28], [-58, -38], [-65, -42], [-68, -52], [-74, -52], [-73, -40], [-71, -30], [-70, -18], [-76, -14], [-81, -5], [-80, 0]],
  // Europe and Great Britain
  [[-10, 36], [-9, 43], [-2, 44], [-4, 48], [-5, 51], [2, 51], [5, 53], [8, 57], [5, 62], [10, 64], [15, 69], [25, 71], [30, 70], [40, 67], [45, 60], [40, 48], [35, 45], [28, 41], [25, 37], [20, 40], [15, 38], [12, 44], [8, 44], [3, 43], [-5, 36]],
  [[-6, 50], [1, 51], [0, 53], [-2, 55], [-5, 58], [-6, 56], [-4, 54], [-5, 52]],
  // Africa, Madagascar, Arabia
  [[-17, 21], [-16, 28], [-10, 30], [-6, 36], [10, 37], [11, 33], [20, 31], [30, 31], [33, 28], [37, 22], [43, 12], [51, 12], [48, 5], [40, -3], [40, -15], [35, -25], [32, -29], [27, -34], [20, -35], [18, -30], [12, -17], [13, -8], [9, -1], [9, 4], [4, 6], [-5, 5], [-8, 4], [-13, 8], [-17, 14]],
  [[44, -25], [47, -25], [50, -16], [49, -12], [44, -17]],
  [[35, 30], [39, 22], [43, 13], [52, 16], [59, 22], [56, 26], [50, 28], [48, 30]],
  // Asia
  [[30, 70], [60, 70], [70, 73], [80, 73], [100, 77], [115, 73], [130, 72], [140, 72], [160, 70], [175, 68], [180, 66], [170, 60], [163, 57], [156, 51], [150, 59], [142, 54], [140, 48], [132, 43], [129, 40], [129, 35], [126, 35], [126, 38], [122, 40], [121, 32], [122, 28], [117, 23], [108, 21], [106, 17], [109, 12], [105, 9], [100, 13], [99, 8], [103, 2], [98, 8], [97, 16], [92, 22], [88, 22], [82, 16], [80, 9], [77, 8], [73, 16], [72, 21], [67, 24], [62, 25], [57, 26], [50, 30], [48, 30], [44, 37], [36, 37], [35, 40], [40, 42], [50, 45], [52, 42], [54, 37], [60, 40], [50, 47], [45, 48], [40, 48], [45, 60], [40, 67]],
  // Japan, Sumatra, Borneo, New Guinea
  [[130, 31], [135, 34], [140, 36], [142, 40], [141, 45], [139, 41], [136, 36], [131, 34]],
  [[95, 5], [98, 4], [104, -3], [106, -6], [102, -5], [96, 2]],
  [[109, 1], [113, -3], [117, -4], [119, 1], [117, 6], [113, 4]],
  [[131, -1], [141, -3], [150, -10], [143, -9], [138, -7], [132, -3]],
  // Australia and New Zealand
  [[114, -22], [114, -34], [118, -35], [124, -33], [131, -31], [138, -35], [141, -38], [147, -39], [150, -37], [153, -30], [153, -25], [146, -19], [142, -11], [141, -15], [136, -12], [131, -11], [125, -14], [122, -18]],
  [[172, -34], [175, -37], [178, -38], [175, -41], [170, -46], [167, -46], [172, -41]],
  // Antarctica
  [[-180, -78], [-150, -76], [-120, -73], [-90, -72], [-60, -64], [-55, -66], [-30, -76], [0, -70], [30, -69], [60, -67], [90, -66], [120, -67], [150, -69], [180, -78], [180, -90], [-180, -90]],
]

/** The world map as a flat (equirectangular) land mask, drawn once with rounded coastlines. */
const MAP_W = 2048
const MAP_H = 1024
let landMaskCache: Uint8Array | null = null

function landMask(): Uint8Array {
  if (landMaskCache) return landMaskCache
  const canvas = document.createElement("canvas")
  canvas.width = MAP_W
  canvas.height = MAP_H
  const ctx = canvas.getContext("2d")!
  ctx.fillStyle = "#000"
  for (const ring of LAND) {
    const pts = ring.map(([lon, lat]) => [((lon + 180) / 360) * MAP_W, ((90 - lat) / 180) * MAP_H])
    const mid = (a: number[], b: number[]) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]
    // Curve through each edge's midpoint so coastlines come out smooth instead of angular.
    const start = mid(pts[pts.length - 1], pts[0])
    ctx.beginPath()
    ctx.moveTo(start[0], start[1])
    pts.forEach((p, i) => {
      const m = mid(p, pts[(i + 1) % pts.length])
      ctx.quadraticCurveTo(p[0], p[1], m[0], m[1])
    })
    ctx.closePath()
    ctx.fill()
  }
  const alpha = ctx.getImageData(0, 0, MAP_W, MAP_H).data
  const mask = new Uint8Array(MAP_W * MAP_H)
  for (let i = 0; i < mask.length; i++) mask[i] = alpha[i * 4 + 3] > 127 ? 1 : 0
  landMaskCache = mask
  return mask
}

/** The logo's gradient (gold → orange → flame → red → crimson → plum), used for the oceans from the lit side outward. */
const OCEAN_STOPS: [number, [number, number, number]][] = [
  [0, [245, 180, 0]],
  [0.25, [242, 140, 26]],
  [0.45, [238, 75, 28]],
  [0.62, [215, 26, 31]],
  [0.8, [176, 16, 48]],
  [1, [94, 15, 69]],
]

function oceanColor(t: number): [number, number, number] {
  for (let s = 1; s < OCEAN_STOPS.length; s++) {
    const [t1, c1] = OCEAN_STOPS[s]
    if (t <= t1) {
      const [t0, c0] = OCEAN_STOPS[s - 1]
      const k = (t - t0) / (t1 - t0)
      return [c0[0] + (c1[0] - c0[0]) * k, c0[1] + (c1[1] - c0[1]) * k, c0[2] + (c1[2] - c0[2]) * k]
    }
  }
  return OCEAN_STOPS[OCEAN_STOPS.length - 1][1]
}

const pack = (r: number, g: number, b: number, a: number) => ((a << 24) | (Math.round(b) << 16) | (Math.round(g) << 8) | Math.round(r)) >>> 0

const TILT = 15 * (Math.PI / 180)
const START_LON = 25 * (Math.PI / 180) // start facing Europe, Africa and the Middle East

/**
 * Per-pixel lookup for one canvas size: where each pixel of the disc lands on the flat map (an
 * orthographic projection tilted 15° toward us), plus its ocean and land colours with the shading
 * already applied. Turning the globe is then just a horizontal shift into the map.
 */
type Sphere = { size: number; disc: Int32Array; row: Int32Array; col: Int32Array; ocean: Uint32Array; land: Uint32Array; image: ImageData; out: Uint32Array }

function buildSphere(ctx: CanvasRenderingContext2D, size: number): Sphere {
  const image = ctx.createImageData(size, size)
  const out = new Uint32Array(image.data.buffer)
  const n = size * size
  const discList: number[] = []
  const row = new Int32Array(n)
  const col = new Int32Array(n)
  const ocean = new Uint32Array(n)
  const land = new Uint32Array(n)
  const r = size / 2
  const sinT = Math.sin(TILT)
  const cosT = Math.cos(TILT)
  for (let py = 0; py < size; py++) {
    for (let px = 0; px < size; px++) {
      const dx = (px + 0.5 - r) / r
      const dy = (r - py - 0.5) / r
      const rho = Math.sqrt(dx * dx + dy * dy)
      if (rho >= 1) continue
      const i = py * size + px
      discList.push(i)
      const z = Math.sqrt(1 - rho * rho)
      const lat = Math.asin(Math.min(1, Math.max(-1, z * sinT + dy * cosT)))
      const lon = Math.atan2(dx, z * cosT - dy * sinT)
      row[i] = Math.min(MAP_H - 1, Math.floor((0.5 - lat / Math.PI) * MAP_H)) * MAP_W
      col[i] = Math.floor((lon / (2 * Math.PI) + 0.5) * MAP_W) % MAP_W
      const a = Math.round(Math.min(1, (1 - rho) * r) * 255) // soft rim
      const [or, og, ob] = oceanColor(Math.min(1, Math.hypot(dx + 0.38, dy - 0.42) / 1.6))
      const shade = 0.8 + 0.2 * z
      ocean[i] = pack(or * shade, og * shade, ob * shade, a)
      const k = 1 - z // land: warm cream, a touch deeper toward the rim
      land[i] = pack(255 - 9 * k, 246 - 34 * k, 234 - 46 * k, a)
    }
  }
  return { size, disc: Int32Array.from(discList), row, col, ocean, land, image, out }
}

function drawEarth(ctx: CanvasRenderingContext2D, s: Sphere, rotation: number) {
  const mask = landMask()
  const shift = Math.round((rotation / (2 * Math.PI)) * MAP_W)
  for (let d = 0; d < s.disc.length; d++) {
    const i = s.disc[d]
    let c = (s.col[i] + shift) % MAP_W
    if (c < 0) c += MAP_W
    s.out[i] = mask[s.row[i] + c] ? s.land[i] : s.ocean[i]
  }
  ctx.putImageData(s.image, 0, 0)
  // Night side and a soft highlight, painted only onto the globe itself.
  const size = s.size
  ctx.globalCompositeOperation = "source-atop"
  const night = ctx.createLinearGradient(size * 0.15, size * 0.1, size, size)
  night.addColorStop(0.5, "rgba(40, 6, 30, 0)")
  night.addColorStop(1, "rgba(40, 6, 30, 0.45)")
  ctx.fillStyle = night
  ctx.fillRect(0, 0, size, size)
  const shine = ctx.createRadialGradient(size * 0.32, size * 0.26, 0, size * 0.32, size * 0.26, size * 0.45)
  shine.addColorStop(0, "rgba(255, 255, 255, 0.28)")
  shine.addColorStop(1, "rgba(255, 255, 255, 0)")
  ctx.fillStyle = shine
  ctx.fillRect(0, 0, size, size)
  ctx.globalCompositeOperation = "source-over"
}

/** Canvas globe that turns slowly (west to east) while on screen; one still frame when motion is reduced. */
function Earth({ spinning }: { spinning: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rotationRef = useRef(START_LON)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx) return
    let sphere: Sphere | null = null
    const resize = () => {
      // At least 1.5x the CSS size so coastlines stay smooth, capped so the per-frame work stays small; CSS scales it to fit.
      const size = Math.min(Math.round(canvas.clientWidth * Math.min(Math.max(window.devicePixelRatio || 1, 1.5), 2)), 720)
      if (!size || sphere?.size === size) return
      canvas.width = size
      canvas.height = size
      sphere = buildSphere(ctx, size)
      drawEarth(ctx, sphere, rotationRef.current)
    }
    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(canvas)
    if (!spinning) return () => observer.disconnect()

    // A full turn every 60s, redrawn at about 25fps.
    let frame = 0
    let last = performance.now()
    const tick = (now: number) => {
      frame = requestAnimationFrame(tick)
      if (now - last < 40 || !sphere) return
      rotationRef.current -= ((now - last) / 60000) * Math.PI * 2
      last = now
      drawEarth(ctx, sphere, rotationRef.current)
    }
    frame = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
    }
  }, [spinning])

  return <canvas ref={canvasRef} className="absolute inset-0 size-full rounded-full" />
}

/* ----------------------------------------------------------------------------------------------
 * The three stages on the Earth, wired together. A current runs along the wires in order:
 * stage 1 lights → spark travels to stage 2 → stage 2 lights → spark to stage 3 → stage 3 lights.
 * -------------------------------------------------------------------------------------------- */

/** Node positions, in % of the illustration (the Earth fills its middle 84%). */
const STAGES = [
  { id: "sign", x: 29, y: 30, labelBelow: false },
  { id: "understands", x: 50, y: 50, labelBelow: true },
  { id: "hear", x: 76, y: 78, labelBelow: true },
] as const

/** The wires between consecutive stages, in the same 0–100 space, arching over the surface. */
const WIRES = ["M29 30 C 28 41, 36 49, 50 50", "M50 50 C 65 50, 77 62, 76 78"] as const

/** The cycle: which stage is lit or which wire carries the current, and for how long. */
const PHASES: { lit: number | null; wire: number | null; ms: number }[] = [
  { lit: 0, wire: null, ms: 1300 },
  { lit: null, wire: 0, ms: 1100 },
  { lit: 1, wire: null, ms: 1300 },
  { lit: null, wire: 1, ms: 1100 },
  { lit: 2, wire: null, ms: 1700 },
]

/** Numbered dot for a stage (a <b>, so the landing's forced dark span colour doesn't reach the white digit). */
function StepNumber({ n }: { n: number }) {
  return (
    <b className="grid size-6 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#D63C1A] to-[#B01030] text-xs leading-none font-bold text-white">
      {n}
    </b>
  )
}

function StageNode({ index, lit, label, pulse }: { index: number; lit: boolean; label: string; pulse: boolean }) {
  const stage = STAGES[index]
  const icon =
    index === 0 ? <Hand className="size-7 sm:size-8" /> : index === 1 ? (
      <img src="/deafference-mark.png" alt="" className={cn("size-9 object-contain transition-[filter,opacity] duration-300 sm:size-10", !lit && "opacity-60 grayscale")} />
    ) : (
      <AudioLines className="size-7 sm:size-8" />
    )
  return (
    <div className="absolute z-20 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center" style={{ left: `${stage.x}%`, top: `${stage.y}%` }}>
      {/* The label sits above stage 1 and below the others, so none of them covers a wire. */}
      {!stage.labelBelow ? <StageLabel n={index + 1} label={label} lit={lit} className="mb-2" /> : null}
      <div className="relative">
        {lit && pulse ? (
          <motion.div
            className="absolute inset-0 rounded-full border-[3px] border-[#fff]"
            initial={{ scale: 1, opacity: 0.95 }}
            animate={{ scale: 1.75, opacity: 0 }}
            transition={{ duration: 1.1, repeat: Infinity, ease: "easeOut" }}
          />
        ) : null}
        {/* Lit: a crimson ring inside a bright white halo, so it stands out on the warm planet; it also grows a little. */}
        <div
          className={cn(
            "rounded-full transition-all duration-300",
            lit
              ? "scale-110 bg-gradient-to-br from-[#F28C1A] via-[#D63C1A] to-[#B01030] p-1.5 shadow-[0_0_0_5px_rgba(255,255,255,0.85),0_0_40px_16px_rgba(255,255,255,0.75)]"
              : "bg-[rgba(255,255,255,0.6)] p-1 shadow-[0_10px_24px_-10px_rgba(40,6,30,0.7)]",
          )}
        >
          <div
            className={cn(
              "grid size-14 place-items-center rounded-full bg-[#fff] transition-colors duration-300 sm:size-16",
              lit ? "text-[#C0341B]" : "text-[#8a93a6]",
            )}
          >
            {icon}
          </div>
        </div>
      </div>
      {stage.labelBelow ? <StageLabel n={index + 1} label={label} lit={lit} className="mt-2" /> : null}
    </div>
  )
}

function StageLabel({ n, label, lit, className }: { n: number; label: string; lit: boolean; className?: string }) {
  // Arbitrary white (not bg-white/…), so dark mode's surface remap leaves this light chip and its dark text alone.
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-full bg-[rgba(255,255,255,0.96)] py-1 ps-1 pe-3 text-xs leading-tight font-bold whitespace-nowrap text-[#25242f] shadow-[0_10px_24px_-14px_rgba(40,6,30,0.7)] transition-shadow duration-300 sm:text-sm",
        lit && "shadow-[0_0_0_2px_rgba(214,60,26,0.9),0_10px_24px_-14px_rgba(40,6,30,0.7)]",
        className,
      )}
    >
      <StepNumber n={n} />
      {label}
    </div>
  )
}

export function HeroIllustration() {
  const { t } = useI18n()
  const cards = t.landing.hero.cards
  const labels = [cards.sign, cards.understands, cards.hear]
  const wrapRef = useRef<HTMLDivElement>(null)
  const inView = useInView(wrapRef, { amount: 0.2 })
  const reduced = useLandingReducedMotion()
  const animate = inView && !reduced
  const [phaseIndex, setPhaseIndex] = useState(0)
  // Bumps every cycle so a wire's current starts again from its beginning.
  const [cycle, setCycle] = useState(0)

  useEffect(() => {
    if (!animate) return
    const id = window.setTimeout(() => {
      const next = (phaseIndex + 1) % PHASES.length
      if (next === 0) setCycle((c) => c + 1)
      setPhaseIndex(next)
    }, PHASES[phaseIndex].ms)
    return () => window.clearTimeout(id)
  }, [animate, phaseIndex])

  const phase = PHASES[phaseIndex]
  // Without motion everything shows connected: all stages lit, both wires live.
  const isLit = (i: number) => reduced || phase.lit === i
  const isLive = (i: number) => reduced || phase.wire === i

  return (
    <div ref={wrapRef} className="relative mx-auto aspect-square w-full max-w-[460px] select-none" role="img" aria-label={t.landing.hero.illustrationLabel}>
      {/* Atmosphere: a thin warm haze around the planet, in the logo's orange. */}
      <div aria-hidden="true" className="absolute inset-[4%] rounded-full bg-[radial-gradient(circle,rgba(242,140,26,0.4)_58%,rgba(242,140,26,0)_71%)]" />
      <div aria-hidden="true" className="absolute inset-[8%] rounded-full shadow-[0_30px_60px_-24px_rgba(94,15,69,0.7)]">
        <Earth spinning={animate} />
      </div>

      {/* Wires: a dark plum cable with a light core; the live one carries a bright gold current (framed by the dark cable, so it reads on land and sea) and a white spark. */}
      <svg viewBox="0 0 100 100" className="absolute inset-0 z-10 size-full overflow-visible" fill="none" aria-hidden="true">
        <defs>
          <linearGradient id="hero-current" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#FFE45C" />
            <stop offset="1" stopColor="#FFC21A" />
          </linearGradient>
          <filter id="hero-current-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="0.9" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {WIRES.map((d, i) => (
          <g key={d}>
            <path d={d} stroke="rgba(40,8,30,0.7)" strokeWidth="1.9" strokeLinecap="round" />
            <path d={d} stroke="rgba(255,255,255,0.85)" strokeWidth="0.6" strokeLinecap="round" />
            {isLive(i) ? (
              <>
                <motion.path
                  key={`current-${i}-${cycle}`}
                  d={d}
                  stroke="url(#hero-current)"
                  strokeWidth="1.15"
                  strokeLinecap="round"
                  filter="url(#hero-current-glow)"
                  initial={{ pathLength: reduced ? 1 : 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: PHASES[i * 2 + 1].ms / 1000, ease: "easeInOut" }}
                />
                {reduced ? null : (
                  <motion.circle
                    key={`spark-${i}-${cycle}`}
                    r="1.7"
                    fill="#ffffff"
                    filter="url(#hero-current-glow)"
                    initial={{ offsetDistance: "0%" }}
                    animate={{ offsetDistance: "100%" }}
                    transition={{ duration: PHASES[i * 2 + 1].ms / 1000, ease: "easeInOut" }}
                    style={{ offsetPath: `path('${d}')` }}
                  />
                )}
              </>
            ) : null}
          </g>
        ))}
      </svg>

      {STAGES.map((stage, i) => (
        <StageNode key={stage.id} index={i} lit={isLit(i)} label={labels[i]} pulse={animate} />
      ))}
    </div>
  )
}
