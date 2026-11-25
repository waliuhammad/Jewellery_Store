import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Container } from '@/components/ui/Container';
import { EmptyState } from '@/components/products/EmptyState';
import { ProductGrid } from '@/components/products/ProductGrid';
import { EditorialBanner } from '@/components/content/EditorialBanner';
import { getActiveCollectionBySlug } from '@/lib/catalog/collections';
import { getActiveProductsByIds } from '@/lib/catalog/repository';
import { isAdminConfigured } from '@/lib/firebase/admin';

export const dynamic = 'force-dynamic';

const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  if (!SLUG.test(params.slug) || !isAdminConfigured()) return { title: 'Collection' };
  const c = await getActiveCollectionBySlug(params.slug);
  return { title: c?.name ?? 'Collection' };
}

export default async function CollectionPage({ params }: Props) {
  if (!SLUG.test(params.slug)) notFound();
  if (!isAdminConfigured()) {
    return <Container className="py-12"><EmptyState title="Store not connected" body="Collections load once the database is configured." /></Container>;
  }
  const c = await getActiveCollectionBySlug(params.slug);
  if (!c) notFound();

  const products = await getActiveProductsByIds(c.productIds.slice(0, 200));
  const eyebrow = c.kind === 'seasonal' ? c.season || 'Seasonal' : 'Curated edit';

  return (
    <div>
      <EditorialBanner image={c.banner} eyebrow={eyebrow} title={c.name} body={c.tagline || undefined} />

      <Container className="py-12">
        {c.description && <p className="max-w-2xl text-muted">{c.description}</p>}
        <div className="mt-10">
          {products.length === 0 ? (
            <EmptyState title="Nothing here yet" body="Pieces in this collection will appear here." />
          ) : (
            <ProductGrid products={products} />
          )}
        </div>
      </Container>
    </div>
  );
}
