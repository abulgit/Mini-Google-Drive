import { Trash2, Folder } from "lucide-react";

interface FileEmptyStateProps {
  mode: "files" | "trash";
}

export function FileEmptyState({ mode }: FileEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div
        className={`w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6 ${mode === "trash" ? "opacity-70" : ""}`}
      >
        {mode === "trash" ? (
          <Trash2 className="w-12 h-12 text-muted-foreground" />
        ) : (
          <Folder className="w-12 h-12 text-muted-foreground" />
        )}
      </div>
      <h3 className="text-lg font-medium text-foreground mb-2">
        {mode === "trash" ? "Trash is empty" : "No files yet"}
      </h3>
      <p className="text-muted-foreground max-w-sm">
        {mode === "trash"
          ? "Deleted files will appear here. You can restore them or delete them permanently."
          : "Upload your first file to get started with Mini Drive"}
      </p>
    </div>
  );
}
