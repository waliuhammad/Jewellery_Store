import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getOrderAdmin } from '@/lib/admin/orders';
import { ALLOWED_TRANSITIONS, labelFor, type OrderStatus } from '@/lib/orders/status';
import { formatPrice } from '@/lib/cloudinary/url';
import { OrderStatusControl } from '@/components/admin/OrderStatusControl';

export const dynamic = 'force-dynamic';

const ID = /^[A-Za-z0-9_-]{1,128}$/;

export default async function AdminOrderPage({ params }: { params: { id: string } }) {
  if (!ID.test(params.id)) notFound();
  const order = await getOrderAdmin(params.id);
  if (!order) notFound();

  const c = order.customer;
  const allowed = (ALLOWED_TRANSITIONS[order.status as OrderStatus] ?? []) as OrderStatus[];

  return (
    <div>
      <Link href="/admin/orders" className="text-sm text-muted hover:text-ink">← All orders</Link>
      <h1 className="mt-4 font-heading text-4xl">Order {order.id.slice(0, 8).toUpperCase()}</h1>
      <p className="mt-2 text-sm text-muted">
        Status: <span className="text-ink">{labelFor(order.status)}</span>
        {order.userId ? ' · Account customer' : ' · Guest checkout'}
      </p>

      <div className="mt-8 max-w-2xl rounded-card border border-rose-border bg-card p-6">
        <h2 className="font-heading text-2xl">Update status</h2>
        <div className="mt-4">
          <OrderStatusControl orderId={order.id} allowed={allowed} />
        </div>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-2">
        <section>
          <h2 className="font-heading text-2xl">Items</h2>
          <ul className="mt-4 divide-y divide-rose-border text-sm">
            {order.lines.map((l) => (
              <li key={l.productId} className="flex justify-between gap-4 py-3">
                <span>{l.name} <span className="text-muted">({l.sku || 'no SKU'})</span> × {l.quantity}</span>
                <span>{formatPrice(l.lineTotal, order.currency)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-4 space-y-1 text-sm">
            <div className="flex justify-between"><dt className="text-muted">Subtotal</dt><dd>{formatPrice(order.subtotal, order.currency)}</dd></div>
            <div className="flex justify-between"><dt className="text-muted">Shipping</dt><dd>{formatPrice(order.shipping, order.currency)}</dd></div>
            {order.tax > 0 && <div className="flex justify-between"><dt className="text-muted">Tax</dt><dd>{formatPrice(order.tax, order.currency)}</dd></div>}
            <div className="flex justify-between border-t border-rose-border pt-2 font-medium"><dt>Total</dt><dd>{formatPrice(order.total, order.currency)}</dd></div>
          </dl>
        </section>

        <section>
          <h2 className="font-heading text-2xl">Customer and delivery</h2>
          <p className="mt-4 text-sm">
            {c.fullName}<br />
            {c.email}<br />
            {c.phone}<br />
            {c.address1}{c.address2 ? `, ${c.address2}` : ''}<br />
            {c.city}{c.postalCode ? ` ${c.postalCode}` : ''}<br />
            {c.country}
          </p>
        </section>
      </div>
    </div>
  );
}
