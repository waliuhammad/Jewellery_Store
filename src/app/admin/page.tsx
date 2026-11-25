import Link from 'next/link';
import { isAdminConfigured } from '@/lib/firebase/admin';
import { loadDashboard } from '@/lib/admin/dashboard';
import { labelFor } from '@/lib/orders/status';
import { formatPrice } from '@/lib/cloudinary/url';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/products/EmptyState';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  if (!isAdminConfigured()) {
    return <EmptyState title="Database not connected" body="Set the Firebase Admin environment variables to see live figures." />;
  }
  const d = await loadDashboard();

  const stats = [
    { label: 'Revenue, last 30 days', value: formatPrice(d.revenue30, d.currency) },
    { label: 'Orders, last 30 days', value: String(d.orders30) },
    { label: 'Customers', value: String(d.customers) },
    { label: 'Active products', value: String(d.activeProducts) },
  ];

  return (
    <div>
      <h1 className="font-heading text-4xl">Dashboard</h1>

      <dl className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label} className="p-6">
            <dt className="text-sm text-muted">{s.label}</dt>
            <dd className="mt-2 font-heading text-3xl">{s.value}</dd>
          </Card>
        ))}
      </dl>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h2 className="font-heading text-2xl">Inventory</h2>
          <p className="mt-2 text-sm text-muted">{d.outOfStock} active {d.outOfStock === 1 ? 'product is' : 'products are'} sold out.</p>
          {d.lowStock.length === 0 ? (
            <p className="mt-4 text-sm text-muted">No active products are running low.</p>
          ) : (
            <ul className="mt-4 divide-y divide-rose-border text-sm">
              {d.lowStock.map((p) => (
                <li key={p.id} className="flex justify-between py-2">
                  <span>{p.name}</span>
                  <span className="text-muted">{p.stock} left</span>
                </li>
              ))}
            </ul>
          )}
          <Link href="/admin/inventory" className="mt-4 inline-block text-sm underline-offset-4 hover:underline">Manage inventory</Link>
        </Card>

        <Card className="p-6">
          <h2 className="font-heading text-2xl">Orders by status, last 30 days</h2>
          {Object.keys(d.byStatus).length === 0 ? (
            <p className="mt-4 text-sm text-muted">No orders in the last 30 days.</p>
          ) : (
            <ul className="mt-4 divide-y divide-rose-border text-sm">
              {Object.entries(d.byStatus).map(([status, count]) => (
                <li key={status} className="flex justify-between py-2">
                  <span>{labelFor(status)}</span>
                  <span className="text-muted">{count}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <Card className="mt-6 p-6">
        <h2 className="font-heading text-2xl">Recent orders</h2>
        {d.recent.length === 0 ? (
          <p className="mt-4 text-sm text-muted">No orders yet.</p>
        ) : (
          <ul className="mt-4 divide-y divide-rose-border text-sm">
            {d.recent.map((o) => (
              <li key={o.id} className="flex flex-wrap justify-between gap-2 py-3">
                <Link href={`/admin/orders/${o.id}`} className="hover:underline">Order {o.id.slice(0, 8).toUpperCase()}</Link>
                <span className="text-muted">{labelFor(o.status)}</span>
                <span>{formatPrice(o.total, o.currency)}</span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
