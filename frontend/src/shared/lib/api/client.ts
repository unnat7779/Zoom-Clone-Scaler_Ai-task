import type { ApiErrorBody, ApiErrorCode } from "@/shared/types/api";
import { env } from "../env";

/** Error thrown by every API call. `status` is 0 for network failures. */
export class ApiError extends Error {
  readonly status: number;
  readonly code: ApiErrorCode;

  constructor(status: number, code: ApiErrorCode, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

export const isApiError = (error: unknown, code?: ApiErrorCode): error is ApiError =>
  error instanceof ApiError && (code === undefined || error.code === code);

export type QueryValue = string | number | boolean | null | undefined;

export interface ApiFetchOptions {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  body?: unknown;
  query?: Record<string, QueryValue>;
  signal?: AbortSignal;
}

export function buildApiUrl(path: string, query?: Record<string, QueryValue>): string {
  const base = env.apiUrl || (typeof window !== "undefined" ? window.location.origin : "");
  const url = new URL(
    base ? `${base}/api${path}` : `/api${path}`,
    typeof window !== "undefined" ? window.location.origin : "http://localhost:8000"
  );
  for (const [key, value] of Object.entries(query ?? {})) {
    if (value !== undefined && value !== null) url.searchParams.set(key, String(value));
  }
  return url.toString();
}

/** Maps `{"error": {code, message}}`, FastAPI 422 `{"detail": [...]}` and anything else. */
async function toApiError(response: Response): Promise<ApiError> {
  const body: unknown = await response.json().catch(() => null);
  const error = (body as Partial<ApiErrorBody> | null)?.error;
  if (error?.code) return new ApiError(response.status, error.code, error.message);
  const detail = (body as { detail?: unknown } | null)?.detail;
  if (response.status === 422) {
    const first = Array.isArray(detail) ? (detail[0] as { msg?: string } | undefined) : undefined;
    const message = first?.msg ?? (typeof detail === "string" ? detail : "Invalid request");
    return new ApiError(422, "VALIDATION_ERROR", message);
  }
  const message = typeof detail === "string" ? detail : response.statusText || "Request failed";
  return new ApiError(response.status, "UNKNOWN_ERROR", message);
}

/** Typed JSON fetch against `${NEXT_PUBLIC_API_URL}/api`. Resolves `undefined` for 204. */
export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  const { method = "GET", body, query, signal } = options;
  let response: Response;
  try {
    response = await fetch(buildApiUrl(path, query), {
      method,
      signal,
      headers: body === undefined ? { Accept: "application/json" } : { "Content-Type": "application/json", Accept: "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch (cause) {
    if (cause instanceof DOMException && cause.name === "AbortError") throw cause;
    throw new ApiError(0, "NETWORK_ERROR", "Unable to reach the server");
  }
  if (!response.ok) throw await toApiError(response);
  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}
