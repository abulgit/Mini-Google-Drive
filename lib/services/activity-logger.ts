import { ObjectId } from "mongodb";
import { connectToDatabase } from "./mongodb";
import { ActivityAction, ActivityLog } from "@/types";
import { COLLECTIONS } from "@/lib/config/constants";

interface LogActivityParams {
  userId: string;
  fileId: string | ObjectId;
  action: ActivityAction;
  fileName: string;
  metadata?: {
    oldName?: string;
    newName?: string;
  };
}

export async function logActivity(params: LogActivityParams): Promise<void> {
  try {
    const { db } = await connectToDatabase();

    const activityLog: ActivityLog = {
      userId: params.userId,
      fileId:
        typeof params.fileId === "string"
          ? new ObjectId(params.fileId)
          : params.fileId,
      action: params.action,
      fileName: params.fileName,
      metadata: params.metadata,
      timestamp: new Date(),
    };

    await db.collection(COLLECTIONS.ACTIVITIES).insertOne(activityLog);
  } catch (error) {
    console.error("Failed to log activity:", error);
  }
}
