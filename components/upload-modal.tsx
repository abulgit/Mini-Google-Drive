"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { STORAGE_LIMIT, validateFileType, ALLOWED_EXTENSIONS } from "@/types";
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
            <FileUp className="w-5 h-5 text-primary" />
            Upload File
          </DialogTitle>
          <DialogDescription>
            Choose a file to upload to your Mini Drive
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
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
              "relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 min-h-[200px] flex flex-col items-center justify-center",
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
              <div className="space-y-4">
                <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                  <Cloud className="w-8 h-8 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-medium text-foreground">
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
                  <p className="text-sm text-muted-foreground">
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
                    dragOver ? "bg-primary/10" : "bg-muted"
                  )}
                >
                  <Upload
                    className={cn(
                      "w-8 h-8 transition-colors",
                      dragOver ? "text-primary" : "text-muted-foreground"
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-medium text-foreground">
                    {dragOver ? "Drop your file here" : "Drag and drop a file"}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    or{" "}
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={csrfLoading || !csrfToken}
                      className="text-primary hover:text-primary/80 font-medium"
                    >
                      browse from your computer
                    </button>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Maximum file size: {formatBytes(STORAGE_LIMIT)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Supported formats: {ALLOWED_EXTENSIONS.join(", ")}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Error Display */}
          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center gap-2 text-sm text-destructive">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span className="flex-1">{error}</span>
              <button
                onClick={() => setError(null)}
                className="text-destructive hover:text-destructive/80"
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
