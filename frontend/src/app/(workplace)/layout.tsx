import type { ReactNode } from "react";
import { WorkplaceShell } from "@/features/shell";

/** Workplace routes (`/wc/home`, `/wc/meetings`, …) render inside the shell's content card. */
export default function WorkplaceLayout({ children }: { children: ReactNode }) {
  return <WorkplaceShell>{children}</WorkplaceShell>;
}
