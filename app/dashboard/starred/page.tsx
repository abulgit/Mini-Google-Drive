"use client";

import { DashboardLayout } from "@/components/DashboardLayout";
import { useDashboardPage } from "@/hooks/useDashboardPage";

export default function StarredPage() {
  const {
    status,
    session,
    files,
    loading,
    isUploadModalOpen,
    setIsUploadModalOpen,
    handleUploadSuccess,
    handleFileAction,
    handleNewClick,
  } = useDashboardPage({ endpoint: "/api/files/starred" });

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/20">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <DashboardLayout
      files={files}
      loading={loading}
      mode="files"
      isUploadModalOpen={isUploadModalOpen}
      onUploadModalClose={() => setIsUploadModalOpen(false)}
      onUploadSuccess={handleUploadSuccess}
      onFileAction={handleFileAction}
      onNewClick={handleNewClick}
      loadingMessage="Loading starred files..."
    />
  );
}
