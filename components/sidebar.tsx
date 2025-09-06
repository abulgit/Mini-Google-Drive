"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  HardDrive,
  Trash2,
  Star,
  Clock,
  Plus,
  Settings,
  HelpCircle,
} from "lucide-react";
import { useEffect } from "react";
import type { StorageUsage } from "@/types";

interface SidebarProps {
  className?: string;
  onNewClick?: () => void;
}

export function Sidebar({ className, onNewClick }: SidebarProps) {
  const [storage, setStorage] = useState<StorageUsage | null>(null);
  const [activeItem, setActiveItem] = useState("my-drive");

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

  const navigationItems = [
    {
      id: "my-drive",
      label: "My Drive",
      icon: HardDrive,
      count: null,
      active: true,
    },
    {
      id: "recent",
      label: "Recent",
      icon: Clock,
      count: null,
      active: false,
    },
    {
      id: "starred",
      label: "Starred",
      icon: Star,
      count: null,
      active: false,
    },
    {
      id: "trash",
      label: "Trash",
      icon: Trash2,
      count: null,
      active: false,
    },
  ];

  return (
    <div
      className={cn(
        "flex flex-col h-full bg-white border-r border-gray-200",
        className
      )}
    >
      {/* New Button */}
      <div className="p-4">
        <Button
          onClick={onNewClick}
          className="w-full justify-start gap-3 h-12 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 shadow-sm rounded-2xl font-medium"
          variant="outline"
        >
          <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
            <Plus className="w-4 h-4 text-white" />
          </div>
          New
        </Button>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-3">
        <nav className="space-y-1">
          {navigationItems.map(item => {
            const Icon = item.icon;
            const isActive = activeItem === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveItem(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                  isActive
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100"
                )}
              >
                <Icon
                  className={cn(
                    "w-5 h-5",
                    isActive ? "text-blue-700" : "text-gray-500"
                  )}
                />
                <span className="flex-1 text-left">{item.label}</span>
                {item.count && (
                  <Badge variant="secondary" className="text-xs">
                    {item.count}
                  </Badge>
                )}
              </button>
            );
          })}
        </nav>

        {/* Storage Section */}
        <div className="mt-8 px-3">
          <div className="space-y-3">
            <div className="text-sm font-medium text-gray-900">Storage</div>

            {storage ? (
              <div className="space-y-3">
                <div className="space-y-2">
                  <Progress
                    value={storage.percentage}
                    className="h-2 bg-gray-100"
                  />
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>{formatBytes(storage.used)} used</span>
                    <span>of {formatBytes(storage.total)}</span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs h-8 rounded-lg border-blue-200 text-blue-600 hover:bg-blue-50"
                >
                  Buy storage
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="h-2 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="p-3 border-t border-gray-100">
        <div className="space-y-1">
          <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            <Settings className="w-5 h-5 text-gray-500" />
            <span>Settings</span>
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            <HelpCircle className="w-5 h-5 text-gray-500" />
            <span>Help</span>
          </button>
        </div>
      </div>
    </div>
  );
}
