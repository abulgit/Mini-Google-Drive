import { NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/services/mongodb";
import { validateCSRFToken, createCSRFError } from "@/lib/auth/csrf-middleware";
import {
  verifyBlobExists,
  getBlobProperties,
} from "@/lib/services/azure-storage";
import {
  getAuthenticatedUser,
  validateRequest,
  createErrorResponse,
  createSuccessResponse,
  parseRequestBody,
} from "@/lib/api/api-helpers";
import { COLLECTIONS, ERROR_MESSAGES } from "@/lib/config/constants";
import { z } from "zod";
import { type FileDocument, type User } from "@/types";

const completeUploadSchema = z.object({
  blobPath: z.string().min(1, "Blob path is required"),
  originalFileName: z
    .string()
    .min(1, "Original file name is required")
    .max(255, "File name too long"),
});

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

    const validation = await validateRequest(completeUploadSchema, body);
    if (!validation.success) {
      return createErrorResponse(validation.error, 400);
    }

    const { blobPath, originalFileName } = validation.data;

    if (!blobPath.startsWith(`${user!.id}/`)) {
      return createErrorResponse("Invalid blob path: unauthorized access", 403);
    }

    const blobExists = await verifyBlobExists(blobPath);
    if (!blobExists) {
      return createErrorResponse(
        "File not found in storage. Upload may have failed.",
        404
      );
    }

    const blobProperties = await getBlobProperties(blobPath);
    if (!blobProperties) {
      return createErrorResponse("Failed to retrieve file properties", 500);
    }

    const { db } = await connectToDatabase();

    const existingFile = await db
      .collection<FileDocument>(COLLECTIONS.FILES)
      .findOne({
        userId: user!.id,
        blobUrl: { $regex: blobPath },
      });

    if (existingFile) {
      return createErrorResponse("File already exists in database", 409);
    }

    const userData = await db.collection<User>(COLLECTIONS.USERS).findOne({
      userId: user!.id,
    });

    if (!userData) {
      return createErrorResponse("User not found", 404);
    }

    const fileName = blobPath.split("/").pop() || originalFileName;

    const fileDocument: Omit<FileDocument, "_id"> = {
      userId: user!.id,
      fileName,
      originalFileName,
      fileSize: blobProperties.size,
      fileType: blobProperties.contentType,
      blobUrl: blobProperties.url,
      uploadedAt: new Date(),
    };

    const result = await db
      .collection<FileDocument>(COLLECTIONS.FILES)
      .insertOne(fileDocument);

    await db.collection<User>(COLLECTIONS.USERS).updateOne(
      { userId: user!.id },
      {
        $inc: { totalStorageUsed: blobProperties.size },
        $set: { updatedAt: new Date() },
      }
    );

    return createSuccessResponse({
      success: true,
      file: { ...fileDocument, _id: result.insertedId },
    });
  } catch (error) {
    console.error("Error completing upload:", error);
    return createErrorResponse(ERROR_MESSAGES.UPLOAD_FAILED, 500);
  }
}
