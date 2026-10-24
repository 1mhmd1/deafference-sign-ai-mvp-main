'use client'

import { useRef } from 'react'
import { CSSTransition } from 'react-transition-group'
import { useJudyChat } from '@/hooks/useJudyChat'
import { JudyChatLauncher } from './JudyChatLauncher'
import { JudyChatPanel } from './JudyChatPanel'
import './JudyChatExperience.css'

export function JudyChatExperience() {
  const launcherHostRef = useRef<HTMLDivElement>(null)
  const backdropRef = useRef<HTMLButtonElement>(null)

  const {
    isOpen,
    state,
    draft,
    setDraft,
    voiceLevel,
    messages,
    quickPrompts,
    statusText,
    srAnnouncement,
    openChat,
    closeChat,
    minimizeChat,
    toggleListening,
    sendMessage,
    applyPrompt,
    explainMore,
    prefersReducedMotion
  } = useJudyChat()

  // The original swapped in page-specific greetings for its news/subscribe routes; this app
  // has no such pages, so the default status text is always used.
  const contextualStatus = statusText

  function focusLauncher() {
    const button = launcherHostRef.current?.querySelector('button') as HTMLButtonElement | null
    button?.focus()
  }

  function togglePanel() {
    if (isOpen) {
      minimizePanel()
      return
    }

    openChat()
  }

  function closePanel() {
    closeChat()
    focusLauncher()
  }

  function minimizePanel() {
    minimizeChat()
    focusLauncher()
  }

  return (
    <div className="judy-chat-root" aria-label="Judy chat experience">
      <CSSTransition
        in={isOpen}
        nodeRef={backdropRef}
        timeout={prefersReducedMotion ? 0 : 240}
        classNames="judy-backdrop"
        unmountOnExit
      >
        <button
          ref={backdropRef}
          type="button"
          className="judy-backdrop"
          aria-label="Close Judy chat overlay"
          onClick={minimizePanel}
        />
      </CSSTransition>

      <JudyChatPanel
        open={isOpen}
        state={state}
        messages={messages}
        draft={draft}
        quickPrompts={quickPrompts}
        statusText={contextualStatus}
        voiceLevel={voiceLevel}
        reducedMotion={prefersReducedMotion}
        srAnnouncement={srAnnouncement}
        onDraftChange={setDraft}
        onSend={() => void sendMessage()}
        onPrompt={applyPrompt}
        onExplain={explainMore}
        onToggleMic={toggleListening}
        onClose={closePanel}
        onMinimize={minimizePanel}
      />

      <div ref={launcherHostRef}>
        <JudyChatLauncher open={isOpen} reducedMotion={prefersReducedMotion} onToggle={togglePanel} />
      </div>
    </div>
  )
}

export default JudyChatExperience
