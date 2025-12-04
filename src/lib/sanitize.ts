/**
 * Sanitizes user input to prevent XSS attacks
 * Removes potentially dangerous HTML tags and scripts
 */
export function sanitizeInput(input: string): string {
  if (!input) return ""

  // Remove script tags and their content
  let sanitized = input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")

  // Remove on* event handlers (onclick, onerror, etc.)
  sanitized = sanitized.replace(/\son\w+\s*=\s*["'][^"']*["']/gi, "")
  sanitized = sanitized.replace(/\son\w+\s*=\s*[^\s>]*/gi, "")

  // Remove javascript: protocol
  sanitized = sanitized.replace(/javascript:/gi, "")

  // Remove data: protocol (can be used for XSS)
  sanitized = sanitized.replace(/data:text\/html/gi, "")

  // Remove iframe tags
  sanitized = sanitized.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")

  // Remove object and embed tags
  sanitized = sanitized.replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, "")
  sanitized = sanitized.replace(/<embed\b[^<]*>/gi, "")

  return sanitized.trim()
}

/**
 * Escapes HTML special characters to prevent XSS
 * Use this when displaying user content as plain text
 */
export function escapeHtml(input: string): string {
  if (!input) return ""

  const htmlEscapes: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#x27;",
    "/": "&#x2F;",
  }

  return input.replace(/[&<>"'/]/g, (char) => htmlEscapes[char])
}

/**
 * Validates and sanitizes a URL to prevent XSS via URL schemes
 */
export function sanitizeUrl(url: string): string {
  if (!url) return ""

  const trimmedUrl = url.trim().toLowerCase()

  // Only allow http, https, and mailto protocols
  if (
    !trimmedUrl.startsWith("http://") &&
    !trimmedUrl.startsWith("https://") &&
    !trimmedUrl.startsWith("mailto:")
  ) {
    return ""
  }

  // Block javascript: and data: protocols
  if (trimmedUrl.startsWith("javascript:") || trimmedUrl.startsWith("data:")) {
    return ""
  }

  return url.trim()
}
