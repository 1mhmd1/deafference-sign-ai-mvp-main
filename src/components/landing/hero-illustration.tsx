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

const CARD_DATA = [
  { id: "sign", className: "left-1 top-1 sm:-left-3 sm:top-2", delay: 0 },
  { id: "understands", className: "right-1 top-10 sm:-right-3 sm:top-12", delay: 0.75 },
  { id: "hear", className: "bottom-16 left-0 sm:-bottom-1 sm:-left-3", delay: 1.5 },
  { id: "connect", className: "right-0 bottom-0 sm:-right-3 sm:bottom-1", delay: 2.25 },
] as const

function SigningHands() {
  return <svg viewBox="0 0 58 45" className="h-12 w-14" fill="none" aria-hidden="true">
    <g stroke="#6d77c7" strokeWidth="1.45" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 39c-5-4-7-10-5-15l4-10c1-2 4-1 4 1l-2 9 4-12c1-2 4-1 4 1l-3 12 5-14c1-2 4-1 4 1l-4 14 5-11c1-2 4-1 4 1l-5 16c-2 7-8 10-16 8Z" />
      <path d="M42 38c-4-3-5-8-3-12l4-9c1-2 3-1 3 1l-1 7 4-9c1-2 3-1 3 1l-4 11" />
    </g>
    <g fill="#f3a639"><circle cx="15" cy="39" r="2.1" /><circle cx="16" cy="24" r="1.9" /><circle cx="21" cy="25" r="1.9" /><circle cx="23" cy="22" r="1.9" /><circle cx="27" cy="21" r="1.9" /><circle cx="32" cy="26" r="1.9" /><circle cx="42" cy="38" r="2.1" /></g>
  </svg>
}

function Brain() {
  return <svg viewBox="0 0 58 45" className="h-12 w-14" fill="none" aria-hidden="true">
    <path d="M29 37c-3 3-9 2-11-2-5 0-8-4-7-8-4-3-4-9 1-12-1-5 3-9 8-8 3-4 8-3 10 0 3-3 8-4 11 0 5-1 9 3 8 8 5 3 5 9 1 12 1 5-3 8-7 8-3 4-9 5-12 2Z" fill="#edeafc" stroke="#7775bb" strokeWidth="1.4" />
    <path d="M29 11v25M20 15c4 1 5 5 3 8m-2 6c4-1 5-5 3-8m13-6c-4 1-5 5-3 8m2 6c-4-1-5-5-3-8" stroke="#7775bb" strokeWidth="1.25" strokeLinecap="round" />
  </svg>
}

function Soundwave() {
  const heights = [8, 15, 23, 31, 16, 38, 25, 12, 21, 34, 14, 8]
  return <div className="flex h-12 items-center gap-[3px] px-1" aria-hidden="true">{heights.map((height, i) => <motion.span key={i} className="w-[3px] rounded-full bg-[#e9a037]" style={{ height }} animate={{ scaleY: [0.68, 1.18, 0.76] }} transition={{ duration: 1.35, delay: i * 0.075, repeat: Infinity, ease: "easeInOut" }} />)}</div>
}

function Conversation() {
  return <div className="relative h-12 w-[73px] overflow-hidden rounded-xl bg-[linear-gradient(135deg,#f5d9c6,#f8f4ef_44%,#c9e0e8)]" aria-hidden="true">
    <span className="absolute -bottom-3 left-2 h-10 w-7 rounded-t-full bg-[#273d57]" /><span className="absolute bottom-5 left-4 size-5 rounded-full bg-[#b8785f]" />
    <span className="absolute -bottom-3 right-2 h-10 w-7 rounded-t-full bg-[#8c98b1]" /><span className="absolute bottom-5 right-4 size-5 rounded-full bg-[#9b6951]" />
    <span className="absolute top-[23px] left-[28px] h-2 w-4 rounded-full border border-white/80" />
  </div>
}

function StoryCard({ card, label }: { card: (typeof CARD_DATA)[number]; label: string }) {
  return <motion.div className={`absolute z-30 w-[46%] max-w-[150px] rounded-[18px] border border-white/80 bg-white/82 px-3 py-2.5 shadow-[0_16px_30px_-18px_rgba(72,72,140,0.42)] backdrop-blur-md ${card.className}`} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1, y: [0, -5, 0] }} transition={{ opacity: { duration: 0.55, delay: card.delay * 0.12 }, scale: { duration: 0.55, delay: card.delay * 0.12 }, y: { duration: 4.6, delay: card.delay, repeat: Infinity, ease: "easeInOut" } }}>
    <p className="mb-1 text-xs leading-tight font-bold text-[#3f4263]">{label}</p>
    <div className="flex h-12 items-center justify-center rounded-xl bg-[#f9f9fe]">
      {card.id === "sign" && <SigningHands />}{card.id === "understands" && <Brain />}{card.id === "hear" && <Soundwave />}{card.id === "connect" && <Conversation />}
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
        </motion.svg>
        <svg viewBox="0 0 240 240" className="absolute inset-0 size-full" fill="none" aria-hidden="true">{CONNECTIONS.map((path, i) => <g key={path}><path d={path} stroke="#f1aa45" strokeOpacity=".38" strokeWidth="1.2" /><motion.circle r="2.8" fill="#f0a53a" filter="url(#glow)" animate={{ offsetDistance: ["0%", "100%"], opacity: [0, 1, 0] }} transition={{ duration: 2.7, delay: i * .55, repeat: Infinity, ease: "easeOut" }} style={{ offsetPath: `path('${path}')` }} /></g>)}<defs><filter id="glow"><feGaussianBlur stdDeviation="1.2" /></filter></defs></svg>
        <div className="absolute inset-0 flex items-center justify-center"><motion.div className="relative flex size-[84px] items-center justify-center rounded-full border border-[rgba(255,255,255,0.8)] bg-[rgba(255,255,255,0.94)] shadow-[0_0_0_7px_rgba(255,255,255,.3),0_14px_32px_rgba(99,94,190,.24)] sm:size-[100px]" animate={{ boxShadow: ["0 0 0 7px rgba(255,255,255,.3),0 14px 32px rgba(99,94,190,.24)", "0 0 0 12px rgba(244,179,73,.16),0 14px 38px rgba(99,94,190,.34)", "0 0 0 7px rgba(255,255,255,.3),0 14px 32px rgba(99,94,190,.24)"] }} transition={{ duration: 2.5, repeat: Infinity }}><img src="/deafference-mark.png" alt="" aria-hidden="true" className="size-[64%] object-contain drop-shadow-[0_4px_10px_rgba(232,89,12,0.35)]" /></motion.div></div>
      </motion.div>
    </motion.div>
    {CARD_DATA.map(card => <StoryCard key={card.id} card={card} label={cards[card.id]} />)}
  </div>
}

