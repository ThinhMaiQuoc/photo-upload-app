"use client"

import { useState } from "react"
import { Upload, message } from "antd"
import { InboxOutlined } from "@ant-design/icons"
import type { UploadProps } from "antd"
import { validatePhoto } from "@/lib/validation/photo"

const { Dragger } = Upload

export default function PhotoUploadForm({
  onUploadSuccess,
}: {
  onUploadSuccess?: () => void
}) {
  const [uploading, setUploading] = useState(false)

  const uploadProps: UploadProps = {
    name: "photo",
    multiple: false,
    accept: "image/jpeg,image/jpg,image/png",
    beforeUpload: (file) => {
      const validation = validatePhoto(file)
      if (!validation.valid) {
        message.error(validation.error)
        return Upload.LIST_IGNORE
      }
      return true
    },
    onChange: async (info) => {
      const { status } = info.file
      if (status === "done") {
        message.success(`${info.file.name} uploaded successfully.`)
      } else if (status === "error") {
        message.error(`${info.file.name} upload failed.`)
      }
    },
    customRequest: async ({ file, onSuccess, onError }) => {
      setUploading(true)
      try {
        const formData = new FormData()
        formData.append("photo", file as File)

        const response = await fetch("/api/photos", {
          method: "POST",
          body: formData,
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || "Upload failed")
        }

        const data = await response.json()
        onSuccess?.(data)
        onUploadSuccess?.()
      } catch (error) {
        message.error(
          error instanceof Error ? error.message : "Upload failed"
        )
        onError?.(error as Error)
      } finally {
        setUploading(false)
      }
    },
  }

  return (
    <div className="w-full">
      <Dragger {...uploadProps} disabled={uploading}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">
          Click or drag file to this area to upload
        </p>
        <p className="ant-upload-hint">
          Support for JPEG, JPG, and PNG images. Maximum file size: 5MB.
        </p>
      </Dragger>
    </div>
  )
}
