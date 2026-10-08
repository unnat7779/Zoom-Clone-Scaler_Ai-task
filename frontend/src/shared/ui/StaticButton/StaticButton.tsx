"use client";

import type { ButtonHTMLAttributes } from "react";
import { useToast } from "../Toast";

type StaticButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type" | "onClick">;

/** A Static-UI-only link or control (PRD §2.2): a button that shows the "not available in this demo" toast. */
export function StaticButton(props: StaticButtonProps) {
  const toast = useToast();
  return <button type="button" {...props} onClick={toast.notAvailable} />;
}
