"use client";

import { type RefObject, useEffect, useRef } from "react";
import { optionId } from "./optionId";

/** Scrolls the menu's own scroll area (never the page) so option `index` is visible. */
function scrollToOption(wrap: HTMLElement | null, listId: string, index: number, mode: "center" | "nearest") {
  const option = index >= 0 ? wrap?.querySelector<HTMLElement>(`#${CSS.escape(optionId(listId, index))}`) : null;
  if (!wrap || !option) return;
  const top = option.offsetTop;
  const bottom = top + option.offsetHeight;
  if (mode === "center") wrap.scrollTop = top - (wrap.clientHeight - option.offsetHeight) / 2;
  else if (top < wrap.scrollTop) wrap.scrollTop = top;
  else if (bottom > wrap.scrollTop + wrap.clientHeight) wrap.scrollTop = bottom - wrap.clientHeight;
}

interface UseMenuScrollArgs {
  wrapRef: RefObject<HTMLElement | null>;
  listId: string;
  open: boolean;
  selectedIndex: number;
  activeIndex: number;
}

/** On open the selected option is centred in the scroll area; keyboard moves then scroll only as far as needed. */
export function useMenuScroll({ wrapRef, listId, open, selectedIndex, activeIndex }: UseMenuScrollArgs) {
  const centred = useRef(false);
  useEffect(() => {
    if (!open) {
      centred.current = false;
      return;
    }
    if (centred.current) {
      scrollToOption(wrapRef.current, listId, activeIndex, "nearest");
      return;
    }
    centred.current = true;
    scrollToOption(wrapRef.current, listId, selectedIndex, "center");
  }, [activeIndex, listId, open, selectedIndex, wrapRef]);
}
