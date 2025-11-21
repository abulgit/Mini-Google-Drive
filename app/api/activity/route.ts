import { NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/services/mongodb";
import {
  getAuthenticatedUser,
  createErrorResponse,
  createSuccessResponse,
} from "@/lib/api/api-helpers";
import { COLLECTIONS, ERROR_MESSAGES } from "@/lib/config/constants";
import type { ActivityLog } from "@/types";

export async function GET(request: NextRequest) {
  try {
    const { error, user } = await getAuthenticatedUser(request);
    if (error) {
      return error;
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "7", 10);
    const skip = (page - 1) * limit;

    const { db } = await connectToDatabase();

    const query = { userId: user!.id };

    const [activities, totalCount] = await Promise.all([
      db
        .collection<ActivityLog>(COLLECTIONS.ACTIVITIES)
        .find(query)
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
      db.collection<ActivityLog>(COLLECTIONS.ACTIVITIES).countDocuments(query),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return createSuccessResponse({
      activities,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        limit,
      },
    });
  } catch (error) {
    console.error("Activity fetch error:", error);
    return createErrorResponse(ERROR_MESSAGES.INTERNAL_ERROR, 500);
  }
}
