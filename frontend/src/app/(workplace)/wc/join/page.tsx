import { Suspense } from "react";
import { JoinShortcutPage } from "@/features/home";

/** `/wc/join` → Home with the Join modal open (URL replaced by `/wc/home`). */
export default function Page() {
  return (
    <Suspense>
      <JoinShortcutPage />
    </Suspense>
  );
}
