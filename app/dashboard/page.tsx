"use client";

import { DashboardLayout } from "@/components/DashboardLayout";
import { LoadingScreen } from "@/components/LoadingScreen";
import { useDashboardPage } from "@/hooks/useDashboardPage";

export default function DashboardPage() {
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
  } = useDashboardPage({ endpoint: "/api/files" });

  if (status === "loading") {
    return <LoadingScreen />;
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
      loadingMessage="Loading files..."
    />
  );
}
