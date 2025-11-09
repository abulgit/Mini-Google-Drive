import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { uploadFileToBlob } from "@/lib/azure-storage";
import { validateCSRFToken, createCSRFError } from "@/lib/csrf-middleware";
import {
  STORAGE_LIMIT,
  ALLOWED_EXTENSIONS,
  ALLOWED_MIME_TYPES,
  type FileDocument,
  type User,
} from "@/types";

// LEGACY UPLOAD ENDPOINT - Kept for backward compatibility
// This endpoint proxies file uploads through the server and is limited by Vercel's 4.5MB payload limit
// For files >4.5MB, the new presigned URL flow is used (/api/upload/sas + /api/upload/complete)
// This endpoint can be used as a fallback for small files or in environments without SAS token support

// Server-side file type validation
function validateFileType(file: File): string | null {
  const fileExtension = file.name
    .toLowerCase()
    .substring(file.name.lastIndexOf("."));

  if (!ALLOWED_EXTENSIONS.includes(fileExtension)) {
    return `File type "${fileExtension}" not allowed. Supported formats: ${ALLOWED_EXTENSIONS.join(", ")}`;
  }

  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return `File type not recognized. Please ensure the file is not corrupted.`;
  }

  return null;
}

export async function POST(request: NextRequest) {
  try {
    // Validate CSRF token first
    if (!validateCSRFToken(request)) {
      return createCSRFError();
    }

    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    const fileTypeError = validateFileType(file);
    if (fileTypeError) {
      return NextResponse.json({ error: fileTypeError }, { status: 400 });
    }

    const { db } = await connectToDatabase();

    // Get user's current storage usage
    const user = await db.collection<User>("users").findOne({
      userId: session.user.id,
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if adding this file would exceed storage limit
    if (user.totalStorageUsed + file.size > STORAGE_LIMIT) {
      return NextResponse.json(
        { error: "Storage limit exceeded. Maximum 5GB allowed." },
        { status: 413 }
      );
    }

    // Handle file name conflicts by adding timestamp
    let fileName = file.name;
    const existingFile = await db.collection<FileDocument>("files").findOne({
      userId: session.user.id,
      fileName: fileName,
    });

    if (existingFile) {
      const timestamp = Date.now();
      const lastDotIndex = fileName.lastIndexOf(".");
      if (lastDotIndex > 0) {
        fileName = `${fileName.substring(0, lastDotIndex)}_${timestamp}${fileName.substring(lastDotIndex)}`;
      } else {
        fileName = `${fileName}_${timestamp}`;
      }
    }

    // Convert file to buffer
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    // Upload to Azure Blob Storage
    const blobUrl = await uploadFileToBlob(
      session.user.id,
      fileName,
      fileBuffer,
      file.type
    );

    // Save file metadata to MongoDB
    const fileDocument: Omit<FileDocument, "_id"> = {
      userId: session.user.id,
      fileName,
      originalFileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      blobUrl,
      uploadedAt: new Date(),
    };

    const result = await db
      .collection<FileDocument>("files")
      .insertOne(fileDocument);

    // Update user's total storage used
    await db.collection<User>("users").updateOne(
      { userId: session.user.id },
      {
        $inc: { totalStorageUsed: file.size },
        $set: { updatedAt: new Date() },
      }
    );

    return NextResponse.json({
      success: true,
      file: { ...fileDocument, _id: result.insertedId },
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
