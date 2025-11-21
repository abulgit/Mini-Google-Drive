export const COLLECTIONS = {
  USERS: "users",
  FILES: "files",
  ACTIVITIES: "activities",
} as const;

export const ERROR_MESSAGES = {
  UNAUTHORIZED: "Unauthorized",
  NOT_FOUND: "File not found",
  INTERNAL_ERROR: "Internal server error",
  INVALID_REQUEST: "Invalid request",
  CSRF_ERROR: "Invalid or missing CSRF token",
  FILE_NOT_FOUND: "File not found",
  UPLOAD_FAILED: "Failed to upload file",
  DOWNLOAD_FAILED: "Failed to download file",
  DELETE_FAILED: "Failed to delete file",
  RESTORE_FAILED: "Failed to restore file",
  STAR_FAILED: "Failed to update star status",
  RENAME_FAILED: "Failed to rename file",
} as const;

export const SUCCESS_MESSAGES = {
  FILE_UPLOADED: "File uploaded successfully!",
  FILE_DELETED: "File moved to trash",
  FILE_RESTORED: "File restored successfully",
  FILE_STARRED: "File starred",
  FILE_UNSTARRED: "File unstarred",
  FILE_PERMANENTLY_DELETED: "File permanently deleted",
  FILE_RENAMED: "File renamed successfully",
} as const;

export const DATABASE_NAME = "simpledrive";
