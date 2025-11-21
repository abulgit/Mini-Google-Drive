"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { LoadingScreen } from "@/components/common/LoadingScreen";
import { useDashboardPage } from "@/hooks/dashboard/useDashboardPage";

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
    pagination,
    goToNextPage,
    goToPreviousPage,
    goToPage,
  } = useDashboardPage({ endpoint: "/api/files", pageSize: 18 });

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
      pagination={pagination}
      onNextPage={goToNextPage}
      onPreviousPage={goToPreviousPage}
      onGoToPage={goToPage}
    />
  );
}
