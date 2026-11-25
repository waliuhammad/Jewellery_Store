import Link from 'next/link';

/**
 * Placeholder for Firestore-backed product rows (featured, new arrivals).
 * Shows an honest empty state until products are connected. No fabricated products.
 */
export function ProductShelf({
  id,
  title,
  viewAllHref,
}: {
  id: string;
  title: string;
  viewAllHref: string;
}) {
  return (
    <section aria-labelledby={id} className="mx-auto max-w-content px-4 py-16 sm:px-6 lg:px-8">
      <div className="flex items-baseline justify-between gap-4">
        <h2 id={id} className="font-heading text-3xl text-ink sm:text-4xl">
          {title}
        </h2>
        <Link href={viewAllHref} className="text-sm text-ink underline-offset-4 hover:text-rose hover:underline">
          View all
        </Link>
      </div>
      <div className="mt-8 rounded-card border border-dashed border-rose-border bg-card p-10 text-center text-sm text-muted">
        Products will appear here once the store database is connected.
      </div>
    </section>
  );
}
