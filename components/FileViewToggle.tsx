import { Grid3X3, List } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FileViewToggleProps {
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
}

export function FileViewToggle({
  viewMode,
  onViewModeChange,
}: FileViewToggleProps) {
  const getListButtonVariant = () =>
    viewMode === "list" ? "secondary" : "ghost";
  const getGridButtonVariant = () =>
    viewMode === "grid" ? "secondary" : "ghost";

  return (
    <div className="flex items-center bg-muted rounded-lg p-1">
      <Button
        variant={getListButtonVariant()}
        size="sm"
        onClick={() => onViewModeChange("list")}
        className="w-8 h-8 p-0 rounded-md"
      >
        <List className="w-4 h-4" />
      </Button>
      <Button
        variant={getGridButtonVariant()}
        size="sm"
        onClick={() => onViewModeChange("grid")}
        className="w-8 h-8 p-0 rounded-md"
      >
        <Grid3X3 className="w-4 h-4" />
      </Button>
    </div>
  );
}
