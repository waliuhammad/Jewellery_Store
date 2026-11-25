import { notFound } from 'next/navigation';
import { adminDb } from '@/lib/firebase/admin';
import { CollectionForm } from '@/components/admin/CollectionForm';

export const dynamic = 'force-dynamic';

const ID = /^[A-Za-z0-9_-]{1,128}$/;

export default async function EditCollectionPage({ params }: { params: { id: string } }) {
  if (!ID.test(params.id)) notFound();
  const db = adminDb();
  const snap = await db.collection('collections').doc(params.id).get();
  if (!snap.exists) notFound();
  const d = snap.data()!;

  const productsSnap = await db.collection('products').select('name', 'sku').limit(300).get();
  const products = productsSnap.docs.map((p) => ({ id: p.id, name: String(p.data().name ?? ''), sku: String(p.data().sku ?? '') }));
  const banner = d.banner && typeof d.banner.url === 'string' ? d.banner : null;

  return (
    <div>
      <h1 className="font-heading text-4xl">{String(d.name ?? 'Collection')}</h1>
      <div className="mt-8">
        <CollectionForm
          collectionId={params.id}
          initial={{
            name: String(d.name ?? ''),
            slug: String(d.slug ?? ''),
            description: String(d.description ?? ''),
            kind: d.kind === 'seasonal' ? 'seasonal' : 'curated',
            season: String(d.season ?? ''),
            tagline: String(d.tagline ?? ''),
            banner,
            isActive: d.isActive === true,
            productIds: Array.isArray(d.productIds) ? d.productIds.map(String) : [],
          }}
          products={products}
        />
      </div>
    </div>
  );
}
