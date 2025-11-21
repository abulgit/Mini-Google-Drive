import {
  Upload,
  Eye,
  Download,
  FileEdit,
  Trash2,
  RotateCcw,
  Clock,
} from "lucide-react";
import { formatRelativeTime } from "@/lib/utils/utils";
import type { ActivityLog, ActivityAction } from "@/types";

interface ActivityListProps {
  activities: ActivityLog[];
  loading: boolean;
}

function getActivityIcon(action: ActivityAction) {
  switch (action) {
    case "upload":
      return Upload;
    case "view":
      return Eye;
    case "download":
      return Download;
    case "rename":
      return FileEdit;
    case "delete":
      return Trash2;
    case "restore":
      return RotateCcw;
  }
}

function getActivityColor(action: ActivityAction) {
  switch (action) {
    case "upload":
      return "bg-green-500/10 text-green-600 dark:text-green-400";
    case "view":
      return "bg-blue-500/10 text-blue-600 dark:text-blue-400";
    case "download":
      return "bg-purple-500/10 text-purple-600 dark:text-purple-400";
    case "rename":
      return "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400";
    case "delete":
      return "bg-red-500/10 text-red-600 dark:text-red-400";
    case "restore":
      return "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400";
  }
}

function getActivityText(activity: ActivityLog) {
  switch (activity.action) {
    case "upload":
      return (
        <>
          Uploaded <span className="font-medium">{activity.fileName}</span>
        </>
      );
    case "view":
      return (
        <>
          Viewed <span className="font-medium">{activity.fileName}</span>
        </>
      );
    case "download":
      return (
        <>
          Downloaded <span className="font-medium">{activity.fileName}</span>
        </>
      );
    case "rename":
      return (
        <>
          Renamed{" "}
          <span className="font-medium">{activity.metadata?.oldName}</span> to{" "}
          <span className="font-medium">{activity.metadata?.newName}</span>
        </>
      );
    case "delete":
      return (
        <>
          Deleted <span className="font-medium">{activity.fileName}</span>
        </>
      );
    case "restore":
      return (
        <>
          Restored <span className="font-medium">{activity.fileName}</span>
        </>
      );
  }
}

export function ActivityList({ activities, loading }: ActivityListProps) {
  if (loading) {
    return (
      <div className="bg-card rounded-lg border border-border p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="bg-card rounded-lg border border-border p-12">
        <div className="text-center">
          <Clock className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-card-foreground mb-2">
            No activity yet
          </h3>
          <p className="text-sm text-muted-foreground">
            Your file activities will appear here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border border-border">
      <div className="divide-y divide-border">
        {activities.map(activity => {
          const Icon = getActivityIcon(activity.action);
          const colorClass = getActivityColor(activity.action);

          return (
            <div
              key={activity._id?.toString()}
              className="flex items-start gap-4 p-4 hover:bg-muted/50 transition-colors"
            >
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${colorClass}`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-card-foreground">
                  {getActivityText(activity)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatRelativeTime(activity.timestamp)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
