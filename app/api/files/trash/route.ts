import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import type { FileDocument } from "@/types";

export async function GET(_request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { db } = await connectToDatabase();

    // Get all deleted files for the user, sorted by deletion date (newest first)
    const files = await db
      .collection<FileDocument>("files")
      .find({
        userId: session.user.id,
        deletedAt: { $exists: true }, // Only deleted files
      })
      .sort({ deletedAt: -1 })
      .toArray();

    return NextResponse.json({ files });
  } catch (error) {
    console.error("Trash files fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
