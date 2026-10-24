import Groq from 'groq-sdk'
import { AppError } from './AppError'

// Server-only: read straight from process.env (the original read these via its MySQL-bound config/env.ts).
const groqApiKey = () => process.env.GROQ_API_KEY ?? ''
const groqModel = () => process.env.GROQ_MODEL || 'openai/gpt-oss-120b'

export const JUDY_SYSTEM_PROMPT = `You are Judy, the friendly AI companion of Deafference.

You are warm, intelligent, approachable, calm, and slightly playful.

You communicate naturally and conversationally.

Your goal is to make users feel like they are talking to a friendly character, not a generic AI chatbot.

Keep responses concise and easy to read.

Use natural conversational language.

You can occasionally use subtle emojis when appropriate, but do not overuse them.

Never describe yourself as a generic chatbot.

When users ask who you are, explain that you are Judy, the AI companion of Deafference.

Deafference is an organization focused on accessibility, Deaf culture, inclusive communication, storytelling, and technology.

Do not invent facts about Deafference.

If you do not know something about Deafference, clearly say that you don't have that information.

Do not pretend to have capabilities that are not implemented.

Be respectful when discussing Deaf people, Deaf culture, accessibility, and sign language.

Never make assumptions about a person's disability.

Keep responses helpful, concise, and conversational.

Your replies are shown as plain text in a chat bubble, not rendered markdown. Never use markdown syntax — no asterisks for bold/italics, no bullet or numbered lists, no headers, no code fences. Write in plain, natural sentences instead.`

export interface JudyChatTurn {
  role: 'user' | 'assistant'
  content: string
}

const MAX_HISTORY_MESSAGES = 20
const MAX_MESSAGE_LENGTH = 2000

let client: Groq | null = null

export function assertJudyConfigured(): void {
  if (!groqApiKey()) {
    throw new AppError(503, 'JUDY_UNAVAILABLE', 'Judy is not configured yet.')
  }
}

function getClient(): Groq {
  assertJudyConfigured()
  if (!client) {
    client = new Groq({ apiKey: groqApiKey(), timeout: 30_000, maxRetries: 1 })
  }
  return client
}

export function validateChatTurns(input: unknown): JudyChatTurn[] {
  if (!Array.isArray(input) || input.length === 0) {
    throw new AppError(400, 'VALIDATION_ERROR', 'A conversation with at least one message is required.')
  }

  const turns = input.slice(-MAX_HISTORY_MESSAGES).map((item): JudyChatTurn => {
    const role = (item as { role?: unknown } | null)?.role
    const content = (item as { content?: unknown } | null)?.content
    if ((role !== 'user' && role !== 'assistant') || typeof content !== 'string' || !content.trim()) {
      throw new AppError(400, 'VALIDATION_ERROR', 'Each message needs a valid role and content.')
    }
    return { role, content: content.trim().slice(0, MAX_MESSAGE_LENGTH) }
  })

  if (turns[turns.length - 1].role !== 'user') {
    throw new AppError(400, 'VALIDATION_ERROR', 'The last message must come from the user.')
  }

  return turns
}

export async function streamJudyReply(turns: JudyChatTurn[], onDelta: (text: string) => void): Promise<void> {
  const groq = getClient()

  try {
    const stream = await groq.chat.completions.create({
      model: groqModel(),
      messages: [{ role: 'system', content: JUDY_SYSTEM_PROMPT }, ...turns],
      stream: true,
      temperature: 0.7,
      max_tokens: 600
    })

    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta?.content
      if (delta) onDelta(delta)
    }
  } catch (error) {
    if (error instanceof AppError) throw error
    console.error('Judy: Groq stream failed', error)
    throw new AppError(502, 'JUDY_UPSTREAM_ERROR', 'Judy lost connection while responding.')
  }
}
