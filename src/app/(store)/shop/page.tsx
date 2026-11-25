import type { Metadata } from 'next';
import { FilterBar } from '@/components/products/FilterBar';
import { ProductGrid } from '@/components/products/ProductGrid';
import { Pagination } from '@/components/products/Pagination';
import { EmptyState } from '@/components/products/EmptyState';
import { Container } from '@/components/ui/Container';
import { PageIntro } from '@/components/ui/PageIntro';
import { listActiveProducts } from '@/lib/catalog/repository';
import { parseFilters } from '@/lib/catalog/parseFilters';
import { paginate } from '@/lib/catalog/paginate';

export const metadata: Metadata = {
  title: 'Shop All Jewellery',
  description: 'Rings, necklaces, earrings and bracelets, thoughtfully chosen. Prices in PKR.',
};
export const dynamic = 'force-dynamic';

type SearchParams = Record<string, string | string[] | undefined>;

export default async function ShopPage({ searchParams }: { searchParams: SearchParams }) {
  const filters = parseFilters(searchParams);
  const { configured, data } = await listActiveProducts(filters);
  const { items, page, totalPages, total } = paginate(data, filters.page);

  // Every filter that should survive moving between pages.
  const params = {
    q: filters.q,
    category: filters.category,
    material: filters.material,
    availability: filters.inStock ? 'in-stock' : undefined,
    min: filters.min?.toString(),
    max: filters.max?.toString(),
    sort: filters.sort === 'newest' ? undefined : filters.sort,
    featured: filters.featured ? 'true' : undefined,
  };

  return (
    <>
    <PageIntro
      crumbs={[{ label: filters.q ? 'Search' : 'Shop' }]}
      eyebrow={filters.q ? `Results for “${filters.q}”` : 'The Collection'}
      title="Shop All"
      accent="Jewellery."
      aside={configured && total > 0 ? <p className="text-[11px] uppercase tracking-[0.2em] text-muted">{total} piece{total === 1 ? '' : 's'}</p> : undefined}
    />
    <Container className="py-10">
      <div>
        <FilterBar current={params} />
      </div>

      <div className="mt-10" aria-live="polite">
        {!configured ? (
          <EmptyState title="Store not connected" body="Products load once the database is configured." />
        ) : total === 0 ? (
          <EmptyState title="No pieces match these filters" body="Try clearing a filter or searching for something else." />
        ) : (
          <>
            <p className="mb-8 text-xs uppercase tracking-[0.16em] text-muted">
              Showing {items.length} of {total}
            </p>
            <ProductGrid products={items} />
            <Pagination page={page} totalPages={totalPages} basePath="/shop" params={params} />
          </>
        )}
      </div>
    </Container>
    </>
  );
}
