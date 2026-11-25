import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getSessionUser } from '@/lib/auth/session';
import { getOrderForUser } from '@/lib/account/orders';
import { cloudinaryUrl, formatPrice } from '@/lib/cloudinary/url';

export const metadata: Metadata = { title: 'Order details' };
export const dynamic = 'force-dynamic';

import { labelFor } from '@/lib/orders/status';

export default async function OrderDetailPage({ params }: { params: { id: string } }) {
  const user = await getSessionUser();
  if (!user) notFound();
  const order = await getOrderForUser(user.uid, params.id);
  if (!order) notFound();

  const c = order.customer;

  return (
    <div>
      <Link href="/account/orders" className="text-sm text-muted hover:text-ink">← All orders</Link>
      <h1 className="mt-4 font-heading text-4xl">Order {order.id.slice(0, 8).toUpperCase()}</h1>
      <p className="mt-2 text-sm text-muted">
        {order.createdAtMs
          ? new Date(order.createdAtMs).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
          : 'Date pending'}
        {' · '}{labelFor(order.status)}
      </p>

      <ul className="mt-10 divide-y divide-rose-border border-y border-rose-border">
        {order.lines.map((line) => (
          <li key={line.productId} className="flex gap-5 py-5">
            <div className="h-24 w-20 shrink-0 overflow-hidden rounded-card bg-blush">
              {line.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={cloudinaryUrl(line.image, { width: 200, aspect: '1:1' })} alt={line.image.alt || line.name} className="h-full w-full object-cover" />
              )}
            </div>
            <div className="flex flex-1 justify-between gap-4">
              <div>
                <p className="font-medium">{line.name}</p>
                <p className="mt-1 text-xs text-muted">{line.sku}</p>
                <p className="mt-2 text-sm text-muted">Qty {line.quantity} × {formatPrice(line.unitPrice, order.currency)}</p>
              </div>
              <p className="text-sm">{formatPrice(line.lineTotal, order.currency)}</p>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-10 grid gap-10 md:grid-cols-2">
        <section>
          <h2 className="font-heading text-2xl">Delivery address</h2>
          <p className="mt-3 text-sm text-muted">
            {c.fullName}<br />
            {c.address1}{c.address2 ? `, ${c.address2}` : ''}<br />
            {c.city}{c.postalCode ? ` ${c.postalCode}` : ''}<br />
            {c.country}
          </p>
        </section>

        <section>
          <h2 className="font-heading text-2xl">Summary</h2>
          <dl className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between"><dt className="text-muted">Subtotal</dt><dd>{formatPrice(order.subtotal, order.currency)}</dd></div>
            <div className="flex justify-between"><dt className="text-muted">Shipping</dt><dd>{order.shipping === 0 ? 'Calculated at checkout' : formatPrice(order.shipping, order.currency)}</dd></div>
            {order.tax > 0 && <div className="flex justify-between"><dt className="text-muted">Tax</dt><dd>{formatPrice(order.tax, order.currency)}</dd></div>}
            <div className="flex justify-between border-t border-rose-border pt-2 font-medium"><dt>Total</dt><dd>{formatPrice(order.total, order.currency)}</dd></div>
          </dl>
        </section>
      </div>
    </div>
  );
}
