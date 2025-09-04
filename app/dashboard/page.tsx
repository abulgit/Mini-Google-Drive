"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard-header";
import { StorageUsageCard } from "@/components/storage-usage";
import { FileUpload } from "@/components/file-upload";
import { FileList } from "@/components/file-list";
import type { FileDocument } from "@/types";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [files, setFiles] = useState<FileDocument[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") {
      return;
    }

    if (!session) {
      router.push("/login");
      return;
    }

    fetchFiles();
  }, [session, status, router]);

  const fetchFiles = async () => {
    try {
      const response = await fetch("/api/files");
      if (response.ok) {
        const data = await response.json();
        setFiles(data.files);
      }
    } catch (error) {
      console.error("Failed to fetch files:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadSuccess = () => {
    fetchFiles(); // Refresh file list and storage usage
  };

  const handleFileDeleted = () => {
    fetchFiles(); // Refresh file list and storage usage
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Storage Usage */}
          <div className="max-w-md">
            <StorageUsageCard />
          </div>

          {/* File Upload */}
          <FileUpload onUploadSuccess={handleUploadSuccess} />

          {/* File List */}
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Loading files...</p>
            </div>
          ) : (
            <FileList files={files} onFileDeleted={handleFileDeleted} />
          )}
        </div>
      </main>
    </div>
  );
}
