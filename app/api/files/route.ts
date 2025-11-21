import { NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/services/mongodb";
import {
  getAuthenticatedUser,
  createErrorResponse,
  createSuccessResponse,
} from "@/lib/api/api-helpers";
import { COLLECTIONS, ERROR_MESSAGES } from "@/lib/config/constants";
import type { FileDocument } from "@/types";

export async function GET(request: NextRequest) {
  try {
    const { error, user } = await getAuthenticatedUser(request);
    if (error) {
      return error;
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "18", 10);
    const skip = (page - 1) * limit;

    const { db } = await connectToDatabase();

    const query = {
      userId: user!.id,
      deletedAt: { $exists: false },
    };

    const [files, totalCount] = await Promise.all([
      db
        .collection<FileDocument>(COLLECTIONS.FILES)
        .find(query)
        .sort({ uploadedAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
      db.collection<FileDocument>(COLLECTIONS.FILES).countDocuments(query),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return createSuccessResponse({
      files,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        limit,
      },
    });
  } catch (error) {
    console.error("Files fetch error:", error);
    return createErrorResponse(ERROR_MESSAGES.INTERNAL_ERROR, 500);
  }
}
