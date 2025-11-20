"use client";

import { useState, useEffect, useCallback } from "react";
import { Download, FileText } from "lucide-react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { formatBytes } from "@/lib/utils/utils";
import type { FileDocument } from "@/types";

interface ViewFileModalProps {
  file: FileDocument | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ViewFileModal({ file, isOpen, onClose }: ViewFileModalProps) {
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchFileUrl = useCallback(async () => {
    if (!file) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/files/${file._id}/view`);
      if (response.ok) {
        const data = await response.json();
        setFileUrl(data.viewUrl);
      } else {
        toast.error("Failed to load file");
      }
    } catch (error) {
      console.error("Failed to fetch file:", error);
      toast.error("Failed to load file");
    } finally {
      setLoading(false);
    }
  }, [file]);

  useEffect(() => {
    if (file && isOpen) {
      fetchFileUrl();
    } else {
      setFileUrl(null);
    }
  }, [file, isOpen, fetchFileUrl]);

  const handleDownload = async () => {
    if (!file) {
      return;
    }

    try {
      const response = await fetch(`/api/files/${file._id}/download`);
      if (response.ok) {
        const data = await response.json();
        const link = document.createElement("a");
        link.href = data.downloadUrl;
        link.download = file.originalFileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        toast.error("Failed to download file");
      }
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download file");
    }
  };

  const modalClass = file?.fileType.startsWith("image/")
    ? "w-[50vw] max-w-[1400px] h-[70vh] max-h-[700px] overflow-hidden"
    : "w-[50vw] max-w-[1200px] h-[70vh] max-h-[700px] overflow-hidden";

  const renderFileContent = () => {
    if (!file || !fileUrl) {
      return null;
    }

    const isImage = file.fileType.startsWith("image/");
    const isVideo = file.fileType.startsWith("video/");
    const isAudio = file.fileType.startsWith("audio/");

    if (isImage) {
      return (
        <div className="relative w-full h-full">
          <Image
            src={fileUrl}
            alt={file.originalFileName}
            fill
            className="object-contain"
            onContextMenu={e => e.preventDefault()}
            onError={() => toast.error("Failed to load image")}
            unoptimized
          />
        </div>
      );
    }

    if (isVideo) {
      return (
        <video
          src={fileUrl}
          controls
          controlsList="nodownload"
          disablePictureInPicture
          className="w-full h-full object-contain"
          onContextMenu={e => e.preventDefault()}
          onError={() => toast.error("Failed to load video")}
        >
          Your browser does not support the video tag.
        </video>
      );
    }

    if (isAudio) {
      return (
        <div className="flex justify-center items-center h-full">
          <audio
            src={fileUrl}
            controls
            controlsList="nodownload"
            className="w-full max-w-md"
            onContextMenu={e => e.preventDefault()}
            onError={() => toast.error("Failed to load audio")}
          >
            Your browser does not support the audio tag.
          </audio>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center h-full">
        <FileText className="w-16 h-16 text-muted-foreground mb-4" />
        <p className="text-muted-foreground text-center">
          This file type cannot be previewed
        </p>
        <p className="text-sm text-muted-foreground mt-2">{file.fileType}</p>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`${modalClass} flex flex-col`}>
        <DialogHeader>
          <DialogTitle className="truncate">
            {file?.originalFileName}
          </DialogTitle>
          {file && (
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>{file.fileType.split("/")[1]?.toUpperCase()}</span>
              <span>{formatBytes(file.fileSize)}</span>
            </div>
          )}
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex items-center justify-center bg-black/5">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              <p className="ml-3 text-muted-foreground">Loading file...</p>
            </div>
          ) : (
            renderFileContent()
          )}
        </div>

        <DialogFooter className="flex justify-end flex-shrink-0">
          <Button onClick={handleDownload} disabled={!fileUrl}>
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
