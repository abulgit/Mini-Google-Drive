import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical, Download, Trash2, Star, RotateCcw } from "lucide-react";

interface FileDropdownMenuProps {
  fileId: string;
  mode: "files" | "trash";
  isStarred?: boolean;
  isDeleting: boolean;
  isProcessing: boolean;
  onDownload: (fileId: string) => void;
  onStarToggle?: (fileId: string, currentStarred: boolean) => void;
  onDelete: (fileId: string) => void;
  onRestore?: (fileId: string) => void;
  className?: string;
}

export function FileDropdownMenu({
  fileId,
  mode,
  isStarred = false,
  isDeleting,
  isProcessing,
  onDownload,
  onStarToggle,
  onDelete,
  onRestore,
  className,
}: FileDropdownMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={className || "w-8 h-8 p-0"}
        >
          <MoreVertical className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onDownload(fileId)}>
          <Download className="w-4 h-4 mr-2" />
          Download
        </DropdownMenuItem>

        {mode === "files" ? (
          <>
            <DropdownMenuItem onClick={() => onStarToggle?.(fileId, isStarred)}>
              <Star
                className={`w-4 h-4 mr-2 ${isStarred ? "fill-current" : ""}`}
              />
              {isStarred ? "Remove from starred" : "Add to starred"}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onDelete(fileId)}
              disabled={isDeleting}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              {isDeleting ? "Moving to trash..." : "Move to trash"}
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuItem
              onClick={() => onRestore?.(fileId)}
              disabled={isProcessing}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              {isProcessing ? "Restoring..." : "Restore"}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onDelete(fileId)}
              disabled={isProcessing}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete permanently
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
