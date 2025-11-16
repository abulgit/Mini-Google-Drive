import { useState, useRef } from "react";
import { toast } from "sonner";
import { STORAGE_LIMIT, validateFileType } from "@/types";
import { useCSRFToken } from "@/hooks/useCSRFToken";
import { formatBytes } from "@/lib/utils";

interface UseFileUploadOptions {
  onSuccess: () => void;
  showToast?: boolean;
}

export function useFileUpload({
  onSuccess,
  showToast = true,
}: UseFileUploadOptions) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [uploadComplete, setUploadComplete] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { csrfToken, loading: csrfLoading } = useCSRFToken();

  const validateFile = (file: File): string | null => {
    const fileTypeError = validateFileType(file);
    if (fileTypeError) {
      return fileTypeError;
    }

    if (file.size > STORAGE_LIMIT) {
      return `File size (${formatBytes(file.size)}) exceeds maximum limit of ${formatBytes(STORAGE_LIMIT)}`;
    }
    if (file.size === 0) {
      return "Cannot upload empty files";
    }
    if (!file.name || file.name.trim() === "") {
      return "File must have a valid name";
    }
    const dangerousChars = /[<>:"/\\|?*]/;
    if (dangerousChars.test(file.name)) {
      return "File name contains invalid characters";
    }
    return null;
  };

  const uploadFile = async (file: File) => {
    if (!csrfToken) {
      const errorMsg = "Security token not available. Please refresh the page.";
      setError(errorMsg);
      if (showToast) toast.error(errorMsg);
      return;
    }

    setUploading(true);
    setError(null);
    setUploadProgress(0);
    setUploadComplete(false);

    let blobPath = "";

    try {
      const sasResponse = await fetch("/api/upload/sas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken,
        },
        body: JSON.stringify({
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
        }),
      });

      if (!sasResponse.ok) {
        const errorData = await sasResponse.json();
        throw new Error(errorData.error || "Failed to get upload URL");
      }

      const sasData = await sasResponse.json();
      const { uploadUrl } = sasData;
      blobPath = sasData.blobPath;

      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.upload.addEventListener("progress", e => {
          if (e.lengthComputable) {
            const percentComplete = Math.round((e.loaded / e.total) * 95);
            setUploadProgress(percentComplete);
          }
        });

        xhr.addEventListener("load", () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            setUploadProgress(95);
            resolve();
          } else {
            reject(new Error(`Upload failed with status: ${xhr.status}`));
          }
        });

        xhr.addEventListener("error", () => {
          reject(new Error("Network error during upload"));
        });

        xhr.addEventListener("abort", () => {
          reject(new Error("Upload cancelled"));
        });

        xhr.open("PUT", uploadUrl, true);
        xhr.setRequestHeader("x-ms-blob-type", "BlockBlob");
        xhr.setRequestHeader("Content-Type", file.type);
        xhr.send(file);
      });

      setUploadProgress(98);

      const completeResponse = await fetch("/api/upload/complete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken,
        },
        body: JSON.stringify({
          blobPath,
          originalFileName: file.name,
        }),
      });

      if (!completeResponse.ok) {
        const errorData = await completeResponse.json();
        throw new Error(errorData.error || "Failed to complete upload");
      }

      setUploadProgress(100);
      setUploadComplete(true);

      if (showToast) toast.success("File uploaded successfully!");

      setTimeout(
        () => {
          onSuccess();
          setUploadProgress(0);
          setUploadComplete(false);
        },
        showToast ? 1500 : 1000
      );
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Upload failed";
      setError(errorMsg);
      if (showToast) toast.error(errorMsg);
      setUploadProgress(0);
      setUploadComplete(false);
    } finally {
      setTimeout(() => {
        setUploading(false);
      }, 1000);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleFileSelect = (file: File) => {
    if (file) {
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        if (showToast) toast.error(validationError);
        return;
      }
      uploadFile(file);
    }
  };

  const resetUpload = () => {
    setError(null);
    setUploadProgress(0);
    setUploadComplete(false);
  };

  return {
    uploading,
    uploadProgress,
    uploadComplete,
    error,
    csrfToken,
    csrfLoading,
    fileInputRef,
    handleFileSelect,
    resetUpload,
  };
}
