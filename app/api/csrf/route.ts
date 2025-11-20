import { NextRequest } from "next/server";
import { generateCSRFToken } from "@/lib/auth/csrf";
import {
  getAuthenticatedUser,
  createErrorResponse,
  createSuccessResponse,
} from "@/lib/api/api-helpers";
import { ERROR_MESSAGES } from "@/lib/config/constants";

export async function GET(request: NextRequest) {
  try {
    const { error } = await getAuthenticatedUser(request);
    if (error) {
      return error;
    }

    const csrfToken = generateCSRFToken();

    return createSuccessResponse({ csrfToken });
  } catch (error) {
    console.error("CSRF token generation error:", error);
    return createErrorResponse(ERROR_MESSAGES.INTERNAL_ERROR, 500);
  }
}
