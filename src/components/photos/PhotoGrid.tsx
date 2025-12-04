"use client"

import { Row, Col, Spin, Empty } from "antd"
import { useQuery } from "@tanstack/react-query"
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
  const {
    data,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["photos", onPhotoUpdate],
    queryFn: async () => {
      const result = await fetchWithError<{ photos: Photo[] }>(
        "/api/photos",
        { showErrorMessage: false }
      )
      return result.photos
    },
    refetchInterval: 5000, // Poll every 5 seconds
    staleTime: 4000, // Consider data stale after 4 seconds
  })

  const photos = data || []

  if (isLoading) {
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
          <PhotoCard photo={photo} onCommentAdded={() => refetch()} />
        </Col>
      ))}
    </Row>
  )
}
