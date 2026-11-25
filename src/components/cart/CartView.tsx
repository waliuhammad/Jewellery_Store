'use client';

import Link from 'next/link';
import { useCart } from '@/lib/cart/CartContext';
import { useCartQuote } from '@/lib/checkout/useCartQuote';
import { cloudinaryUrl, formatPrice } from '@/lib/cloudinary/url';
import { Button, ButtonLink } from '@/components/ui/Button';
import { MAX_QTY_PER_LINE } from '@/lib/validations/checkout';

export function CartView() {
  const { items, ready, setQuantity, removeItem } = useCart();
  const { quote, error, loading } = useCartQuote(items, ready);

  if (!ready) return <p className="text-muted">Loading your bag…</p>;

  if (items.length === 0) {
    return (
      <div className="py-20 text-center">
        <h1 className="font-heading text-4xl">Your bag is empty</h1>
        <p className="mt-4 text-muted">Find something you love in the shop.</p>
        <div className="mt-8 flex justify-center">
          <ButtonLink href="/shop">Continue shopping</ButtonLink>
        </div>
      </div>
    );
  }

  const count = items.reduce((sum, i) => sum + i.quantity, 0);
  const canCheckout = Boolean(quote) && !loading && quote!.lines.length > 0 && quote!.issues.length === 0;

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
      <section aria-labelledby="bag-heading">
        <h1 id="bag-heading" className="font-heading text-4xl">
          Shopping Bag{' '}
          <span className="text-2xl text-muted">
            ({count} {count === 1 ? 'item' : 'items'})
          </span>
        </h1>

        <ul className="mt-8 divide-y divide-rose-border border-y border-rose-border">
          {items.map((item) => {
            const line = quote?.lines.find((l) => l.productId === item.productId);
            const unavailable = Boolean(quote) && !line && !loading;
            const image = line?.image ?? item.image;
            const max = Math.min(MAX_QTY_PER_LINE, line?.stock ?? MAX_QTY_PER_LINE);

            return (
              <li key={item.productId} className="flex gap-5 py-6">
                <div className="h-28 w-24 shrink-0 overflow-hidden rounded-card bg-blush">
                  {image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={cloudinaryUrl(image, { width: 240, aspect: '1:1' })}
                      alt={image.alt || item.name}
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>

                <div className="flex flex-1 flex-col">
                  <div className="flex justify-between gap-4">
                    <Link href={`/products/${item.slug}`} className="font-medium hover:text-rose">
                      {item.name}
                    </Link>
                    {line && <span className="text-sm">{formatPrice(line.lineTotal, line.currency)}</span>}
                  </div>
                  {line && <p className="mt-1 text-xs text-muted">{line.sku}</p>}
                  {unavailable && <p className="mt-1 text-xs text-red-700">No longer available. Please remove this item.</p>}

                  <div className="mt-auto flex items-center gap-5 pt-4 text-sm">
                    {line && (
                      <div className="flex items-center rounded-button border border-rose-border">
                        <button
                          type="button"
                          aria-label={`Decrease quantity of ${item.name}`}
                          onClick={() => setQuantity(item.productId, item.quantity - 1)}
                          className="px-3 py-1"
                        >
                          −
                        </button>
                        <span aria-live="polite" className="min-w-8 text-center">{item.quantity}</span>
                        <button
                          type="button"
                          aria-label={`Increase quantity of ${item.name}`}
                          disabled={item.quantity >= max}
                          onClick={() => setQuantity(item.productId, item.quantity + 1)}
                          className="px-3 py-1 disabled:opacity-40"
                        >
                          +
                        </button>
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => removeItem(item.productId)}
                      className="text-muted underline underline-offset-4 hover:text-ink"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        {error && <p role="alert" className="mt-6 text-sm text-red-700">{error}</p>}
        {quote?.issues.map((msg) => (
          <p key={msg} role="alert" className="mt-3 text-sm text-red-700">{msg}</p>
        ))}
      </section>

      <aside aria-labelledby="summary-heading" className="h-fit rounded-card border border-rose-border bg-card p-6">
        <h2 id="summary-heading" className="font-heading text-2xl">Order Summary</h2>

        {loading && !quote && <p className="mt-4 text-sm text-muted">Calculating…</p>}

        {quote && (
          <dl className="mt-6 space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted">Subtotal</dt>
              <dd>{formatPrice(quote.subtotal, quote.currency)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Shipping</dt>
              <dd>{quote.shipping === 0 ? 'Calculated at checkout' : formatPrice(quote.shipping, quote.currency)}</dd>
            </div>
            {quote.tax > 0 && (
              <div className="flex justify-between">
                <dt className="text-muted">Tax</dt>
                <dd>{formatPrice(quote.tax, quote.currency)}</dd>
              </div>
            )}
            <div className="flex justify-between border-t border-rose-border pt-3 text-base font-medium">
              <dt>Total</dt>
              <dd>{formatPrice(quote.total, quote.currency)}</dd>
            </div>
          </dl>
        )}

        <p className="mt-4 text-xs text-muted">Prices and stock are checked again at checkout.</p>

        <div className="mt-6">
          {canCheckout ? (
            <ButtonLink href="/checkout" className="w-full">Proceed to secure checkout</ButtonLink>
          ) : (
            <Button type="button" disabled className="w-full">Proceed to secure checkout</Button>
          )}
        </div>
      </aside>
    </div>
  );
}
