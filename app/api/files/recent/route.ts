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
    const limit = parseInt(searchParams.get("limit") || "12", 10);
    const skip = (page - 1) * limit;

    const { db } = await connectToDatabase();

    const basePipeline = [
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
    ];

    const [recentFiles, countResult] = await Promise.all([
      db
        .collection(COLLECTIONS.ACTIVITIES)
        .aggregate([...basePipeline, { $skip: skip }, { $limit: limit }])
        .toArray(),
      db
        .collection(COLLECTIONS.ACTIVITIES)
        .aggregate([...basePipeline, { $count: "total" }])
        .toArray(),
    ]);

    const files = recentFiles as FileDocument[];
    const totalCount = countResult[0]?.total || 0;
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
    console.error("Recent files fetch error:", error);
    return createErrorResponse(ERROR_MESSAGES.INTERNAL_ERROR, 500);
  }
}
