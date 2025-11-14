import { Badge } from "@/components/ui/badge";
import { formatBytes, formatDate } from "@/lib/utils";
import {
  getFileIcon,
  getFileTypeColor,
  getFileExtension,
} from "@/lib/file-utils";
import { FileDropdownMenu } from "@/components/FileDropdownMenu";
import { FileViewToggle } from "@/components/FileViewToggle";
import type { FileDocument } from "@/types";

interface FileListViewProps {
  files: FileDocument[];
  mode: "files" | "trash";
  viewMode: "grid" | "list";
  deletingFiles: Set<string>;
  processingFiles: Set<string>;
  onViewModeChange: (mode: "grid" | "list") => void;
  onFileClick: (fileId: string) => void;
  onDownload: (fileId: string) => void;
  onStarToggle: (fileId: string, currentStarred: boolean) => void;
  onRename: (fileId: string) => void;
  onDelete: (fileId: string) => void;
  onRestore: (fileId: string) => void;
}

export function FileListView({
  files,
  mode,
  viewMode,
  deletingFiles,
  processingFiles,
  onViewModeChange,
  onFileClick,
  onDownload,
  onStarToggle,
  onRename,
  onDelete,
  onRestore,
}: FileListViewProps) {
  return (
    <div className="bg-card rounded-lg border border-border">
      <div className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-medium text-card-foreground">
            {mode === "trash" ? "Trash" : "Files"}
          </h2>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="text-xs sm:text-sm text-muted-foreground">
              {files.length} items
            </div>
            <FileViewToggle
              viewMode={viewMode}
              onViewModeChange={onViewModeChange}
            />
          </div>
        </div>
      </div>

      <div className="divide-y divide-border">
        {files.map(file => {
          const Icon = getFileIcon(file.fileType);
          const isDeleting = deletingFiles.has(file._id!.toString());
          const isProcessing = processingFiles.has(file._id!.toString());

          return (
            <div
              key={file._id?.toString()}
              className={`flex items-center px-3 sm:px-4 md:px-6 py-3 sm:py-4 hover:bg-muted/50 group ${mode === "trash" ? "opacity-70" : ""}`}
            >
              <div className="flex items-center flex-1 min-w-0">
                <div
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center mr-3 sm:mr-4 cursor-pointer ${getFileTypeColor(file.fileType)}`}
                  onClick={e => {
                    e.stopPropagation();
                    onFileClick(file._id!.toString());
                  }}
                >
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className="text-xs sm:text-sm font-medium text-card-foreground truncate cursor-pointer"
                    title={file.originalFileName}
                    onClick={e => {
                      e.stopPropagation();
                      onFileClick(file._id!.toString());
                    }}
                  >
                    {file.originalFileName}
                  </p>
                  <p className="text-[10px] sm:text-sm text-muted-foreground truncate">
                    {mode === "trash"
                      ? `Deleted ${formatDate(file.deletedAt!)} • ${formatBytes(file.fileSize)}`
                      : `${formatDate(file.uploadedAt)} • ${formatBytes(file.fileSize)}`}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 sm:gap-2 ml-2">
                <Badge
                  variant="secondary"
                  className="text-[10px] sm:text-xs hidden sm:inline-flex"
                >
                  {getFileExtension(file.originalFileName)}
                </Badge>

                <FileDropdownMenu
                  fileId={file._id!.toString()}
                  mode={mode}
                  isStarred={file.starred}
                  isDeleting={isDeleting}
                  isProcessing={isProcessing}
                  onDownload={onDownload}
                  onStarToggle={onStarToggle}
                  onRename={onRename}
                  onDelete={onDelete}
                  onRestore={onRestore}
                  className="w-7 h-7 sm:w-8 sm:h-8 p-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
