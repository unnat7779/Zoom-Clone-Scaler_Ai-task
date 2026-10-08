import { Suspense } from "react";
import { HomePage } from "@/features/home";

/** Suspense: the calendar widget reads `?day=` with useSearchParams. */
export default function Page() {
  return (
    <Suspense>
      <HomePage />
    </Suspense>
  );
}
