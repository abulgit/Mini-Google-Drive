"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useCSRFToken } from "@/hooks/useCSRFToken";
import type { FileDocument } from "@/types";

interface FileListProps {
  files: FileDocument[];
  onFileDeleted: () => void;
}

export function FileList({ files, onFileDeleted }: FileListProps) {
  const [deletingFiles, setDeletingFiles] = useState<Set<string>>(new Set());
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<FileDocument | null>(null);
  const { csrfToken } = useCSRFToken();

  const formatBytes = (bytes: number) => {
    if (bytes === 0) {
      return "0 Bytes";
    }
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return (
      d.toLocaleDateString() +
      " " +
      d.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    );
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith("image/")) {
      return "🖼️";
    }
    if (fileType.startsWith("video/")) {
      return "🎥";
    }
    if (fileType.startsWith("audio/")) {
      return "🎵";
    }
    if (fileType.includes("pdf")) {
      return "📄";
    }
    if (fileType.includes("text")) {
      return "📝";
    }
    if (fileType.includes("zip") || fileType.includes("rar")) {
      return "📦";
    }
    return "📁";
  };

  const handleDownload = async (fileId: string) => {
    try {
      const response = await fetch(`/api/files/${fileId}/download`);
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

  const handleStarToggle = async (fileId: string, currentStarred: boolean) => {
    if (!csrfToken) {
      return;
    }

    try {
      const response = await fetch(`/api/files/${fileId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken,
        },
        body: JSON.stringify({ starred: !currentStarred }),
      });

      if (response.ok) {
        toast.success(!currentStarred ? "File starred" : "File unstarred");
        onFileDeleted(); // Refresh the file list
      } else {
        toast.error("Failed to update star status");
      }
    } catch (error) {
      console.error("Star toggle failed:", error);
      toast.error("Failed to update star status");
    }
  };

  const handleDelete = async (fileId: string) => {
    const file = files.find(f => f._id!.toString() === fileId);
    if (file) {
      setFileToDelete(file);
      setDeleteDialogOpen(true);
    }
  };

  const confirmDelete = async () => {
    if (!fileToDelete || !csrfToken) {
      console.error("CSRF token not available");
      return;
    }

    const fileId = fileToDelete._id!.toString();
    setDeleteDialogOpen(false);
    setDeletingFiles(prev => new Set(prev).add(fileId));

    try {
      const response = await fetch(`/api/files/${fileId}`, {
        method: "DELETE",
        headers: {
          "X-CSRF-Token": csrfToken,
        },
      });

      if (response.ok) {
        toast.success("File deleted successfully");
        onFileDeleted();
      } else {
        toast.error("Failed to delete file");
        throw new Error("Delete failed");
      }
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("Failed to delete file");
    } finally {
      setDeletingFiles(prev => {
        const newSet = new Set(prev);
        newSet.delete(fileId);
        return newSet;
      });
      setFileToDelete(null);
    }
  };

  if (files.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Files</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="text-4xl mb-4">📁</div>
            <p className="text-muted-foreground">
              No files uploaded yet. Upload your first file to get started.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Your Files ({files.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Uploaded</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {files.map(file => (
                <TableRow key={file._id?.toString()}>
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-2">
                      <span>{getFileIcon(file.fileType)}</span>
                      <span
                        className="truncate max-w-xs"
                        title={file.originalFileName}
                      >
                        {file.originalFileName}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{formatBytes(file.fileSize)}</TableCell>
                  <TableCell>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {file.fileType.split("/")[1]?.toUpperCase() || "FILE"}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(file.uploadedAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownload(file._id!.toString())}
                      >
                        Download
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleStarToggle(
                            file._id!.toString(),
                            file.starred || false
                          )
                        }
                      >
                        {file.starred ? "⭐" : "☆"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(file._id!.toString())}
                        disabled={deletingFiles.has(file._id!.toString())}
                      >
                        {deletingFiles.has(file._id!.toString())
                          ? "Deleting..."
                          : "Delete"}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete File</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;
              {fileToDelete?.originalFileName}&quot;? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={deletingFiles.has(fileToDelete?._id?.toString() || "")}
            >
              {deletingFiles.has(fileToDelete?._id?.toString() || "")
                ? "Deleting..."
                : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
