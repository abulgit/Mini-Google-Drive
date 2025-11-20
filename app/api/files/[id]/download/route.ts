import { NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/services/mongodb";
import { generateDownloadUrl } from "@/lib/services/azure-storage";
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

    const downloadUrl = await generateDownloadUrl(user!.id, file.fileName);

    return createSuccessResponse({ downloadUrl });
  } catch (error) {
    console.error("Download error:", error);
    return createErrorResponse(ERROR_MESSAGES.DOWNLOAD_FAILED, 500);
  }
}
