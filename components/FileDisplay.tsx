"use client";

import { useState } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ViewFileModal } from "@/components/view-file-modal";
import { FileEmptyState } from "@/components/FileEmptyState";
import { FileListView } from "@/components/FileListView";
import { FileGridView } from "@/components/FileGridView";
import { FileDeleteDialog } from "@/components/FileDeleteDialog";
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
    deleteDialogOpen,
    permanentDeleteDialogOpen,
    fileToDelete,
    setDeleteDialogOpen,
    setPermanentDeleteDialogOpen,
    handleDownload,
    handleStarToggle,
    handleRestore,
    handleDeleteClick,
    confirmDelete,
    confirmPermanentDelete,
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
