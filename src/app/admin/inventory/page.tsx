import { isAdminConfigured, adminDb } from '@/lib/firebase/admin';
import { mapProduct } from '@/lib/catalog/repository';
import { StockAdjuster } from '@/components/admin/StockAdjuster';
import { EmptyState } from '@/components/products/EmptyState';

export const dynamic = 'force-dynamic';

export default async function InventoryPage() {
  if (!isAdminConfigured()) {
    return <EmptyState title="Database not connected" body="Set the Firebase Admin environment variables first." />;
  }
  const snap = await adminDb().collection('products').limit(300).get();
  // Lowest stock first, so items needing attention appear at the top.
  const products = snap.docs.map((d) => mapProduct(d.id, d.data())).sort((a, b) => a.stock - b.stock);

  return (
    <div>
      <h1 className="font-heading text-4xl">Inventory</h1>
      <p className="mt-3 text-sm text-muted">
        Set the count to what is physically on hand, and give a reason. Every change is recorded.
      </p>

      {products.length === 0 ? (
        <div className="mt-8"><EmptyState title="No products yet" body="Create products to track their stock here." /></div>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-card border border-rose-border bg-card">
          <table className="w-full text-left text-sm">
            <caption className="sr-only">Stock levels, lowest first</caption>
            <thead className="border-b border-rose-border text-muted">
              <tr>
                <th scope="col" className="px-4 py-3 font-medium">Product</th>
                <th scope="col" className="px-4 py-3 font-medium">Status</th>
                <th scope="col" className="px-4 py-3 font-medium">Adjust stock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rose-border">
              {products.map((p) => (
                <tr key={p.id}>
                  <td className="px-4 py-3">
                    {p.name}
                    <span className="block text-xs text-muted">{p.sku || 'No SKU'} · {p.stock} on hand</span>
                  </td>
                  <td className="px-4 py-3">{p.status}</td>
                  <td className="px-4 py-3">
                    <StockAdjuster productId={p.id} current={p.stock} />
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
