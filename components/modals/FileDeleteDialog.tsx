import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { FileDocument } from "@/types";

interface FileDeleteDialogProps {
  file: FileDocument | null;
  isOpen: boolean;
  isPermanent: boolean;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function FileDeleteDialog({
  file,
  isOpen,
  isPermanent,
  isDeleting,
  onClose,
  onConfirm,
}: FileDeleteDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isPermanent ? "Delete Permanently" : "Move to Trash"}
          </DialogTitle>
          <DialogDescription>
            {isPermanent ? (
              <>
                Are you sure you want to permanently delete &quot;
                {file?.originalFileName}&quot;? This action cannot be undone and
                the file will be lost forever.
              </>
            ) : (
              <>
                Are you sure you want to move &quot;{file?.originalFileName}
                &quot; to trash? You can restore it later from the trash.
              </>
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting
              ? isPermanent
                ? "Deleting..."
                : "Moving to trash..."
              : isPermanent
                ? "Delete Permanently"
                : "Move to trash"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
