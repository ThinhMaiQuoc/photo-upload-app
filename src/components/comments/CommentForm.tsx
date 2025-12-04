"use client"

import { useState } from "react"
import { Input, Button, message } from "antd"
import { fetchWithError } from "@/lib/fetch-with-error"

const { TextArea } = Input

export default function CommentForm({
  photoId,
  onCommentAdded,
}: {
  photoId: string
  onCommentAdded?: () => void
}) {
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!content.trim()) {
      message.error("Comment cannot be empty")
      return
    }

    if (content.length > 500) {
      message.error("Comment cannot exceed 500 characters")
      return
    }

    setLoading(true)
    try {
      await fetchWithError(`/api/photos/${photoId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
        showErrorMessage: true,
      })

      message.success("Comment added successfully")
      setContent("")
      onCommentAdded?.()
    } catch (error) {
      console.error("Error adding comment:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-2">
      <TextArea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write a comment..."
        rows={3}
        maxLength={500}
        showCount
      />
      <Button type="primary" onClick={handleSubmit} loading={loading}>
        Add Comment
      </Button>
    </div>
  )
}
