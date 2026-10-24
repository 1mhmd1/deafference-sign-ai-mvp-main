'use client'

import type { JudyChatState } from '@/hooks/useJudyChat'
import judyImage from './assets/judyy.jpeg'
import './JudyPortrait.css'

interface JudyPortraitProps {
  state: JudyChatState
  size?: 'sm' | 'md' | 'lg'
  reducedMotion?: boolean
}

export function JudyPortrait({ state, size = 'md', reducedMotion = false }: JudyPortraitProps) {
  const shellClass = [
    'judy-portrait',
    size === 'sm' && 'judy-portrait-sm',
    size === 'md' && 'judy-portrait-md',
    size === 'lg' && 'judy-portrait-lg',
    state === 'listening' && 'is-listening',
    state === 'thinking' && 'is-thinking',
    state === 'responding' && 'is-responding',
    reducedMotion && 'reduce-motion'
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={shellClass} aria-hidden="true">
      <span className="judy-aura" />
      <span className="judy-ring judy-ring-orange" />
      <span className="judy-ring judy-ring-blue" />

      <div className="judy-face-shell">
        {/* eslint-disable-next-line @next/next/no-img-element -- plain <img> keeps the original markup and sizing */}
        <img className="judy-face" src={judyImage.src} alt="" />
      </div>

      <div className="judy-thinking-dots" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>

      <div className="judy-wave" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>

      <div className="judy-sparkles" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
    </div>
  )
}

export default JudyPortrait
