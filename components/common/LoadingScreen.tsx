"use client";

function SkeletonPulse({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse bg-zinc-200 dark:bg-zinc-800 ${className}`}
    />
  );
}

export function LoadingScreen() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header skeleton */}
      <div className="h-[57px] md:h-[73px] border-b border-zinc-200 dark:border-zinc-800 px-4 md:px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <SkeletonPulse className="w-8 h-8 rounded md:hidden" />
          <SkeletonPulse className="w-24 h-6 rounded" />
        </div>
        <div className="flex items-center gap-3">
          <SkeletonPulse className="w-48 h-9 rounded hidden md:block" />
          <SkeletonPulse className="w-9 h-9 rounded-full" />
        </div>
      </div>

      <div className="flex h-[calc(100vh-57px)] md:h-[calc(100vh-73px)]">
        {/* Sidebar skeleton */}
        <div className="hidden md:block w-64 border-r border-zinc-200 dark:border-zinc-800 p-4">
          <SkeletonPulse className="w-full h-10 rounded mb-6" />
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonPulse key={i} className="w-full h-9 rounded" />
            ))}
          </div>
          <div className="mt-8 space-y-2">
            <SkeletonPulse className="w-20 h-4 rounded mb-3" />
            {Array.from({ length: 3 }).map((_, i) => (
              <SkeletonPulse key={i} className="w-full h-8 rounded" />
            ))}
          </div>
        </div>

        {/* Main content skeleton */}
        <div className="flex-1 p-4 md:p-6">
          <div className="flex items-center justify-between mb-6">
            <SkeletonPulse className="h-6 w-24 rounded" />
            <div className="flex items-center gap-3">
              <SkeletonPulse className="h-5 w-16 rounded" />
              <SkeletonPulse className="h-8 w-20 rounded" />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg p-3 sm:p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <SkeletonPulse className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg" />
                  <SkeletonPulse className="w-6 h-6 rounded" />
                </div>
                <div className="space-y-2">
                  <SkeletonPulse className="h-4 w-full rounded" />
                  <div className="flex items-center justify-between">
                    <SkeletonPulse className="h-4 w-10 rounded" />
                    <SkeletonPulse className="h-3 w-12 rounded" />
                  </div>
                  <SkeletonPulse className="h-3 w-20 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
