import { NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { validateCSRFToken, createCSRFError } from "@/lib/csrf-middleware";
import { generatePresignedUploadUrl } from "@/lib/azure-storage";
import {
  getAuthenticatedUser,
  validateRequest,
  createErrorResponse,
  createSuccessResponse,
  parseRequestBody,
} from "@/lib/api-helpers";
import { COLLECTIONS, ERROR_MESSAGES } from "@/lib/constants";
import { z } from "zod";
import {
  STORAGE_LIMIT,
  ALLOWED_EXTENSIONS,
  ALLOWED_MIME_TYPES,
  type User,
} from "@/types";

const presignedUrlSchema = z
  .object({
    fileName: z
      .string()
      .min(1, "File name is required")
      .max(255, "File name too long"),
    fileSize: z
      .number()
      .positive("File size must be positive")
      .max(
        STORAGE_LIMIT,
        `File size exceeds maximum limit of ${STORAGE_LIMIT / (1024 * 1024 * 1024)}GB`
      ),
    fileType: z.string().min(1, "File type is required"),
  })
  .refine(
    data => {
      const fileExtension = data.fileName
        .toLowerCase()
        .substring(data.fileName.lastIndexOf("."));
      return ALLOWED_EXTENSIONS.includes(fileExtension);
    },
    {
      message: "File type not allowed",
      path: ["fileName"],
    }
  )
  .refine(data => ALLOWED_MIME_TYPES.includes(data.fileType), {
    message: "File MIME type not allowed",
    path: ["fileType"],
  })
  .refine(data => !/[<>:"/\\|?*]/.test(data.fileName), {
    message: "File name contains invalid characters",
    path: ["fileName"],
  });

function sanitizeFileName(fileName: string): string {
  return fileName
    .replace(/[<>:"/\\|?*]/g, "_")
    .replace(/\s+/g, "_")
    .substring(0, 255);
}

export async function POST(request: NextRequest) {
  try {
    if (!validateCSRFToken(request)) {
      return createCSRFError();
    }

    const { error, user } = await getAuthenticatedUser(request);
    if (error) {
      return error;
    }

    const body = await parseRequestBody(request);
    if (!body) {
      return createErrorResponse(ERROR_MESSAGES.INVALID_REQUEST, 400);
    }

    const validation = await validateRequest(presignedUrlSchema, body);
    if (!validation.success) {
      return createErrorResponse(validation.error, 400);
    }

    const { fileName, fileSize, fileType } = validation.data;

    const { db } = await connectToDatabase();

    const userData = await db.collection<User>(COLLECTIONS.USERS).findOne({
      userId: user!.id,
    });

    if (!userData) {
      return createErrorResponse("User not found", 404);
    }

    if (userData.totalStorageUsed + fileSize > STORAGE_LIMIT) {
      return createErrorResponse(
        `Storage limit exceeded. You have ${((STORAGE_LIMIT - userData.totalStorageUsed) / (1024 * 1024)).toFixed(2)}MB remaining.`,
        413
      );
    }

    const timestamp = Date.now();
    const sanitizedFileName = sanitizeFileName(fileName);
    const uniqueFileName = `${timestamp}_${sanitizedFileName}`;

    const { uploadUrl, blobPath } = await generatePresignedUploadUrl(
      user!.id,
      uniqueFileName,
      fileType,
      10
    );

    return createSuccessResponse({
      uploadUrl,
      blobPath,
      uniqueFileName,
      expiresIn: 600,
    });
  } catch (error) {
    console.error("Error generating presigned URL:", error);
    return createErrorResponse("Failed to generate upload URL", 500);
  }
}
