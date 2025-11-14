"use client";

import { DashboardHeader } from "@/components/dashboard-header";
import { Sidebar } from "@/components/sidebar";
import { FileDisplay } from "@/components/FileDisplay";
import { UploadModal } from "@/components/upload-modal";
import type { FileDocument } from "@/types";

interface DashboardLayoutProps {
  files: FileDocument[];
  loading: boolean;
  mode: "files" | "trash";
  isUploadModalOpen: boolean;
  onUploadModalClose: () => void;
  onUploadSuccess: () => void;
  onFileAction: () => void;
  onNewClick: () => void;
  loadingMessage?: string;
}

export function DashboardLayout({
  files,
  loading,
  mode,
  isUploadModalOpen,
  onUploadModalClose,
  onUploadSuccess,
  onFileAction,
  onNewClick,
  loadingMessage = "Loading files...",
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <div className="flex h-[calc(100vh-73px)]">
        <div className="w-64 flex-shrink-0">
          <Sidebar onNewClick={onNewClick} />
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex-1 overflow-auto">
            <div className="p-6">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                  <p className="mt-4 text-muted-foreground">{loadingMessage}</p>
                </div>
              ) : (
                <FileDisplay
                  mode={mode}
                  files={files}
                  onFileDeleted={onFileAction}
                  onFileUpdated={onFileAction}
                />
              )}
            </div>
          </main>
        </div>
      </div>

      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={onUploadModalClose}
        onUploadSuccess={onUploadSuccess}
      />
    </div>
  );
}
