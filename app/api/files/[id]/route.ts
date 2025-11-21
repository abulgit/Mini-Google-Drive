import { NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/services/mongodb";
import { validateCSRFToken, createCSRFError } from "@/lib/auth/csrf-middleware";
import { logActivity } from "@/lib/services/activity-logger";
import {
  getAuthenticatedUser,
  validateRequest,
  createErrorResponse,
  createSuccessResponse,
  parseRequestBody,
} from "@/lib/api/api-helpers";
import { fileUpdateSchema, fileIdSchema } from "@/lib/utils/validations";
import { COLLECTIONS, ERROR_MESSAGES } from "@/lib/config/constants";
import { ObjectId } from "mongodb";
import type { FileDocument } from "@/types";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!validateCSRFToken(request)) {
      return createCSRFError();
    }

    const { error, user } = await getAuthenticatedUser(request);
    if (error) {
      return error;
    }

    const { id } = await params;

    const idValidation = await validateRequest(fileIdSchema, { id });
    if (!idValidation.success) {
      return createErrorResponse(idValidation.error, 400);
    }

    const body = await parseRequestBody(request);
    if (!body) {
      return createErrorResponse(ERROR_MESSAGES.INVALID_REQUEST, 400);
    }

    const validation = await validateRequest(fileUpdateSchema, body);
    if (!validation.success) {
      return createErrorResponse(validation.error, 400);
    }

    const { db } = await connectToDatabase();

    const file = await db.collection<FileDocument>(COLLECTIONS.FILES).findOne({
      _id: new ObjectId(id),
      userId: user!.id,
    });

    if (!file) {
      return createErrorResponse(ERROR_MESSAGES.FILE_NOT_FOUND, 404);
    }

    await db.collection<FileDocument>(COLLECTIONS.FILES).updateOne(
      {
        _id: new ObjectId(id),
        userId: user!.id,
      },
      {
        $set: validation.data,
      }
    );

    if (
      validation.data.originalFileName &&
      validation.data.originalFileName !== file.originalFileName
    ) {
      await logActivity({
        userId: user!.id,
        fileId: file._id!,
        action: "rename",
        fileName: validation.data.originalFileName,
        metadata: {
          oldName: file.originalFileName,
          newName: validation.data.originalFileName,
        },
      });
    }

    return createSuccessResponse({ success: true, ...validation.data });
  } catch (error) {
    console.error("File update error:", error);
    return createErrorResponse(ERROR_MESSAGES.INTERNAL_ERROR, 500);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!validateCSRFToken(request)) {
      return createCSRFError();
    }

    const { error, user } = await getAuthenticatedUser(request);
    if (error) {
      return error;
    }

    const { id } = await params;

    const idValidation = await validateRequest(fileIdSchema, { id });
    if (!idValidation.success) {
      return createErrorResponse(idValidation.error, 400);
    }

    const { db } = await connectToDatabase();

    const file = await db.collection<FileDocument>(COLLECTIONS.FILES).findOne({
      _id: new ObjectId(id),
      userId: user!.id,
      deletedAt: { $exists: false },
    });

    if (!file) {
      return createErrorResponse(ERROR_MESSAGES.FILE_NOT_FOUND, 404);
    }

    await db.collection<FileDocument>(COLLECTIONS.FILES).updateOne(
      { _id: new ObjectId(id) },
      {
        $set: { deletedAt: new Date() },
      }
    );

    await logActivity({
      userId: user!.id,
      fileId: file._id!,
      action: "delete",
      fileName: file.originalFileName,
    });

    return createSuccessResponse({
      success: true,
      message: "File moved to trash",
    });
  } catch (error) {
    console.error("Soft delete error:", error);
    return createErrorResponse(ERROR_MESSAGES.INTERNAL_ERROR, 500);
  }
}
