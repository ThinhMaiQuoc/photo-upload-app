const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_FILE_TYPES = ["image/jpeg", "image/jpg", "image/png"]

export function validatePhoto(file: File): { valid: boolean; error?: string } {
  if (!file) {
    return { valid: false, error: "No file provided" }
  }

  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: "Invalid file type. Only JPEG, JPG, and PNG are allowed.",
    }
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: "File size exceeds 5MB limit.",
    }
  }

  return { valid: true }
}

export function validatePhotoServer(
  file: File
): { valid: boolean; error?: string } {
  return validatePhoto(file)
}
