import { adminDb } from '@/lib/firebase/admin';
import { CollectionForm } from '@/components/admin/CollectionForm';

export const dynamic = 'force-dynamic';

export default async function NewCollectionPage() {
  const snap = await adminDb().collection('products').select('name', 'sku').limit(300).get();
  const products = snap.docs.map((d) => ({ id: d.id, name: String(d.data().name ?? ''), sku: String(d.data().sku ?? '') }));

  return (
    <div>
      <h1 className="font-heading text-4xl">New collection</h1>
      <div className="mt-8">
        <CollectionForm
          initial={{
            name: '', slug: '', description: '', kind: 'curated', season: '', tagline: '',
            banner: null, isActive: false, productIds: [],
          }}
          products={products}
        />
      </div>
    </div>
  );
}
