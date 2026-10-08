"use client";

import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import clsx from "clsx";
import { useIsClient } from "@/shared/hooks/useIsClient";
import { useOverlayScope } from "./OverlayScope";
import styles from "./Portal.module.css";

/**
 * Renders children into `document.body` (after hydration). Inside an `OverlayScope` they are
 * wrapped in a `display: contents` element carrying the scope's class, so they inherit its
 * variables and fonts without affecting layout.
 */
export function Portal({ children }: { children: ReactNode }) {
  const isClient = useIsClient();
  const scope = useOverlayScope();
  if (!isClient) return null;
  return createPortal(scope ? <div className={clsx(styles.scope, scope)}>{children}</div> : children, document.body);
}
