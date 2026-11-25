import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { FilterBar } from '@/components/products/FilterBar';
import { ProductGrid } from '@/components/products/ProductGrid';
import { Pagination } from '@/components/products/Pagination';
import { EmptyState } from '@/components/products/EmptyState';
import { Container } from '@/components/ui/Container';
import { PageIntro } from '@/components/ui/PageIntro';
import { getCategoryBySlug, listActiveProducts } from '@/lib/catalog/repository';
import { parseFilters } from '@/lib/catalog/parseFilters';
import { paginate } from '@/lib/catalog/paginate';
import { siteConfig } from '@/config/site';

export const dynamic = 'force-dynamic';

type Props = { params: { slug: string }; searchParams: Record<string, string | string[] | undefined> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const fallback = siteConfig.categories.find((c) => c.slug === params.slug);
  return {
    title: fallback?.name ?? 'Category',
    description: fallback ? `Shop ${fallback.name.toLowerCase()} at Jewelora. Prices in PKR.` : undefined,
  };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  // Only known category slugs are accepted from the URL path.
  const known = siteConfig.categories.find((c) => c.slug === params.slug);
  if (!known) notFound();

  const { data: category, configured } = await getCategoryBySlug(params.slug);
  const filters = parseFilters(searchParams, params.slug);
  const { data } = await listActiveProducts(filters);
  const { items, page, totalPages, total } = paginate(data, filters.page);

  // The category is part of the path here, so it is not repeated in the query string.
  const params_ = {
    q: filters.q,
    material: filters.material,
    availability: filters.inStock ? 'in-stock' : undefined,
    min: filters.min?.toString(),
    max: filters.max?.toString(),
    sort: filters.sort === 'newest' ? undefined : filters.sort,
  };

  return (
    <>
    <PageIntro
      crumbs={[{ label: 'Shop', href: '/shop' }, { label: known.name }]}
      eyebrow="Jewellery"
      title={known.name}
      lead={category?.description || undefined}
      aside={configured && total > 0 ? <p className="text-[11px] uppercase tracking-[0.2em] text-muted">{total} piece{total === 1 ? '' : 's'}</p> : undefined}
    />
    <Container className="py-10">
      <div>
        <FilterBar current={params_} showCategory={false} />
      </div>

      <div className="mt-10" aria-live="polite">
        {!configured ? (
          <EmptyState title="Store not connected" body="Products load once the database is configured." />
        ) : total === 0 ? (
          <EmptyState title={`No ${known.name.toLowerCase()} yet`} body="New pieces are added regularly. Check back soon." />
        ) : (
          <>
            <p className="mb-8 text-xs uppercase tracking-[0.16em] text-muted">
              Showing {items.length} of {total}
            </p>
            <ProductGrid products={items} />
            <Pagination page={page} totalPages={totalPages} basePath={`/categories/${params.slug}`} params={params_} />
          </>
        )}
      </div>
    </Container>
    </>
  );
}
