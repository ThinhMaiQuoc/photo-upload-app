import { message } from "antd"

type FetchOptions = RequestInit & {
  showErrorMessage?: boolean
}

class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public details?: string
  ) {
    super(message)
    this.name = "ApiError"
  }
}

export async function fetchWithError<T>(
  url: string,
  options: FetchOptions = {}
): Promise<T> {
  const { showErrorMessage = true, ...fetchOptions } = options

  try {
    const response = await fetch(url, fetchOptions)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        error: "An unexpected error occurred",
      }))

      const errorMessage = errorData.error || "Request failed"
      const errorDetails = errorData.details

      if (showErrorMessage) {
        message.error(errorMessage)
      }

      throw new ApiError(response.status, errorMessage, errorDetails)
    }

    return await response.json()
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }

    // Network errors or other unexpected errors
    const errorMessage =
      error instanceof Error ? error.message : "Network error occurred"

    if (showErrorMessage) {
      message.error(errorMessage)
    }

    throw new ApiError(0, errorMessage)
  }
}
