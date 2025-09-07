"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard-header";
import { Sidebar } from "@/components/sidebar";
import { UploadModal } from "@/components/upload-modal";
import { FileDisplay } from "@/components/FileDisplay";
import { useStorage } from "@/components/storage-context";
import type { FileDocument } from "@/types";

export default function TrashPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { refreshStorage } = useStorage();
  const [files, setFiles] = useState<FileDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  useEffect(() => {
    if (status === "loading") {
      return;
    }

    if (!session) {
      router.push("/");
      return;
    }

    fetchTrashFiles();
  }, [session, status, router]);

  const fetchTrashFiles = async () => {
    try {
      const response = await fetch("/api/files/trash");
      if (response.ok) {
        const data = await response.json();
        setFiles(data.files);
      }
    } catch (error) {
      console.error("Failed to fetch trash files:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadSuccess = async () => {
    await fetchTrashFiles(); // Refresh file list
    await refreshStorage(); // Refresh storage usage
  };

  const handleFileUpdated = async () => {
    await fetchTrashFiles(); // Refresh file list after restore/permanent delete
    await refreshStorage(); // Refresh storage usage after permanent delete
  };

  const handleNewClick = () => {
    setIsUploadModalOpen(true);
  };

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
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <div className="flex h-[calc(100vh-73px)]">
        {/* Sidebar */}
        <div className="w-64 flex-shrink-0">
          <Sidebar onNewClick={handleNewClick} />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex-1 overflow-auto">
            <div className="p-6">
              {/* Trash Files Section */}
              {loading ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                  <p className="mt-4 text-muted-foreground">
                    Loading trash files...
                  </p>
                </div>
              ) : (
                <FileDisplay
                  mode="trash"
                  files={files}
                  onFileDeleted={handleFileUpdated}
                  onFileUpdated={handleFileUpdated}
                />
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Upload Modal */}
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUploadSuccess={handleUploadSuccess}
      />
    </div>
  );
}
