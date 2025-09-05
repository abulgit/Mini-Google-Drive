"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { STORAGE_LIMIT } from "@/types";
import { useCSRFToken } from "@/hooks/useCSRFToken";

interface FileUploadProps {
  onUploadSuccess: () => void;
}

export function FileUpload({ onUploadSuccess }: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { csrfToken, loading: csrfLoading } = useCSRFToken();

  const formatBytes = (bytes: number) => {
    if (bytes === 0) {
      return "0 Bytes";
    }
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const validateFile = (file: File): string | null => {
    // Check file size - max 5GB per file
    if (file.size > STORAGE_LIMIT) {
      return `File size (${formatBytes(file.size)}) exceeds maximum limit of ${formatBytes(STORAGE_LIMIT)}`;
    }

    // Check for empty files
    if (file.size === 0) {
      return "Cannot upload empty files";
    }

    // Basic file name validation
    if (!file.name || file.name.trim() === "") {
      return "File must have a valid name";
    }

    // Check for potentially dangerous file names
    const dangerousChars = /[<>:"/\\|?*]/;
    if (dangerousChars.test(file.name)) {
      return "File name contains invalid characters";
    }

    return null;
  };

  const handleFileSelect = (file: File) => {
    if (file) {
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }
      uploadFile(file);
    }
  };

  const uploadFile = async (file: File) => {
    if (!csrfToken) {
      setError("Security token not available. Please refresh the page.");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        headers: {
          "X-CSRF-Token": csrfToken,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Upload failed");
      }

      onUploadSuccess();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragOver
              ? "border-blue-400 bg-blue-50"
              : "border-gray-300 hover:border-gray-400"
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Upload Files</h3>
              <p className="text-sm text-muted-foreground">
                Drag and drop files here, or click to select
              </p>
              <p className="text-xs text-muted-foreground">
                Maximum file size: {formatBytes(STORAGE_LIMIT)}
              </p>
            </div>

            <div className="space-y-2">
              <Input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={e => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleFileSelect(file);
                  }
                }}
              />

              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading || csrfLoading || !csrfToken}
                variant="outline"
              >
                {uploading
                  ? "Uploading..."
                  : csrfLoading
                    ? "Loading..."
                    : "Select File"}
              </Button>
            </div>

            {error && (
              <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                {error}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
