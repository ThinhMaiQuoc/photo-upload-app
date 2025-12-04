"use client"

import { useEffect, useState } from "react"
import { Avatar, Spin, Tabs, Empty } from "antd"
import { UserOutlined } from "@ant-design/icons"
import { useParams } from "next/navigation"
import Image from "next/image"
import { formatDistanceToNow } from "date-fns"
import { fetchWithError } from "@/lib/fetch-with-error"

type User = {
  id: string
  name: string | null
  email: string
  image: string | null
  _count: {
    photos: number
    comments: number
  }
}

type Photo = {
  id: string
  title: string | null
  filename: string
  createdAt: string
}

type Comment = {
  id: string
  content: string
  createdAt: string
  photo: {
    id: string
    title: string | null
    filename: string
  }
}

export default function ProfilePage() {
  const params = useParams()
  const userId = params.id as string

  const [user, setUser] = useState<User | null>(null)
  const [photos, setPhotos] = useState<Photo[]>([])
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await fetchWithError<{
          user: User & { photos: Photo[]; comments: Comment[] }
        }>(`/api/users/${userId}`, { showErrorMessage: false })
        setUser(data.user)
        setPhotos(data.user.photos)
        setComments(data.user.comments)
      } catch (error) {
        console.error("Error fetching user data:", error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [userId])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Spin size="large" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">User not found</h1>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center gap-4">
            {user.image ? (
              <Avatar size={80} src={user.image} />
            ) : (
              <Avatar size={80} icon={<UserOutlined />} />
            )}
            <div>
              <h1 className="text-3xl font-bold">{user.name || "Unknown User"}</h1>
              <p className="text-gray-600">{user.email}</p>
              <div className="flex gap-4 mt-2 text-sm text-gray-500">
                <span>{user._count.photos} photos</span>
                <span>{user._count.comments} comments</span>
              </div>
            </div>
          </div>
        </div>

        <Tabs
          defaultActiveKey="photos"
          items={[
            {
              key: "photos",
              label: `Photos (${user._count.photos})`,
              children: (
                <div>
                  {photos.length === 0 ? (
                    <Empty description="No photos uploaded yet" />
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {photos.map((photo) => (
                        <div
                          key={photo.id}
                          className="bg-white rounded-lg shadow overflow-hidden"
                        >
                          <div className="relative w-full h-48">
                            <Image
                              src={photo.filename}
                              alt={photo.title || "Photo"}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="p-3">
                            <h3 className="font-semibold truncate">
                              {photo.title || "Untitled"}
                            </h3>
                            <p className="text-xs text-gray-500">
                              {formatDistanceToNow(new Date(photo.createdAt), {
                                addSuffix: true,
                              })}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ),
            },
            {
              key: "comments",
              label: `Comments (${user._count.comments})`,
              children: (
                <div>
                  {comments.length === 0 ? (
                    <Empty description="No comments yet" />
                  ) : (
                    <div className="space-y-4">
                      {comments.map((comment) => (
                        <div
                          key={comment.id}
                          className="bg-white rounded-lg shadow p-4"
                        >
                          <div className="flex gap-3">
                            <div className="relative w-16 h-16 flex-shrink-0">
                              <Image
                                src={comment.photo.filename}
                                alt={comment.photo.title || "Photo"}
                                fill
                                className="object-cover rounded"
                              />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm text-gray-600 mb-1">
                                Commented on{" "}
                                <span className="font-semibold">
                                  {comment.photo.title || "Untitled"}
                                </span>
                              </p>
                              <p className="text-gray-800">{comment.content}</p>
                              <p className="text-xs text-gray-500 mt-2">
                                {formatDistanceToNow(new Date(comment.createdAt), {
                                  addSuffix: true,
                                })}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ),
            },
          ]}
        />
      </div>
    </div>
  )
}
