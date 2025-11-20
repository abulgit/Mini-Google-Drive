"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { FileDocument } from "@/types";

interface FileRenameDialogProps {
  file: FileDocument | null;
  isOpen: boolean;
  isRenaming: boolean;
  onClose: () => void;
  onConfirm: (newName: string) => void;
}

export function FileRenameDialog({
  file,
  isOpen,
  isRenaming,
  onClose,
  onConfirm,
}: FileRenameDialogProps) {
  const [newName, setNewName] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (file && isOpen) {
      const fileName = file.originalFileName;
      const lastDotIndex = fileName.lastIndexOf(".");
      const nameWithoutExt =
        lastDotIndex > 0 ? fileName.substring(0, lastDotIndex) : fileName;
      setNewName(nameWithoutExt);
      setError("");
    }
  }, [file, isOpen]);

  const getFileExtension = (fileName: string) => {
    const lastDotIndex = fileName.lastIndexOf(".");
    return lastDotIndex > 0 ? fileName.substring(lastDotIndex) : "";
  };

  const validateFileName = (name: string): string | null => {
    const trimmedName = name.trim();

    if (!trimmedName) {
      return "File name cannot be empty";
    }

    if (trimmedName.length > 255) {
      return "File name is too long (max 255 characters)";
    }

    const dangerousChars = /[<>:"/\\|?*]/;
    if (dangerousChars.test(trimmedName)) {
      return "File name contains invalid characters";
    }

    return null;
  };

  const handleInputChange = (value: string) => {
    setNewName(value);
    const validationError = validateFileName(value);
    setError(validationError || "");
  };

  const handleSubmit = () => {
    if (!file) {
      return;
    }

    const trimmedName = newName.trim();
    const validationError = validateFileName(trimmedName);

    if (validationError) {
      setError(validationError);
      return;
    }

    const extension = getFileExtension(file.originalFileName);
    const fullName = trimmedName + extension;

    if (fullName === file.originalFileName) {
      onClose();
      return;
    }

    onConfirm(fullName);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !error && newName.trim()) {
      handleSubmit();
    }
  };

  if (!file) {
    return null;
  }

  const extension = getFileExtension(file.originalFileName);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename file</DialogTitle>
          <DialogDescription>
            Enter a new name for your file. The file extension will be
            preserved.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Input
              value={newName}
              onChange={e => handleInputChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="File name"
              disabled={isRenaming}
              autoFocus
              className={error ? "border-destructive" : ""}
            />
            {extension && (
              <span className="text-sm text-muted-foreground whitespace-nowrap">
                {extension}
              </span>
            )}
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isRenaming}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isRenaming || !!error || !newName.trim()}
          >
            {isRenaming ? "Renaming..." : "Rename"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
