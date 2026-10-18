'use client'

import { useState, useRef } from 'react'
import { Copy, Trash2, Camera, Volume2 } from 'lucide-react'
import Link from 'next/link'

export default function SignToTextPage() {
  const [recognizedText, setRecognizedText] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (error) {
      alert('Unable to access camera')
    }
  }

  const captureFrame = async () => {
    if (!videoRef.current || !canvasRef.current) return

    setIsProcessing(true)
    const context = canvasRef.current.getContext('2d')
    if (context) {
      context.drawImage(videoRef.current, 0, 0)
      // Placeholder: In production, send to ML model for sign language recognition
      const mockRecognition = "Hello, how are you? (Mock sign recognition)"
      setRecognizedText(mockRecognition)
    }
    setIsProcessing(false)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(recognizedText)
  }

  return (
    <div className="min-h-screen bg-white p-4 sm:p-6">
      <div className="max-w-2xl mx-auto">
        {/* Navigation */}
        <nav className="mb-8 flex flex-wrap gap-2 sm:gap-4 border-b-2 border-gray-300 pb-4">
          <Link href="/speech-to-text" className="px-4 py-2 bg-gray-200 text-black font-semibold rounded-lg hover:bg-gray-300">
            🎤 Speech → Text
          </Link>
          <Link href="/text-to-speech" className="px-4 py-2 bg-gray-200 text-black font-semibold rounded-lg hover:bg-gray-300">
            🔊 Text → Speech
          </Link>
          <Link href="/sign-to-text" className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg">
            🖐️ Sign → Text
          </Link>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-black mb-2">Sign Language to Text</h1>
          <p className="text-lg text-gray-700">
            Use your camera to convert sign language to text
          </p>
        </div>

        {/* Camera Feed */}
        <div className="mb-6">
          <div className="relative bg-black rounded-lg overflow-hidden mb-4" style={{ paddingBottom: '75%' }}>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="absolute inset-0 w-full h-full"
            />
            <canvas
              ref={canvasRef}
              className="hidden"
              width={640}
              height={480}
            />
          </div>
          <button
            onClick={startCamera}
            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Camera className="w-5 h-5" />
            Start Camera
          </button>
        </div>

        {/* Recognized Text */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-black mb-3">
            Recognized text
          </label>
          <textarea
            value={recognizedText}
            readOnly
            className="w-full h-32 p-4 border-2 border-gray-300 rounded-lg bg-gray-50 text-black"
            placeholder="Sign language will be recognized here..."
          />
          <p className="text-sm text-gray-600 mt-2">
            {recognizedText.length} characters
          </p>
        </div>

        {/* Capture Button */}
        <div className="mb-6">
          <button
            onClick={captureFrame}
            disabled={isProcessing}
            className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Camera className="w-5 h-5" />
            {isProcessing ? 'Processing...' : 'Capture & Recognize'}
          </button>
        </div>

        {/* Utility Buttons */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={copyToClipboard}
            disabled={!recognizedText.trim()}
            className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 text-black font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Copy className="w-4 h-4" />
            Copy
          </button>
          <button
            onClick={() => setRecognizedText('')}
            disabled={!recognizedText.trim()}
            className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 text-black font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Clear
          </button>
        </div>

        {/* Info Box */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
          <p className="text-sm text-black">
            ℹ️ <strong>Note:</strong> This page demonstrates camera integration. Real sign language recognition requires trained ML models (MediaPipe Holistic or similar).
          </p>
        </div>
      </div>
    </div>
  )
}
