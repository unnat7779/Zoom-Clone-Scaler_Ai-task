/** Paging of tile lists (speaker-view filmstrip, phone gallery). */

/** Number of pages for `count` items (at least 1). */
export function pageCount(count: number, pageSize: number): number {
  return Math.max(1, Math.ceil(count / Math.max(1, pageSize)));
}

/** Page index clamped to the existing pages (a page disappears when people leave). */
export function clampPage(page: number, count: number, pageSize: number): number {
  return Math.min(Math.max(page, 0), pageCount(count, pageSize) - 1);
}

/** The items of page `page` (clamped). */
export function pageItems<T>(items: readonly T[], page: number, pageSize: number): T[] {
  const size = Math.max(1, pageSize);
  const current = clampPage(page, items.length, size);
  return items.slice(current * size, current * size + size);
}
