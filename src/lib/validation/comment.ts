const MAX_COMMENT_LENGTH = 500

export function validateComment(
  content: string
): { valid: boolean; error?: string } {
  if (!content || content.trim().length === 0) {
    return { valid: false, error: "Comment cannot be empty" }
  }

  if (content.length > MAX_COMMENT_LENGTH) {
    return {
      valid: false,
      error: `Comment cannot exceed ${MAX_COMMENT_LENGTH} characters`,
    }
  }

  return { valid: true }
}
