import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import LogoutButton from "@/components/auth/LogoutButton"
import PhotoUploadForm from "@/components/photos/PhotoUploadForm"

const isPreview = process.env.VERCEL_ENV === "preview"

export default async function Home() {
  const session = isPreview
    ? {
        user: {
          id: "preview-user",
          name: "Preview User",
          email: "preview@example.com",
          image: null,
        },
      }
    : await getServerSession(authOptions)

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Photo Upload App</h1>
          {session && (
            <div className="flex items-center gap-4">
              <span className="text-gray-600">
                Welcome, {session.user?.name}
              </span>
              <LogoutButton />
            </div>
          )}
        </div>

        {session ? (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Upload a Photo</h2>
              <PhotoUploadForm />
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
