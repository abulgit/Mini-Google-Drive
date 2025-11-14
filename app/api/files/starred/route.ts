import { NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import {
  getAuthenticatedUser,
  createErrorResponse,
  createSuccessResponse,
} from "@/lib/api-helpers";
import { COLLECTIONS, ERROR_MESSAGES } from "@/lib/constants";
import type { FileDocument } from "@/types";

export async function GET(request: NextRequest) {
  try {
    const { error, user } = await getAuthenticatedUser(request);
    if (error) {
      return error;
    }

    const { db } = await connectToDatabase();

    const files = await db
      .collection<FileDocument>(COLLECTIONS.FILES)
      .find({
        userId: user!.id,
        starred: true,
        deletedAt: { $exists: false },
      })
      .sort({ uploadedAt: -1 })
      .toArray();

    return createSuccessResponse({ files });
  } catch (error) {
    console.error("Starred files fetch error:", error);
    return createErrorResponse(ERROR_MESSAGES.INTERNAL_ERROR, 500);
  }
}
