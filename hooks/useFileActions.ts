import { useState } from "react";
import { toast } from "sonner";
import { useCSRFToken } from "@/hooks/useCSRFToken";
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from "@/lib/constants";
import type { FileDocument } from "@/types";

export function useFileActions(
  onFileDeleted: () => void,
  onFileUpdated?: () => void
) {
  const [deletingFiles, setDeletingFiles] = useState<Set<string>>(new Set());
  const [processingFiles, setProcessingFiles] = useState<Set<string>>(
    new Set()
  );
  const [renamingFiles, setRenamingFiles] = useState<Set<string>>(new Set());
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [permanentDeleteDialogOpen, setPermanentDeleteDialogOpen] =
    useState(false);
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<FileDocument | null>(null);
  const [fileToRename, setFileToRename] = useState<FileDocument | null>(null);
  const { csrfToken } = useCSRFToken();

  const handleDownload = async (fileId: string) => {
    try {
      const response = await fetch(`/api/files/${fileId}/download`);
      if (response.ok) {
        const data = await response.json();
        window.open(data.downloadUrl, "_blank");
      } else {
        toast.error(ERROR_MESSAGES.DOWNLOAD_FAILED);
      }
    } catch (error) {
      console.error("Download failed:", error);
      toast.error(ERROR_MESSAGES.DOWNLOAD_FAILED);
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
        toast.success(
          !currentStarred
            ? SUCCESS_MESSAGES.FILE_STARRED
            : SUCCESS_MESSAGES.FILE_UNSTARRED
        );
        onFileDeleted();
      } else {
        toast.error(ERROR_MESSAGES.STAR_FAILED);
      }
    } catch (error) {
      console.error("Star toggle failed:", error);
      toast.error(ERROR_MESSAGES.STAR_FAILED);
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
        toast.success(SUCCESS_MESSAGES.FILE_RESTORED);
        onFileUpdated?.();
      } else {
        toast.error(ERROR_MESSAGES.RESTORE_FAILED);
      }
    } catch (error) {
      console.error("Restore failed:", error);
      toast.error(ERROR_MESSAGES.RESTORE_FAILED);
    } finally {
      setProcessingFiles(prev => {
        const newSet = new Set(prev);
        newSet.delete(fileId);
        return newSet;
      });
    }
  };

  const handleDeleteClick = async (
    fileId: string,
    file: FileDocument,
    mode: "files" | "trash"
  ) => {
    if (mode === "trash") {
      setFileToDelete(file);
      setPermanentDeleteDialogOpen(true);
    } else {
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
        toast.success(SUCCESS_MESSAGES.FILE_DELETED);
        onFileDeleted();
      } else {
        toast.error(ERROR_MESSAGES.DELETE_FAILED);
      }
    } catch (error) {
      console.error("Move to trash failed:", error);
      toast.error(ERROR_MESSAGES.DELETE_FAILED);
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
        toast.success(SUCCESS_MESSAGES.FILE_PERMANENTLY_DELETED);
        onFileUpdated?.();
      } else {
        toast.error(ERROR_MESSAGES.DELETE_FAILED);
      }
    } catch (error) {
      console.error("Permanent delete failed:", error);
      toast.error(ERROR_MESSAGES.DELETE_FAILED);
    } finally {
      setProcessingFiles(prev => {
        const newSet = new Set(prev);
        newSet.delete(fileId);
        return newSet;
      });
      setFileToDelete(null);
    }
  };

  const handleRenameClick = (fileId: string, file: FileDocument) => {
    setFileToRename(file);
    setRenameDialogOpen(true);
  };

  const confirmRename = async (newName: string) => {
    if (!fileToRename || !csrfToken) {
      return;
    }

    const fileId = fileToRename._id!.toString();
    setRenameDialogOpen(false);
    setRenamingFiles(prev => new Set(prev).add(fileId));

    try {
      const response = await fetch(`/api/files/${fileId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken,
        },
        body: JSON.stringify({ originalFileName: newName }),
      });

      if (response.ok) {
        toast.success(SUCCESS_MESSAGES.FILE_RENAMED);
        onFileUpdated?.();
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || ERROR_MESSAGES.RENAME_FAILED);
      }
    } catch (error) {
      console.error("Rename failed:", error);
      toast.error(ERROR_MESSAGES.RENAME_FAILED);
    } finally {
      setRenamingFiles(prev => {
        const newSet = new Set(prev);
        newSet.delete(fileId);
        return newSet;
      });
      setFileToRename(null);
    }
  };

  return {
    deletingFiles,
    processingFiles,
    renamingFiles,
    deleteDialogOpen,
    permanentDeleteDialogOpen,
    renameDialogOpen,
    fileToDelete,
    fileToRename,
    setDeleteDialogOpen,
    setPermanentDeleteDialogOpen,
    setRenameDialogOpen,
    handleDownload,
    handleStarToggle,
    handleRestore,
    handleDeleteClick,
    handleRenameClick,
    confirmDelete,
    confirmPermanentDelete,
    confirmRename,
  };
}
