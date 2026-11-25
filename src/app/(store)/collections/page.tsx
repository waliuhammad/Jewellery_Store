import type { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { PageIntro } from '@/components/ui/PageIntro';
import { EmptyState } from '@/components/products/EmptyState';
import { EditorialBanner } from '@/components/content/EditorialBanner';
import { listActiveCollections, type CollectionDoc } from '@/lib/catalog/collections';
import { isAdminConfigured } from '@/lib/firebase/admin';

export const metadata: Metadata = { title: 'Collections', description: 'Curated and seasonal jewellery collections from Jewelora.' };
export const dynamic = 'force-dynamic';

function CollectionCard({ c }: { c: CollectionDoc }) {
  const eyebrow = c.kind === 'seasonal' ? c.season || 'Seasonal' : 'Curated edit';
  return (
    <li>
      <Link href={`/collections/${c.slug}`} className="group block">
        <EditorialBanner
          image={c.banner}
          eyebrow={eyebrow}
          title={c.name}
          body={c.tagline || undefined}
          heightClass="h-72 md:h-80"
          titleTag="h2"
        />
        <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted transition-colors group-hover:text-gold-deep">
          {c.productIds.length} {c.productIds.length === 1 ? 'piece' : 'pieces'} · View collection →
        </p>
      </Link>
    </li>
  );
}

export default async function CollectionsIndex() {
  if (!isAdminConfigured()) {
    return <Container className="py-12"><EmptyState title="Store not connected" body="Collections load once the database is configured." /></Container>;
  }
  const collections = await listActiveCollections();
  const seasonal = collections.filter((c) => c.kind === 'seasonal');
  const curated = collections.filter((c) => c.kind !== 'seasonal');

  return (
    <div>
      <PageIntro crumbs={[{ label: 'Collections' }]} eyebrow="Curated for You" title="The" accent="Collections." />

      {collections.length === 0 ? (
        <Container className="py-12"><EmptyState title="No collections yet" body="New collections are announced here." /></Container>
      ) : (
        <Container className="space-y-16 py-12">
          {seasonal.length > 0 && (
            <section aria-labelledby="seasonal-heading">
              <h2 id="seasonal-heading" className="eyebrow">Seasonal</h2>
              <ul className="mt-8 grid gap-8 md:grid-cols-2">
                {seasonal.map((c) => <CollectionCard key={c.id} c={c} />)}
              </ul>
            </section>
          )}
          {curated.length > 0 && (
            <section aria-labelledby="curated-heading">
              <h2 id="curated-heading" className="eyebrow">Curated edits</h2>
              <ul className="mt-8 grid gap-8 md:grid-cols-2">
                {curated.map((c) => <CollectionCard key={c.id} c={c} />)}
              </ul>
            </section>
          )}
        </Container>
      )}
    </div>
  );
}
