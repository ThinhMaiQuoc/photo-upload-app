import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/middleware/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const { error, session } = await requireAuth()

  if (error) {
    return error
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session!.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ user })
  } catch (err) {
    console.error("Error fetching current user:", err)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
