'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useMotionPreference } from '@/hooks/useMotionPreference'
import { streamJudyChat } from '@/lib/judyService'

export type JudyChatState = 'idle' | 'listening' | 'thinking' | 'responding'

export interface JudyChatMessage {
  id: number
  role: 'judy' | 'user'
  text: string
  createdAt: number
  streaming?: boolean
  /** The user question this Judy reply answers; set when it can offer "explain more". */
  question?: string
}

const QUICK_PROMPTS = [
  'Tell me about Deafference',
  'What can you help me with?',
  'Show me the latest stories',
  'I have a question'
]

const FALLBACK_RESPONSE = "I'm having a little trouble connecting right now. Could you try again? ✨"
const MAX_HISTORY_TURNS = 16
const EXPLAIN_QUESTION_MAX = 80

function explainPrompt(question: string) {
  const short = question.length > EXPLAIN_QUESTION_MAX ? `${question.slice(0, EXPLAIN_QUESTION_MAX).trimEnd()}…` : question
  return `Can you explain more about "${short}"?`
}

type SpeechRecognitionCtor = new () => SpeechRecognitionLike

interface SpeechRecognitionResultLike {
  results: { [index: number]: { [index: number]: { transcript: string } } }
}

interface SpeechRecognitionLike {
  lang: string
  interimResults: boolean
  maxAlternatives: number
  onresult: ((event: SpeechRecognitionResultLike) => void) | null
  onerror: (() => void) | null
  onend: (() => void) | null
  start: () => void
  stop: () => void
}

function getSpeechRecognitionCtor(): SpeechRecognitionCtor | null {
  if (typeof window === 'undefined') return null
  const w = window as unknown as {
    SpeechRecognition?: SpeechRecognitionCtor
    webkitSpeechRecognition?: SpeechRecognitionCtor
  }
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null
}

export function useJudyChat() {
  const { prefersReducedMotion } = useMotionPreference()

  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [state, setStateValue] = useState<JudyChatState>('idle')
  const [draft, setDraftValue] = useState('')
  const [voiceLevel, setVoiceLevel] = useState(0)
  const [srAnnouncement, setSrAnnouncement] = useState('Judy is ready to chat.')
  const [speechSupported] = useState(() => !!getSpeechRecognitionCtor())

  const [messages, setMessagesValue] = useState<JudyChatMessage[]>(() => [
    {
      id: 1,
      role: 'judy',
      text: 'Hi, I am Judy. Ask me anything and we can explore together.',
      createdAt: Date.now()
    }
  ])

  // Refs mirror the latest values so async callbacks (speech, streaming) never read stale state.
  const stateRef = useRef<JudyChatState>('idle')
  const draftRef = useRef('')
  const messagesRef = useRef(messages)
  const idSeed = useRef(2)
  const voicePulseInterval = useRef<number | undefined>(undefined)
  const recognition = useRef<SpeechRecognitionLike | null>(null)
  const activeRequestId = useRef(0)
  const activeAbort = useRef<AbortController | undefined>(undefined)

  const setState = useCallback((value: JudyChatState) => {
    stateRef.current = value
    setStateValue(value)
  }, [])

  const setDraft = useCallback((value: string) => {
    draftRef.current = value
    setDraftValue(value)
  }, [])

  function updateMessages(updater: (list: JudyChatMessage[]) => JudyChatMessage[]) {
    messagesRef.current = updater(messagesRef.current)
    setMessagesValue(messagesRef.current)
  }

  function updateMessageAt(index: number, patch: (message: JudyChatMessage) => Partial<JudyChatMessage>) {
    updateMessages((list) => list.map((message, i) => (i === index ? { ...message, ...patch(message) } : message)))
  }

  function stopVoicePulse() {
    if (voicePulseInterval.current) window.clearInterval(voicePulseInterval.current)
    voicePulseInterval.current = undefined
    setVoiceLevel(0)
  }

  function stopRecognition() {
    stopVoicePulse()
    const instance = recognition.current
    if (instance) {
      instance.onresult = null
      instance.onerror = null
      instance.onend = null
      try {
        instance.stop()
      } catch {
        // already stopped
      }
      recognition.current = null
    }
  }

  function clearTimers() {
    stopRecognition()
    activeAbort.current?.abort()
    activeAbort.current = undefined
  }

  function openChat() {
    setIsOpen(true)
    setIsMinimized(false)
    setSrAnnouncement('Judy chat opened.')
  }

  function closeChat() {
    setIsOpen(false)
    setIsMinimized(false)
    clearTimers()
    setState('idle')
    setSrAnnouncement('Judy chat closed.')
  }

  function minimizeChat() {
    setIsMinimized(true)
    setIsOpen(false)
    clearTimers()
    setState('idle')
    setSrAnnouncement('Judy chat minimized.')
  }

  function restoreChat() {
    setIsOpen(true)
    setIsMinimized(false)
    setSrAnnouncement('Judy chat restored.')
  }

  function setListeningState() {
    const Ctor = getSpeechRecognitionCtor()
    if (!Ctor) {
      setSrAnnouncement('Voice input is not supported in this browser yet.')
      return
    }

    stopRecognition()
    setState('listening')
    setSrAnnouncement('Judy is listening.')

    if (!prefersReducedMotion) {
      voicePulseInterval.current = window.setInterval(() => {
        setVoiceLevel(Math.max(12, Math.min(100, Math.round(30 + Math.random() * 65))))
      }, 140)
    }

    const instance = new Ctor()
    instance.lang = 'en-US'
    instance.interimResults = false
    instance.maxAlternatives = 1

    instance.onresult = (event) => {
      const transcript = event.results?.[0]?.[0]?.transcript?.trim()
      stopRecognition()
      if (transcript) {
        void sendMessage(transcript, true)
      } else {
        setState('idle')
      }
    }

    instance.onerror = () => {
      stopRecognition()
      setState('idle')
      setSrAnnouncement('I could not hear that clearly. Please try again.')
    }

    instance.onend = () => {
      if (stateRef.current === 'listening') {
        setState('idle')
      }
    }

    recognition.current = instance

    try {
      instance.start()
    } catch {
      stopRecognition()
      setState('idle')
    }
  }

  function toggleListening() {
    if (stateRef.current === 'listening') {
      stopRecognition()
      setState('idle')
      setSrAnnouncement('Listening stopped.')
      return
    }

    setListeningState()
  }

  function addMessage(role: 'judy' | 'user', text: string, streaming = false) {
    updateMessages((list) => [
      ...list,
      {
        id: idSeed.current,
        role,
        text,
        createdAt: Date.now(),
        streaming
      }
    ])
    idSeed.current += 1
    return messagesRef.current.length - 1
  }

  function buildHistory() {
    return messagesRef.current
      .filter((message) => message.text.trim().length > 0)
      .slice(-MAX_HISTORY_TURNS)
      .map((message) => ({
        role: (message.role === 'judy' ? 'assistant' : 'user') as 'assistant' | 'user',
        content: message.text
      }))
  }

  // `topic` is the original question a reply should remember for "explain more" (defaults to the text sent).
  async function sendMessage(text?: string, fromVoice = false, topic?: string) {
    if (stateRef.current === 'thinking' || stateRef.current === 'responding') return

    const raw = (text ?? draftRef.current).trim()
    if (!raw) return

    stopRecognition()
    addMessage('user', raw)
    setDraft('')

    setState('thinking')
    setSrAnnouncement(fromVoice ? 'Judy is thinking after listening.' : 'Judy is thinking.')

    const history = buildHistory()
    const requestId = ++activeRequestId.current
    activeAbort.current?.abort()
    const controller = new AbortController()
    activeAbort.current = controller

    let judyMessageIndex = -1

    await streamJudyChat(
      history,
      {
        onDelta: (delta) => {
          if (requestId !== activeRequestId.current) return
          if (judyMessageIndex === -1) {
            setState('responding')
            setSrAnnouncement('Judy is responding.')
            judyMessageIndex = addMessage('judy', '', true)
          }
          updateMessageAt(judyMessageIndex, (message) => ({ text: message.text + delta }))
        },
        onDone: () => {
          if (requestId !== activeRequestId.current) return
          if (judyMessageIndex !== -1) {
            updateMessageAt(judyMessageIndex, () => ({ streaming: false, question: topic ?? raw }))
          }
          setState('idle')
          setSrAnnouncement('Judy responded.')
        },
        onError: () => {
          if (requestId !== activeRequestId.current) return
          if (judyMessageIndex !== -1) {
            updateMessageAt(judyMessageIndex, () => ({ text: FALLBACK_RESPONSE, streaming: false }))
          } else {
            addMessage('judy', FALLBACK_RESPONSE)
          }
          setState('idle')
          setSrAnnouncement('Judy had trouble responding.')
        }
      },
      controller.signal
    )
  }

  function applyPrompt(prompt: string) {
    setDraft(prompt)
    void sendMessage(prompt)
  }

  /** The "?" on a Judy reply: ask her to go deeper on the question that reply answered. */
  function explainMore(messageId: number) {
    const question = messagesRef.current.find((message) => message.id === messageId)?.question
    if (!question) return
    void sendMessage(explainPrompt(question), false, question)
  }

  const quickPrompts = QUICK_PROMPTS

  const statusText = useMemo(() => {
    if (state === 'listening') return 'I am listening...'
    if (state === 'thinking') return 'Judy is thinking...'
    if (state === 'responding') return 'Judy is responding...'
    return 'Hi, I am Judy.'
  }, [state])

  // Keep the latest clearTimers reachable from the unmount cleanup below.
  const clearTimersRef = useRef(clearTimers)
  clearTimersRef.current = clearTimers

  useEffect(() => {
    return () => {
      clearTimersRef.current()
    }
  }, [])

  return {
    isOpen,
    isMinimized,
    state,
    draft,
    setDraft,
    voiceLevel,
    messages,
    quickPrompts,
    statusText,
    srAnnouncement,
    speechSupported,
    openChat,
    closeChat,
    minimizeChat,
    restoreChat,
    toggleListening,
    sendMessage,
    applyPrompt,
    explainMore,
    prefersReducedMotion
  }
}
