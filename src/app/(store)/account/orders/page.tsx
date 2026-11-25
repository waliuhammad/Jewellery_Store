import type { Metadata } from 'next';
import Link from 'next/link';
import { getSessionUser } from '@/lib/auth/session';
import { listOrdersForUser } from '@/lib/account/orders';
import { formatPrice } from '@/lib/cloudinary/url';

export const metadata: Metadata = { title: 'Orders' };
export const dynamic = 'force-dynamic';

import { labelFor } from '@/lib/orders/status';

export default async function OrdersPage() {
  const user = await getSessionUser();
  const orders = user ? await listOrdersForUser(user.uid) : [];

  return (
    <div>
      <h1 className="font-heading text-4xl">Orders</h1>

      {orders.length === 0 ? (
        <div className="mt-10 rounded-card border border-dashed border-rose-border p-10 text-center">
          <p className="font-heading text-2xl">No orders yet</p>
          <p className="mt-2 text-sm text-muted">Orders you place while signed in will appear here.</p>
        </div>
      ) : (
        <ul className="mt-10 divide-y divide-rose-border border-y border-rose-border">
          {orders.map((o) => (
            <li key={o.id} className="flex flex-wrap items-center justify-between gap-4 py-6">
              <div>
                <Link href={`/account/orders/${o.id}`} className="font-medium hover:text-rose">
                  Order {o.id.slice(0, 8).toUpperCase()}
                </Link>
                <p className="mt-1 text-sm text-muted">
                  {o.createdAtMs
                    ? new Date(o.createdAtMs).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                    : 'Date pending'}
                  {' · '}{o.itemCount} {o.itemCount === 1 ? 'item' : 'items'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm">{formatPrice(o.total, o.currency)}</p>
                <p className="mt-1 text-xs text-muted">{labelFor(o.status)}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
