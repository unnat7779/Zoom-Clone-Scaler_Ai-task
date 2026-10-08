"use client";

import { type RefObject, useCallback, useLayoutEffect, useState } from "react";

/**
 * `zm-tabs` scrolling (Element's `scrollToActiveTab` / `scrollPrev` / `scrollNext`): on mount and on
 * resize the active tab is scrolled into view, the arrows page by the visible width, and each arrow is
 * disabled at its end. The scroller is a plain overflow box, so touch users can also swipe it.
 */
export function useTabScroll(scrollerRef: RefObject<HTMLElement | null>, activeRef: RefObject<HTMLElement | null>) {
  const [edges, setEdges] = useState({ atStart: true, atEnd: true });

  useLayoutEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const updateEdges = () => {
      const max = scroller.scrollWidth - scroller.clientWidth;
      const next = { atStart: scroller.scrollLeft <= 0, atEnd: scroller.scrollLeft >= max - 1 };
      setEdges((prev) => (prev.atStart === next.atStart && prev.atEnd === next.atEnd ? prev : next));
    };
    const revealActive = () => {
      const tab = activeRef.current?.getBoundingClientRect();
      const box = scroller.getBoundingClientRect();
      if (tab && tab.left < box.left) scroller.scrollLeft -= box.left - tab.left;
      else if (tab && tab.right > box.right) scroller.scrollLeft += tab.right - box.right;
      updateEdges();
    };
    revealActive();
    const observer = new ResizeObserver(revealActive);
    observer.observe(scroller);
    scroller.addEventListener("scroll", updateEdges, { passive: true });
    return () => {
      observer.disconnect();
      scroller.removeEventListener("scroll", updateEdges);
    };
  }, [scrollerRef, activeRef]);

  const page = useCallback(
    (direction: -1 | 1) => {
      const scroller = scrollerRef.current;
      scroller?.scrollBy({ left: direction * scroller.clientWidth, behavior: "smooth" });
    },
    [scrollerRef],
  );

  return { ...edges, prev: () => page(-1), next: () => page(1) };
}
