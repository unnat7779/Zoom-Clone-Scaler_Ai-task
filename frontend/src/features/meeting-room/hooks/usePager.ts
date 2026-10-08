"use client";

import { useState } from "react";
import { clampPage, pageCount, pageItems } from "../utils/paging";

/** The visible page of a tile list with previous / next (filmstrip ‹ ›, phone gallery arrows and swipes). */
export function usePager<T>(items: readonly T[], pageSize: number) {
  const [requestedPage, setPage] = useState(0);
  const pages = pageCount(items.length, pageSize);
  const page = clampPage(requestedPage, items.length, pageSize);
  return {
    visible: pageItems(items, page, pageSize),
    page,
    pages,
    canPrevious: page > 0,
    canNext: page < pages - 1,
    previous: () => setPage(Math.max(0, page - 1)),
    next: () => setPage(Math.min(pages - 1, page + 1)),
  };
}
