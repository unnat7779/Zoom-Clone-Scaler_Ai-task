"use client";

import { usePathname } from "next/navigation";
import { routes } from "@/shared/lib/routes";

export type RailTabId = "home" | "chat" | "meetings" | "contacts";

const PREFIXES: Array<[RailTabId, string]> = [
  ["home", routes.home()],
  ["chat", routes.teamChat()],
  ["meetings", routes.meetings()],
  ["contacts", routes.contacts()],
];

/** Rail tab matching the current route; null on meeting routes (no tab selected, PRD §6.7). */
export function useRailSelection(): RailTabId | null {
  const pathname = usePathname();
  const match = PREFIXES.find(([, prefix]) => pathname === prefix || pathname.startsWith(`${prefix}/`));
  return match ? match[0] : null;
}
