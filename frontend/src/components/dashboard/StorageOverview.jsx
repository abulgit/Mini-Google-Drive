import React from 'react';
import { FiHardDrive, FiFile, FiCloud } from 'react-icons/fi';

export const StorageOverview = ({ storageStats }) => {
  if (!storageStats) {
    return (
      <div className="mb-6 p-6 bg-zinc-800 rounded-xl border border-zinc-700 animate-pulse">
        {/* Skeleton content */}
        <div className="flex items-center justify-between mb-6">
          <div className="space-y-2">
            <div className="h-5 bg-zinc-700 rounded w-40"></div>
            <div className="h-4 bg-zinc-700 rounded w-56"></div>
          </div>
          <div className="w-10 h-10 bg-zinc-700 rounded-lg"></div>
        </div>
        <div className="mb-6 space-y-2">
          <div className="h-2.5 bg-zinc-700 rounded-full"></div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="bg-zinc-700 rounded-xl p-4">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 bg-zinc-600 rounded-lg"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-zinc-600 rounded w-16"></div>
                  <div className="h-5 bg-zinc-600 rounded w-24"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const usedPercentage = (storageStats.totalUsed / storageStats.storageLimit) * 100;
  const formattedPercentage = `${usedPercentage.toFixed(1)}%`;

  return (
    <div className="bg-zinc-800 rounded-xl border border-zinc-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-zinc-50">Storage Usage</h3>
          <p className="text-sm text-zinc-400">
            {(storageStats.totalUsed / 1024 ** 2).toFixed(1)} MB of {(storageStats.storageLimit / 1024 ** 2).toFixed(0)} MB used
          </p>
        </div>
        <div className="bg-zinc-700 p-2 rounded-lg">
          <FiCloud className="w-6 h-6 text-zinc-200" />
        </div>
      </div>

      <div className="mb-6 space-y-2">
        <div className="h-2.5 bg-zinc-700 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"
            style={{ width: `${usedPercentage}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Stat cards */}
        <div className="bg-zinc-700 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <div className="bg-zinc-600 p-2 rounded-lg">
              <FiFile className="w-5 h-5 text-zinc-200" />
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-300">Files</p>
              <p className="text-xl font-bold text-zinc-50">
                {storageStats.fileCount.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Used Space Card */}
        <div className="bg-zinc-700 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <div className="bg-zinc-600 p-2 rounded-lg">
              <FiHardDrive className="w-5 h-5 text-zinc-200" />
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-300">Used</p>
              <p className="text-xl font-bold text-zinc-50">
                {(storageStats.totalUsed / 1024 ** 2).toFixed(1)}
                <span className="text-sm font-normal text-zinc-400 ml-1">MB</span>
              </p>
            </div>
          </div>
        </div>

        {/* Free Space Card */}
        <div className="bg-zinc-700 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <div className="bg-zinc-600 p-2 rounded-lg">
              <FiCloud className="w-5 h-5 text-zinc-200" />
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-300">Free</p>
              <p className="text-xl font-bold text-zinc-50">
                {(storageStats.remainingSpace / 1024 ** 2).toFixed(1)}
                <span className="text-sm font-normal text-zinc-400 ml-1">MB</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {usedPercentage > 90 && (
        <div className="mt-4 p-3 bg-zinc-800 border border-yellow-500 rounded-lg">
          <p className="text-sm text-yellow-400">
            <span className="font-medium">Storage Alert:</span> You're running low on storage space. Consider removing unused files.
          </p>
        </div>
      )}
    </div>
  );
}; 