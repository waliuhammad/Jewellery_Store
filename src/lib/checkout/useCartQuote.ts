'use client';

import { useEffect, useState } from 'react';
import type { CartItem } from '@/lib/cart/CartContext';
import type { PricedCart } from '@/lib/checkout/types';

export function useCartQuote(items: CartItem[], ready: boolean) {
  const [quote, setQuote] = useState<PricedCart | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const key = JSON.stringify(items.map((i) => [i.productId, i.quantity]));

  useEffect(() => {
    if (!ready) return;
    if (items.length === 0) {
      setQuote(null);
      setError(null);
      return;
    }
    let cancelled = false;
    setLoading(true);

    fetch('/api/checkout/quote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })) }),
    })
      .then(async (res) => {
        const body = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(body.error ?? 'Could not load your bag.');
        return body as PricedCart;
      })
      .then((q) => {
        if (!cancelled) {
          setQuote(q);
          setError(null);
        }
      })
      .catch((e: Error) => {
        if (!cancelled) setError(e.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // `key` captures the items that matter; `items` itself changes identity on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, ready]);

  return { quote, error, loading };
}
