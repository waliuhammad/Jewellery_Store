import Link from 'next/link';

type Props = {
  page: number;
  totalPages: number;
  basePath: string;
  /** Current filters, so moving between pages keeps them. */
  params: Record<string, string | undefined>;
};

/** Plain links, so pagination works without JavaScript. */
export function Pagination({ page, totalPages, basePath, params }: Props) {
  if (totalPages <= 1) return null;

  const hrefFor = (target: number) => {
    const sp = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) if (v) sp.set(k, v);
    if (target > 1) sp.set('page', String(target));
    const qs = sp.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  };

  const linkClass = 'rounded-button border border-rose-border px-4 py-2 hover:border-rose';
  const disabledClass = 'rounded-button border border-rose-border px-4 py-2 opacity-40';

  return (
    <nav aria-label="Pagination" className="mt-14 flex items-center justify-center gap-4 text-sm">
      {page > 1 ? (
        <Link href={hrefFor(page - 1)} rel="prev" className={linkClass}>Previous</Link>
      ) : (
        <span aria-disabled="true" className={disabledClass}>Previous</span>
      )}
      <span aria-current="page">Page {page} of {totalPages}</span>
      {page < totalPages ? (
        <Link href={hrefFor(page + 1)} rel="next" className={linkClass}>Next</Link>
      ) : (
        <span aria-disabled="true" className={disabledClass}>Next</span>
      )}
    </nav>
  );
}
