import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { deleteFileFromBlob } from "@/lib/azure-storage";
import { validateCSRFToken, createCSRFError } from "@/lib/csrf-middleware";
import { ObjectId } from "mongodb";
import type { FileDocument, User } from "@/types";

export async function DELETE(
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
      deletedAt: { $exists: true }, // Only permanently delete files in trash
    });

    if (!file) {
      return NextResponse.json(
        { error: "File not found in trash" },
        { status: 404 }
      );
    }

    // Delete from Azure Blob Storage
    await deleteFileFromBlob(session.user.id, file.fileName);

    // Delete from MongoDB permanently
    await db.collection<FileDocument>("files").deleteOne({
      _id: new ObjectId(id),
    });

    // Update user's total storage used
    await db.collection<User>("users").updateOne(
      { userId: session.user.id },
      {
        $inc: { totalStorageUsed: -file.fileSize },
        $set: { updatedAt: new Date() },
      }
    );

    return NextResponse.json({
      success: true,
      message: "File permanently deleted",
    });
  } catch (error) {
    console.error("Permanent delete error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
