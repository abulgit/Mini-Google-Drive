"use client";

import { useEffect, useRef } from "react";
import { Loader2, SearchX } from "lucide-react";
import { formatBytes } from "@/lib/utils/utils";
import { getFileIcon, getFileTypeColor } from "@/lib/utils/file-utils";
import type { FileDocument } from "@/types";

interface SearchDropdownProps {
  isOpen: boolean;
  isSearching: boolean;
  searchResults: FileDocument[];
  searchQuery: string;
  onClose: () => void;
  onFileSelect: (file: FileDocument) => void;
}

export function SearchDropdown({
  isOpen,
  isSearching,
  searchResults,
  searchQuery,
  onClose,
  onFileSelect,
}: SearchDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Handle escape key
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen || searchQuery.trim().length < 2) {
    return null;
  }

  const handleFileClick = (file: FileDocument) => {
    onFileSelect(file);
    onClose();
  };

  return (
    <div
      ref={dropdownRef}
      className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg z-50 overflow-hidden max-h-[400px] overflow-y-auto"
    >
      {isSearching ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
          <span className="ml-2 text-sm text-muted-foreground">
            Searching...
          </span>
        </div>
      ) : searchResults.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8">
          <SearchX className="w-8 h-8 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">
            No files match &quot;{searchQuery}&quot;
          </p>
        </div>
      ) : (
        <ul className="py-1">
          {searchResults.map(file => {
            const Icon = getFileIcon(file.fileType);
            const colorClass = getFileTypeColor(file.fileType);

            return (
              <li key={file._id?.toString()}>
                <button
                  type="button"
                  onClick={() => handleFileClick(file)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors text-left"
                >
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${colorClass}`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-card-foreground truncate">
                      {file.originalFileName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {file.fileType.split("/")[1]?.toUpperCase()} •{" "}
                      {formatBytes(file.fileSize)}
                    </p>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
