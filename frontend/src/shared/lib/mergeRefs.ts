import { type Ref, type RefCallback, useCallback } from "react";

function assignRef<T>(ref: Ref<T> | undefined, value: T | null) {
  if (typeof ref === "function") ref(value);
  else if (ref) (ref as { current: T | null }).current = value;
}

/** Combines two refs (object or callback) into one callback ref, stable while both refs are stable. */
export function useMergedRef<T>(a: Ref<T> | undefined, b: Ref<T> | undefined): RefCallback<T> {
  return useCallback(
    (value: T | null) => {
      assignRef(a, value);
      assignRef(b, value);
    },
    [a, b],
  );
}
