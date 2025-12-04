import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/middleware/auth"
import { prisma } from "@/lib/prisma"
import { validateComment } from "@/lib/validation/comment"

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error, session } = await requireAuth()

  if (error) {
    return error
  }

  try {
    const { id: photoId } = await params
    const body = await request.json()
    const { content } = body

    const validation = validateComment(content)
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 })
    }

    const photo = await prisma.photo.findUnique({
      where: { id: photoId },
    })

    if (!photo) {
      return NextResponse.json({ error: "Photo not found" }, { status: 404 })
    }

    const comment = await prisma.comment.create({
      data: {
        content: validation.sanitized || content,
        photoId,
        userId: session!.user.id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    })

    return NextResponse.json({ comment }, { status: 201 })
  } catch (err) {
    console.error("Error creating comment:", err)
    return NextResponse.json(
      { error: "Failed to create comment" },
      { status: 500 }
    )
  }
}
