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

    const { db } = await connectToDatabase();

    const recentFiles = await db
      .collection(COLLECTIONS.ACTIVITIES)
      .aggregate([
        {
          $match: {
            userId: user!.id,
            action: { $in: ["upload", "view", "rename"] },
          },
        },
        {
          $sort: { timestamp: -1 },
        },
        {
          $group: {
            _id: "$fileId",
            lastActivity: { $first: "$timestamp" },
          },
        },
        {
          $sort: { lastActivity: -1 },
        },
        {
          $lookup: {
            from: COLLECTIONS.FILES,
            localField: "_id",
            foreignField: "_id",
            as: "file",
          },
        },
        {
          $unwind: "$file",
        },
        {
          $match: {
            "file.deletedAt": { $exists: false },
          },
        },
        {
          $replaceRoot: { newRoot: "$file" },
        },
        {
          $limit: 20,
        },
      ])
      .toArray();

    const files = recentFiles as FileDocument[];

    return createSuccessResponse({ files });
  } catch (error) {
    console.error("Recent files fetch error:", error);
    return createErrorResponse(ERROR_MESSAGES.INTERNAL_ERROR, 500);
  }
}
