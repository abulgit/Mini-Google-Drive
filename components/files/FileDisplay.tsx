"use client";

import { useState } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { FileEmptyState } from "@/components/files/FileEmptyState";
import { FileListView } from "@/components/files/FileListView";
import { FileGridView } from "@/components/files/FileGridView";
import { FileDeleteDialog } from "@/components/modals/FileDeleteDialog";
import { FileRenameDialog } from "@/components/modals/FileRenameDialog";
import { useFileActions } from "@/hooks/files/useFileActions";
import type { FileDocument } from "@/types";

interface FileDisplayProps {
  files: FileDocument[];
  mode: "files" | "trash";
  onFileDeleted: () => void;
  onFileUpdated?: () => void;
  onViewFile: (file: FileDocument) => void;
}

export function FileDisplay({
  files,
  mode,
  onFileDeleted,
  onFileUpdated,
  onViewFile,
}: FileDisplayProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const {
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
  } = useFileActions(onFileDeleted, onFileUpdated);

  const handleView = (fileId: string) => {
    const file = files.find(f => f._id!.toString() === fileId);
    if (file) {
      onViewFile(file);
    }
  };

  const handleDelete = (fileId: string) => {
    const file = files.find(f => f._id!.toString() === fileId);
    if (file) {
      handleDeleteClick(fileId, file, mode);
    }
  };

  const handleRename = (fileId: string) => {
    const file = files.find(f => f._id!.toString() === fileId);
    if (file) {
      handleRenameClick(fileId, file);
    }
  };

  if (files.length === 0) {
    return <FileEmptyState mode={mode} />;
  }

  const commonProps = {
    files,
    mode,
    viewMode,
    deletingFiles,
    processingFiles,
    onViewModeChange: setViewMode,
    onFileClick: handleView,
    onDownload: handleDownload,
    onStarToggle: handleStarToggle,
    onRename: handleRename,
    onDelete: handleDelete,
    onRestore: handleRestore,
  };

  return (
    <>
      <TooltipProvider>
        {viewMode === "list" ? (
          <FileListView {...commonProps} />
        ) : (
          <FileGridView {...commonProps} />
        )}
      </TooltipProvider>

      <FileDeleteDialog
        file={fileToDelete}
        isOpen={deleteDialogOpen}
        isPermanent={false}
        isDeleting={deletingFiles.has(fileToDelete?._id?.toString() || "")}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
      />

      <FileDeleteDialog
        file={fileToDelete}
        isOpen={permanentDeleteDialogOpen}
        isPermanent={true}
        isDeleting={processingFiles.has(fileToDelete?._id?.toString() || "")}
        onClose={() => setPermanentDeleteDialogOpen(false)}
        onConfirm={confirmPermanentDelete}
      />

      <FileRenameDialog
        file={fileToRename}
        isOpen={renameDialogOpen}
        isRenaming={renamingFiles.has(fileToRename?._id?.toString() || "")}
        onClose={() => setRenameDialogOpen(false)}
        onConfirm={confirmRename}
      />
    </>
  );
}
