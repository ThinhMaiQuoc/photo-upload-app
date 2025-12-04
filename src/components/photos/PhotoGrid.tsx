"use client"

import { useEffect, useState } from "react"
import { Row, Col, Spin, Empty } from "antd"
import PhotoCard from "./PhotoCard"
import { fetchWithError } from "@/lib/fetch-with-error"

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

export default function PhotoGrid({
  onPhotoUpdate,
}: {
  onPhotoUpdate?: number
}) {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [loading, setLoading] = useState(true)

  const fetchPhotos = async () => {
    try {
      const data = await fetchWithError<{ photos: Photo[] }>(
        "/api/photos",
        { showErrorMessage: false }
      )
      setPhotos(data.photos)
    } catch (error) {
      console.error("Error fetching photos:", error)
      setPhotos([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPhotos()
  }, [onPhotoUpdate])

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Spin size="large" />
      </div>
    )
  }

  if (photos.length === 0) {
    return <Empty description="No photos yet. Upload one to get started!" />
  }

  return (
    <Row gutter={[16, 16]}>
      {photos.map((photo) => (
        <Col xs={24} sm={12} md={8} lg={6} key={photo.id}>
          <PhotoCard photo={photo} onCommentAdded={fetchPhotos} />
        </Col>
      ))}
    </Row>
  )
}
