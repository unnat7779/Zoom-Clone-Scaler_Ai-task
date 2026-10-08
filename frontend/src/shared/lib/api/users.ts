import type { User } from "@/shared/types/api";
import { apiFetch } from "./client";

/** `GET /api/me` — the seeded default user (id 1). */
export const getMe = (signal?: AbortSignal) => apiFetch<User>("/me", { signal });

/** The API's default page of `GET /api/users` (PRD §10.4). */
export const USERS_DEFAULT_LIMIT = 8;

/** `GET /api/users?q=&limit=8` — other users (invite contacts, invitee suggestions). */
export const listUsers = (params: { q?: string; limit?: number } = {}, signal?: AbortSignal) =>
  apiFetch<User[]>("/users", { query: { q: params.q, limit: params.limit ?? USERS_DEFAULT_LIMIT }, signal });
