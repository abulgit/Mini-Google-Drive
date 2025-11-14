import { useState, useEffect, useCallback } from "react";
import { useStorage } from "@/components/storage-context";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import type { FileDocument } from "@/types";

interface UseDashboardPageOptions {
  endpoint: string;
}

export function useDashboardPage({ endpoint }: UseDashboardPageOptions) {
  const { session, status, isAuthenticated } = useRequireAuth();
  const { refreshStorage } = useStorage();
  const [files, setFiles] = useState<FileDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const fetchFiles = useCallback(async () => {
    try {
      const response = await fetch(endpoint);
      if (response.ok) {
        const data = await response.json();
        setFiles(data.files);
      }
    } catch (error) {
      console.error("Failed to fetch files:", error);
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    if (status === "loading" || !isAuthenticated) {
      return;
    }

    fetchFiles();
  }, [status, isAuthenticated, fetchFiles]);

  const handleUploadSuccess = async () => {
    await fetchFiles();
    await refreshStorage();
  };

  const handleFileAction = async () => {
    await fetchFiles();
    await refreshStorage();
  };

  const handleNewClick = () => {
    setIsUploadModalOpen(true);
  };

  return {
    session,
    status,
    files,
    loading,
    isUploadModalOpen,
    setIsUploadModalOpen,
    handleUploadSuccess,
    handleFileAction,
    handleNewClick,
  };
}
