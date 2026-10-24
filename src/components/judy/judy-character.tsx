"use client"

import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react"
import "./judy-character.css"

// Judy, ported from JudyCompanion.vue: the artwork, the CSS animations and
// (opt-in, via `autoPlay`) the original random idle routine. The page-specific
// behaviour (route watching, section detection, data-judy-* triggers, chat)
// did not come across — otherwise the parent decides what she does via props.

export type JudyMood = "neutral" | "happy" | "listen" | "think" | "sad"

export type JudyPose =
  | "idle"
  | "walk"
  | "run"
  | "wave"
  | "point"
  | "ponder"
  | "listen"
  | "cute-think"
  | "laugh"
  | "party"
  | "cheer-loop"
  | "twirl"
  | "dance"
  | "drive"
  | "eat"
  | "hungry"
  | "phone"
  | "sleep"
  | "coy"
  | "love"
  | "communicate"

// Each pose turns on the same state classes the Vue file combined for it, and
// the mood (face) the original paired it with. `mood` overrides the face.
const POSES: Record<JudyPose, { classes: string[]; mood: JudyMood }> = {
  idle: { classes: [], mood: "neutral" },
  walk: { classes: ["judy-walking"], mood: "neutral" },
  run: { classes: ["judy-walking", "judy-running"], mood: "neutral" },
  wave: { classes: ["judy-waving"], mood: "happy" },
  point: { classes: ["judy-reaching", "judy-excited"], mood: "happy" },
  ponder: { classes: ["judy-pondering"], mood: "think" },
  listen: { classes: ["judy-cupping"], mood: "listen" },
  "cute-think": { classes: ["judy-cute-thinking", "judy-pondering"], mood: "think" },
  laugh: { classes: ["judy-laughing"], mood: "happy" },
  party: { classes: ["judy-partying"], mood: "happy" },
  "cheer-loop": { classes: ["judy-subscribing"], mood: "happy" },
  twirl: { classes: ["judy-twirling"], mood: "happy" },
  dance: { classes: ["judy-happy-dancing"], mood: "happy" },
  drive: { classes: ["judy-driving"], mood: "happy" },
  eat: { classes: ["judy-eating"], mood: "happy" },
  hungry: { classes: ["judy-hungry"], mood: "happy" },
  phone: { classes: ["judy-phone-talking"], mood: "happy" },
  sleep: { classes: ["judy-sleeping"], mood: "neutral" },
  // Playful: one finger at the corner of her smile, glancing up to the right.
  coy: { classes: ["judy-coy"], mood: "happy" },
  // Signs I LOVE YOU (thumb, index and pinky up, palm out) while zoomed in so the handshape reads.
  love: { classes: ["judy-signing-love"], mood: "happy" },
  // Signs COMMUNICATION / FOR / EVERYONE (ASL) over the 10s move, zoomed in, with every finger drawn.
  communicate: { classes: ["judy-signing-communicate"], mood: "happy" },
}

const DRAG_THRESHOLD = 4

type Point = { x: number; y: number }

export interface JudyCharacterProps {
  pose?: JudyPose
  /** Face expression; defaults to the one the original paired with `pose`. */
  mood?: JudyMood
  /** CSS `left` of the fixed-position character. Numbers are px. */
  x?: number | string
  /** CSS `bottom` of the fixed-position character. Numbers are px. */
  y?: number | string
  facing?: "left" | "right"
  /** Width in px (height follows). Default: 132, or 100 below 640px wide. */
  size?: number
  /** Speech bubble text; the bubble hides when empty. */
  message?: string
  draggable?: boolean
  /** Called with the dropped `left`/`bottom` in px after a drag. */
  onDragEnd?: (position: Point) => void
  /**
   * Runs Judy's idle routine: a random move for 10s, a 30s rest, then another
   * random move, starting as soon as she mounts. While a move plays it
   * overrides pose, mood, message and position; during the rest the props
   * apply again.
   */
  autoPlay?: boolean
  /** Translated bubble lines for `autoPlay` (defaults to English). */
  autoPlayLines?: JudyAutoPlayLines
  /** Renders Judy in normal document flow (e.g. inside a card) instead of fixed to the viewport; `x`/`y` are ignored. */
  inline?: boolean
  /** Announce speech-bubble text to screen readers. Turn off where the bubble repeats a visible status. */
  announce?: boolean
  /** Accessible name for the illustration. */
  label?: string
  className?: string
}

type AutoAction = { pose: JudyPose; mood?: JudyMood }

/** Speech-bubble lines used by `autoPlay`; pass translated copies via `autoPlayLines`. */
export const JUDY_AUTOPLAY_LINES = {
  roadTrip: "Road trip!",
  hi: "Hi there!",
  listening: "I am listening.",
  think: "Hmm... let me think.",
  quiet: "Sometimes I need a quiet moment.",
  wheee: "Wheee!",
  yay: "Yay!",
  burger: "A burger! Yum!",
  yum: "Yum!",
  phone: "Hello! How are you?",
  loveYou: "I love you! 🤟",
  communicate: ["Communication", " is ", "for", " ", "everyone."] as [string, string, string, string, string],
  tickle: "Hehe, that tickles!",
  tapHint1: "Psst… tap me!",
  tapHint2: "I'm ticklish. Try tapping me!",
  tapHint3: "Tap me, or drag me anywhere!",
}
export type JudyAutoPlayLines = typeof JUDY_AUTOPLAY_LINES

// Move and bubble timings from JudyCompanion.vue (idleMoment / showLine /
// roamRandomly). The rest is counted from when a move ends, not when it starts.
const MOVE_LASTS_MS = 10_000
const REST_BETWEEN_MS = 30_000
const BUBBLE_LASTS_MS = 3_400
// How long she laughs after being tapped (draggable Judy only).
const TAP_LAUGH_MS = 2_500
// Chance that a rest period includes a "tap me" hint (draggable Judy only).
const TAP_HINT_CHANCE = 0.7

const toCss = (value: number | string) => (typeof value === "number" ? `${value}px` : value)

/** One finger: a darker outline stroke under a skin stroke, so overlapping fingers stay separate. */
function Digit({ d }: { d: string }) {
  return (
    <>
      <path d={d} className="judy-sign-digit-edge" />
      <path d={d} className="judy-sign-digit" />
    </>
  )
}

// Finger bases along the top of the palm, thumb side first (index → pinky), in a local box
// whose origin is the wrist and whose fingers point up (-y).
const KNUCKLES = [-5.4, -1.8, 1.8, 5.4]

/**
 * A palm-out hand with all five fingers drawn: "index" (index up, the rest folded, thumb
 * across the palm), "a" (a fist with the thumb up along its side).
 */
function SignHand({ shape }: { shape: "index" | "a" }) {
  return (
    <>
      {shape === "a" && <Digit d="M-7.5 -9 L-8.6 -21" />}
      {shape === "index" && <Digit d="M-5.4 -14 L-6.4 -28" />}
      <rect x="-8.5" y="-17" width="17" height="16" rx="5.5" className="judy-hand" />
      {/* Folded fingers: knuckles bent over the top of the palm. */}
      {KNUCKLES.map((kx, i) =>
        shape === "index" && i === 0 ? null : (
          <rect key={kx} x={kx - 1.9} y="-18.5" width="3.8" height="8" rx="1.9" className="judy-sign-folded" />
        ),
      )}
      {/* Thumb folded across the curled fingers. */}
      {shape === "index" && <Digit d="M-7 -6 L1.5 -10" />}
    </>
  )
}

/** A loose, resting hand (like her idle hands), fingers along -y. */
function RelaxedHand() {
  return (
    <>
      <circle cx="0" cy="-5" r="9" className="judy-hand" />
      <g className="judy-fingers">
        <path d="M-8 -8 L-12 -16" />
        <path d="M-4 -13 L-7 -22" />
        <path d="M0 -14 L0 -23" />
        <path d="M4 -13 L7 -21" />
      </g>
    </>
  )
}

/** A C handshape seen from the side: four curved fingers stacked over a curved thumb, opening toward +x. */
function SignHandC() {
  return (
    <>
      <ellipse cx="-2" cy="-8" rx="5.5" ry="8.5" className="judy-hand" />
      {[3, 2, 1, 0].map((i) => {
        const y = -16.5 + i * 2.6
        return <Digit key={i} d={`M-2 ${y} Q9 ${y - 6} 11.5 ${y + 4.5}`} />
      })}
      <Digit d="M-2 -1 Q6.5 5 11 0.5" />
    </>
  )
}

export function JudyCharacter({
  pose: posePropValue = "idle",
  mood: moodProp,
  x: xProp = 16,
  y: yProp = 10,
  facing = "right",
  size,
  message: messageProp = "",
  draggable = false,
  onDragEnd,
  autoPlay = false,
  autoPlayLines = JUDY_AUTOPLAY_LINES,
  inline = false,
  announce = true,
  label = "Judy, the Deafference companion",
  className,
}: JudyCharacterProps) {
  const [autoAction, setAutoAction] = useState<AutoAction | null>(null)
  const [autoMessage, setAutoMessage] = useState("")
  const [autoPos, setAutoPos] = useState<Partial<Point> | null>(null)
  // Read through a ref so a language switch updates the lines without restarting the routine.
  const linesRef = useRef(autoPlayLines)
  useEffect(() => {
    linesRef.current = autoPlayLines
  }, [autoPlayLines])
  // Her rendered width, so auto-play moves can centre her or start her just off-screen at any size.
  const widthRef = useRef(size ?? 132)
  useEffect(() => {
    widthRef.current = size ?? 132
  }, [size])
  const [tapLaugh, setTapLaugh] = useState(false)
  const tapLaughRef = useRef(false)
  useEffect(() => {
    tapLaughRef.current = tapLaugh
  }, [tapLaugh])
  const tapTimer = useRef<number | undefined>(undefined)
  useEffect(() => () => window.clearTimeout(tapTimer.current), [])
  const drag = useRef({ pointerId: -1, startX: 0, startY: 0, left: 0, bottom: 0, moved: false })

  useEffect(() => {
    if (!autoPlay) return
    const timeouts = new Set<number>()
    const frames = new Set<number>()
    let bubble: number | undefined

    const later = (fn: () => void, ms: number) => {
      const id = window.setTimeout(() => {
        timeouts.delete(id)
        fn()
      }, ms)
      timeouts.add(id)
      return id
    }
    const nextFrame = (fn: () => void) => {
      const id = window.requestAnimationFrame(() => {
        frames.delete(id)
        fn()
      })
      frames.add(id)
    }
    const say = (line: string) => {
      setAutoMessage(line)
      if (bubble !== undefined) {
        window.clearTimeout(bubble)
        timeouts.delete(bubble)
      }
      bubble = later(() => setAutoMessage(""), BUBBLE_LASTS_MS)
    }
    const play = (action: AutoAction, line?: string) => {
      setAutoAction(action)
      if (line) say(line)
    }
    const drive = () => {
      play({ pose: "drive", mood: "happy" }, linesRef.current.roadTrip)
      setAutoPos({ x: -widthRef.current - 10, y: 10 })
      // Two frames so the off-screen start is committed before she sets off.
      nextFrame(() => nextFrame(() => setAutoPos({ x: window.innerWidth + 12, y: 10 })))
    }

    const signLove = () => {
      play({ pose: "love", mood: "happy" }, linesRef.current.loveYou)
      // Step to the middle of the screen so there is room to zoom in on the sign.
      setAutoPos({ x: Math.round(window.innerWidth / 2 - widthRef.current / 2), y: 10 })
    }

    const signCommunicate = () => {
      setAutoAction({ pose: "communicate", mood: "happy" })
      // The sentence stays up for the whole move (no 3.4s bubble timer) so each word can light up as it is signed.
      if (bubble !== undefined) window.clearTimeout(bubble)
      setAutoMessage(linesRef.current.communicate.join(""))
      setAutoPos({ x: Math.round(window.innerWidth / 2 - widthRef.current / 2), y: 10 })
    }

    const moves: Array<() => void> = [
      () => play({ pose: "wave", mood: "happy" }, linesRef.current.hi),
      () => play({ pose: "listen", mood: "listen" }, linesRef.current.listening),
      () => play({ pose: "cute-think", mood: "think" }, linesRef.current.think),
      () => play({ pose: "idle", mood: "sad" }, linesRef.current.quiet),
      () => play({ pose: "twirl", mood: "happy" }, linesRef.current.wheee),
      () => play({ pose: "dance", mood: "happy" }, linesRef.current.yay),
      drive,
      () => play({ pose: "hungry", mood: "happy" }, linesRef.current.burger),
      () => play({ pose: "eat", mood: "happy" }, linesRef.current.yum),
      () => play({ pose: "phone", mood: "happy" }, linesRef.current.phone),
      signLove,
      signCommunicate,
      () => {
        play({ pose: "sleep" })
        setAutoPos((p) => ({ ...p, y: 10 }))
      },
    ]

    const finish = (goHome: boolean) =>
      later(() => {
        setAutoAction(null)
        setAutoMessage("")
        // Driving ends off-screen and signing ends mid-screen, so she comes home.
        if (goHome) setAutoPos(null)
      }, MOVE_LASTS_MS)

    // During the rest after a move, sometimes invite the visitor to tap her. The hint is
    // placed randomly inside the rest window so it never overlaps the next move.
    const tapHint = () => {
      if (drag.current.pointerId !== -1 || tapLaughRef.current) return
      const { tapHint1, tapHint2, tapHint3 } = linesRef.current
      const hints = [tapHint1, tapHint2, tapHint3]
      play({ pose: "coy", mood: "happy" }, hints[Math.floor(Math.random() * hints.length)])
      later(() => setAutoAction(null), BUBBLE_LASTS_MS)
    }
    const scheduleTapHint = () => {
      if (!draggable || Math.random() > TAP_HINT_CHANCE) return
      const earliest = MOVE_LASTS_MS + 3_000
      const latest = MOVE_LASTS_MS + REST_BETWEEN_MS - BUBBLE_LASTS_MS - 1_000
      later(tapHint, earliest + Math.random() * (latest - earliest))
    }

    let first = true
    const idleMoment = () => {
      // Never yank her out of the visitor's hand mid-drag.
      if (drag.current.pointerId === -1) {
        // The signed sentence is never the first move after a page load; after that it is just one of the random moves.
        const pool = first ? moves.filter((m) => m !== signCommunicate) : moves
        first = false
        const move = pool[Math.floor(Math.random() * pool.length)]
        move()
        finish(move === drive || move === signLove || move === signCommunicate)
      }
      scheduleTapHint()
      later(idleMoment, MOVE_LASTS_MS + REST_BETWEEN_MS)
    }

    idleMoment()

    return () => {
      timeouts.forEach((id) => window.clearTimeout(id))
      frames.forEach((id) => window.cancelAnimationFrame(id))
    }
  }, [autoPlay, draggable])

  // While a move plays it wins over the props; stale auto state is ignored when autoPlay is off.
  // A tap-laugh wins over both the auto-play move and the props while it lasts.
  const action: AutoAction | null = tapLaugh ? { pose: "laugh", mood: "happy" } : autoPlay ? autoAction : null
  const pose = action ? action.pose : posePropValue
  const mood = action ? action.mood : moodProp
  const message = tapLaugh ? autoPlayLines.tickle : action ? autoMessage : messageProp
  const x = autoPlay && autoPos?.x !== undefined ? autoPos.x : xProp
  const y = autoPlay && autoPos?.y !== undefined ? autoPos.y : yProp

  // Keep the last text on screen while the bubble fades out.
  const [bubbleText, setBubbleText] = useState(message)
  if (message && message !== bubbleText) setBubbleText(message)

  // A dragged position wins until the parent moves her through x/y.
  const positionKey = `${x}|${y}`
  const [dragged, setDragged] = useState<(Point & { key: string }) | null>(null)
  const [dragging, setDragging] = useState(false)
  const current = dragged?.key === positionKey ? dragged : null

  const { classes, mood: poseMood } = POSES[pose]
  const visible = message.length > 0

  function onPointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (event.button !== 0 && event.pointerType === "mouse") return
    const el = event.currentTarget
    const style = window.getComputedStyle(el)
    drag.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      left: parseFloat(style.left) || 0,
      bottom: parseFloat(style.bottom) || 0,
      moved: false,
    }
    setDragging(true)
    el.setPointerCapture(event.pointerId)
  }

  function onPointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    const d = drag.current
    if (!dragging || event.pointerId !== d.pointerId) return
    const dx = event.clientX - d.startX
    const dy = event.clientY - d.startY
    if (!d.moved && Math.hypot(dx, dy) > DRAG_THRESHOLD) d.moved = true
    if (!d.moved) return
    const rect = event.currentTarget.getBoundingClientRect()
    const maxLeft = Math.max(10, window.innerWidth - rect.width - 10)
    const maxBottom = Math.max(10, window.innerHeight - rect.height - 10)
    setDragged({
      x: Math.min(maxLeft, Math.max(10, d.left + dx)),
      y: Math.min(maxBottom, Math.max(10, d.bottom - dy)),
      key: positionKey,
    })
  }

  function endDrag(event: ReactPointerEvent<HTMLDivElement>) {
    if (event.pointerId !== drag.current.pointerId) return
    try {
      event.currentTarget.releasePointerCapture(event.pointerId)
    } catch {
      // capture already released
    }
    setDragging(false)
    drag.current.pointerId = -1
    if (drag.current.moved && current) onDragEnd?.({ x: current.x, y: current.y })
    // A press that never turned into a drag is a tap: she laughs.
    if (!drag.current.moved && event.type === "pointerup") {
      setTapLaugh(true)
      window.clearTimeout(tapTimer.current)
      tapTimer.current = window.setTimeout(() => setTapLaugh(false), TAP_LAUGH_MS)
    }
  }

  const rootClass = [
    "judy-companion",
    `judy-${mood ?? poseMood}`,
    ...classes,
    visible && "judy-visible",
    dragging && "judy-dragging",
    !draggable && "judy-static",
    inline && "judy-inline",
    className,
  ]
    .filter(Boolean)
    .join(" ")

  return (
    <div
      className={rootClass}
      style={
        inline
          ? { width: size }
          : {
              left: toCss(current ? current.x : x),
              bottom: toCss(current ? current.y : y),
              width: size,
            }
      }
      aria-live={announce ? "polite" : undefined}
      {...(draggable && {
        onPointerDown,
        onPointerMove,
        onPointerUp: endDrag,
        onPointerCancel: endDrag,
      })}
    >
      <div
        className={["judy-bubble", visible && "judy-bubble-visible", pose === "cheer-loop" && "judy-subscribe-bubble"]
          .filter(Boolean)
          .join(" ")}
      >
        {pose === "communicate"
          ? // <strong>, not <span>: globals.css forces every span black with !important, which would block the highlight.
            autoPlayLines.communicate.map((part, i) =>
              i % 2 === 0 ? (
                <strong key={i} className={`judy-sign-word judy-sign-word-${i / 2}`}>
                  {part}
                </strong>
              ) : (
                part
              ),
            )
          : bubbleText}
      </div>
      <div className="judy-sleep-zzz" aria-hidden="true">
        <span>Z</span>
        <span>Z</span>
        <span>Z</span>
      </div>
      <div className={facing === "left" ? "judy-facing judy-facing-left" : "judy-facing"}>
        <svg className="judy-figure" viewBox="0 0 220 380" aria-label={label} role="img">
          <ellipse cx="110" cy="372" rx="46" ry="6" className="judy-shadow" />

          <g className="judy-hair-wrap" transform="translate(0 -8)">
            <g className="judy-hair-mass">
              <ellipse cx="110" cy="81" rx="52" ry="55" />
              <ellipse cx="70" cy="125" rx="24" ry="32" />
              <ellipse cx="150" cy="125" rx="24" ry="32" />
              <ellipse cx="78" cy="151" rx="18" ry="22" className="judy-hair-mid" />
              <ellipse cx="142" cy="151" rx="18" ry="22" className="judy-hair-mid" />
              <circle cx="66" cy="67" r="14" className="judy-hair-hi" />
              <circle cx="83" cy="49" r="11" className="judy-hair-hi" />
              <circle cx="155" cy="73" r="13" className="judy-hair-sh" />
              <circle cx="142" cy="50" r="10" className="judy-hair-hi" />
              <circle cx="62" cy="105" r="11" className="judy-hair-hi" />
              <circle cx="159" cy="109" r="10" className="judy-hair-sh" />
            </g>
            <g className="judy-lock-left">
              <ellipse cx="69" cy="155" rx="14" ry="23" />
              <circle cx="66" cy="171" r="10" className="judy-hair-mid" />
              <circle cx="72" cy="183" r="8" />
              <circle cx="62" cy="148" r="7" className="judy-hair-hi" />
            </g>
            <g className="judy-lock-right">
              <ellipse cx="151" cy="155" rx="14" ry="23" />
              <circle cx="154" cy="171" r="10" className="judy-hair-mid" />
              <circle cx="148" cy="183" r="8" />
              <circle cx="158" cy="147" r="7" className="judy-hair-sh" />
            </g>
          </g>

          <g className="judy-leg-left">
            <path d="M98 212 L94 270" className="judy-thigh" />
            <g className="judy-shin-left">
              <path d="M94 270 L92 320" className="judy-shin" />
              <ellipse cx="90" cy="323" rx="17" ry="8" className="judy-shoe-body" />
              <path d="M74 326q16 6 32 0" className="judy-shoe-sole" />
              <circle cx="87" cy="320" r="1.8" className="judy-shoe-eyelet" />
            </g>
          </g>
          <g className="judy-leg-right">
            <path d="M122 212 L126 270" className="judy-thigh" />
            <g className="judy-shin-right">
              <path d="M126 270 L128 320" className="judy-shin" />
              <ellipse cx="128" cy="323" rx="17" ry="8" className="judy-shoe-body" />
              <path d="M112 326q16 6 32 0" className="judy-shoe-sole" />
              <circle cx="131" cy="320" r="1.8" className="judy-shoe-eyelet" />
            </g>
          </g>

          <g className="judy-arm-left judy-arm-left-back">
            <path d="M82 108 L74 150" className="judy-upperarm" />
            <g className="judy-fore-left">
              <path d="M74 150 L70 212" className="judy-forearm" />
              <path d="M79 152 L70 157" className="judy-cuff" />
              <circle cx="70" cy="217" r="9" className="judy-hand" />
              <g className="judy-fingers">
                <path d="M62 220 L58 228" />
                <path d="M66 225 L63 234" />
                <path d="M70 227 L70 236" />
                <path d="M74 225 L77 233" />
              </g>
            </g>
          </g>

          <g className="judy-torso">
            <path
              d="M110 104q-20 0-27 15-8 16-9 42l-3 40q0 7 7 7h64q7 0 7-7l-3-40q-1-26-9-42-8-15-27-15z"
              className="judy-robe"
            />
            <path d="M101 84 L101 118 Q110 124 119 118 L119 84 Z" className="judy-neck" />
            <path d="M99 108 L110 121 L121 108" className="judy-collar" />
            <path d="M78 124q-10 18-13 46l-2 32" className="judy-seam" />
            <rect x="131" y="140" width="8" height="24" rx="4" className="judy-ember" />
          </g>

          {/* Same left arm drawn in front of the torso; shown instead of the back one only
              when a pose brings that hand across her body (see .judy-signing-welcome). */}
          <g className="judy-arm-left judy-arm-left-front" aria-hidden="true">
            <path d="M82 108 L74 150" className="judy-upperarm" />
            <g className="judy-fore-left">
              <path d="M74 150 L70 212" className="judy-forearm" />
              <path d="M79 152 L70 157" className="judy-cuff" />
              <circle cx="70" cy="217" r="9" className="judy-hand" />
              <g className="judy-fingers">
                <path d="M62 220 L58 228" />
                <path d="M66 225 L63 234" />
                <path d="M70 227 L70 236" />
                <path d="M74 225 L77 233" />
              </g>
            </g>
          </g>

          <g className="judy-sleep-arm" aria-hidden="true">
            <path d="M82 112 C79 118 77 123 78 130" className="judy-sleep-sleeve" />
            <path d="M78 130 C75 124 76 116 79 109" className="judy-sleep-forearm" />
            <path d="M76 117 L81 119" className="judy-sleep-cuff" />
            <circle cx="80" cy="105" r="9" className="judy-sleep-hand" />
            <path d="M74 106l-6 2M75 110l-6 4M79 112l-3 5" className="judy-sleep-fingers" />
          </g>

          <g className="judy-laugh-arms" aria-hidden="true">
            <path d="M82 112 C80 136 86 155 95 169" className="judy-laugh-sleeve" />
            <path d="M95 169 C98 176 102 181 106 186" className="judy-laugh-forearm" />
            <path d="M138 112 C140 136 134 155 125 169" className="judy-laugh-sleeve" />
            <path d="M125 169 C122 176 118 181 114 186" className="judy-laugh-forearm" />
            <path d="M99 178 L104 181M121 178 L116 181" className="judy-laugh-cuff" />
            <circle cx="106" cy="187" r="9" className="judy-laugh-hand" />
            <circle cx="114" cy="187" r="9" className="judy-laugh-hand" />
            <path d="M101 191l-3 6M105 195l-1 6M111 195l1 6M119 191l3 6" className="judy-laugh-fingers" />
          </g>

          <g className="judy-arm-right">
            <path d="M138 108 L146 150" className="judy-upperarm" />
            <g className="judy-fore-right">
              <path d="M141 152 L150 157" className="judy-cuff" />
              <path d="M146 150 L150 212" className="judy-forearm" />
              <g className="judy-hand-open-right">
                <circle cx="150" cy="217" r="9" className="judy-hand" />
                <g className="judy-fingers">
                  <path d="M158 220 L162 228" />
                  <path d="M154 225 L157 234" />
                  <path d="M150 227 L150 236" />
                  <path d="M146 225 L143 233" />
                </g>
              </g>
              <g className="judy-hand-point-right">
                <circle cx="150" cy="193" r="7" className="judy-hand" />
                <path d="M150 187 L152 168" className="judy-point-finger" />
              </g>
            </g>
          </g>

          <g className="judy-catching-hand" aria-hidden="true">
            <circle cx="152" cy="170" r="9" className="judy-hand" />
            <path d="M145 173l-4 7M149 177l-2 8M153 178v8M157 176l3 7" className="judy-fingers" />
          </g>
          <g className="judy-eating-arm" aria-hidden="true">
            <path d="M138 108 C154 126 158 150 150 169" className="judy-eating-sleeve" />
            <path d="M150 169 C140 146 129 124 120 112" className="judy-eating-forearm" />
            <circle cx="119" cy="110" r="9" className="judy-hand" />
            <path d="M113 112l-5 5M116 116l-3 7M120 118v7M124 116l3 5" className="judy-fingers" />
          </g>
          <g className="judy-phone-arm" aria-hidden="true">
            <path d="M138 108 C151 117 159 107 154 96" className="judy-phone-sleeve" />
            <path d="M154 96 C151 90 147 85 144 80" className="judy-phone-forearm" />
            <circle cx="144" cy="79" r="8" className="judy-hand" />
            <path d="M140 83l-4 4M143 86l-2 5M147 85l2 4" className="judy-fingers" />
          </g>

          <g className="judy-head" transform="translate(0 -8)">
            <path
              d="M110 34 C92.3 34 78.8 47.6 78.3 68.4 C77.8 77.7 79.8 87.1 84.5 95.9 C90.2 105.3 99.6 110 110 110 C120.4 110 129.8 105.3 135.5 95.9 C140.2 87.1 142.2 77.7 141.7 68.4 C141.2 47.6 127.7 34 110 34 Z"
              className="judy-face"
            />

            <path
              d="M78.8 66.3 q5.2 -32.24 31.2 -32.24 q26 0 31.2 32.24 q-7.28 -12.48 -15.08 -8.32 q-6.24 -10.4 -16.12 -7.28 q-9.88 3.12 -15.08 9.36 q-7.28 -3.12 -10.92 6.24 z"
              className="judy-hairline"
            />
            <circle cx="87.1" cy="47.6" r="9.9" className="judy-hairline-fill" />
            <circle cx="104.8" cy="39.2" r="10.9" className="judy-hairline-fill" />
            <circle cx="122.5" cy="41.3" r="9.9" className="judy-hairline-fill" />
            <circle cx="136" cy="52.8" r="8.8" className="judy-hairline-fill" />
            <circle cx="95.4" cy="43.4" r="5.7" className="judy-hair-hi" />
            <circle cx="116.2" cy="38.2" r="5.2" className="judy-hair-hi" />
            <path d="M77.8 71.5 q-4.16 15.6 1.56 28.08 q-7.28 -11.96 -5.2 -28.08 z" className="judy-hairline-fill" />
            <path d="M142.2 71.5 q4.16 15.6 -1.56 28.08 q7.28 -11.96 5.2 -28.08 z" className="judy-hairline-fill" />

            <ellipse cx="140.7" cy="78.8" rx="4.2" ry="6.8" className="judy-ear" />
            <rect x="137.6" y="72.5" width="6.2" height="13" rx="3.1" className="judy-aid" />
            <circle className="judy-aid-light" cx="140.7" cy="75.6" r="1.8" />

            <g className="judy-brow-neutral">
              <path d="M91.3 65.2 C95.4 60.6 103.2 59.0 108.4 62.1 C109.0 63.2 108.4 64.7 107.4 64.2 C102.7 62.1 97.0 63.2 92.8 67.3 C91.8 67.8 90.8 66.3 91.3 65.2 Z" />
              <path d="M128.7 65.2 C124.6 60.6 116.8 59.0 111.6 62.1 C111.0 63.2 111.6 64.7 112.6 64.2 C117.3 62.1 123.0 63.2 127.2 67.3 C128.2 67.8 129.2 66.3 128.7 65.2 Z" />
            </g>
            <g className="judy-brow-think">
              <path d="M91.8 67.3 C96.0 63.7 102.7 62.6 107.4 64.7 C107.9 65.8 107.4 66.8 106.4 66.3 C102.2 64.7 96.5 65.8 92.8 69.4 C91.8 69.9 90.8 68.4 91.8 67.3 Z" />
              <path d="M129.2 63.2 C124.6 58.0 116.8 56.9 111.6 60.6 C111.0 61.7 111.6 63.2 112.6 62.7 C117.3 60.6 123.5 61.7 127.7 65.2 C128.7 65.8 129.8 64.2 129.2 63.2 Z" />
            </g>
            <g className="judy-brow-high" />

            <g className="judy-eye-open">
              <path
                d="M89.7 75.1 C91.3 69.4 94.4 66.8 98.0 66.8 C102.2 66.8 105.8 69.9 106.9 75.1 C105.3 80.8 102.2 83.4 98.0 83.4 C93.9 83.4 91.3 80.3 89.7 75.1 Z"
                className="judy-eye-white"
              />
              <path
                d="M113.1 75.1 C114.2 69.9 117.8 66.8 122.0 66.8 C125.6 66.8 128.7 69.4 130.3 75.1 C128.7 80.3 126.1 83.4 122.0 83.4 C117.8 83.4 114.7 80.8 113.1 75.1 Z"
                className="judy-eye-white"
              />
              <circle cx="98.6" cy="75.6" r="5.7" className="judy-iris" />
              <circle cx="121.4" cy="75.6" r="5.7" className="judy-iris" />
              <circle cx="98.6" cy="76.7" r="4.2" className="judy-iris-mid" />
              <circle cx="121.4" cy="76.7" r="4.2" className="judy-iris-mid" />
              <circle cx="98.6" cy="75.6" r="2.6" className="judy-pupil" />
              <circle cx="121.4" cy="75.6" r="2.6" className="judy-pupil" />
              <circle cx="96.5" cy="72.5" r="1.9" className="judy-catchlight" />
              <circle cx="119.4" cy="72.5" r="1.9" className="judy-catchlight" />
              <path d="M89.7 74.1 C91.3 68.4 94.4 65.8 98.0 65.8 C102.7 65.8 106.4 69.4 107.4 74.6" className="judy-lash" />
              <path d="M130.3 74.6 C129.2 69.4 125.6 65.8 122.0 65.8 C118.3 65.8 114.7 68.4 113.1 74.1" className="judy-lash" />
            </g>
            <g className="judy-eye-arc">
              <path d="M90.2 77.7 C92.3 71.0 95.4 68.9 98.6 68.9 C102.2 68.9 105.3 72.0 106.9 77.7" />
              <path d="M129.8 77.7 C128.2 72.0 125.1 68.9 121.4 68.9 C118.3 68.9 115.2 71.0 113.1 77.7" />
              <path d="M90.8 75.1 L86.6 72.5" className="judy-eye-tick" />
              <path d="M129.2 75.1 L133.4 72.5" className="judy-eye-tick" />
            </g>
            <g className="judy-eye-wide">
              <path
                d="M88.7 75.1 C90.8 68.4 93.9 65.2 98.0 65.2 C102.7 65.2 106.4 68.9 107.9 75.1 C106.4 81.9 102.7 85.0 98.0 85.0 C93.4 85.0 90.8 81.4 88.7 75.1 Z"
                className="judy-eye-white"
              />
              <path
                d="M112.1 75.1 C113.6 68.9 117.3 65.2 122.0 65.2 C126.1 65.2 129.8 68.4 131.3 75.1 C129.8 81.4 126.6 85.0 122.0 85.0 C117.3 85.0 113.6 81.9 112.1 75.1 Z"
                className="judy-eye-white"
              />
              <circle cx="98.6" cy="75.6" r="6.2" className="judy-iris" />
              <circle cx="121.4" cy="75.6" r="6.2" className="judy-iris" />
              <circle cx="98.6" cy="75.6" r="3" className="judy-pupil" />
              <circle cx="121.4" cy="75.6" r="3" className="judy-pupil" />
              <circle cx="96.0" cy="72.0" r="2.1" className="judy-catchlight" />
              <circle cx="118.8" cy="72.0" r="2.1" className="judy-catchlight" />
            </g>

            <g className="judy-cheek">
              <ellipse cx="90.2" cy="86.0" rx="6.8" ry="3.9" />
              <ellipse cx="129.8" cy="86.0" rx="6.8" ry="3.9" />
            </g>
            <g className="judy-laugh-tears" aria-hidden="true">
              <path d="M89 82c-3 5-3 8 0 10 3-2 3-5 0-10Z" />
              <path d="M131 82c-3 5-3 8 0 10 3-2 3-5 0-10Z" />
            </g>

            <path d="M110 77.7 q2.08 6.24 0.52 9.36" className="judy-nose" />
            <ellipse cx="110" cy="88.1" rx="3.1" ry="2.1" className="judy-nose-tip" />
            <path d="M106.9 89.2 q1.56 1.56 2.6 0.52" className="judy-nostril" />
            <path d="M113.1 89.2 q-1.56 1.56 -2.6 0.52" className="judy-nostril" />

            <g className="judy-mouth-neutral">
              <path d="M102.2 98 q7.8 5 15.6 0" />
            </g>
            <g className="judy-mouth-smile">
              <path d="M102.2 97.5 q7.8 7.28 15.6 0" />
              <path d="M105.3 102.7 q4.68 2.08 9.36 0" className="judy-lip-hi" />
            </g>
            <g className="judy-mouth-flat">
              <path d="M102.2 100 h15.6" />
            </g>
            <g className="judy-mouth-o">
              <ellipse cx="110" cy="99.6" rx="4.68" ry="6.24" />
              <ellipse cx="110" cy="95.9" rx="3.38" ry="1.56" className="judy-mouth-hi" />
            </g>
            <g className="judy-mouth-laugh">
              <path d="M98.6 96.4q11.4 17.2 22.8 0q-11.4 5.7-22.8 0Z" />
              <path d="M101.2 97.1q8.8 4.4 17.6 0" />
            </g>
          </g>

          <g className="judy-phone" aria-hidden="true">
            <rect x="145" y="61" width="13" height="29" rx="3.3" className="judy-phone-body" />
            <rect x="147" y="66" width="9" height="16" rx="1.5" className="judy-phone-screen" />
            <circle cx="151.5" cy="64" r=".9" className="judy-phone-camera" />
            <path d="M149.2 86h4.6" className="judy-phone-speaker" />
          </g>

          <g className="judy-sparkles" aria-hidden="true">
            <path d="M40 108l3 8 8 3-8 3-3 8-3-8-8-3 8-3z" />
            <path d="M182 122l2.5 6 6 2.5-6 2.5-2.5 6-2.5-6-6-2.5 6-2.5z" />
            <circle cx="28" cy="88" r="3" />
            <circle cx="196" cy="100" r="4" />
          </g>

          <g className="judy-snack" aria-hidden="true">
            <path d="M126 109q10-11 20 0z" className="judy-burger-bun" />
            <path d="M125 110h22l-3 4h-16z" className="judy-burger-lettuce" />
            <path d="M126 114h20v5h-20z" className="judy-burger-patty" />
            <path d="M126 119h20q-10 7-20 0z" className="judy-burger-bun" />
          </g>

          <g className="judy-hunger-rumble" aria-hidden="true">
            <path d="M96 174q7-5 14 0t14 0" />
            <path d="M99 181q5-4 11 0t11 0" />
          </g>

          <g className="judy-catch-burger" aria-hidden="true">
            <path d="M126 109q10-11 20 0z" className="judy-burger-bun" />
            <path d="M125 110h22l-3 4h-16z" className="judy-burger-lettuce" />
            <path d="M126 114h20v5h-20z" className="judy-burger-patty" />
            <path d="M126 119h20q-10 7-20 0z" className="judy-burger-bun" />
          </g>

          <g className="judy-car" aria-hidden="true">
            <path d="M48 263q3-15 16-20l21-7h50l21 7q13 5 16 20v19q0 7-7 7H55q-7 0-7-7z" className="judy-car-body" />
            <path d="M79 242l11-17h40l11 17z" className="judy-car-windshield" />
            <path d="M110 227v15" className="judy-car-divider" />
            <circle cx="74" cy="289" r="13" className="judy-car-wheel" />
            <circle cx="146" cy="289" r="13" className="judy-car-wheel" />
            <circle cx="74" cy="289" r="5" className="judy-car-hub" />
            <circle cx="146" cy="289" r="5" className="judy-car-hub" />
            <circle cx="58" cy="263" r="4" className="judy-car-light" />
            <circle cx="162" cy="263" r="4" className="judy-car-light" />
            <circle cx="110" cy="218" r="15" className="judy-steering-wheel" />
            <path d="M110 203v30M96 218h28" className="judy-steering-spokes" />
          </g>
          <g className="judy-coy-arm" aria-hidden="true">
            <path d="M138 108 C154 124 157 146 149 162" className="judy-eating-sleeve" />
            <path d="M149 162 C140 144 130 127 124 114" className="judy-eating-forearm" />
            <circle cx="123" cy="111" r="8" className="judy-hand" />
            <path d="M119.6 105.5 L116.6 95.5" className="judy-coy-finger" />
            <path d="M126 113l3 3M124 116l2 4" className="judy-fingers" />
          </g>
          {/* I LOVE YOU handshape: palm facing out, thumb, index and pinky extended,
              middle and ring fingers folded down. */}
          <g className="judy-love-arm" aria-hidden="true">
            <path d="M138 108 C152 120 160 136 158 150" className="judy-eating-sleeve" />
            <path d="M158 150 L160 106" className="judy-eating-forearm" />
            <path d="M154 154 L161 147" className="judy-cuff" />
            <g className="judy-love-hand">
              {/* Extended: index (up), pinky (up and out), thumb (out to the side). */}
              <path d="M152 86 L150 58M169 88 L177 66M149 99 L133 88" className="judy-love-finger-edge" />
              <path d="M152 86 L150 58M169 88 L177 66M149 99 L133 88" className="judy-love-finger" />
              <rect x="147" y="82" width="26" height="25" rx="9" className="judy-hand" />
              {/* Folded: middle and ring fingers bent down over the palm, knuckles showing. */}
              <rect x="153.5" y="79" width="7" height="13" rx="3.5" className="judy-love-folded" />
              <rect x="161" y="80" width="7" height="12" rx="3.5" className="judy-love-folded" />
            </g>
            <path d="M193 52c-4-5-12-1-9 5l9 9 9-9c3-6-5-10-9-5z" className="judy-love-heart" />
          </g>

          {/* "Communication is for everyone." in ASL: a jointed two-arm rig (shoulder → elbow →
              wrist) driven by CSS keyframes (.judy-signing-communicate), so the arms travel
              smoothly between signs; the handshape at each wrist changes as she moves. */}
          <g className="judy-rig" aria-hidden="true">
            <g className="judy-rig-l-upper">
              <path d="M82 108 L82 150" className="judy-upperarm" />
              <g className="judy-rig-l-fore">
                <path d="M82 150 L82 192" className="judy-forearm judy-rig-l-forearm" />
                <path d="M76 152 L88 152" className="judy-cuff" />
                {/* Wrist slides along the forearm as it foreshortens. */}
                <g className="judy-rig-l-wrist">
                  <g transform="translate(82 192)">
                    <g className="judy-rig-l-hand">
                      <g className="judy-rig-shape judy-rig-l-relaxed"><RelaxedHand /></g>
                      <g className="judy-rig-shape judy-rig-l-c" transform="scale(1.2)"><SignHandC /></g>
                      <g className="judy-rig-shape judy-rig-l-a" transform="scale(1.2)"><SignHand shape="a" /></g>
                    </g>
                  </g>
                </g>
              </g>
            </g>
            <g className="judy-rig-r-upper">
              <path d="M138 108 L138 150" className="judy-upperarm" />
              <g className="judy-rig-r-fore">
                <path d="M138 150 L138 192" className="judy-forearm judy-rig-r-forearm" />
                <path d="M132 152 L144 152" className="judy-cuff" />
                <g className="judy-rig-r-wrist">
                  <g transform="translate(138 192)">
                    <g className="judy-rig-r-hand">
                      <g className="judy-rig-shape judy-rig-r-relaxed" transform="scale(-1 1)"><RelaxedHand /></g>
                      <g className="judy-rig-shape judy-rig-r-c" transform="scale(-1.2 1.2)"><SignHandC /></g>
                      <g className="judy-rig-shape judy-rig-r-index" transform="scale(1.2)"><SignHand shape="index" /></g>
                      <g className="judy-rig-shape judy-rig-r-a" transform="scale(-1.2 1.2)"><SignHand shape="a" /></g>
                    </g>
                  </g>
                </g>
              </g>
            </g>
          </g>
        </svg>
      </div>
    </div>
  )
}
