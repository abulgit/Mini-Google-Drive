"use client";

import { useEffect, useRef } from "react";

const SCROLL_KEY = "landing_scroll_position";

export function useScrollRestore(isReady: boolean = true) {
  const hasRestored = useRef(false);

  useEffect(() => {
    // Save scroll position before unload
    const handleBeforeUnload = () => {
      sessionStorage.setItem(SCROLL_KEY, window.scrollY.toString());
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    // Only restore once when content is ready
    if (!isReady || hasRestored.current) return;

    const savedPosition = sessionStorage.getItem(SCROLL_KEY);
    if (savedPosition) {
      const position = parseInt(savedPosition, 10);
      // Delay to ensure DOM is fully rendered
      setTimeout(() => {
        window.scrollTo({ top: position, behavior: "instant" });
      }, 100);
    }
    hasRestored.current = true;
  }, [isReady]);
}
