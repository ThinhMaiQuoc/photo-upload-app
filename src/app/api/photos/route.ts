import { NextResponse } from "next/server"
import { put } from "@vercel/blob"
import { requireAuth } from "@/lib/middleware/auth"
import { prisma } from "@/lib/prisma"
import { validatePhotoServer } from "@/lib/validation/photo"

export async function POST(request: Request) {
  const { error, session } = await requireAuth()

  if (error) {
    return error
  }

  try {
    const formData = await request.formData()
    const file = formData.get("photo") as File
    const title = formData.get("title") as string

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const validation = validatePhotoServer(file)
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 })
    }

    const filename = `${Date.now()}-${file.name}`
    const blob = await put(filename, file, {
      access: "public",
    })

    const photo = await prisma.photo.create({
      data: {
        title: title || null,
        filename: blob.url,
        uploadedById: session!.user.id,
      },
    })

    return NextResponse.json({ photo }, { status: 201 })
  } catch (err) {
    console.error("Error uploading photo:", err)
    return NextResponse.json(
      { error: "Failed to upload photo" },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const photos = await prisma.photo.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        uploadedBy: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        _count: {
          select: { comments: true },
        },
      },
    })

    return NextResponse.json({ photos })
  } catch (err) {
    console.error("Error fetching photos:", err)
    return NextResponse.json(
      { error: "Failed to fetch photos" },
      { status: 500 }
    )
  }
}
