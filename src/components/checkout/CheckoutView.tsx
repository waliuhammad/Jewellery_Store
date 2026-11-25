'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCart } from '@/lib/cart/CartContext';
import { useCartQuote } from '@/lib/checkout/useCartQuote';
import { customerSchema, type CustomerInput } from '@/lib/validations/checkout';
import { formatPrice } from '@/lib/cloudinary/url';
import { Button, ButtonLink } from '@/components/ui/Button';

const fields: { name: keyof CustomerInput; label: string; type?: string; autoComplete: string; wide?: boolean }[] = [
  { name: 'fullName', label: 'Full name', autoComplete: 'name', wide: true },
  { name: 'email', label: 'Email', type: 'email', autoComplete: 'email', wide: true },
  { name: 'phone', label: 'Phone', type: 'tel', autoComplete: 'tel', wide: true },
  { name: 'address1', label: 'Address', autoComplete: 'address-line1', wide: true },
  { name: 'address2', label: 'Apartment, suite, etc. (optional)', autoComplete: 'address-line2', wide: true },
  { name: 'city', label: 'City', autoComplete: 'address-level2' },
  { name: 'postalCode', label: 'Postal code (optional)', autoComplete: 'postal-code' },
  { name: 'country', label: 'Country', autoComplete: 'country-name', wide: true },
];

export function CheckoutView() {
  const router = useRouter();
  const { items, ready, clear } = useCart();
  const { quote, error: quoteError, loading } = useCartQuote(items, ready);
  const [serverError, setServerError] = useState<string | null>(null);
  const [serverIssues, setServerIssues] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CustomerInput>({ resolver: zodResolver(customerSchema) });

  if (!ready) return <p className="text-muted">Loading checkout…</p>;

  if (items.length === 0) {
    return (
      <div className="py-20 text-center">
        <h1 className="font-heading text-4xl">Your bag is empty</h1>
        <div className="mt-8 flex justify-center">
          <ButtonLink href="/shop">Continue shopping</ButtonLink>
        </div>
      </div>
    );
  }

  const canPlace = Boolean(quote) && !loading && quote!.lines.length > 0 && quote!.issues.length === 0;

  const onSubmit = async (customer: CustomerInput) => {
    setServerError(null);
    setServerIssues([]);

    const res = await fetch('/api/checkout/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        customer,
      }),
    });
    const body = await res.json().catch(() => ({}));

    if (!res.ok) {
      setServerError(body.error ?? 'We could not place your order. Please try again.');
      setServerIssues(Array.isArray(body.issues) ? body.issues : []);
      return;
    }

    clear();
    router.push(`/checkout/confirmation?order=${encodeURIComponent(body.orderId)}`);
  };

  const inputClass =
    'mt-1 w-full rounded-button border border-rose-border bg-card px-4 py-3 text-sm focus:border-rose focus:outline-none';

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-10">
        <section aria-labelledby="details-heading">
          <h1 id="details-heading" className="font-heading text-4xl">Checkout</h1>
          <h2 className="mt-8 font-heading text-2xl">Shipping details</h2>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            {fields.map((f) => {
              const id = `co-${f.name}`;
              const err = errors[f.name]?.message;
              return (
                <div key={f.name} className={f.wide ? 'sm:col-span-2' : ''}>
                  <label htmlFor={id} className="block text-sm">{f.label}</label>
                  <input
                    id={id}
                    type={f.type ?? 'text'}
                    autoComplete={f.autoComplete}
                    aria-invalid={Boolean(err)}
                    aria-describedby={err ? `${id}-error` : undefined}
                    className={inputClass}
                    {...register(f.name)}
                  />
                  {err && (
                    <p id={`${id}-error`} role="alert" className="mt-1 text-xs text-red-700">{err}</p>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        <section aria-labelledby="payment-heading">
          <h2 id="payment-heading" className="font-heading text-2xl">Payment</h2>
          <p className="mt-3 text-sm text-muted">
            No payment provider is connected yet. Your order will be saved as awaiting payment, and no payment is taken.
          </p>
        </section>

        {(serverError || serverIssues.length > 0) && (
          <div role="alert" className="rounded-card border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            {serverError && <p>{serverError}</p>}
            {serverIssues.map((msg) => (
              <p key={msg} className="mt-1">{msg}</p>
            ))}
          </div>
        )}

        <div>
          <Button type="submit" disabled={!canPlace || isSubmitting} className="w-full sm:w-auto">
            {isSubmitting ? 'Placing order…' : 'Place order'}
          </Button>
        </div>
      </form>

      <aside aria-labelledby="order-summary-heading" className="h-fit rounded-card border border-rose-border bg-card p-6">
        <h2 id="order-summary-heading" className="font-heading text-2xl">Order Summary</h2>

        {loading && !quote && <p className="mt-4 text-sm text-muted">Calculating…</p>}
        {quoteError && <p role="alert" className="mt-4 text-sm text-red-700">{quoteError}</p>}

        {quote && (
          <>
            <ul className="mt-6 space-y-4 text-sm">
              {quote.lines.map((line) => (
                <li key={line.productId} className="flex justify-between gap-4">
                  <span>{line.name} × {line.quantity}</span>
                  <span>{formatPrice(line.lineTotal, line.currency)}</span>
                </li>
              ))}
            </ul>
            <dl className="mt-6 space-y-3 border-t border-rose-border pt-4 text-sm">
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
            {quote.issues.map((msg) => (
              <p key={msg} role="alert" className="mt-4 text-sm text-red-700">{msg}</p>
            ))}
          </>
        )}
      </aside>
    </div>
  );
}
