import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import type { FileDocument } from "@/types";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { db } = await connectToDatabase();

    // Get all files for the user, sorted by upload date (newest first)
    const files = await db
      .collection<FileDocument>("files")
      .find({ userId: session.user.id })
      .sort({ uploadedAt: -1 })
      .toArray();

    return NextResponse.json({ files });
  } catch (error) {
    console.error("Files fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
