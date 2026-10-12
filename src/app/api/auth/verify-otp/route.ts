import { NextResponse } from "next/server"
import { z } from "zod"
import { OTP_LENGTH, validateOTP } from "@/lib/otp"

const bodySchema = z.object({
  email: z.string().email("Invalid email address"),
  code: z.string().length(OTP_LENGTH, `Code must be ${OTP_LENGTH} digits`).regex(/^\d+$/, "Code must contain only digits"),
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

    const { email, code } = parsed.data

    // TODO: Implement actual OTP verification
    // 1. Look up the OTP in the database for this email
    // 2. Check if it matches and hasn't expired
    // 3. Mark the email as verified
    // 4. Create a session and set auth cookie
    // 5. Return success

    // Demo: accept any code in development for testing
    if (process.env.NODE_ENV === "development" && validateOTP(code)) {
      console.log(`[demo] OTP verified for ${email}: ${code}`)
      return NextResponse.json({ ok: true, message: "Email verified." }, { status: 200 })
    }

    // Production: reject since OTP storage isn't wired yet
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json({ error: "OTP verification is not yet available." }, { status: 503 })
    }

    return NextResponse.json({ error: "Invalid or expired code." }, { status: 401 })
  } catch (err) {
    console.error("OTP verification failed:", err)
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 })
  }
}
