import { NextResponse } from 'next/server'
import { AppError } from '@/lib/judy/AppError'
import { assertJudyConfigured, streamJudyReply, validateChatTurns } from '@/lib/judy/judy.service'

// Judy chat: streams the reply as Server-Sent Events ("delta", "done", "error").
// Ported from the Express judy.controller.ts; the Groq key never leaves the server.
export async function POST(request: Request) {
  const body = await request.json().catch(() => null)

  let turns
  try {
    turns = validateChatTurns((body as { messages?: unknown } | null)?.messages)
    assertJudyConfigured()
  } catch (error) {
    // Same shape as the original errorHandler middleware.
    if (error instanceof AppError) {
      return NextResponse.json({ error: { message: error.message, code: error.code } }, { status: error.status })
    }
    console.error(error)
    return NextResponse.json({ error: { message: 'Internal server error.', code: 'INTERNAL_ERROR' } }, { status: 500 })
  }

  const encoder = new TextEncoder()
  // Set when the browser disconnects (e.g. the chat is closed mid-reply), so we stop writing.
  let cancelled = false

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (event: string, data: unknown) => {
        if (cancelled) return
        controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`))
      }

      try {
        await streamJudyReply(turns, (text) => send('delta', { text }))
        send('done', {})
      } catch (error) {
        const message = error instanceof AppError ? error.message : 'Judy ran into a problem.'
        console.error('Judy chat stream error', error)
        send('error', { message })
      } finally {
        if (!cancelled) controller.close()
      }
    },
    cancel() {
      cancelled = true
    }
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive'
    }
  })
}
