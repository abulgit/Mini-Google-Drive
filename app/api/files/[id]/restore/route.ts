import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { validateCSRFToken, createCSRFError } from "@/lib/csrf-middleware";
import { ObjectId } from "mongodb";
import type { FileDocument } from "@/types";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Validate CSRF token first
    if (!validateCSRFToken(request)) {
      return createCSRFError();
    }

    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { db } = await connectToDatabase();

    // Find the deleted file and verify ownership
    const file = await db.collection<FileDocument>("files").findOne({
      _id: new ObjectId(id),
      userId: session.user.id,
      deletedAt: { $exists: true }, // Only restore deleted files
    });

    if (!file) {
      return NextResponse.json(
        { error: "File not found in trash" },
        { status: 404 }
      );
    }

    // Restore file: Remove deletedAt field
    await db.collection<FileDocument>("files").updateOne(
      { _id: new ObjectId(id) },
      {
        $unset: { deletedAt: "" },
      }
    );

    return NextResponse.json({
      success: true,
      message: "File restored successfully",
    });
  } catch (error) {
    console.error("File restore error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
