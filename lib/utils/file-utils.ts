import {
  FileText,
  Image as ImageIcon,
  Video,
  Music,
  Archive,
  File,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export function getFileIcon(fileType: string): LucideIcon {
  if (fileType.startsWith("image/")) {
    return ImageIcon;
  }
  if (fileType.startsWith("video/")) {
    return Video;
  }
  if (fileType.startsWith("audio/")) {
    return Music;
  }
  if (fileType.includes("pdf") || fileType.includes("text")) {
    return FileText;
  }
  if (fileType.includes("zip") || fileType.includes("rar")) {
    return Archive;
  }
  return File;
}

export function getFileTypeColor(fileType: string): string {
  if (fileType.startsWith("image/")) {
    return "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300";
  }
  if (fileType.startsWith("video/")) {
    return "bg-zinc-200 text-zinc-800 dark:bg-zinc-700 dark:text-zinc-200";
  }
  if (fileType.startsWith("audio/")) {
    return "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400";
  }
  if (fileType.includes("pdf")) {
    return "bg-zinc-200 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300";
  }
  if (fileType.includes("text")) {
    return "bg-zinc-50 text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400";
  }
  if (fileType.includes("zip") || fileType.includes("rar")) {
    return "bg-zinc-300 text-zinc-800 dark:bg-zinc-600 dark:text-zinc-200";
  }
  return "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400";
}

export function getFileExtension(fileName: string): string {
  const parts = fileName.split(".");
  return parts.length > 1 ? parts[parts.length - 1].toUpperCase() : "FILE";
}
