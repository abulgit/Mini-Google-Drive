"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { STORAGE_LIMIT } from "@/types";
import { useCSRFToken } from "@/hooks/useCSRFToken";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Upload,
  X,
  CheckCircle,
  AlertCircle,
  Cloud,
  FileUp,
} from "lucide-react";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: () => void;
}

export function UploadModal({
  isOpen,
  onClose,
  onUploadSuccess,
}: UploadModalProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadComplete, setUploadComplete] = useState(false);
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
    if (file.size > STORAGE_LIMIT) {
      return `File size (${formatBytes(file.size)}) exceeds maximum limit of ${formatBytes(STORAGE_LIMIT)}`;
    }
    if (file.size === 0) {
      return "Cannot upload empty files";
    }
    if (!file.name || file.name.trim() === "") {
      return "File must have a valid name";
    }
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
    setUploadProgress(0);
    setUploadComplete(false);

    try {
      const formData = new FormData();
      formData.append("file", file);

      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const response = await fetch("/api/upload", {
        method: "POST",
        headers: {
          "X-CSRF-Token": csrfToken,
        },
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Upload failed");
      }

      setUploadComplete(true);

      // Show success state briefly, then close modal and refresh
      setTimeout(() => {
        onUploadSuccess();
        handleClose();
      }, 1500);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Upload failed");
      setUploadProgress(0);
    } finally {
      setTimeout(() => {
        setUploading(false);
      }, 1000);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleClose = () => {
    if (!uploading) {
      setError(null);
      setUploadProgress(0);
      setUploadComplete(false);
      onClose();
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
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileUp className="w-5 h-5 text-blue-600" />
            Upload File
          </DialogTitle>
          <DialogDescription>
            Choose a file to upload to your SimpleDrive
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
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

          {/* Drop Zone */}
          <div
            className={cn(
              "relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 min-h-[200px] flex flex-col items-center justify-center",
              dragOver
                ? "border-blue-400 bg-blue-50"
                : "border-gray-300 hover:border-gray-400 bg-gray-50/50",
              uploading && "border-blue-400 bg-blue-50"
            )}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            {uploading ? (
              <div className="space-y-4">
                <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
                  <Cloud className="w-8 h-8 text-blue-600" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-medium text-gray-900">
                    {uploadComplete ? "Upload Complete!" : "Uploading file..."}
                  </h3>
                  <div className="w-full bg-gray-200 rounded-full h-2 max-w-xs mx-auto">
                    <div
                      className={cn(
                        "h-2 rounded-full transition-all duration-300",
                        uploadComplete ? "bg-green-600" : "bg-blue-600"
                      )}
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600">
                    {uploadComplete
                      ? "File uploaded successfully!"
                      : `${uploadProgress}% complete`}
                  </p>
                </div>
                {uploadComplete && (
                  <CheckCircle className="w-8 h-8 text-green-600 mx-auto" />
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div
                  className={cn(
                    "w-16 h-16 mx-auto rounded-full flex items-center justify-center transition-colors",
                    dragOver ? "bg-blue-100" : "bg-gray-100"
                  )}
                >
                  <Upload
                    className={cn(
                      "w-8 h-8 transition-colors",
                      dragOver ? "text-blue-600" : "text-gray-400"
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-medium text-gray-900">
                    {dragOver ? "Drop your file here" : "Drag and drop a file"}
                  </h3>
                  <p className="text-sm text-gray-600">
                    or{" "}
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={csrfLoading || !csrfToken}
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      browse from your computer
                    </button>
                  </p>
                  <p className="text-xs text-gray-500">
                    Maximum file size: {formatBytes(STORAGE_LIMIT)}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Error Display */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-sm text-red-700">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span className="flex-1">{error}</span>
              <button
                onClick={() => setError(null)}
                className="text-red-500 hover:text-red-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading || csrfLoading || !csrfToken}
              className="flex-1"
            >
              {csrfLoading ? "Loading..." : "Choose File"}
            </Button>
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={uploading}
            >
              {uploading ? "Uploading..." : "Cancel"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
