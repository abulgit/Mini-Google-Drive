import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { validateCSRFToken, createCSRFError } from "@/lib/csrf-middleware";
import { verifyBlobExists, getBlobProperties } from "@/lib/azure-storage";
import { type FileDocument, type User } from "@/types";

interface CompleteUploadRequest {
  blobPath: string;
  originalFileName: string;
}

export async function POST(request: NextRequest) {
  try {
    if (!validateCSRFToken(request)) {
      return createCSRFError();
    }

    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: CompleteUploadRequest = await request.json();
    const { blobPath, originalFileName } = body;

    if (!blobPath || !originalFileName) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!blobPath.startsWith(`${session.user.id}/`)) {
      return NextResponse.json(
        { error: "Invalid blob path: unauthorized access" },
        { status: 403 }
      );
    }

    const blobExists = await verifyBlobExists(blobPath);
    if (!blobExists) {
      return NextResponse.json(
        { error: "File not found in storage. Upload may have failed." },
        { status: 404 }
      );
    }

    const blobProperties = await getBlobProperties(blobPath);
    if (!blobProperties) {
      return NextResponse.json(
        { error: "Failed to retrieve file properties" },
        { status: 500 }
      );
    }

    const { db } = await connectToDatabase();

    const existingFile = await db.collection<FileDocument>("files").findOne({
      userId: session.user.id,
      blobUrl: { $regex: blobPath },
    });

    if (existingFile) {
      return NextResponse.json(
        { error: "File already exists in database" },
        { status: 409 }
      );
    }

    const user = await db.collection<User>("users").findOne({
      userId: session.user.id,
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const fileName = blobPath.split("/").pop() || originalFileName;

    const fileDocument: Omit<FileDocument, "_id"> = {
      userId: session.user.id,
      fileName,
      originalFileName,
      fileSize: blobProperties.size,
      fileType: blobProperties.contentType,
      blobUrl: `https://${process.env.AZURE_STORAGE_ACCOUNT_NAME || "storage"}.blob.core.windows.net/${process.env.AZURE_STORAGE_CONTAINER_NAME || "user-files"}/${blobPath}`,
      uploadedAt: new Date(),
    };

    const result = await db
      .collection<FileDocument>("files")
      .insertOne(fileDocument);

    await db.collection<User>("users").updateOne(
      { userId: session.user.id },
      {
        $inc: { totalStorageUsed: blobProperties.size },
        $set: { updatedAt: new Date() },
      }
    );

    return NextResponse.json({
      success: true,
      file: { ...fileDocument, _id: result.insertedId },
    });
  } catch (error) {
    console.error("Error completing upload:", error);
    return NextResponse.json(
      { error: "Failed to complete upload" },
      { status: 500 }
    );
  }
}
