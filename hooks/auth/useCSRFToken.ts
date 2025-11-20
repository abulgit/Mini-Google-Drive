"use client";

import { useState, useEffect } from "react";

export function useCSRFToken() {
  const [csrfToken, setCSRFToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCSRFToken();
  }, []);

  const fetchCSRFToken = async () => {
    try {
      const response = await fetch("/api/csrf");
      if (response.ok) {
        const data = await response.json();
        setCSRFToken(data.csrfToken);
      }
    } catch (error) {
      console.error("Failed to fetch CSRF token:", error);
    } finally {
      setLoading(false);
    }
  };

  return { csrfToken, loading, refreshToken: fetchCSRFToken };
}
