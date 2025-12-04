"use client"

import { Avatar, Spin, Empty } from "antd"
import { UserOutlined } from "@ant-design/icons"
import { formatDistanceToNow } from "date-fns"
import { useQuery } from "@tanstack/react-query"
import { fetchWithError } from "@/lib/fetch-with-error"

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
  const { data, isLoading } = useQuery({
    queryKey: ["comments", photoId],
    queryFn: async () => {
      const result = await fetchWithError<{
        photo: { comments: Comment[] }
      }>(`/api/photos/${photoId}`, { showErrorMessage: false })
      return result.photo.comments
    },
    refetchInterval: 5000, // Poll every 5 seconds
    staleTime: 4000, // Consider data stale after 4 seconds
  })

  const comments = data || []

  if (isLoading) {
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
            <a
              href={`/profile/${comment.user.id}`}
              className="font-semibold text-sm hover:text-blue-600 hover:underline"
            >
              {comment.user.name || "Unknown User"}
            </a>
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
