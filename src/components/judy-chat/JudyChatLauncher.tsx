'use client'

import { JudyPortrait } from './JudyPortrait'
import './JudyChatLauncher.css'

interface JudyChatLauncherProps {
  open: boolean
  reducedMotion: boolean
  onToggle: () => void
}

export function JudyChatLauncher({ open, reducedMotion, onToggle }: JudyChatLauncherProps) {
  return (
    <div className={`judy-launcher-wrap${open ? ' is-open' : ''}`}>
      <button
        type="button"
        className="judy-launcher"
        aria-label="Talk to Judy"
        aria-controls="judy-chat-panel"
        aria-expanded={open}
        onClick={onToggle}
      >
        <span className="judy-launcher-particles" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <JudyPortrait state={open ? 'responding' : 'idle'} size="sm" reducedMotion={reducedMotion} />
      </button>
    </div>
  )
}

export default JudyChatLauncher
