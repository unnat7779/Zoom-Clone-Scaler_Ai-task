"use client";

import { type ReactNode, useCallback, useMemo, useRef, useState } from "react";
import { Portal } from "../Portal";
import { ToastItem } from "./ToastItem";
import { DEFAULT_TOAST_DURATION, NOT_AVAILABLE_MESSAGE, type ToastApi, type ToastOptions, type ToastRecord } from "./toastTypes";
import { ToastContext } from "./useToast";
import styles from "./Toast.module.css";

/** Hosts the light Workplace toasts (top-centre, 50px) and portal messages (top 8px). Mounted in app/providers.tsx. */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastRecord[]>([]);
  const nextId = useRef(1);

  const dismiss = useCallback((id: number) => setToasts((list) => list.filter((toast) => toast.id !== id)), []);

  const show = useCallback((options: ToastOptions) => {
    const id = nextId.current++;
    const record: ToastRecord = {
      id,
      message: options.message,
      title: options.title,
      kind: options.kind ?? "info",
      surface: options.surface ?? "workplace",
      duration: options.duration === undefined ? DEFAULT_TOAST_DURATION : options.duration,
    };
    setToasts((list) => [...list, record]);
    return id;
  }, []);

  const api = useMemo<ToastApi>(
    () => ({ show, dismiss, notAvailable: () => show({ message: NOT_AVAILABLE_MESSAGE, kind: "info" }) }),
    [dismiss, show],
  );

  const workplace = toasts.filter((toast) => toast.surface === "workplace");
  const portal = toasts.filter((toast) => toast.surface === "portal");

  return (
    <ToastContext.Provider value={api}>
      {children}
      <Portal>
        {workplace.length > 0 ? (
          <div className={styles.workplaceContainer}>
            {workplace.map((toast) => (
              <ToastItem key={toast.id} toast={toast} onDismiss={dismiss} />
            ))}
          </div>
        ) : null}
        {portal.length > 0 ? (
          <div className={styles.portalContainer}>
            {portal.map((toast) => (
              <ToastItem key={toast.id} toast={toast} onDismiss={dismiss} />
            ))}
          </div>
        ) : null}
      </Portal>
    </ToastContext.Provider>
  );
}
