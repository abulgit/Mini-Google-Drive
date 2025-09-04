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
