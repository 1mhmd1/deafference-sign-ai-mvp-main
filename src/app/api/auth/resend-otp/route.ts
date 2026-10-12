import { NextResponse } from "next/server"
import { z } from "zod"
import { EMAIL_PATTERN } from "@/lib/validation"
import { generateOTP } from "@/lib/otp"

const bodySchema = z.object({
  email: z.string().trim().toLowerCase().regex(EMAIL_PATTERN, "Enter a valid email address."),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = bodySchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid input." },
        { status: 400 },
      )
    }

    const { email } = parsed.data

    // TODO: Implement actual OTP resend
    // 1. Check if the email exists in the database
    // 2. Generate a new OTP
    // 3. Store it with an expiry timestamp (10 minutes)
    // 4. Send it via email
    // 5. Return success response

    // Demo: generate and store OTP in localStorage for testing
    const newOTP = generateOTP()
    if (process.env.NODE_ENV === "development") {
      console.log(`[demo] OTP generated for ${email}: ${newOTP}`)
      // Store in localStorage on client side (see verify page)
      return NextResponse.json(
        { ok: true, message: "Code sent. Check your email.", devOTP: newOTP },
        {
          status: 202,
          headers: { "Set-Cookie": `demo-otp=${newOTP}; Path=/; Max-Age=600; HttpOnly; Secure; SameSite=Lax` },
        },
      )
    }

    // Production: reject since email sending isn't wired yet
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json({ error: "OTP resend is not yet available." }, { status: 503 })
    }

    return NextResponse.json({ error: "Failed to send code." }, { status: 500 })
  } catch (err) {
    console.error("OTP resend failed:", err)
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 })
  }
}
