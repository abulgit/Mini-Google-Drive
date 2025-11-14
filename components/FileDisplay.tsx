"use client";

import { useState } from "react";
import { Grid3X3, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatBytes, formatDate } from "@/lib/utils";
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
import { ViewFileModal } from "@/components/view-file-modal";
import { FileDropdownMenu } from "@/components/FileDropdownMenu";
import type { FileDocument } from "@/types";
import {
  Trash2,
  FileText,
  Image as ImageIcon,
  Video,
  Music,
  Archive,
  File,
  Folder,
} from "lucide-react";

interface FileDisplayProps {
  files: FileDocument[];
  mode: "files" | "trash";
  onFileDeleted: () => void;
  onFileUpdated?: () => void;
}

export function FileDisplay({
  files,
  mode,
  onFileDeleted,
  onFileUpdated,
}: FileDisplayProps) {
  const [deletingFiles, setDeletingFiles] = useState<Set<string>>(new Set());
  const [processingFiles, setProcessingFiles] = useState<Set<string>>(
    new Set()
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [permanentDeleteDialogOpen, setPermanentDeleteDialogOpen] =
    useState(false);
  const [fileToDelete, setFileToDelete] = useState<FileDocument | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [viewFile, setViewFile] = useState<FileDocument | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const { csrfToken } = useCSRFToken();

  // Helper functions for button variants
  const getListButtonVariant = () =>
    viewMode === "list" ? "secondary" : "ghost";
  const getGridButtonVariant = () =>
    viewMode === "grid" ? "secondary" : "ghost";

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

  const handleRestore = async (fileId: string) => {
    if (!csrfToken) {
      return;
    }

    setProcessingFiles(prev => new Set(prev).add(fileId));

    try {
      const response = await fetch(`/api/files/${fileId}/restore`, {
        method: "PATCH",
        headers: {
          "X-CSRF-Token": csrfToken,
        },
      });

      if (response.ok) {
        toast.success("File restored successfully");
        onFileUpdated?.();
      } else {
        toast.error("Failed to restore file");
      }
    } catch (error) {
      console.error("Restore failed:", error);
      toast.error("Failed to restore file");
    } finally {
      setProcessingFiles(prev => {
        const newSet = new Set(prev);
        newSet.delete(fileId);
        return newSet;
      });
    }
  };

  const handleDelete = async (fileId: string) => {
    const file = files.find(f => f._id!.toString() === fileId);
    if (file) {
      if (mode === "trash") {
        setFileToDelete(file);
        setPermanentDeleteDialogOpen(true);
      } else {
        setFileToDelete(file);
        setDeleteDialogOpen(true);
      }
    }
  };

  const handleView = (fileId: string) => {
    const file = files.find(f => f._id!.toString() === fileId);
    if (file) {
      setViewFile(file);
      setIsViewModalOpen(true);
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
        toast.success("File moved to trash");
        onFileDeleted();
      } else {
        toast.error("Failed to move file to trash");
      }
    } catch (error) {
      console.error("Move to trash failed:", error);
      toast.error("Failed to move file to trash");
    } finally {
      setDeletingFiles(prev => {
        const newSet = new Set(prev);
        newSet.delete(fileId);
        return newSet;
      });
      setFileToDelete(null);
    }
  };

  const confirmPermanentDelete = async () => {
    if (!fileToDelete || !csrfToken) {
      return;
    }

    const fileId = fileToDelete._id!.toString();
    setPermanentDeleteDialogOpen(false);
    setProcessingFiles(prev => new Set(prev).add(fileId));

    try {
      const response = await fetch(`/api/files/${fileId}/permanent`, {
        method: "DELETE",
        headers: { "X-CSRF-Token": csrfToken },
      });

      if (response.ok) {
        toast.success("File permanently deleted");
        onFileUpdated?.();
      } else {
        toast.error("Failed to delete file permanently");
      }
    } catch (error) {
      console.error("Permanent delete failed:", error);
      toast.error("Failed to delete file permanently");
    } finally {
      setProcessingFiles(prev => {
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
        <div
          className={`w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6 ${mode === "trash" ? "opacity-70" : ""}`}
        >
          {mode === "trash" ? (
            <Trash2 className="w-12 h-12 text-muted-foreground" />
          ) : (
            <Folder className="w-12 h-12 text-muted-foreground" />
          )}
        </div>
        <h3 className="text-lg font-medium text-foreground mb-2">
          {mode === "trash" ? "Trash is empty" : "No files yet"}
        </h3>
        <p className="text-muted-foreground max-w-sm">
          {mode === "trash"
            ? "Deleted files will appear here. You can restore them or delete them permanently."
            : "Upload your first file to get started with Mini Drive"}
        </p>
      </div>
    );
  }

  // Render both view modes conditionally and always render dialogs and modal
  return (
    <>
      {viewMode === "list" ? (
        <TooltipProvider>
          <div className="bg-card rounded-lg border border-border">
            <div className="px-6 py-4 border-b border-border">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-card-foreground">
                  {mode === "trash" ? "Trash" : "Files"}
                </h2>
                <div className="flex items-center gap-3">
                  <div className="text-sm text-muted-foreground">
                    {files.length} items
                  </div>
                  {/* View Toggle */}
                  <div className="flex items-center bg-muted rounded-lg p-1">
                    <Button
                      variant={getListButtonVariant()}
                      size="sm"
                      onClick={() => setViewMode("list")}
                      className="w-8 h-8 p-0 rounded-md"
                    >
                      <List className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={getGridButtonVariant()}
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
                const isProcessing = processingFiles.has(file._id!.toString());

                return (
                  <div
                    key={file._id?.toString()}
                    className={`flex items-center px-6 py-4 hover:bg-muted/50 group ${mode === "trash" ? "opacity-70" : ""}`}
                  >
                    <div className="flex items-center flex-1 min-w-0">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center mr-4 cursor-pointer ${getFileTypeColor(file.fileType)}`}
                        onClick={e => {
                          e.stopPropagation();
                          handleView(file._id!.toString());
                        }}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className="text-sm font-medium text-card-foreground truncate cursor-pointer"
                          title={file.originalFileName}
                          onClick={e => {
                            e.stopPropagation();
                            handleView(file._id!.toString());
                          }}
                        >
                          {file.originalFileName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {mode === "trash"
                            ? `Deleted ${formatDate(file.deletedAt!)} • ${formatBytes(file.fileSize)}`
                            : `${formatDate(file.uploadedAt)} • ${formatBytes(file.fileSize)}`}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {file.fileType.split("/")[1]?.toUpperCase() || "FILE"}
                      </Badge>

                      <FileDropdownMenu
                        fileId={file._id!.toString()}
                        mode={mode}
                        isStarred={file.starred}
                        isDeleting={isDeleting}
                        isProcessing={isProcessing}
                        onDownload={handleDownload}
                        onStarToggle={handleStarToggle}
                        onDelete={handleDelete}
                        onRestore={handleRestore}
                        className="w-8 h-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </TooltipProvider>
      ) : (
        <TooltipProvider>
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-medium text-foreground">
                {mode === "trash" ? "Trash" : "Files"}
              </h2>
              <div className="flex items-center gap-3">
                <div className="text-sm text-muted-foreground">
                  {files.length} items
                </div>
                {/* View Toggle */}
                <div className="flex items-center bg-muted rounded-lg p-1">
                  <Button
                    variant={getListButtonVariant()}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="w-8 h-8 p-0 rounded-md"
                  >
                    <List className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={getGridButtonVariant()}
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
                const isProcessing = processingFiles.has(file._id!.toString());

                return (
                  <div key={file._id?.toString()} className="group">
                    <div
                      className={`bg-card border border-border rounded-lg p-4 hover:shadow-md hover:border-primary/20 transition-all ${mode === "trash" ? "opacity-70" : ""}`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center cursor-pointer ${getFileTypeColor(file.fileType)}`}
                          onClick={() => handleView(file._id!.toString())}
                        >
                          <Icon className="w-5 h-5" />
                        </div>

                        <FileDropdownMenu
                          fileId={file._id!.toString()}
                          mode={mode}
                          isStarred={file.starred}
                          isDeleting={isDeleting}
                          isProcessing={isProcessing}
                          onDownload={handleDownload}
                          onStarToggle={handleStarToggle}
                          onDelete={handleDelete}
                          onRestore={handleRestore}
                          className="w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        />
                      </div>

                      <div className="space-y-1">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <p
                              className="text-sm font-medium text-card-foreground truncate cursor-pointer"
                              onClick={() => handleView(file._id!.toString())}
                            >
                              {file.originalFileName}
                            </p>
                          </TooltipTrigger>
                          <TooltipContent>
                            {file.originalFileName}
                          </TooltipContent>
                        </Tooltip>

                        <div className="flex items-center justify-between">
                          <Badge variant="secondary" className="text-xs">
                            {file.fileType.split("/")[1]?.toUpperCase() ||
                              "FILE"}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {formatBytes(file.fileSize)}
                          </span>
                        </div>

                        <p className="text-xs text-muted-foreground">
                          {mode === "trash"
                            ? `Deleted ${formatDate(file.deletedAt!)}`
                            : formatDate(file.uploadedAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </TooltipProvider>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Move to Trash</DialogTitle>
            <DialogDescription>
              Are you sure you want to move &quot;
              {fileToDelete?.originalFileName}&quot; to trash? You can restore
              it later from the trash.
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
                ? "Moving to trash..."
                : "Move to trash"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Permanent Delete Confirmation Dialog */}
      <Dialog
        open={permanentDeleteDialogOpen}
        onOpenChange={setPermanentDeleteDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Permanently</DialogTitle>
            <DialogDescription>
              Are you sure you want to permanently delete &quot;
              {fileToDelete?.originalFileName}&quot;? This action cannot be
              undone and the file will be lost forever.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setPermanentDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmPermanentDelete}
              disabled={processingFiles.has(
                fileToDelete?._id?.toString() || ""
              )}
            >
              {processingFiles.has(fileToDelete?._id?.toString() || "")
                ? "Deleting..."
                : "Delete Permanently"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View File Modal - Always rendered so it works in both view modes */}
      <ViewFileModal
        file={viewFile}
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setViewFile(null);
        }}
      />
    </>
  );
}
