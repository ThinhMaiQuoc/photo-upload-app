import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
        _count: {
          select: {
            photos: true,
            comments: true,
          },
        },
        photos: {
          select: {
            id: true,
            title: true,
            filename: true,
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
        },
        comments: {
          select: {
            id: true,
            content: true,
            createdAt: true,
            photo: {
              select: {
                id: true,
                title: true,
                filename: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ user })
  } catch (err) {
    console.error("Error fetching user:", err)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
