"use client";

import { motion } from "framer-motion";

function SkeletonPulse({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse bg-zinc-200 dark:bg-zinc-800 rounded ${className}`}
    />
  );
}

export function DashboardSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Header skeleton */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <SkeletonPulse className="h-6 w-16 sm:w-20" />
        <div className="flex items-center gap-2 sm:gap-3">
          <SkeletonPulse className="h-5 w-14 sm:w-16" />
          <SkeletonPulse className="h-8 w-16 sm:w-20" />
        </div>
      </div>

      {/* Grid skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: i * 0.03 }}
          >
            <FileCardSkeleton />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function FileCardSkeleton() {
  return (
    <div className="bg-card border border-border rounded-lg p-3 sm:p-4">
      {/* Icon */}
      <div className="mb-6 sm:mb-8">
        <SkeletonPulse className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg" />
      </div>

      {/* File name */}
      <SkeletonPulse className="h-4 sm:h-5 w-full mb-3" />

      {/* Badge and size row */}
      <div className="flex items-center justify-between mb-2">
        <SkeletonPulse className="h-5 w-10 sm:w-12 rounded-full" />
        <SkeletonPulse className="h-4 w-14 sm:w-16" />
      </div>

      {/* Date */}
      <SkeletonPulse className="h-3 sm:h-4 w-20 sm:w-24" />
    </div>
  );
}

export function ActivitySkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-card rounded-lg border border-border"
    >
      <div className="divide-y divide-border">
        {Array.from({ length: 7 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
            className="flex items-center gap-4 p-4"
          >
            <SkeletonPulse className="w-10 h-10 rounded-lg flex-shrink-0" />
            <div className="flex-1 min-w-0 space-y-2">
              <SkeletonPulse className="h-4 w-64 max-w-full" />
              <SkeletonPulse className="h-3 w-20" />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
