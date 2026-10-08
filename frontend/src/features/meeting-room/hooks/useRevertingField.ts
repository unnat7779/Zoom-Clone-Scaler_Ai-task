"use client";

import { type ChangeEvent, useState } from "react";

/**
 * Editable text that snaps back to `committed` on blur — for Static-UI-only
 * inputs such as the host's meeting-topic field (rename is out of scope, PRD §2.2).
 */
export function useRevertingField(committed: string) {
  const [draft, setDraft] = useState<string | null>(null);
  return {
    value: draft ?? committed,
    onChange: (event: ChangeEvent<HTMLInputElement>) => setDraft(event.target.value),
    onBlur: () => setDraft(null),
  };
}
