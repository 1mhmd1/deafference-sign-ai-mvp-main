import { NextResponse } from "next/server"
import { normalizeContact, validateContact } from "@/lib/contact"

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid input." }, { status: 400 })
  }

  // Honeypot: real users never see or fill the "website" field, so accept
  // silently and drop it rather than telling a bot what tripped it.
  if (typeof body.website === "string" && body.website.trim()) {
    return NextResponse.json({ ok: true }, { status: 202 })
  }

  const submission = normalizeContact(body)
  const fields = validateContact(submission)
  if (Object.keys(fields).length > 0) {
    return NextResponse.json({ error: "Invalid input.", fields }, { status: 400 })
  }

  // TODO: persist submissions (e.g. a ContactSubmission Prisma model) and
  // notify the team. Until then, refuse in production so a visitor is never
  // told their message arrived when it was silently dropped. The form falls
  // back to showing the email address.
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "The contact form is not available yet." }, { status: 503 })
  }

  console.log(`[contact] ${submission.topic} via ${submission.contactMethod} from ${submission.email} (not persisted)`)
  return NextResponse.json({ ok: true }, { status: 202 })
}
