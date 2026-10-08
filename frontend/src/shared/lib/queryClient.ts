import { QueryClient } from "@tanstack/react-query";
import { ApiError } from "./api/client";

const MAX_RETRIES = 2;

/** Client errors (4xx) are final; network / 5xx errors retry twice. */
function shouldRetry(failureCount: number, error: unknown): boolean {
  if (error instanceof ApiError && error.status >= 400 && error.status < 500) return false;
  return failureCount < MAX_RETRIES;
}

/** One QueryClient per browser session (created in app/providers.tsx). */
export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        refetchOnWindowFocus: false,
        retry: shouldRetry,
      },
      mutations: {
        retry: false,
      },
    },
  });
}
