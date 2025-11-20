import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatBytes, formatDate } from "@/lib/utils/utils";
import {
  getFileIcon,
  getFileTypeColor,
  getFileExtension,
} from "@/lib/utils/file-utils";
import { FileDropdownMenu } from "@/components/files/FileDropdownMenu";
import { FileViewToggle } from "@/components/files/FileViewToggle";
import type { FileDocument } from "@/types";

interface FileGridViewProps {
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

export function FileGridView({
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
}: FileGridViewProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h2 className="text-base sm:text-lg font-medium text-foreground">
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

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
        {files.map(file => {
          const Icon = getFileIcon(file.fileType);
          const isDeleting = deletingFiles.has(file._id!.toString());
          const isProcessing = processingFiles.has(file._id!.toString());

          return (
            <div key={file._id?.toString()} className="group">
              <div
                className={`bg-card border border-border rounded-lg p-3 sm:p-4 hover:shadow-md hover:border-primary/20 transition-all ${mode === "trash" ? "opacity-70" : ""}`}
              >
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <div
                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center cursor-pointer ${getFileTypeColor(file.fileType)}`}
                    onClick={() => onFileClick(file._id!.toString())}
                  >
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>

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
                    className="w-6 h-6 p-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
                  />
                </div>

                <div className="space-y-1">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <p
                        className="text-xs sm:text-sm font-medium text-card-foreground truncate cursor-pointer"
                        onClick={() => onFileClick(file._id!.toString())}
                      >
                        {file.originalFileName}
                      </p>
                    </TooltipTrigger>
                    <TooltipContent>{file.originalFileName}</TooltipContent>
                  </Tooltip>

                  <div className="flex items-center justify-between gap-1">
                    <Badge
                      variant="secondary"
                      className="text-[10px] sm:text-xs px-1.5 py-0"
                    >
                      {getFileExtension(file.originalFileName)}
                    </Badge>
                    <span className="text-[10px] sm:text-xs text-muted-foreground">
                      {formatBytes(file.fileSize)}
                    </span>
                  </div>

                  <p className="text-[10px] sm:text-xs text-muted-foreground">
                    {mode === "trash"
                      ? `Deleted ${formatDate(file.deletedAt!)}`
                      : formatDate(file.uploadedAt)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
