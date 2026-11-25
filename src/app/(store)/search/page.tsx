import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { ProductGrid } from '@/components/products/ProductGrid';
import { Pagination } from '@/components/products/Pagination';
import { EmptyState } from '@/components/products/EmptyState';
import { listActiveProducts } from '@/lib/catalog/repository';
import { parseFilters } from '@/lib/catalog/parseFilters';
import { paginate } from '@/lib/catalog/paginate';
import { isAdminConfigured } from '@/lib/firebase/admin';

export const metadata: Metadata = { title: 'Search' };
export const dynamic = 'force-dynamic';

type SearchParams = Record<string, string | string[] | undefined>;

export default async function SearchPage({ searchParams }: { searchParams: SearchParams }) {
    const filters = parseFilters(searchParams);
    const q = filters.q ?? '';
    const searched = q.length > 0;
    const configured = isAdminConfigured();

    const products = searched && configured ? (await listActiveProducts(filters)).data : [];
    const { items, page, totalPages, total } = paginate(products, filters.page);

    return (
        <Container className="py-12">
            <h1 className="font-heading text-4xl sm:text-5xl">Search</h1>

            <form method="get" role="search" className="mt-8 flex gap-3">
                <label htmlFor="q" className="sr-only">Search pieces</label>
                <input
                    id="q"
                    name="q"
                    type="search"
                    defaultValue={q}
                    placeholder="Search by name, material or SKU"
                    className="flex-1 rounded-button border border-rose-border bg-card px-4 py-3 text-sm focus:border-rose focus:outline-none"
                />
                <button type="submit" className="rounded-button bg-espresso px-6 py-3 text-sm text-white hover:bg-ink/90">
                    Search
                </button>
            </form>

            <div className="mt-10" aria-live="polite">
                {!configured ? (
                    <EmptyState title="Store not connected" body="Search loads once the database is configured." />
                ) : !searched ? (
                    <EmptyState title="What are you looking for?" body="Enter a name, material or SKU above." />
                ) : total === 0 ? (
                    <EmptyState title={`No pieces match "${q}"`} body="Try a different word, or browse the shop." />
                ) : (
                    <>
                        <p className="mb-6 text-sm text-muted">
                            {total} {total === 1 ? 'piece' : 'pieces'} for &ldquo;{q}&rdquo;
                        </p>
                        <ProductGrid products={items} />
                        <Pagination page={page} totalPages={totalPages} basePath="/search" params={{ q }} />
                    </>
                )}
            </div>
        </Container>
    );
}