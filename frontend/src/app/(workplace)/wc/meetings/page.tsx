import { Suspense } from "react";
import { MeetingsTabPage } from "@/features/meetings";

/** Suspense: the tab reads `?tab=&select=` with useSearchParams. */
export default function Page() {
  return (
    <Suspense>
      <MeetingsTabPage />
    </Suspense>
  );
}
