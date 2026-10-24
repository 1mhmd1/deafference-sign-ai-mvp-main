"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import { easeIn, easeInOut, motion, useScroll, useSpring, useTransform } from "framer-motion"
import { cn } from "@/lib/utils"
import { useLandingReducedMotion } from "../calm-mode"

/**
 * "Stacking sheets" between landing sections: every section is an opaque sheet, and the
 * next sheet slides up over it while the old one stays pinned behind, easing back (scales
 * down a touch) and dimming, like a card being pushed under a deck.
 *
 * - A section taller than the viewport scrolls normally until its bottom reaches the
 *   viewport bottom, then pins there (sticky with a negative top), so none of it is skipped.
 * - A short section (under ~75% of the viewport) never pins, otherwise the dimmed stack
 *   would show below it.
 * - Every wrapper is a direct child of <main>, so sticky stops at the end of main and the
 *   footer scrolls in normally.
 * - Only transform/opacity are animated, tied to scroll. Calm mode or OS reduced motion turns
 *   it all off (plain stacked sections). `first` (the hero) keeps square corners and no
 *   clipping, so its photo can still run up behind the navbar.
 */
export function SectionTransition({ children, first = false }: { children: ReactNode; first?: boolean }) {
  const reduced = useLandingReducedMotion()
  const wrapRef = useRef<HTMLDivElement>(null)
  // Sits right after this sheet, i.e. at the top edge of the next one.
  const nextRef = useRef<HTMLDivElement>(null)
  // `top` for sticky, in px; null = this sheet doesn't pin.
  const [stickTop, setStickTop] = useState<number | null>(null)

  useEffect(() => {
    const el = wrapRef.current
    if (!el || reduced) {
      setStickTop(null)
      return
    }
    const update = () => {
      const h = el.offsetHeight
      const vh = window.innerHeight
      setStickTop(h < vh * 0.75 ? null : Math.min(0, vh - h))
    }
    update()
    const observer = new ResizeObserver(update)
    observer.observe(el)
    window.addEventListener("resize", update)
    return () => {
      observer.disconnect()
      window.removeEventListener("resize", update)
    }
  }, [reduced])

  // 0 while the next sheet's top is at the viewport bottom, 1 once it reaches the top (fully covered).
  const { scrollYProgress: cover } = useScroll({ target: nextRef, offset: ["start end", "start start"] })
  // A soft spring between scroll and motion: mouse-wheel steps glide instead of jumping, and the
  // old sheet settles back a beat behind the scroll.
  const smooth = useSpring(cover, { stiffness: 90, damping: 26, mass: 0.8, restDelta: 0.0005 })
  // The old sheet sinks well back (to 84%) so the new one clearly passes in front of it.
  const scale = useTransform(smooth, [0, 1], [1, 0.84], { ease: easeInOut })
  // Darkening starts gently and deepens as the sheet is nearly covered.
  const dim = useTransform(smooth, [0, 1], [0, 0.4], { ease: easeIn })
  const pinned = stickTop !== null && !reduced

  return (
    <>
      <div
        ref={wrapRef}
        className={cn(pinned ? "sticky" : "relative")}
        style={pinned ? { top: stickTop } : undefined}
      >
        <motion.div
          className={cn("relative", !first && "landing-sheet overflow-hidden rounded-t-[28px] sm:rounded-t-[36px]")}
          // Shrink around the part of the sheet that is on screen while pinned (its last viewport-height).
          style={pinned ? { scale, transformOrigin: "50% calc(100% - 50vh)", willChange: "transform" } : undefined}
        >
          {children}
          {pinned ? (
            <motion.div aria-hidden="true" className="pointer-events-none absolute inset-0 z-50 bg-[#0b1220]" style={{ opacity: dim, willChange: "opacity" }} />
          ) : null}
        </motion.div>
      </div>
      <div ref={nextRef} aria-hidden="true" className="h-0" />
    </>
  )
}
