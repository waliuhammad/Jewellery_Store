import 'server-only';
import { adminDb, isAdminConfigured } from '@/lib/firebase/admin';
import type { Category, Product, ShopFilters } from '@/types/catalog';

type Result<T> = { configured: boolean; data: T };

const MAX_SCAN = 200; // bounded read; move price/search filtering into Firestore queries as the catalogue grows

function toMillis(v: unknown): number {
  if (v && typeof v === 'object' && 'toMillis' in v && typeof (v as { toMillis: () => number }).toMillis === 'function') {
    return (v as { toMillis: () => number }).toMillis();
  }
  return 0;
}

export function mapProduct(id: string, d: FirebaseFirestore.DocumentData): Product {
  return {
    id,
    name: d.name ?? '',
    slug: d.slug ?? id,
    description: d.description ?? '',
    categoryId: d.categoryId ?? '',
    images: Array.isArray(d.images) ? d.images : [],
    price: Number(d.price ?? 0),
    compareAtPrice: d.compareAtPrice ?? null,
    currency: d.currency ?? 'PKR',
    sku: d.sku ?? '',
    stock: Number(d.stock ?? 0),
    status: d.status ?? 'draft',
    featured: Boolean(d.featured),
    material: d.material ?? null,
    soldCount: Number(d.soldCount ?? 0),
    createdAt: toMillis(d.createdAt),
  };
}

// Firestore error code for "this query needs a composite index that has not been deployed".
const FAILED_PRECONDITION = 9;
let warnedMissingIndex = false;

/**
 * Newest active products. Uses the (status, createdAt) index from firestore.indexes.json; if that
 * index has not been deployed yet, falls back to an unordered read sorted in memory instead of
 * failing the whole page.
 */
async function scanActiveProducts(): Promise<Product[]> {
  const active = adminDb().collection('products').where('status', '==', 'active');
  try {
    const snap = await active.orderBy('createdAt', 'desc').limit(MAX_SCAN).get();
    return snap.docs.map((doc) => mapProduct(doc.id, doc.data()));
  } catch (err) {
    if ((err as { code?: number }).code !== FAILED_PRECONDITION) throw err;
    if (!warnedMissingIndex) {
      warnedMissingIndex = true;
      console.warn('[catalog] Firestore index products(status, createdAt) is missing. Run: firebase deploy --only firestore:indexes');
    }
    const snap = await active.limit(MAX_SCAN).get();
    return snap.docs.map((doc) => mapProduct(doc.id, doc.data())).sort((a, b) => b.createdAt - a.createdAt);
  }
}

export async function listActiveProducts(filters: ShopFilters): Promise<Result<Product[]>> {
  if (!isAdminConfigured()) return { configured: false, data: [] };

  let items = await scanActiveProducts();

  if (filters.category) items = items.filter((p) => p.categoryId === filters.category);
  if (filters.featured) items = items.filter((p) => p.featured);
  if (filters.material) items = items.filter((p) => p.material === filters.material);
  if (filters.inStock) items = items.filter((p) => p.stock > 0);
  if (filters.q) {
    const q = filters.q.toLowerCase();
    items = items.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        (p.material ?? '').toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q),
    );
  }
  if (filters.min !== undefined) items = items.filter((p) => p.price >= filters.min!);
  if (filters.max !== undefined) items = items.filter((p) => p.price <= filters.max!);

  if (filters.sort === 'price-asc') items.sort((a, b) => a.price - b.price);
  else if (filters.sort === 'price-desc') items.sort((a, b) => b.price - a.price);
  else if (filters.sort === 'popular') items.sort((a, b) => b.soldCount - a.soldCount);
  // 'newest' keeps the Firestore order

  return { configured: true, data: items };
}

export async function getActiveProductBySlug(slug: string): Promise<Result<Product | null>> {
  if (!isAdminConfigured()) return { configured: false, data: null };

  const snap = await adminDb()
    .collection('products')
    .where('slug', '==', slug)
    .where('status', '==', 'active')
    .limit(1)
    .get();

  const doc = snap.docs[0];
  return { configured: true, data: doc ? mapProduct(doc.id, doc.data()) : null };
}

function mapCategory(id: string, d: FirebaseFirestore.DocumentData): Category {
  return {
    id,
    name: d.name ?? '',
    slug: d.slug ?? id,
    description: d.description ?? '',
    image: d.image ?? null,
    isActive: Boolean(d.isActive),
    sortOrder: Number(d.sortOrder ?? 0),
  };
}

/** Active categories, keyed by slug (for images and descriptions on discovery tiles). */
export async function listActiveCategories(): Promise<Result<Category[]>> {
  if (!isAdminConfigured()) return { configured: false, data: [] };
  const snap = await adminDb().collection('categories').where('isActive', '==', true).limit(50).get();
  const data = snap.docs.map((doc) => mapCategory(doc.id, doc.data())).sort((a, b) => a.sortOrder - b.sortOrder);
  return { configured: true, data };
}

export async function getCategoryBySlug(slug: string): Promise<Result<Category | null>> {
  if (!isAdminConfigured()) return { configured: false, data: null };

  const snap = await adminDb()
    .collection('categories')
    .where('slug', '==', slug)
    .where('isActive', '==', true)
    .limit(1)
    .get();

  const doc = snap.docs[0];
  if (!doc) return { configured: true, data: null };
  const d = doc.data();
  return {
    configured: true,
    data: {
      id: doc.id,
      name: d.name ?? '',
      slug: d.slug ?? doc.id,
      description: d.description ?? '',
      image: d.image ?? null,
      isActive: true,
      sortOrder: Number(d.sortOrder ?? 0),
    },
  };
}

/** Active products for the given ids. Drafts and archived items are dropped. */
export async function getActiveProductsByIds(ids: string[]): Promise<Product[]> {
  if (ids.length === 0) return [];
  const db = adminDb();
  const snaps = await db.getAll(...ids.map((id) => db.collection('products').doc(id)));
  return snaps
    .filter((s) => s.exists)
    .map((s) => mapProduct(s.id, s.data() ?? {}))
    .filter((p) => p.status === 'active');
}
