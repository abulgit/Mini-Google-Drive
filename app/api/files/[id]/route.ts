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
    const { starred } = await request.json();

    if (typeof starred !== "boolean") {
      return NextResponse.json(
        { error: "Invalid starred value" },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();

    // Update the file's starred status
    const result = await db.collection<FileDocument>("files").updateOne(
      {
        _id: new ObjectId(id),
        userId: session.user.id,
      },
      {
        $set: { starred },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, starred });
  } catch (error) {
    console.error("Star toggle error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

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

    // Find the file and verify ownership
    const file = await db.collection<FileDocument>("files").findOne({
      _id: new ObjectId(id),
      userId: session.user.id,
      deletedAt: { $exists: false }, // Only allow soft delete of non-deleted files
    });

    if (!file) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    // Soft delete: Set deletedAt timestamp
    await db.collection<FileDocument>("files").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: { deletedAt: new Date() },
      }
    );

    return NextResponse.json({ success: true, message: "File moved to trash" });
  } catch (error) {
    console.error("Soft delete error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
