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
    return "bg-green-50 text-green-700";
  }
  if (fileType.startsWith("video/")) {
    return "bg-purple-50 text-purple-700";
  }
  if (fileType.startsWith("audio/")) {
    return "bg-blue-50 text-blue-700";
  }
  if (fileType.includes("pdf")) {
    return "bg-red-50 text-red-700";
  }
  if (fileType.includes("text")) {
    return "bg-muted text-muted-foreground";
  }
  if (fileType.includes("zip") || fileType.includes("rar")) {
    return "bg-orange-50 text-orange-700";
  }
  return "bg-muted text-muted-foreground";
}

export function getFileExtension(fileName: string): string {
  const parts = fileName.split(".");
  return parts.length > 1 ? parts[parts.length - 1].toUpperCase() : "FILE";
}
