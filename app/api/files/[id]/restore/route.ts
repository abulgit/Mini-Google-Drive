import { NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/services/mongodb";
import { validateCSRFToken, createCSRFError } from "@/lib/auth/csrf-middleware";
import {
  getAuthenticatedUser,
  validateRequest,
  createErrorResponse,
  createSuccessResponse,
} from "@/lib/api/api-helpers";
import { fileIdSchema } from "@/lib/utils/validations";
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

    const { db } = await connectToDatabase();

    const file = await db.collection<FileDocument>(COLLECTIONS.FILES).findOne({
      _id: new ObjectId(id),
      userId: user!.id,
      deletedAt: { $exists: true },
    });

    if (!file) {
      return createErrorResponse("File not found in trash", 404);
    }

    await db.collection<FileDocument>(COLLECTIONS.FILES).updateOne(
      { _id: new ObjectId(id) },
      {
        $unset: { deletedAt: "" },
      }
    );

    return createSuccessResponse({
      success: true,
      message: "File restored successfully",
    });
  } catch (error) {
    console.error("File restore error:", error);
    return createErrorResponse(ERROR_MESSAGES.RESTORE_FAILED, 500);
  }
}
