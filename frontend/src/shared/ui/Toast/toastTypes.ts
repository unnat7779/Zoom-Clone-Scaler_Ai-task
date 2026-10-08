import type { ReactNode } from "react";

export type ToastKind = "success" | "info" | "warning" | "error";

/** workplace: white react-toastify card, top-centre 50px · portal: zoom.us `zm-message`, top 8px */
export type ToastSurface = "workplace" | "portal";

export interface ToastOptions {
  message: ReactNode;
  title?: ReactNode;
  kind?: ToastKind;
  surface?: ToastSurface;
  /** ms before auto-dismiss (default 3000); null keeps it until closed */
  duration?: number | null;
}

export interface ToastRecord extends Required<Pick<ToastOptions, "kind" | "surface">> {
  id: number;
  message: ReactNode;
  title?: ReactNode;
  duration: number | null;
}

export interface ToastApi {
  show: (options: ToastOptions) => number;
  dismiss: (id: number) => void;
  /** PRD §0.1 light toast for Static-UI-only controls: "This feature isn't available in this demo." */
  notAvailable: () => number;
}

export const NOT_AVAILABLE_MESSAGE = "This feature isn't available in this demo.";
export const DEFAULT_TOAST_DURATION = 3000;
