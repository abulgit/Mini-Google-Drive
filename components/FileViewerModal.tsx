"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Download, Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { FileDocument } from "@/types";

interface FileViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  file: FileDocument | null;
}

export function FileViewerModal({
  isOpen,
  onClose,
  file,
}: FileViewerModalProps) {
  const [fileUrl, setFileUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (file && isOpen) {
      loadFileContent();
    } else {
      setFileUrl("");
      setError("");
    }
  }, [file, isOpen]);

  const loadFileContent = async () => {
    if (!file) {
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/files/${file._id}/download`);
      if (response.ok) {
        const data = await response.json();
        setFileUrl(data.downloadUrl);
      } else {
        throw new Error("Failed to load file");
      }
    } catch (err) {
      console.error("Error loading file:", err);
      setError("Failed to load file content");
      toast.error("Failed to load file content");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!file) {
      return;
    }

    try {
      const response = await fetch(`/api/files/${file._id}/download`);
      if (response.ok) {
        const data = await response.json();
        window.open(data.downloadUrl, "_blank");
      } else {
        toast.error("Failed to download file");
      }
    } catch (error) {
      console.error("Download failed:", error);
      toast.error("Failed to download file");
    }
  };

  const renderFileContent = () => {
    if (!file || !fileUrl) {
      return null;
    }

    const { fileType } = file;

    if (fileType.startsWith("image/")) {
      return (
        <div className="flex items-center justify-center h-full p-4">
          <img
            src={fileUrl}
            alt={file.originalFileName}
            className="max-w-full max-h-full object-contain rounded-lg"
          />
        </div>
      );
    }

    if (fileType.startsWith("video/")) {
      return (
        <div className="flex items-center justify-center h-full p-4">
          <video
            controls
            controlsList="nodownload noremoteplayback"
            disablePictureInPicture
            disableRemotePlayback
            className="max-w-full max-h-full rounded-lg"
            src={fileUrl}
            onContextMenu={e => e.preventDefault()}
          >
            Your browser doesn&apos;t support video playback
          </video>
        </div>
      );
    }

    if (fileType.startsWith("audio/")) {
      return (
        <div className="flex items-center justify-center h-full p-4">
          <audio
            controls
            controlsList="nodownload"
            className="w-full max-w-md"
            src={fileUrl}
            onContextMenu={e => e.preventDefault()}
          >
            Your browser doesn&apos;t support audio playback
          </audio>
        </div>
      );
    }

    // For documents and archives, show download option
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
          <Download className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium mb-2">Preview not available</h3>
        <p className="text-muted-foreground mb-4">
          This file type cannot be previewed in the browser
        </p>
        <Button onClick={handleDownload}>
          <Download className="w-4 h-4 mr-2" />
          Download File
        </Button>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="truncate pr-8">
            {file?.originalFileName || "View File"}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden h-[calc(80vh-120px)]">
          {isLoading && (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-8 h-8 animate-spin" />
              <span className="ml-2">Loading file...</span>
            </div>
          )}

          {error && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <p className="text-destructive mb-4">{error}</p>
                <Button onClick={loadFileContent} variant="outline">
                  Try Again
                </Button>
              </div>
            </div>
          )}

          {!isLoading && !error && renderFileContent()}
        </div>

        <DialogFooter>
          <Button onClick={handleDownload} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
          <DialogClose asChild>
            <Button>Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
