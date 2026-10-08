"use client";

import { useCallback, useState } from "react";

/** Boolean UI state (visual-only switches, open/closed bits). */
export function useToggle(initial = false) {
  const [on, setOn] = useState(initial);
  const toggle = useCallback(() => setOn((value) => !value), []);
  return [on, toggle, setOn] as const;
}
