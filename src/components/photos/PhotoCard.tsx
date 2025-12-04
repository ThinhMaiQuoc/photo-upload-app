"use client"

import { useState } from "react"
import { Card, Avatar, Modal } from "antd"
import { CommentOutlined, UserOutlined } from "@ant-design/icons"
import Image from "next/image"
import CommentList from "../comments/CommentList"
import CommentForm from "../comments/CommentForm"

const { Meta } = Card

type Photo = {
  id: string
  title: string | null
  filename: string
  createdAt: string
  uploadedBy: {
    id: string
    name: string | null
    image: string | null
  }
  _count: {
    comments: number
  }
}

export default function PhotoCard({
  photo,
  onCommentAdded,
}: {
  photo: Photo
  onCommentAdded?: () => void
}) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [commentRefreshKey, setCommentRefreshKey] = useState(0)

  return (
    <>
      <Card
        hoverable
        cover={
          <div className="relative w-full h-48">
            <Image
              src={photo.filename}
              alt={photo.title || "Photo"}
              fill
              className="object-cover"
            />
          </div>
        }
        onClick={() => setIsModalOpen(true)}
      >
        <Meta
          avatar={
            photo.uploadedBy.image ? (
              <Avatar src={photo.uploadedBy.image} />
            ) : (
              <Avatar icon={<UserOutlined />} />
            )
          }
          title={photo.title || "Untitled"}
          description={photo.uploadedBy.name || "Unknown"}
        />
        <div className="mt-2 text-gray-500 text-sm">
          <CommentOutlined /> {photo._count.comments} comments
        </div>
      </Card>

      <Modal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={800}
      >
        <div className="space-y-4">
          <div className="relative w-full h-96">
            <Image
              src={photo.filename}
              alt={photo.title || "Photo"}
              fill
              className="object-contain"
            />
          </div>
          <Meta
            avatar={
              photo.uploadedBy.image ? (
                <Avatar src={photo.uploadedBy.image} />
              ) : (
                <Avatar icon={<UserOutlined />} />
              )
            }
            title={photo.title || "Untitled"}
            description={`By ${photo.uploadedBy.name || "Unknown"}`}
          />
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold mb-4">Comments</h3>
            <CommentList key={commentRefreshKey} photoId={photo.id} />
            <div className="mt-4">
              <CommentForm
                photoId={photo.id}
                onCommentAdded={() => {
                  setCommentRefreshKey((prev) => prev + 1)
                  onCommentAdded?.()
                }}
              />
            </div>
          </div>
        </div>
      </Modal>
    </>
  )
}
