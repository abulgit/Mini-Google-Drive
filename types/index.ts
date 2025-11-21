import { ObjectId } from "mongodb";

// User interface for MongoDB users collection
export interface User {
  _id?: ObjectId;
  userId: string; // Google OAuth ID
  email: string;
  name: string;
  image?: string;
  totalStorageUsed: number; // in bytes
  createdAt: Date;
  updatedAt: Date;
}

// File interface for MongoDB files collection
export interface FileDocument {
  _id?: ObjectId;
  userId: string; // Reference to user's Google OAuth ID
  fileName: string;
  originalFileName: string; // Store original name for renaming conflicts
  fileSize: number; // in bytes
  fileType: string; // MIME type
  blobUrl: string; // Azure Blob Storage URL
  uploadedAt: Date;
  starred?: boolean; // Whether the file is starred by the user
  deletedAt?: Date; // When the file was moved to trash (soft delete)
}

export type ActivityAction =
  | "upload"
  | "view"
  | "download"
  | "rename"
  | "delete"
  | "restore";

export interface ActivityLog {
  _id?: ObjectId;
  userId: string;
  fileId: ObjectId;
  action: ActivityAction;
  fileName: string;
  metadata?: {
    oldName?: string;
    newName?: string;
  };
  timestamp: Date;
}

// File upload response type
export interface FileUploadResponse {
  success: boolean;
  file?: FileDocument;
  error?: string;
}

// Storage usage type
export interface StorageUsage {
  used: number; // bytes used
  total: number; // total allowed (5GB)
  percentage: number; // used percentage
}

// Constants
export const STORAGE_LIMIT = 5 * 1024 * 1024 * 1024; // 5GB in bytes

// Allowed file types
export const ALLOWED_EXTENSIONS = [
  ".pdf",
  ".doc",
  ".docx",
  ".txt",
  ".rtf",
  ".xls",
  ".xlsx",
  ".csv",
  ".ppt",
  ".pptx",
  ".jpg",
  ".jpeg",
  ".png",
  ".gif",
  ".webp",
  ".svg",
  ".mp3",
  ".wav",
  ".m4a",
  ".mp4",
  ".avi",
  ".mov",
  ".mkv",
  ".zip",
  ".rar",
  ".7z",
];

export const ALLOWED_MIME_TYPES = [
  // Documents
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
  "application/rtf",

  // Spreadsheets
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "text/csv",

  // Presentations
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",

  // Images
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",

  // Audio
  "audio/mpeg",
  "audio/wav",
  "audio/mp4",

  // Video
  "video/mp4",
  "video/x-msvideo",
  "video/quicktime",
  "video/x-matroska",

  // Archives
  "application/zip",
  "application/x-rar-compressed",
  "application/x-7z-compressed",
];

// File type validation function
export function validateFileType(file: File): string | null {
  const fileExtension = file.name
    .toLowerCase()
    .substring(file.name.lastIndexOf("."));

  if (!ALLOWED_EXTENSIONS.includes(fileExtension)) {
    return `File type "${fileExtension}" not allowed. Supported formats: ${ALLOWED_EXTENSIONS.join(", ")}`;
  }

  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return `File type not recognized. Please ensure the file is not corrupted.`;
  }

  return null;
}
