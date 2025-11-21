"use client";

import { useState, useEffect, useCallback } from "react";
import { useRequireAuth } from "@/hooks/auth/useRequireAuth";
import { LoadingScreen } from "@/components/common/LoadingScreen";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { Sidebar } from "@/components/layout/SidebarComponent";
import { ActivityList } from "@/components/activity/ActivityList";
import type { ActivityLog } from "@/types";

export default function ActivityPage() {
  const { session, status, isAuthenticated } = useRequireAuth();
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const fetchActivities = useCallback(async () => {
    try {
      const response = await fetch("/api/activity");
      if (response.ok) {
        const data = await response.json();
        setActivities(data.activities);
      }
    } catch (error) {
      console.error("Failed to fetch activities:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status === "loading" || !isAuthenticated) {
      return;
    }

    fetchActivities();
  }, [status, isAuthenticated, fetchActivities]);

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
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
