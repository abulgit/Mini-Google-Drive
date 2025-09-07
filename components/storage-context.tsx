"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import type { StorageUsage } from "@/types";

interface StorageContextType {
  storage: StorageUsage | null;
  loading: boolean;
  fetchStorage: () => Promise<void>;
  refreshStorage: () => Promise<void>;
}

const StorageContext = createContext<StorageContextType | undefined>(undefined);

export function StorageProvider({ children }: { children: ReactNode }) {
  const [storage, setStorage] = useState<StorageUsage | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchStorage = useCallback(async () => {
    // Only fetch if we don't already have data and aren't currently loading
    if (storage !== null || loading) {
      return;
    }

    setLoading(true);
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
  }, [storage, loading]);

  const refreshStorage = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/storage");
      if (response.ok) {
        const data = await response.json();
        setStorage(data.storage);
      }
    } catch (error) {
      console.error("Failed to refresh storage usage:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <StorageContext.Provider
      value={{
        storage,
        loading,
        fetchStorage,
        refreshStorage,
      }}
    >
      {children}
    </StorageContext.Provider>
  );
}

export function useStorage() {
  const context = useContext(StorageContext);
  if (context === undefined) {
    throw new Error("useStorage must be used within a StorageProvider");
  }
  return context;
}
