import { useState, useEffect, useCallback } from "react";
import { useStorage } from "@/components/providers/StorageContext";
import { useRequireAuth } from "@/hooks/auth/useRequireAuth";
import type { FileDocument } from "@/types";

interface UseDashboardPageOptions {
  endpoint: string;
  pageSize: number;
}

interface PaginationMetadata {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  limit: number;
}

export function useDashboardPage({
  endpoint,
  pageSize,
}: UseDashboardPageOptions) {
  const { session, status, isAuthenticated } = useRequireAuth();
  const { refreshStorage } = useStorage();
  const [files, setFiles] = useState<FileDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationMetadata>({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    limit: pageSize,
  });

  const fetchFiles = useCallback(
    async (page: number = currentPage) => {
      setLoading(true);
      try {
        const url = `${endpoint}?page=${page}&limit=${pageSize}`;
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          setFiles(data.files);
          if (data.pagination) {
            setPagination(data.pagination);
          }
        }
      } catch (error) {
        console.error("Failed to fetch files:", error);
      } finally {
        setLoading(false);
      }
    },
    [endpoint, pageSize, currentPage]
  );

  useEffect(() => {
    if (status === "loading" || !isAuthenticated) {
      return;
    }

    fetchFiles(currentPage);
  }, [status, isAuthenticated, currentPage, fetchFiles]);

  const handleUploadSuccess = async () => {
    setCurrentPage(1);
    await fetchFiles(1);
    await refreshStorage();
  };

  const handleFileAction = async () => {
    await fetchFiles(currentPage);
    await refreshStorage();
  };

  const handleNewClick = () => {
    setIsUploadModalOpen(true);
  };

  const goToNextPage = () => {
    if (currentPage < pagination.totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= pagination.totalPages) {
      setCurrentPage(page);
    }
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
    pagination,
    goToNextPage,
    goToPreviousPage,
    goToPage,
  };
}
