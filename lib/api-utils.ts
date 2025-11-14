import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ERROR_MESSAGES } from "@/lib/constants";

export interface AuthenticatedRequest extends NextRequest {
  userId?: string;
}

export type ApiHandler = (
  request: NextRequest,
  context?: { params: Promise<Record<string, string>> }
) => Promise<NextResponse>;

export function withAuth(handler: ApiHandler): ApiHandler {
  return async (request, context) => {
    try {
      const session = await getServerSession(authOptions);

      if (!session?.user?.id) {
        return NextResponse.json(
          { error: ERROR_MESSAGES.UNAUTHORIZED },
          { status: 401 }
        );
      }

      return await handler(request, context);
    } catch (error) {
      return handleApiError(error, "Authentication");
    }
  };
}

export function handleApiError(
  error: unknown,
  context: string = "API"
): NextResponse {
  console.error(`${context} error:`, error);

  if (error instanceof Error) {
    return NextResponse.json(
      { error: error.message || ERROR_MESSAGES.INTERNAL_ERROR },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { error: ERROR_MESSAGES.INTERNAL_ERROR },
    { status: 500 }
  );
}

export async function getUserIdFromSession(): Promise<string | null> {
  const session = await getServerSession(authOptions);
  return session?.user?.id || null;
}
