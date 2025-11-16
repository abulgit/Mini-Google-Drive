"use client";

import { useState } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ViewFileModal } from "@/components/ViewFileModal";
import { FileEmptyState } from "@/components/FileEmptyState";
import { FileListView } from "@/components/FileListView";
import { FileGridView } from "@/components/FileGridView";
import { FileDeleteDialog } from "@/components/FileDeleteDialog";
import { FileRenameDialog } from "@/components/FileRenameDialog";
import { useFileActions } from "@/hooks/useFileActions";
import type { FileDocument } from "@/types";

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
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [viewFile, setViewFile] = useState<FileDocument | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

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
      setViewFile(file);
      setIsViewModalOpen(true);
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
