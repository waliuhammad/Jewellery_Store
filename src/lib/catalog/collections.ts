import 'server-only';
import { adminDb } from '@/lib/firebase/admin';
import type { ProductImage } from '@/types/catalog';

export type CollectionDoc = {
  id: string;
  name: string;
  slug: string;
  description: string;
  productIds: string[];
  kind: 'curated' | 'seasonal';
  season: string;
  tagline: string;
  banner: ProductImage | null;
};

function map(doc: FirebaseFirestore.QueryDocumentSnapshot): CollectionDoc {
  const d = doc.data();
  const banner = d.banner && typeof d.banner.url === 'string' ? (d.banner as ProductImage) : null;
  return {
    id: doc.id,
    name: String(d.name ?? ''),
    slug: String(d.slug ?? doc.id),
    description: String(d.description ?? ''),
    productIds: Array.isArray(d.productIds) ? d.productIds.map(String) : [],
    kind: d.kind === 'seasonal' ? 'seasonal' : 'curated',
    season: String(d.season ?? ''),
    tagline: String(d.tagline ?? ''),
    banner,
  };
}

export async function listActiveCollections(): Promise<CollectionDoc[]> {
  const snap = await adminDb().collection('collections').where('isActive', '==', true).limit(50).get();
  return snap.docs.map(map).sort((a, b) => a.name.localeCompare(b.name));
}

export async function getActiveCollectionBySlug(slug: string): Promise<CollectionDoc | null> {
  const snap = await adminDb()
    .collection('collections')
    .where('slug', '==', slug)
    .where('isActive', '==', true)
    .limit(1)
    .get();
  return snap.docs[0] ? map(snap.docs[0]) : null;
}
