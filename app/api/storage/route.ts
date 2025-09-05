import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { STORAGE_LIMIT, type User, type StorageUsage } from "@/types";

export async function GET(_request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { db } = await connectToDatabase();

    // Get user's storage usage
    const user = await db.collection<User>("users").findOne({
      userId: session.user.id,
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const storageUsage: StorageUsage = {
      used: user.totalStorageUsed,
      total: STORAGE_LIMIT,
      percentage: Math.round((user.totalStorageUsed / STORAGE_LIMIT) * 100),
    };

    return NextResponse.json({ storage: storageUsage });
  } catch (error) {
    console.error("Storage usage error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
