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

    // Get all starred files for the user, sorted by upload date (newest first)
    const files = await db
      .collection<FileDocument>("files")
      .find({
        userId: session.user.id,
        starred: true,
      })
      .sort({ uploadedAt: -1 })
      .toArray();

    return NextResponse.json({ files });
  } catch (error) {
    console.error("Starred files fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
