import type { ReactNode } from "react";
import { PortalShell } from "@/features/portal";

/** zoom.us portal pages (Schedule, Edit, meeting detail): 104px header + 300px side menu. */
export default function PortalLayout({ children }: { children: ReactNode }) {
  return <PortalShell>{children}</PortalShell>;
}
