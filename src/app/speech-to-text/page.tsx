'use client'

import { useState, useRef } from 'react'
import { Mic, Copy, Trash2, RotateCcw } from 'lucide-react'
import Link from 'next/link'

export default function SpeechToTextPage() {
  const [text, setText] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const recognitionRef = useRef<any>(null)
  const [lastTranscript, setLastTranscript] = useState('')

  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) {
      alert('Speech Recognition not supported in this browser')
      return
    }

    const recognition = new SpeechRecognition()
    recognition.continuous = false
    recognition.interimResults = true
    recognition.lang = 'en-US'

    recognition.onstart = () => setIsListening(true)
    recognition.onresult = (event: any) => {
      let interim = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptSegment = event.results[i][0].transcript
        interim += transcriptSegment + ' '
      }
      setTranscript(interim)
      if (event.results[event.results.length - 1].isFinal) {
        setText(prev => prev ? `${prev} ${interim}` : interim)
        setLastTranscript(interim)
      }
    }

    recognition.onend = () => setIsListening(false)
    recognition.onerror = () => setIsListening(false)

    recognitionRef.current = recognition
    recognition.start()
  }

  const stopListening = () => {
    recognitionRef.current?.stop()
    setIsListening(false)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-2xl mx-auto">
        {/* Navigation */}
        <nav className="mb-8 flex gap-4 border-b-2 border-gray-300 pb-4">
          <Link href="/speech-to-text" className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg">
            🎤 Speech → Text
          </Link>
          <Link href="/text-to-speech" className="px-4 py-2 bg-gray-200 text-black font-semibold rounded-lg hover:bg-gray-300">
            🔊 Text → Speech
          </Link>
          <Link href="/sign-to-text" className="px-4 py-2 bg-gray-200 text-black font-semibold rounded-lg hover:bg-gray-300">
            🖐️ Sign → Text
          </Link>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-black mb-2">Speech to Text</h1>
          <p className="text-lg text-gray-700">
            Speak to convert your words into text
          </p>
        </div>

        {/* Transcript Display */}
        <div className="mb-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg min-h-24">
          <p className="text-sm text-gray-600 mb-2">Live transcript:</p>
          <p className="text-lg text-black">
            {transcript || <span className="text-gray-400 italic">Waiting for speech...</span>}
          </p>
        </div>

        {/* Captured Text */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-black mb-3">
            Captured text
          </label>
          <textarea
            value={text}
            readOnly
            className="w-full h-32 p-4 border-2 border-gray-300 rounded-lg bg-gray-50 text-black"
          />
          <p className="text-sm text-gray-600 mt-2">
            {text.length} characters
          </p>
        </div>

        {/* Listening Indicator */}
        {isListening && (
          <div className="mb-6 p-4 bg-red-50 rounded-lg border-2 border-red-200">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
              <p className="font-semibold text-red-900">Listening...</p>
            </div>
          </div>
        )}

        {/* Control Buttons */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={startListening}
            disabled={isListening}
            className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Mic className="w-5 h-5" />
            {isListening ? 'Listening...' : 'Start Listening'}
          </button>

          {isListening && (
            <button
              onClick={stopListening}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
            >
              Stop
            </button>
          )}
        </div>

        {/* Utility Buttons */}
        <div className="flex gap-3">
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
      </div>
    </div>
  )
}
