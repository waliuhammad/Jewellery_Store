export const PAGE_SIZE = 12;

/** Slices an already-filtered list. Clamps the page so an old link never shows an empty page. */
export function paginate<T>(items: T[], page: number = 1) {
  const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const current = Math.min(Math.max(1, page), totalPages);
  return {
    items: items.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE),
    page: current,
    totalPages,
    total: items.length,
  };
}
