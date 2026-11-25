import Link from 'next/link';
import { adminDb, isAdminConfigured } from '@/lib/firebase/admin';
import { mapProduct } from '@/lib/catalog/repository';
import { formatPrice } from '@/lib/cloudinary/url';
import { ButtonLink } from '@/components/ui/Button';
import { EmptyState } from '@/components/products/EmptyState';

export const dynamic = 'force-dynamic';

const badge: Record<string, string> = {
  active: 'bg-green-100 text-green-900',
  draft: 'bg-blush text-ink',
  archived: 'bg-neutral-200 text-neutral-700',
};

export default async function AdminProductsPage() {
  const header = (
    <div className="flex items-center justify-between gap-4">
      <h1 className="font-heading text-4xl">Products</h1>
      <ButtonLink href="/admin/products/new">New product</ButtonLink>
    </div>
  );

  if (!isAdminConfigured()) {
    return <div>{header}<div className="mt-8"><EmptyState title="Database not connected" body="Set the Firebase Admin environment variables first." /></div></div>;
  }

  const snap = await adminDb().collection('products').orderBy('createdAt', 'desc').limit(100).get();
  const products = snap.docs.map((d) => mapProduct(d.id, d.data()));

  return (
    <div>
      {header}
      {products.length === 0 ? (
        <div className="mt-8"><EmptyState title="No products yet" body="Create your first product to start building the catalogue." /></div>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-card border border-rose-border bg-card">
          <table className="w-full text-left text-sm">
            <caption className="sr-only">All products, newest first</caption>
            <thead className="border-b border-rose-border text-muted">
              <tr>
                <th scope="col" className="px-4 py-3 font-medium">Name</th>
                <th scope="col" className="px-4 py-3 font-medium">SKU</th>
                <th scope="col" className="px-4 py-3 font-medium">Price</th>
                <th scope="col" className="px-4 py-3 font-medium">Stock</th>
                <th scope="col" className="px-4 py-3 font-medium">Status</th>
                <th scope="col" className="px-4 py-3"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rose-border">
              {products.map((p) => (
                <tr key={p.id}>
                  <td className="px-4 py-3">{p.name}</td>
                  <td className="px-4 py-3 text-muted">{p.sku || '—'}</td>
                  <td className="px-4 py-3">{formatPrice(p.price, p.currency)}</td>
                  <td className="px-4 py-3">{p.stock}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-button px-2 py-1 text-xs ${badge[p.status] ?? ''}`}>{p.status}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/admin/products/${p.id}`} className="underline-offset-4 hover:underline">Edit</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
