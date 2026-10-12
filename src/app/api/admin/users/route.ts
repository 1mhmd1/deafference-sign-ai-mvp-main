import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth/require-admin"

export async function GET() {
  const { response } = await requireAdmin()
  if (response) return response

  try {
    const users = await prisma.user.findMany({ orderBy: { createdAt: "desc" } })
    return NextResponse.json({
      users: users.map((user: any) => ({
        id: String(user.id),
        name: user.name ?? user.email,
        email: user.email,
        role: user.role,
        suspended: user.suspended,
        joinedDate: user.createdAt.toISOString(),
      })),
    })
  } catch (err) {
    console.error("Failed to list users:", err)
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 })
  }
}
