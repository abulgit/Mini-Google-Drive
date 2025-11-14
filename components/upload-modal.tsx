"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { STORAGE_LIMIT, validateFileType, ALLOWED_EXTENSIONS } from "@/types";
import { useCSRFToken } from "@/hooks/useCSRFToken";
import { cn, formatBytes } from "@/lib/utils";
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

  const validateFile = (file: File): string | null => {
    // File type validation
    const fileTypeError = validateFileType(file);
    if (fileTypeError) {
      return fileTypeError;
    }

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

    let blobPath = "";
    //let uniqueFileName = "";

    try {
      const sasResponse = await fetch("/api/upload/sas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken,
        },
        body: JSON.stringify({
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
        }),
      });

      if (!sasResponse.ok) {
        const errorData = await sasResponse.json();
        throw new Error(errorData.error || "Failed to get upload URL");
      }

      const sasData = await sasResponse.json();
      const { uploadUrl } = sasData;
      blobPath = sasData.blobPath;
      //uniqueFileName = sasData.uniqueFileName;

      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.upload.addEventListener("progress", e => {
          if (e.lengthComputable) {
            const percentComplete = Math.round((e.loaded / e.total) * 95);
            setUploadProgress(percentComplete);
          }
        });

        xhr.addEventListener("load", () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            setUploadProgress(95);
            resolve();
          } else {
            reject(new Error(`Upload failed with status: ${xhr.status}`));
          }
        });

        xhr.addEventListener("error", () => {
          reject(new Error("Network error during upload"));
        });

        xhr.addEventListener("abort", () => {
          reject(new Error("Upload cancelled"));
        });

        xhr.open("PUT", uploadUrl, true);
        xhr.setRequestHeader("x-ms-blob-type", "BlockBlob");
        xhr.setRequestHeader("Content-Type", file.type);
        xhr.send(file);
      });

      setUploadProgress(98);

      const completeResponse = await fetch("/api/upload/complete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken,
        },
        body: JSON.stringify({
          blobPath,
          originalFileName: file.name,
        }),
      });

      if (!completeResponse.ok) {
        const errorData = await completeResponse.json();
        throw new Error(errorData.error || "Failed to complete upload");
      }

      setUploadProgress(100);
      setUploadComplete(true);

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
      <DialogContent className="sm:max-w-md max-w-[95vw]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base sm:text-lg">
            <FileUp className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            Upload File
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            Choose a file to upload to your Mini Drive
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 sm:space-y-4">
          <Input
            ref={fileInputRef}
            type="file"
            accept={ALLOWED_EXTENSIONS.join(",")}
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
              "relative border-2 border-dashed rounded-lg p-4 sm:p-8 text-center transition-all duration-200 min-h-[180px] sm:min-h-[200px] flex flex-col items-center justify-center",
              dragOver
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50 bg-muted/20",
              uploading && "border-primary bg-primary/5"
            )}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            {uploading ? (
              <div className="space-y-3 sm:space-y-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                  <Cloud className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-base sm:text-lg font-medium text-foreground">
                    {uploadComplete ? "Upload Complete!" : "Uploading file..."}
                  </h3>
                  <div className="w-full bg-muted rounded-full h-2 max-w-xs mx-auto">
                    <div
                      className={cn(
                        "h-2 rounded-full transition-all duration-300",
                        uploadComplete ? "bg-green-600" : "bg-primary"
                      )}
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {uploadComplete
                      ? "File uploaded successfully!"
                      : `${uploadProgress}% complete`}
                  </p>
                </div>
                {uploadComplete && (
                  <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 mx-auto" />
                )}
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                <div
                  className={cn(
                    "w-12 h-12 sm:w-16 sm:h-16 mx-auto rounded-full flex items-center justify-center transition-colors",
                    dragOver ? "bg-primary/10" : "bg-muted"
                  )}
                >
                  <Upload
                    className={cn(
                      "w-6 h-6 sm:w-8 sm:h-8 transition-colors",
                      dragOver ? "text-primary" : "text-muted-foreground"
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <h3 className="text-base sm:text-lg font-medium text-foreground">
                    {dragOver ? "Drop your file here" : "Drag and drop a file"}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    or{" "}
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={csrfLoading || !csrfToken}
                      className="text-primary hover:text-primary/80 font-medium"
                    >
                      browse from your computer
                    </button>
                  </p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">
                    Maximum file size: {formatBytes(STORAGE_LIMIT)}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Error Display */}
          {error && (
            <div className="p-2 sm:p-3 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center gap-2 text-xs sm:text-sm text-destructive">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span className="flex-1 break-words">{error}</span>
              <button
                onClick={() => setError(null)}
                className="text-destructive hover:text-destructive/80"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2 sm:pt-4">
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading || csrfLoading || !csrfToken}
              className="flex-1 text-xs sm:text-sm h-9 sm:h-10"
            >
              {csrfLoading ? "Loading..." : "Choose File"}
            </Button>
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={uploading}
              className="text-xs sm:text-sm h-9 sm:h-10"
            >
              {uploading ? "Uploading..." : "Cancel"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
