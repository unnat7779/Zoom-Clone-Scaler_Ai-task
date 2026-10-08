/**
 * Minimal logger for failures the UI recovers from (WebRTC, signalling, media).
 * `warn` is development-only noise; `error` is an unexpected defect and always logged.
 */
const isDev = process.env.NODE_ENV !== "production";

export const logger = {
  warn(context: string, error?: unknown): void {
    if (isDev) console.warn(`[zoom-clone] ${context}`, error ?? "");
  },
  error(context: string, error?: unknown): void {
    console.error(`[zoom-clone] ${context}`, error ?? "");
  },
};

/** `.catch(warnOnFailure("…"))` for fire-and-forget promises whose failure is not fatal. */
export const warnOnFailure =
  (context: string) =>
  (error: unknown): void =>
    logger.warn(context, error);
