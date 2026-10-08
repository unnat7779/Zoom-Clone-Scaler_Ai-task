"use client";

import { type RefObject, useEffect } from "react";
import { MEDIA } from "@/shared/hooks";

/** the on-screen keyboard slides in over ~250 ms */
const KEYBOARD_DELAY_MS = 300;

/**
 * Touch screens [D]: when a field of the form takes focus, scroll it to the middle of what is
 * left visible once the on-screen keyboard is up (again whenever the visual viewport resizes),
 * so the keyboard never hides "Your Name" or the passcode.
 */
export function useKeepFieldVisible(formRef: RefObject<HTMLElement | null>): void {
  useEffect(() => {
    const form = formRef.current;
    if (!form || !window.matchMedia(MEDIA.coarse).matches) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const reveal = () => {
      const field = document.activeElement;
      if (field instanceof HTMLInputElement && form.contains(field)) field.scrollIntoView({ block: "center", behavior: "smooth" });
    };
    const onFocusIn = () => {
      clearTimeout(timer);
      timer = setTimeout(reveal, KEYBOARD_DELAY_MS);
    };
    form.addEventListener("focusin", onFocusIn);
    window.visualViewport?.addEventListener("resize", reveal);
    return () => {
      clearTimeout(timer);
      form.removeEventListener("focusin", onFocusIn);
      window.visualViewport?.removeEventListener("resize", reveal);
    };
  }, [formRef]);
}
