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

    const { db } = await connectToDatabase();

    const activities = await db
      .collection<ActivityLog>(COLLECTIONS.ACTIVITIES)
      .find({ userId: user!.id })
      .sort({ timestamp: -1 })
      .limit(100)
      .toArray();

    return createSuccessResponse({ activities });
  } catch (error) {
    console.error("Activity fetch error:", error);
    return createErrorResponse(ERROR_MESSAGES.INTERNAL_ERROR, 500);
  }
}
