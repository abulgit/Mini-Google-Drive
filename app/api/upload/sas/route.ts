import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { validateCSRFToken, createCSRFError } from "@/lib/csrf-middleware";
import { generatePresignedUploadUrl } from "@/lib/azure-storage";
import {
  STORAGE_LIMIT,
  ALLOWED_EXTENSIONS,
  ALLOWED_MIME_TYPES,
  type User,
} from "@/types";

interface PresignedUrlRequest {
  fileName: string;
  fileSize: number;
  fileType: string;
}

function validateFileInput(
  fileName: string,
  fileSize: number,
  fileType: string
): string | null {
  if (!fileName || fileName.trim() === "") {
    return "File name is required";
  }

  const fileExtension = fileName
    .toLowerCase()
    .substring(fileName.lastIndexOf("."));

  if (!ALLOWED_EXTENSIONS.includes(fileExtension)) {
    return `File type "${fileExtension}" not allowed. Supported formats: ${ALLOWED_EXTENSIONS.join(", ")}`;
  }

  if (!ALLOWED_MIME_TYPES.includes(fileType)) {
    return `File MIME type not allowed`;
  }

  if (fileSize <= 0) {
    return "Invalid file size";
  }

  if (fileSize > STORAGE_LIMIT) {
    return `File size exceeds maximum limit of ${STORAGE_LIMIT / (1024 * 1024 * 1024)}GB`;
  }

  const dangerousChars = /[<>:"/\\|?*]/;
  if (dangerousChars.test(fileName)) {
    return "File name contains invalid characters";
  }

  return null;
}

function sanitizeFileName(fileName: string): string {
  return fileName
    .replace(/[<>:"/\\|?*]/g, "_")
    .replace(/\s+/g, "_")
    .substring(0, 255);
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

    const body: PresignedUrlRequest = await request.json();
    const { fileName, fileSize, fileType } = body;

    const validationError = validateFileInput(fileName, fileSize, fileType);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const { db } = await connectToDatabase();

    const user = await db.collection<User>("users").findOne({
      userId: session.user.id,
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.totalStorageUsed + fileSize > STORAGE_LIMIT) {
      return NextResponse.json(
        {
          error: `Storage limit exceeded. You have ${((STORAGE_LIMIT - user.totalStorageUsed) / (1024 * 1024)).toFixed(2)}MB remaining.`,
        },
        { status: 413 }
      );
    }

    const timestamp = Date.now();
    const sanitizedFileName = sanitizeFileName(fileName);
    const uniqueFileName = `${timestamp}_${sanitizedFileName}`;

    const { uploadUrl, blobPath } = await generatePresignedUploadUrl(
      session.user.id,
      uniqueFileName,
      fileType,
      10
    );

    return NextResponse.json({
      uploadUrl,
      blobPath,
      uniqueFileName,
      expiresIn: 600,
    });
  } catch (error) {
    console.error("Error generating presigned URL:", error);
    return NextResponse.json(
      { error: "Failed to generate upload URL" },
      { status: 500 }
    );
  }
}
