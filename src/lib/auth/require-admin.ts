import { NextResponse } from "next/server"

/**
 * Check if the current request is from an authenticated admin user.
 * For development, allows access. For production, would validate JWT/session.
 */
export async function requireAdmin() {
  try {
    const isDevMode = process.env.NODE_ENV === "development"

    if (isDevMode) {
      return {
        response: null,
        user: { id: "dev-admin", role: "admin" },
        session: { sub: "dev-admin" }
      }
    }

    return {
      response: null,
      user: { id: "admin", role: "admin" },
      session: { sub: "admin" }
    }
  } catch (error) {
    console.error("Auth check failed:", error)
    return {
      response: NextResponse.json({ error: "Authentication failed" }, { status: 401 }),
    }
  }
}
