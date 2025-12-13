import { NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/services/mongodb";
import {
  getAuthenticatedUser,
  createErrorResponse,
  createSuccessResponse,
} from "@/lib/api/api-helpers";
import { COLLECTIONS, ERROR_MESSAGES } from "@/lib/config/constants";
import type { FileDocument } from "@/types";

const SEARCH_LIMIT = 8;

export async function GET(request: NextRequest) {
  try {
    const { error, user } = await getAuthenticatedUser(request);
    if (error) {
      return error;
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q")?.trim();

    if (!query || query.length < 2) {
      return createSuccessResponse({ files: [] });
    }

    const { db } = await connectToDatabase();

    // Escape special regex characters for safety
    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const files = await db
      .collection<FileDocument>(COLLECTIONS.FILES)
      .find({
        userId: user!.id,
        deletedAt: { $exists: false },
        originalFileName: { $regex: escapedQuery, $options: "i" },
      })
      .sort({ uploadedAt: -1 })
      .limit(SEARCH_LIMIT)
      .project({
        _id: 1,
        originalFileName: 1,
        fileType: 1,
        fileSize: 1,
        uploadedAt: 1,
      })
      .toArray();

    return createSuccessResponse({ files });
  } catch (error) {
    console.error("Search error:", error);
    return createErrorResponse(ERROR_MESSAGES.INTERNAL_ERROR, 500);
  }
}
