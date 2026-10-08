"use client";

import { createContext, useContext } from "react";
import type { ToastApi } from "./toastTypes";

export const ToastContext = createContext<ToastApi | null>(null);

/** `const toast = useToast(); toast.show({ message: "Copied to clipboard", surface: "portal", kind: "success" })` */
export function useToast(): ToastApi {
  const api = useContext(ToastContext);
  if (!api) throw new Error("useToast must be used inside <ToastProvider>");
  return api;
}
