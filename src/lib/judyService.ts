export interface JudyServiceTurn {
  role: 'user' | 'assistant'
  content: string
}

export interface JudyStreamHandlers {
  onDelta: (text: string) => void
  onDone: () => void
  onError: (message: string) => void
}

function parseSseEvent(rawEvent: string): { event: string; data: string } {
  let event = 'message'
  let data = ''
  for (const line of rawEvent.split('\n')) {
    if (line.startsWith('event:')) {
      event = line.slice(6).trim()
    } else if (line.startsWith('data:')) {
      data += line.slice(5).trim()
    }
  }
  return { event, data }
}

export async function streamJudyChat(
  turns: JudyServiceTurn[],
  handlers: JudyStreamHandlers,
  signal?: AbortSignal
): Promise<void> {
  let response: Response

  try {
    response = await fetch('/api/judy/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: turns }),
      signal
    })
  } catch (error) {
    if ((error as { name?: string }).name === 'AbortError') return
    handlers.onError('network')
    return
  }

  if (!response.ok || !response.body) {
    handlers.onError('http')
    return
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  try {
    while (true) {
      const { value, done } = await reader.read()
      if (done) break
      buffer += decoder.decode(value, { stream: true })

      let boundary = buffer.indexOf('\n\n')
      while (boundary !== -1) {
        const rawEvent = buffer.slice(0, boundary)
        buffer = buffer.slice(boundary + 2)

        const { event, data } = parseSseEvent(rawEvent)
        if (data) {
          let parsed: { text?: unknown; message?: unknown } | null = null
          try {
            parsed = JSON.parse(data)
          } catch {
            parsed = null
          }

          if (event === 'delta' && typeof parsed?.text === 'string') {
            handlers.onDelta(parsed.text)
          } else if (event === 'done') {
            handlers.onDone()
            return
          } else if (event === 'error') {
            handlers.onError(typeof parsed?.message === 'string' ? parsed.message : 'stream')
            return
          }
        }

        boundary = buffer.indexOf('\n\n')
      }
    }
  } catch (error) {
    if ((error as { name?: string }).name === 'AbortError') return
    handlers.onError('stream')
    return
  }

  handlers.onDone()
}
