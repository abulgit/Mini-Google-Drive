import { useState, useEffect, useCallback, useRef } from "react";
import type { FileDocument } from "@/types";

interface UseSearchResult {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: FileDocument[];
  isSearching: boolean;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  clearSearch: () => void;
}

const DEBOUNCE_DELAY = 300;

export function useSearch(): UseSearchResult {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<FileDocument[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const performSearch = useCallback(async (query: string) => {
    // Cancel any pending request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    if (!query || query.trim().length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    abortControllerRef.current = new AbortController();
    setIsSearching(true);

    try {
      const response = await fetch(
        `/api/files/search?q=${encodeURIComponent(query.trim())}`,
        { signal: abortControllerRef.current.signal }
      );

      if (response.ok) {
        const data = await response.json();
        setSearchResults(data.files);
        setIsSearchOpen(true);
      }
    } catch (error) {
      // Ignore abort errors
      if (error instanceof Error && error.name !== "AbortError") {
        console.error("Search failed:", error);
        setSearchResults([]);
      }
    } finally {
      setIsSearching(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      performSearch(searchQuery);
    }, DEBOUNCE_DELAY);

    return () => {
      clearTimeout(timer);
    };
  }, [searchQuery, performSearch]);

  // Cleanup abort controller on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const clearSearch = useCallback(() => {
    setSearchQuery("");
    setSearchResults([]);
    setIsSearchOpen(false);
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    isSearching,
    isSearchOpen,
    setIsSearchOpen,
    clearSearch,
  };
}
