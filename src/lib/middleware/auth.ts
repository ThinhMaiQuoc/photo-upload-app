import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function getAuthSession() {
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
