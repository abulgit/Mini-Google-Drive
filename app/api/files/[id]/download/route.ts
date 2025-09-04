import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { generateDownloadUrl } from "@/lib/azure-storage";
import { ObjectId } from "mongodb";
import type { FileDocument } from "@/types";

export async function GET(
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

    // Generate download URL
    const downloadUrl = await generateDownloadUrl(
      session.user.id,
      file.fileName
    );

    return NextResponse.json({ downloadUrl });
  } catch (error) {
    console.error("Download error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
