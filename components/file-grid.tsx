"use client";

import { useState } from "react";
import { Grid3X3, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import { useCSRFToken } from "@/hooks/useCSRFToken";
import type { FileDocument } from "@/types";
import {
  MoreVertical,
  Download,
  Trash2,
  Star,
  Share2,
  FileText,
  Image as ImageIcon,
  Video,
  Music,
  Archive,
  File,
  Folder,
} from "lucide-react";

interface FileGridProps {
  files: FileDocument[];
  onFileDeleted: () => void;
}

export function FileGrid({ files, onFileDeleted }: FileGridProps) {
  const [deletingFiles, setDeletingFiles] = useState<Set<string>>(new Set());
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<FileDocument | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
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
    return d.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith("image/")) {
      return ImageIcon;
    }
    if (fileType.startsWith("video/")) {
      return Video;
    }
    if (fileType.startsWith("audio/")) {
      return Music;
    }
    if (fileType.includes("pdf") || fileType.includes("text")) {
      return FileText;
    }
    if (fileType.includes("zip") || fileType.includes("rar")) {
      return Archive;
    }
    return File;
  };

  const getFileTypeColor = (fileType: string) => {
    if (fileType.startsWith("image/")) {
      return "bg-green-50 text-green-700";
    }
    if (fileType.startsWith("video/")) {
      return "bg-purple-50 text-purple-700";
    }
    if (fileType.startsWith("audio/")) {
      return "bg-blue-50 text-blue-700";
    }
    if (fileType.includes("pdf")) {
      return "bg-red-50 text-red-700";
    }
    if (fileType.includes("text")) {
      return "bg-muted text-muted-foreground";
    }
    if (fileType.includes("zip") || fileType.includes("rar")) {
      return "bg-orange-50 text-orange-700";
    }
    return "bg-muted text-muted-foreground";
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

  const handleDelete = async (fileId: string) => {
    const file = files.find(f => f._id!.toString() === fileId);
    if (file) {
      setFileToDelete(file);
      setDeleteDialogOpen(true);
    }
  };

  const confirmDelete = async () => {
    if (!fileToDelete || !csrfToken) {
      return;
    }

    const fileId = fileToDelete._id!.toString();
    setDeleteDialogOpen(false);
    setDeletingFiles(prev => new Set(prev).add(fileId));

    try {
      const response = await fetch(`/api/files/${fileId}`, {
        method: "DELETE",
        headers: { "X-CSRF-Token": csrfToken },
      });

      if (response.ok) {
        toast.success("File deleted successfully");
        onFileDeleted();
      } else {
        toast.error("Failed to delete file");
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
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
          <Folder className="w-12 h-12 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium text-foreground mb-2">
          No files yet
        </h3>
        <p className="text-muted-foreground max-w-sm">
          Upload your first file to get started with SimpleDrive
        </p>
      </div>
    );
  }

  if (viewMode === "list") {
    return (
      <TooltipProvider>
        <div className="bg-card rounded-lg border border-border">
          <div className="px-6 py-4 border-b border-border">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-card-foreground">
                Files
              </h2>
              <div className="flex items-center gap-3">
                <div className="text-sm text-muted-foreground">
                  {files.length} items
                </div>
                {/* View Toggle */}
                <div className="flex items-center bg-muted rounded-lg p-1">
                  <Button
                    variant={viewMode === "list" ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="w-8 h-8 p-0 rounded-md"
                  >
                    <List className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === "grid" ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="w-8 h-8 p-0 rounded-md"
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="divide-y divide-border">
            {files.map(file => {
              const Icon = getFileIcon(file.fileType);
              const isDeleting = deletingFiles.has(file._id!.toString());

              return (
                <div
                  key={file._id?.toString()}
                  className="flex items-center px-6 py-4 hover:bg-muted/50 group"
                >
                  <div className="flex items-center flex-1 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center mr-4 ${getFileTypeColor(file.fileType)}`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-sm font-medium text-card-foreground truncate"
                        title={file.originalFileName}
                      >
                        {file.originalFileName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(file.uploadedAt)} •{" "}
                        {formatBytes(file.fileSize)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {file.fileType.split("/")[1]?.toUpperCase() || "FILE"}
                    </Badge>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-8 h-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleDownload(file._id!.toString())}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Star className="w-4 h-4 mr-2" />
                          Add to starred
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Share2 className="w-4 h-4 mr-2" />
                          Share
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDelete(file._id!.toString())}
                          disabled={isDeleting}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          {isDeleting ? "Deleting..." : "Delete"}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

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
                disabled={deletingFiles.has(
                  fileToDelete?._id?.toString() || ""
                )}
              >
                {deletingFiles.has(fileToDelete?._id?.toString() || "")
                  ? "Deleting..."
                  : "Delete"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </TooltipProvider>
    );
  }

  // Grid view
  return (
    <TooltipProvider>
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-medium text-foreground">Files</h2>
          <div className="flex items-center gap-3">
            <div className="text-sm text-muted-foreground">
              {files.length} items
            </div>
            {/* View Toggle */}
            <div className="flex items-center bg-muted rounded-lg p-1">
              <Button
                variant={viewMode === "list" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="w-8 h-8 p-0 rounded-md"
              >
                <List className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "grid" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="w-8 h-8 p-0 rounded-md"
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {files.map(file => {
            const Icon = getFileIcon(file.fileType);
            const isDeleting = deletingFiles.has(file._id!.toString());

            return (
              <div key={file._id?.toString()} className="group">
                <div className="bg-card border border-border rounded-lg p-4 hover:shadow-md hover:border-primary/20 transition-all cursor-pointer">
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${getFileTypeColor(file.fileType)}`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleDownload(file._id!.toString())}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Star className="w-4 h-4 mr-2" />
                          Add to starred
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Share2 className="w-4 h-4 mr-2" />
                          Share
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDelete(file._id!.toString())}
                          disabled={isDeleting}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          {isDeleting ? "Deleting..." : "Delete"}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="space-y-1">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <p className="text-sm font-medium text-card-foreground truncate">
                          {file.originalFileName}
                        </p>
                      </TooltipTrigger>
                      <TooltipContent>{file.originalFileName}</TooltipContent>
                    </Tooltip>

                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="text-xs">
                        {file.fileType.split("/")[1]?.toUpperCase() || "FILE"}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatBytes(file.fileSize)}
                      </span>
                    </div>

                    <p className="text-xs text-muted-foreground">
                      {formatDate(file.uploadedAt)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

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
    </TooltipProvider>
  );
}
