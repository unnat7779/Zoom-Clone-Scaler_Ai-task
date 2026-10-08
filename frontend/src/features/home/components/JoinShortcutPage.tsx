"use client";

import { useEffect } from "react";
import { routes } from "@/shared/lib/routes";
import { HomePage } from "./HomePage";

/**
 * `/wc/join` (PRD §4.1, §7.2.1): Zoom replaces the URL with `/wc/home` and opens the Join modal.
 * The replace is shallow (`history.replaceState`), so Home stays mounted with the modal open.
 */
export function JoinShortcutPage() {
  useEffect(() => {
    window.history.replaceState(null, "", routes.home());
  }, []);
  return <HomePage initialJoinOpen />;
}
