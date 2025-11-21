"use client";

import { useState, useEffect, useCallback } from "react";
import { useRequireAuth } from "@/hooks/auth/useRequireAuth";
import { LoadingScreen } from "@/components/common/LoadingScreen";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { Sidebar } from "@/components/layout/SidebarComponent";
import { ActivityList } from "@/components/activity/ActivityList";
import { Button } from "@/components/ui/button";
import type { ActivityLog } from "@/types";

interface PaginationMetadata {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  limit: number;
}

export default function ActivityPage() {
  const { session, status, isAuthenticated } = useRequireAuth();
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationMetadata>({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    limit: 7,
  });

  const fetchActivities = useCallback(
    async (page: number = 1, append: boolean = false) => {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }
      try {
        const response = await fetch(`/api/activity?page=${page}&limit=7`);
        if (response.ok) {
          const data = await response.json();
          if (append) {
            setActivities(prev => [...prev, ...data.activities]);
          } else {
            setActivities(data.activities);
          }
          if (data.pagination) {
            setPagination(data.pagination);
          }
        }
      } catch (error) {
        console.error("Failed to fetch activities:", error);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    []
  );

  useEffect(() => {
    if (status === "loading" || !isAuthenticated) {
      return;
    }

    fetchActivities(1, false);
  }, [status, isAuthenticated, fetchActivities]);

  const loadMore = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    fetchActivities(nextPage, true);
  };

  const hasMore = currentPage < pagination.totalPages;

  if (status === "loading") {
    return <LoadingScreen />;
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader onMenuClick={() => setIsMobileSidebarOpen(true)} />

      <div className="flex h-[calc(100vh-57px)] md:h-[calc(100vh-73px)]">
        {/* Desktop Sidebar */}
        <div className="hidden md:block w-64 flex-shrink-0">
          <Sidebar />
        </div>

        {/* Mobile Sidebar Overlay */}
        {isMobileSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setIsMobileSidebarOpen(false)}
          >
            <div
              className="w-64 h-full bg-card"
              onClick={e => e.stopPropagation()}
            >
              <Sidebar />
            </div>
          </div>
        )}

        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex-1 overflow-auto">
            <div className="p-3 sm:p-4 md:p-6">
              <div className="mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                  Activity
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Your recent file activities
                </p>
              </div>
              <ActivityList activities={activities} loading={loading} />
              {!loading && hasMore && (
                <div className="flex justify-center mt-6">
                  <Button
                    onClick={loadMore}
                    disabled={loadingMore}
                    variant="outline"
                    size="lg"
                  >
                    {loadingMore ? "Loading..." : "Load More"}
                  </Button>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
