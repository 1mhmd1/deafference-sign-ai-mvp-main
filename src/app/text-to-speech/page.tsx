'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { Volume2, Copy, Trash2, RotateCcw } from 'lucide-react'
import WaveformAnimation from '@/components/deafference/waveform-animation'

const QUICK_PHRASES = [
  'Yes',
  'No',
  'One moment please',
  'Can you repeat that?'
]

const TONE_PRESETS = {
  neutral: { pitch: 1.0, rate: 1.0, name: 'Neutral' },
  friendly: { pitch: 1.2, rate: 0.9, name: 'Friendly' },
  formal: { pitch: 0.8, rate: 0.8, name: 'Formal' }
}

const LANGUAGES = [
  { code: 'en-US', name: 'English (US)', flag: '🇺🇸' },
  { code: 'en-GB', name: 'English (UK)', flag: '🇬🇧' },
  { code: 'es-ES', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr-FR', name: 'French', flag: '🇫🇷' },
  { code: 'de-DE', name: 'German', flag: '🇩🇪' },
  { code: 'it-IT', name: 'Italian', flag: '🇮🇹' },
  { code: 'ja-JP', name: 'Japanese', flag: '🇯🇵' },
  { code: 'zh-CN', name: 'Chinese (Simplified)', flag: '🇨🇳' },
]

type ToneType = keyof typeof TONE_PRESETS

export default function TextToSpeechPage() {
  const [text, setText] = useState('')
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [tone, setTone] = useState<ToneType>('neutral')
  const [language, setLanguage] = useState('en-US')
  const [speechRate, setSpeechRate] = useState(1)
  const [volume, setVolume] = useState(1)
  const [lastText, setLastText] = useState('')
  const synthRef = useRef<SpeechSynthesisUtterance | null>(null)

  // Persist language selection
  useEffect(() => {
    const saved = localStorage.getItem('selectedLanguage')
    if (saved) setLanguage(saved)
  }, [])

  useEffect(() => {
    localStorage.setItem('selectedLanguage', language)
  }, [language])

  const handleSpeak = (textToSpeak?: string) => {
    const finalText = textToSpeak || text
    if (!finalText.trim()) return

    // Cancel any ongoing speech
    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(finalText)
    const preset = TONE_PRESETS[tone]

    utterance.rate = speechRate * preset.rate
    utterance.pitch = preset.pitch
    utterance.volume = volume
    utterance.lang = language

    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)

    synthRef.current = utterance
    setLastText(finalText)
    setIsSpeaking(true)
    window.speechSynthesis.speak(utterance)
  }

  const handleRepeat = () => {
    if (lastText.trim()) {
      handleSpeak(lastText)
    }
  }

  const handleStop = () => {
    window.speechSynthesis.cancel()
    setIsSpeaking(false)
  }

  const addQuickPhrase = (phrase: string) => {
    setText(prev => prev ? `${prev} ${phrase}` : phrase)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="min-h-screen bg-white p-4 sm:p-6">
      <div className="max-w-2xl mx-auto">
        {/* Navigation */}
        <nav className="mb-8 flex flex-wrap gap-2 sm:gap-4 border-b-2 border-gray-300 pb-4">
          <Link href="/speech-to-text" className="px-4 py-2 bg-gray-200 text-black font-semibold rounded-lg hover:bg-gray-300">
            🎤 Speech → Text
          </Link>
          <Link href="/text-to-speech" className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg">
            🔊 Text → Speech
          </Link>
          <Link href="/sign-to-text" className="px-4 py-2 bg-gray-200 text-black font-semibold rounded-lg hover:bg-gray-300">
            🖐️ Sign → Text
          </Link>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-black mb-2">Text to Speech</h1>
          <p className="text-lg text-gray-700">
            Type or select phrases to speak out loud
          </p>
        </div>

        {/* Text Area */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-black mb-3">
            What would you like to say?
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type your message here..."
            className="w-full h-32 p-4 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-black placeholder-gray-500"
          />
          <p className="text-sm text-gray-600 mt-2">
            {text.length} characters
          </p>
        </div>

        {/* Quick Phrases */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-black mb-3">
            Quick phrases
          </label>
          <div className="grid grid-cols-1 min-[400px]:grid-cols-2 gap-3">
            {QUICK_PHRASES.map((phrase) => (
              <button
                key={phrase}
                onClick={() => addQuickPhrase(phrase)}
                className="px-4 py-3 bg-blue-100 hover:bg-blue-200 text-blue-900 font-medium rounded-lg transition-colors border-2 border-blue-300"
              >
                {phrase}
              </button>
            ))}
          </div>
        </div>

        {/* Tone Presets */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-black mb-3">
            Voice tone
          </label>
          <div className="flex flex-wrap gap-3">
            {Object.entries(TONE_PRESETS).map(([key, value]) => (
              <button
                key={key}
                onClick={() => setTone(key as ToneType)}
                className={`px-4 py-2 font-medium rounded-lg transition-colors border-2 ${
                  tone === key
                    ? 'bg-blue-600 text-white border-blue-700'
                    : 'bg-gray-200 text-black border-gray-300 hover:bg-gray-300'
                }`}
              >
                {value.name}
              </button>
            ))}
          </div>
        </div>

        {/* Language Selection */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-black mb-3">
            Language
          </label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-black bg-white"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.flag} {lang.name}
              </option>
            ))}
          </select>
        </div>

        {/* Speech Rate Slider */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-semibold text-black">
              Speech rate
            </label>
            <span className="text-sm text-gray-600">{(speechRate * 100).toFixed(0)}%</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={speechRate}
            onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Slow</span>
            <span>Normal</span>
            <span>Fast</span>
          </div>
        </div>

        {/* Volume Control */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-semibold text-black">
              Volume
            </label>
            <span className="text-sm text-gray-600">{(volume * 100).toFixed(0)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Waveform Animation */}
        {isSpeaking && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
            <div className="mb-2 flex items-center gap-2">
              <Volume2 className="w-5 h-5 text-blue-600" />
              <p className="font-semibold text-blue-900">Speaking now...</p>
            </div>
            <WaveformAnimation isActive={isSpeaking} />
          </div>
        )}

        {/* Control Buttons */}
        <div className="flex flex-wrap gap-3 mb-6">
          <button
            onClick={() => handleSpeak()}
            disabled={!text.trim() || isSpeaking}
            className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Volume2 className="w-5 h-5" />
            {isSpeaking ? 'Speaking...' : 'Listen / Speak Out Loud'}
          </button>

          <button
            onClick={handleRepeat}
            disabled={!lastText.trim() || isSpeaking}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
            title="Repeat the last spoken text"
          >
            <RotateCcw className="w-5 h-5" />
            Repeat
          </button>

          {isSpeaking && (
            <button
              onClick={handleStop}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
            >
              Stop
            </button>
          )}
        </div>

        {/* Utility Buttons */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={copyToClipboard}
            disabled={!text.trim()}
            className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 text-black font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Copy className="w-4 h-4" />
            Copy
          </button>
          <button
            onClick={() => setText('')}
            disabled={!text.trim()}
            className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 text-black font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Clear
          </button>
        </div>

        {/* Accessibility Info */}
        <div className="mt-8 p-4 bg-gray-100 rounded-lg border-l-4 border-blue-600">
          <p className="text-sm text-gray-700">
            ℹ️ <strong>Accessibility:</strong> The waveform animation provides visual feedback when audio is playing, helping deaf and hard-of-hearing users confirm the system is actively speaking.
          </p>
        </div>
      </div>
    </div>
  )
}
