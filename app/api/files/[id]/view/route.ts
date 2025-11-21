import { NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/services/mongodb";
import { generateViewUrl } from "@/lib/services/azure-storage";
import { logActivity } from "@/lib/services/activity-logger";
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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
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
    });

    if (!file) {
      return createErrorResponse(ERROR_MESSAGES.FILE_NOT_FOUND, 404);
    }

    const viewUrl = await generateViewUrl(user!.id, file.fileName);

    await logActivity({
      userId: user!.id,
      fileId: file._id!,
      action: "view",
      fileName: file.originalFileName,
    });

    return createSuccessResponse({ viewUrl });
  } catch (error) {
    console.error("View error:", error);
    return createErrorResponse("Failed to generate view URL", 500);
  }
}
