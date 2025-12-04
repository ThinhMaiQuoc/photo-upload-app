"use client"

import { useSession } from "next-auth/react"
import LogoutButton from "@/components/auth/LogoutButton"
import PhotoUploadForm from "@/components/photos/PhotoUploadForm"
import PhotoGrid from "@/components/photos/PhotoGrid"
import { useState } from "react"
import { Spin } from "antd"

const isPreview = process.env.NEXT_PUBLIC_VERCEL_ENV === "preview"

export default function Home() {
  const { data: session, status } = useSession()
  const [photoUpdateTrigger, setPhotoUpdateTrigger] = useState(0)

  const effectiveSession = isPreview
    ? {
        user: {
          id: "preview-user",
          name: "Preview User",
          email: "preview@example.com",
          image: null,
        },
      }
    : session

  if (status === "loading" && !isPreview) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Spin size="large" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Photo Upload App</h1>
          {effectiveSession && (
            <div className="flex items-center gap-4">
              <span className="text-gray-600">
                Welcome, {effectiveSession.user?.name}
              </span>
              <LogoutButton />
            </div>
          )}
        </div>

        {effectiveSession ? (
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Upload a Photo</h2>
              <PhotoUploadForm
                onUploadSuccess={() => setPhotoUpdateTrigger((prev) => prev + 1)}
              />
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">Photo Gallery</h2>
              <PhotoGrid onPhotoUpdate={photoUpdateTrigger} />
            </div>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <p className="text-gray-600 mb-4">Please log in to continue</p>
            <a
              href="/login"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Go to Login
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
