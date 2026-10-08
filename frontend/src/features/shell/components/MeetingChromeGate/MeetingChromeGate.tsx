"use client";

import type { ReactNode } from "react";
import { useSearchParams, useSelectedLayoutSegment } from "next/navigation";
import { FROM_PWA_PARAM } from "@/shared/lib/routes";
import { type ShellChrome, WorkplaceShell } from "../WorkplaceShell/WorkplaceShell";

/**
 * Layout for `/wc/[number]/*` (PRD §4.1): join / start / meeting render inside the Workplace
 * shell when the URL has `?fromPWA=1` (Zoom's own flag), otherwise full viewport. `/left` is
 * always full viewport, and so is the room on phones (≤767px, PRD §11.5, a CSS rule).
 *
 * The shell is always rendered and only its chrome changes, so the page is never remounted
 * (a remount would leave and rejoin the meeting).
 */
export function MeetingChromeGate({ children }: { children: ReactNode }) {
  const fromPwa = useSearchParams().get(FROM_PWA_PARAM) === "1";
  const segment = useSelectedLayoutSegment();
  return <WorkplaceShell chrome={meetingChrome(segment, fromPwa)}>{children}</WorkplaceShell>;
}

function meetingChrome(segment: string | null, fromPwa: boolean): ShellChrome {
  if (!fromPwa || segment === "left") return "hidden";
  return segment === "meeting" ? "desktop" : "visible";
}
