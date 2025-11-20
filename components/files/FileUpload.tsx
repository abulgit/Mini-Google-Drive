"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { STORAGE_LIMIT, ALLOWED_EXTENSIONS } from "@/types";
import { useFileUpload } from "@/hooks/files/useFileUpload";
import {
  cn,
  formatBytes,
  formatSpeed,
  formatTimeRemaining,
} from "@/lib/utils/utils";
import { Upload, Cloud, Plus } from "lucide-react";

interface FileUploadProps {
  onUploadSuccess: () => void;
  className?: string;
}

export function FileUpload({ onUploadSuccess, className }: FileUploadProps) {
  const [dragOver, setDragOver] = useState(false);
  const {
    uploading,
    uploadProgress,
    uploadSpeed,
    timeRemaining,
    csrfToken,
    csrfLoading,
    fileInputRef,
    handleFileSelect,
  } = useFileUpload({ onSuccess: onUploadSuccess });

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
    <div className={cn("w-full", className)}>
      <div className="mb-6">
        <Button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading || csrfLoading || !csrfToken}
          className="w-full justify-start gap-3 h-12 bg-blue-600 hover:bg-blue-700 text-white border-0 shadow-sm rounded-lg font-medium"
        >
          {uploading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Uploading... {uploadProgress}%
            </>
          ) : (
            <>
              <Plus className="w-5 h-5" />
              New Upload
            </>
          )}
        </Button>
      </div>

      <div
        className={cn(
          "relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200",
          dragOver
            ? "border-blue-400 bg-blue-50"
            : "border-gray-300 hover:border-gray-400 bg-gray-50/50",
          uploading && "border-blue-400 bg-blue-50"
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
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

        <div className="space-y-4">
          {uploading ? (
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
                <Cloud className="w-8 h-8 text-blue-600" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-medium text-gray-900">
                  Uploading file...
                </h3>
                <div className="w-full bg-gray-200 rounded-full h-2 max-w-xs mx-auto">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600">
                  {uploadProgress}% complete
                </p>
                {uploadSpeed > 0 && (
                  <div className="flex items-center justify-center gap-3 text-xs text-gray-500">
                    <span>{formatSpeed(uploadSpeed)}</span>
                    <span>•</span>
                    <span>{formatTimeRemaining(timeRemaining)} left</span>
                  </div>
                )}
              </div>
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
                  {dragOver ? "Drop files here" : "Drag files to upload"}
                </h3>
                <p className="text-sm text-gray-600">
                  or{" "}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    browse from your computer
                  </button>
                </p>
                <p className="text-xs text-gray-500">
                  Maximum file size: {formatBytes(STORAGE_LIMIT)}
                </p>
                <p className="text-xs text-gray-500">
                  Supported formats: {ALLOWED_EXTENSIONS.join(", ")}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
