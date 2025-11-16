"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { STORAGE_LIMIT, ALLOWED_EXTENSIONS } from "@/types";
import { useFileUpload } from "@/hooks/useFileUpload";
import { cn, formatBytes, formatSpeed, formatTimeRemaining } from "@/lib/utils";
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
  const [dragOver, setDragOver] = useState(false);
  const {
    uploading,
    uploadProgress,
    uploadComplete,
    error,
    uploadSpeed,
    timeRemaining,
    csrfToken,
    csrfLoading,
    fileInputRef,
    handleFileSelect,
    resetUpload,
  } = useFileUpload({
    onSuccess: () => {
      onUploadSuccess();
      setTimeout(handleClose, 1500);
    },
    showToast: false,
  });

  const handleClose = () => {
    if (!uploading) {
      resetUpload();
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
                  {!uploadComplete && uploadSpeed > 0 && (
                    <div className="flex items-center justify-center gap-2 text-[10px] sm:text-xs text-muted-foreground">
                      <span>{formatSpeed(uploadSpeed)}</span>
                      <span>•</span>
                      <span>{formatTimeRemaining(timeRemaining)} left</span>
                    </div>
                  )}
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

          {error && (
            <div className="p-2 sm:p-3 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center gap-2 text-xs sm:text-sm text-destructive">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span className="flex-1 break-words">{error}</span>
              <button
                onClick={resetUpload}
                className="text-destructive hover:text-destructive/80"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

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
