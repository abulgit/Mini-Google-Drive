import { NextRequest } from "next/server";
import { verifyCSRFToken } from "./csrf";

export function validateCSRFToken(request: NextRequest): boolean {
  // Get CSRF token from header
  const csrfToken = request.headers.get("x-csrf-token");

  if (!csrfToken) {
    return false;
  }

  return verifyCSRFToken(csrfToken);
}

export function createCSRFError() {
  return new Response(JSON.stringify({ error: "Invalid CSRF token" }), {
    status: 403,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
