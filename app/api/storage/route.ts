import { NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/services/mongodb";
import {
  getAuthenticatedUser,
  createErrorResponse,
  createSuccessResponse,
} from "@/lib/api/api-helpers";
import { COLLECTIONS, ERROR_MESSAGES } from "@/lib/config/constants";
import { STORAGE_LIMIT, type User, type StorageUsage } from "@/types";

export async function GET(request: NextRequest) {
  try {
    const { error, user } = await getAuthenticatedUser(request);
    if (error) {
      return error;
    }

    const { db } = await connectToDatabase();

    const userData = await db.collection<User>(COLLECTIONS.USERS).findOne({
      userId: user!.id,
    });

    if (!userData) {
      return createErrorResponse("User not found", 404);
    }

    const storageUsage: StorageUsage = {
      used: userData.totalStorageUsed,
      total: STORAGE_LIMIT,
      percentage: Math.round((userData.totalStorageUsed / STORAGE_LIMIT) * 100),
    };

    return createSuccessResponse({ storage: storageUsage });
  } catch (error) {
    console.error("Storage usage error:", error);
    return createErrorResponse(ERROR_MESSAGES.INTERNAL_ERROR, 500);
  }
}
