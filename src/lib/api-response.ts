import { NextResponse } from "next/server"

type ApiError = {
  error: string
  details?: string
}

type ApiSuccess<T> = {
  data?: T
  message?: string
}

export function apiError(
  message: string,
  status: number = 500,
  details?: string
): NextResponse<ApiError> {
  return NextResponse.json(
    {
      error: message,
      ...(details && { details }),
    },
    { status }
  )
}

export function apiSuccess<T>(
  data?: T,
  status: number = 200,
  message?: string
): NextResponse<ApiSuccess<T>> {
  return NextResponse.json(
    {
      ...(data && { data }),
      ...(message && { message }),
    },
    { status }
  )
}

export const API_ERRORS = {
  UNAUTHORIZED: "Unauthorized",
  FORBIDDEN: "Forbidden",
  NOT_FOUND: "Resource not found",
  BAD_REQUEST: "Bad request",
  INTERNAL_SERVER_ERROR: "Internal server error",
  VALIDATION_ERROR: "Validation error",
} as const
