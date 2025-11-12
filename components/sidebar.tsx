"use client";

import { useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { cn, formatBytes } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { useStorage } from "@/components/storage-context";

interface SidebarProps {
  className?: string;
  onNewClick?: () => void;
}

export function Sidebar({ className, onNewClick }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { storage, loading, fetchStorage } = useStorage();
  const [buyStorageModalOpen, setBuyStorageModalOpen] = useState(false);

  // Determine active item based on current path
  const getActiveItem = useCallback(() => {
    if (pathname === "/dashboard/starred") {
      return "starred";
    }
    if (pathname === "/dashboard/recent") {
      return "recent";
    }
    if (pathname === "/dashboard/trash") {
      return "trash";
    }
    return "my-drive";
  }, [pathname]);

  const [activeItem, setActiveItem] = useState(getActiveItem());

  // Fetch storage on mount if not already loaded
  useEffect(() => {
    fetchStorage();
  }, [fetchStorage]);

  useEffect(() => {
    setActiveItem(getActiveItem());
  }, [pathname, getActiveItem]);

  const handleNavigation = (itemId: string) => {
    setActiveItem(itemId);
    switch (itemId) {
      case "my-drive":
        router.push("/dashboard");
        break;
      case "starred":
        router.push("/dashboard/starred");
        break;
      case "recent":
        // Future implementation
        break;
      case "trash":
        router.push("/dashboard/trash");
        break;
    }
  };

  const navigationItems = [
    {
      id: "my-drive",
      label: "My Drive",
      icon: HardDrive,
      count: null,
    },
    {
      id: "recent",
      label: "Recent",
      icon: Clock,
      count: null,
    },
    {
      id: "starred",
      label: "Starred",
      icon: Star,
      count: null,
    },
    {
      id: "trash",
      label: "Trash",
      icon: Trash2,
      count: null,
    },
  ];

  return (
    <div
      className={cn(
        "flex flex-col h-full bg-card border-r border-border",
        className
      )}
    >
      {/* New Button */}
      <div className="p-4">
        <Button
          onClick={onNewClick}
          className="w-full justify-start gap-3 h-12 bg-card hover:bg-muted text-card-foreground border border-border shadow-sm rounded-2xl font-medium"
        >
          <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
            <Plus className="w-4 h-4 text-primary-foreground" />
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
                onClick={() => handleNavigation(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-card-foreground hover:bg-muted"
                )}
              >
                <Icon
                  className={cn(
                    "w-5 h-5",
                    isActive ? "text-primary" : "text-muted-foreground"
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
            <div className="text-sm font-medium text-card-foreground">
              Storage
            </div>

            {storage && !loading ? (
              <div className="space-y-3">
                <div className="space-y-2">
                  <Progress
                    value={storage.percentage}
                    className="h-2 bg-muted"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{formatBytes(storage.used)} used</span>
                    <span>of {formatBytes(storage.total)}</span>
                  </div>
                </div>

                <Button
                  size="sm"
                  className="w-full text-xs h-8 rounded-lg border border-primary text-foreground hover:bg-primary/10"
                  onClick={() => setBuyStorageModalOpen(true)}
                >
                  Buy storage
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="h-2 bg-muted rounded animate-pulse"></div>
                <div className="h-4 bg-muted rounded animate-pulse"></div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="p-3 border-t border-border">
        <div className="space-y-1">
          <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-card-foreground hover:bg-muted rounded-lg transition-colors">
            <Settings className="w-5 h-5 text-muted-foreground" />
            <span>Settings</span>
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-card-foreground hover:bg-muted rounded-lg transition-colors">
            <HelpCircle className="w-5 h-5 text-muted-foreground" />
            <span>Help</span>
          </button>
        </div>
      </div>

      {/* Buy Storage Modal */}
      <Dialog open={buyStorageModalOpen} onOpenChange={setBuyStorageModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Coming Soon</DialogTitle>
            <DialogDescription>
              We&apos;re working hard to bring you storage upgrade options. This
              feature will be available soon!
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
