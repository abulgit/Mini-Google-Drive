import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { deleteFileFromBlob } from "@/lib/azure-storage";
import { ObjectId } from "mongodb";
import type { FileDocument, User } from "@/types";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { db } = await connectToDatabase();

    // Find the file and verify ownership
    const file = await db.collection<FileDocument>("files").findOne({
      _id: new ObjectId(id),
      userId: session.user.id,
    });

    if (!file) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    // Delete from Azure Blob Storage
    await deleteFileFromBlob(session.user.id, file.fileName);

    // Delete from MongoDB
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

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
