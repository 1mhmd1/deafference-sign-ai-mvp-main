'use client'

import { createRef, useEffect, useRef, type KeyboardEvent, type RefObject } from 'react'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import type { JudyChatMessage, JudyChatState } from '@/hooks/useJudyChat'
import { JudyPortrait } from './JudyPortrait'
import './JudyChatPanel.css'

interface JudyChatPanelProps {
  open: boolean
  state: JudyChatState
  messages: JudyChatMessage[]
  draft: string
  quickPrompts: string[]
  statusText: string
  voiceLevel: number
  reducedMotion: boolean
  srAnnouncement: string
  onDraftChange: (value: string) => void
  onSend: () => void
  onPrompt: (value: string) => void
  onExplain: (messageId: number) => void
  onToggleMic: () => void
  onClose: () => void
  onMinimize: () => void
}

const WAVE_BARS = Array.from({ length: 14 }, (_, i) => i + 1)

export function JudyChatPanel({
  open,
  state,
  messages,
  draft,
  quickPrompts,
  statusText,
  voiceLevel,
  reducedMotion,
  srAnnouncement,
  onDraftChange,
  onSend,
  onPrompt,
  onExplain,
  onToggleMic,
  onClose,
  onMinimize
}: JudyChatPanelProps) {
  const panelRef = useRef<HTMLElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLElement>(null)
  // react-transition-group needs a nodeRef per item on React 19 (no findDOMNode).
  const messageRefs = useRef(new Map<number, RefObject<HTMLElement | null>>())

  const thinkingVisible = state === 'thinking'
  const listeningVisible = state === 'listening'
  const inputDisabled = state === 'responding' || state === 'thinking'

  let statusChip = 'Online'
  if (state === 'listening') statusChip = 'Listening'
  else if (state === 'thinking') statusChip = 'Thinking'
  else if (state === 'responding') statusChip = 'Responding'

  function messageRef(id: number) {
    let ref = messageRefs.current.get(id)
    if (!ref) {
      ref = createRef<HTMLElement>()
      messageRefs.current.set(id, ref)
    }
    return ref
  }

  function onEscape(event: KeyboardEvent<HTMLElement>) {
    if (event.key !== 'Escape') return
    event.preventDefault()
    onMinimize()
  }

  useEffect(() => {
    if (!open) return
    inputRef.current?.focus()
  }, [open])

  useEffect(() => {
    const el = listRef.current
    if (!el) return
    el.scrollTop = el.scrollHeight
  }, [messages.length])

  return (
    <CSSTransition
      in={open}
      nodeRef={panelRef}
      timeout={reducedMotion ? 0 : 380}
      classNames="judy-panel"
      unmountOnExit
    >
      <section
        ref={panelRef}
        id="judy-chat-panel"
        className="judy-panel"
        role="dialog"
        aria-label="Judy AI Companion"
        aria-modal="false"
        onKeyDown={onEscape}
      >
        <header className="judy-head">
          <div className="judy-head-left">
            <JudyPortrait state={state} size="md" reducedMotion={reducedMotion} />
            <div>
              <p className="judy-name">Judy</p>
              <p className="judy-role">AI Companion</p>
              <p className="judy-status">
                <span className={`status-dot state-${state}`} aria-hidden="true" />
                {statusChip}
              </p>
            </div>
          </div>

          <div className="judy-controls">
            <button type="button" className="judy-icon-button" aria-label="Minimize Judy chat" onClick={onMinimize}>
              <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M3 8h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
            </button>
            <button type="button" className="judy-icon-button" aria-label="Close Judy chat" onClick={onClose}>
              <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
            </button>
          </div>
        </header>

        <div className="ai-ribbon" aria-hidden="true">
          <span className="ai-node" />
          <span className="ai-track" />
          <span className="ai-copy">AI ACTIVE</span>
        </div>

        <p className="judy-intro">{statusText}</p>

        <section ref={listRef} className="judy-timeline" role="log" aria-live="polite" aria-label="Judy conversation">
          <TransitionGroup component="div" className="judy-message-list">
            {messages.map((item) => {
              const nodeRef = messageRef(item.id)
              return (
                <CSSTransition
                  key={item.id}
                  nodeRef={nodeRef}
                  timeout={reducedMotion ? 0 : 260}
                  classNames="judy-message"
                  onExited={() => messageRefs.current.delete(item.id)}
                >
                  <article
                    ref={nodeRef as RefObject<HTMLElement>}
                    className={`judy-message ${item.role === 'judy' ? 'is-judy' : 'is-user'}`}
                  >
                    {item.role === 'judy' && <div className="judy-bubble-label">Judy</div>}
                    <div className={`bubble-core${item.streaming ? ' is-streaming' : ''}`}>{item.text}</div>
                    {item.role === 'judy' && item.question && !item.streaming && (
                      <button
                        type="button"
                        className="judy-explain"
                        aria-label="Ask Judy to explain this more"
                        title="Explain more"
                        disabled={inputDisabled || listeningVisible}
                        onClick={() => onExplain(item.id)}
                      >
                        ?
                      </button>
                    )}
                  </article>
                </CSSTransition>
              )
            })}
          </TransitionGroup>

          {thinkingVisible && (
            <article className="judy-message is-judy is-thinking" aria-label="Judy is thinking">
              <div className="judy-bubble-label">Judy</div>
              <div className="bubble-core bubble-thinking">
                <span />
                <span />
                <span />
              </div>
            </article>
          )}
        </section>

        <div className="judy-prompt-row" aria-label="Quick prompts">
          {quickPrompts.map((prompt) => (
            <button key={prompt} type="button" className="judy-chip" onClick={() => onPrompt(prompt)}>
              <span className="chip-mark" aria-hidden="true" />
              {prompt}
            </button>
          ))}
        </div>

        <form
          className="judy-composer"
          onSubmit={(event) => {
            event.preventDefault()
            onSend()
          }}
        >
          {listeningVisible ? (
            <div className="voice-mode" aria-live="polite">
              <p>Judy is listening...</p>
              <div className="voice-wave-shell" aria-hidden="true">
                {WAVE_BARS.map((index) => (
                  <span key={`wave-${index}`} style={{ height: `${8 + ((index * 7 + voiceLevel) % 22)}px` }} />
                ))}
              </div>
            </div>
          ) : (
            <>
              <button type="button" className="judy-action" aria-label="Attach a file" disabled>
                <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
                  <path d="M6 7.5v3.1a2.9 2.9 0 0 0 5.8 0V5.2A2.2 2.2 0 0 0 7.4 5v5.3a1.4 1.4 0 0 0 2.8 0V6.6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              <label className="sr-only" htmlFor="judy-input">Ask Judy anything</label>
              <input
                id="judy-input"
                ref={inputRef}
                value={draft}
                onChange={(event) => onDraftChange(event.target.value)}
                className="judy-input"
                disabled={inputDisabled}
                type="text"
                autoComplete="off"
                placeholder="Ask Judy anything..."
                aria-label="Ask Judy anything"
                onKeyDown={(event) => {
                  if (event.key !== 'Enter' || event.shiftKey || event.ctrlKey || event.altKey || event.metaKey) return
                  event.preventDefault()
                  onSend()
                }}
              />
            </>
          )}

          <button
            type="button"
            className={`judy-action mic${listeningVisible ? ' active' : ''}`}
            aria-pressed={listeningVisible}
            aria-label={listeningVisible ? 'Stop listening' : 'Start voice input'}
            onClick={onToggleMic}
          >
            <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
              <path d="M8 2.5a2 2 0 0 1 2 2v3.5a2 2 0 1 1-4 0V4.5a2 2 0 0 1 2-2Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <path d="M4.2 7.7a3.8 3.8 0 0 0 7.6 0M8 11.5V14M6.2 14h3.6" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          </button>

          <button type="submit" className="judy-send" disabled={!draft.trim() || inputDisabled} aria-label="Send message">
            <span>Send</span>
            <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </form>

        <p className="sr-only" aria-live="polite">{srAnnouncement}</p>
      </section>
    </CSSTransition>
  )
}

export default JudyChatPanel
