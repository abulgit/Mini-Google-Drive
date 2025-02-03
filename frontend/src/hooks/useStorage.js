import { useState, useCallback } from 'react';
import { fileService } from '../services/api';

export const useStorage = () => {
  const [storageStats, setStorageStats] = useState(null);

  const getStorageStats = useCallback(async () => {
    try {
      const { data } = await fileService.getStorageStats();
      setStorageStats(data);
    } catch (err) {
      console.error('Storage stats error:', err);
    }
  }, []);

  const checkStorageLimit = useCallback((fileSize) => {
    if (!storageStats) return true;
    
    const remainingMB = (storageStats.storageLimit - storageStats.totalUsed) / 1024 / 1024;
    return {
      hasSpace: storageStats.totalUsed + fileSize <= storageStats.storageLimit,
      remainingMB: remainingMB.toFixed(2)
    };
  }, [storageStats]);

  return {
    storageStats,
    getStorageStats,
    checkStorageLimit
  };
}; 