import Link from 'next/link';
import { isAdminConfigured } from '@/lib/firebase/admin';
import { listRecentOrders } from '@/lib/admin/orders';
import { ORDER_STATUSES, labelFor } from '@/lib/orders/status';
import { formatPrice } from '@/lib/cloudinary/url';
import { EmptyState } from '@/components/products/EmptyState';

export const dynamic = 'force-dynamic';

export default async function AdminOrdersPage({ searchParams }: { searchParams: { status?: string } }) {
  if (!isAdminConfigured()) {
    return <EmptyState title="Database not connected" body="Set the Firebase Admin environment variables first." />;
  }
  const status = ORDER_STATUSES.find((s) => s === searchParams.status);
  const orders = await listRecentOrders(status);

  return (
    <div>
      <h1 className="font-heading text-4xl">Orders</h1>

      <nav aria-label="Filter by status" className="mt-6 flex flex-wrap gap-2 text-sm">
        <Link href="/admin/orders" className={`rounded-button border px-3 py-1 ${!status ? 'border-ink' : 'border-rose-border'}`}>All</Link>
        {ORDER_STATUSES.map((s) => (
          <Link key={s} href={`/admin/orders?status=${s}`} className={`rounded-button border px-3 py-1 ${status === s ? 'border-ink' : 'border-rose-border'}`}>
            {labelFor(s)}
          </Link>
        ))}
      </nav>

      {orders.length === 0 ? (
        <div className="mt-8"><EmptyState title="No orders" body="Orders appear here as customers check out." /></div>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-card border border-rose-border bg-card">
          <table className="w-full text-left text-sm">
            <caption className="sr-only">Orders, newest first</caption>
            <thead className="border-b border-rose-border text-muted">
              <tr>
                <th scope="col" className="px-4 py-3 font-medium">Order</th>
                <th scope="col" className="px-4 py-3 font-medium">Customer</th>
                <th scope="col" className="px-4 py-3 font-medium">Items</th>
                <th scope="col" className="px-4 py-3 font-medium">Total</th>
                <th scope="col" className="px-4 py-3 font-medium">Status</th>
                <th scope="col" className="px-4 py-3"><span className="sr-only">Open</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rose-border">
              {orders.map((o) => (
                <tr key={o.id}>
                  <td className="px-4 py-3">{o.id.slice(0, 8).toUpperCase()}</td>
                  <td className="px-4 py-3">{o.customerName || '—'}</td>
                  <td className="px-4 py-3">{o.itemCount}</td>
                  <td className="px-4 py-3">{formatPrice(o.total, o.currency)}</td>
                  <td className="px-4 py-3">{labelFor(o.status)}</td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/admin/orders/${o.id}`} className="underline-offset-4 hover:underline">Open</Link>
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
