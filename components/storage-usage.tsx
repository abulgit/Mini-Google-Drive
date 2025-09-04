"use client";

import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import type { StorageUsage } from "@/types";

export function StorageUsageCard() {
  const [storage, setStorage] = useState<StorageUsage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStorageUsage();
  }, []);

  const fetchStorageUsage = async () => {
    try {
      const response = await fetch("/api/storage");
      if (response.ok) {
        const data = await response.json();
        setStorage(data.storage);
      }
    } catch (error) {
      console.error("Failed to fetch storage usage:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) {
      return "0 Bytes";
    }
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-2 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!storage) {
    return null;
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium">Storage Used</span>
            <span className="text-muted-foreground">
              {formatBytes(storage.used)} / {formatBytes(storage.total)}
            </span>
          </div>
          <Progress value={storage.percentage} className="h-2" />
          <div className="text-xs text-muted-foreground">
            {storage.percentage}% of 5GB used
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
