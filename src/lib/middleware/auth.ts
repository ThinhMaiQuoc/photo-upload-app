import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { NextResponse } from "next/server"

const isPreview = process.env.VERCEL_ENV === "preview"

export async function getAuthSession() {
  if (isPreview) {
    return {
      user: {
        id: "preview-user",
        name: "Preview User",
        email: "preview@example.com",
        image: null,
      },
    }
  }
  const session = await getServerSession(authOptions)
  return session
}

export async function requireAuth() {
  const session = await getAuthSession()

  if (!session || !session.user) {
    return {
      error: NextResponse.json(
        { error: "Unauthorized. Please log in." },
        { status: 401 }
      ),
      session: null,
    }
  }

  return { error: null, session }
}
