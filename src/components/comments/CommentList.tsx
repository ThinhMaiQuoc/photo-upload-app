"use client"

import { useEffect, useState } from "react"
import { Avatar, Spin, Empty } from "antd"
import { UserOutlined } from "@ant-design/icons"
import { formatDistanceToNow } from "date-fns"

type Comment = {
  id: string
  content: string
  createdAt: string
  user: {
    id: string
    name: string | null
    image: string | null
  }
}

export default function CommentList({ photoId }: { photoId: string }) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`/api/photos/${photoId}`)
        const data = await response.json()
        setComments(data.photo.comments)
      } catch (error) {
        console.error("Error fetching comments:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchComments()
  }, [photoId])

  if (loading) {
    return (
      <div className="flex justify-center py-4">
        <Spin />
      </div>
    )
  }

  if (comments.length === 0) {
    return <Empty description="No comments yet. Be the first to comment!" />
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <div key={comment.id} className="flex gap-3 pb-4 border-b last:border-b-0">
          <div className="flex-shrink-0">
            {comment.user.image ? (
              <Avatar src={comment.user.image} />
            ) : (
              <Avatar icon={<UserOutlined />} />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-sm">
              {comment.user.name || "Unknown User"}
            </div>
            <div className="text-gray-700 mt-1">{comment.content}</div>
            <div className="text-gray-400 text-xs mt-1">
              {formatDistanceToNow(new Date(comment.createdAt), {
                addSuffix: true,
              })}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
