"use client";

import { type FilmstripMetrics, filmstripPageSize } from "../utils/speakerLayout";
import { usePager } from "./usePager";

/** Which slice of the speaker-view filmstrip is visible, with ‹ › paging when it overflows. */
export function useFilmstripPage<T>(items: T[], stageWidth: number, metrics: FilmstripMetrics) {
  const pager = usePager(items, filmstripPageSize(stageWidth, items.length, metrics));
  return { ...pager, paged: pager.pages > 1 };
}
