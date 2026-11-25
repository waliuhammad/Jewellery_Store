'use client';

import { useState } from 'react';
import { useCart } from '@/lib/cart/CartContext';
import { MAX_QTY_PER_LINE } from '@/lib/validations/checkout';
import type { ProductImage } from '@/types/catalog';

export function AddToBagButton({
  productId,
  slug,
  name,
  image,
  stock,
}: {
  productId: string;
  slug: string;
  name: string;
  image: ProductImage | null;
  /** Live stock from the product page. Checked again at checkout. */
  stock: number;
}) {
  const { addItem } = useCart();
  const [requested, setRequested] = useState(1);
  const [added, setAdded] = useState<number | null>(null);

  const inStock = stock > 0;
  const max = Math.max(1, Math.min(MAX_QTY_PER_LINE, stock));
  const quantity = Math.min(requested, max);

  return (
    <div>
      <div className="flex gap-3">
        <div role="group" aria-label="Quantity" className="flex items-center rounded-button border border-rose-border">
          <button
            type="button"
            aria-label="Decrease quantity"
            disabled={!inStock || quantity <= 1}
            onClick={() => setRequested(Math.max(1, quantity - 1))}
            className="px-4 py-4 disabled:opacity-40"
          >
            −
          </button>
          <span aria-live="polite" className="min-w-8 text-center text-sm">
            {inStock ? quantity : 0}
          </span>
          <button
            type="button"
            aria-label="Increase quantity"
            disabled={!inStock || quantity >= max}
            onClick={() => setRequested(Math.min(max, quantity + 1))}
            className="px-4 py-4 disabled:opacity-40"
          >
            +
          </button>
        </div>

        <button
          type="button"
          disabled={!inStock}
          onClick={() => {
            addItem({ productId, slug, name, image }, quantity);
            setAdded(quantity);
          }}
          className="flex-1 rounded-button bg-espresso px-5 py-4 text-sm tracking-wide text-white disabled:opacity-50"
        >
          {inStock ? 'Add to bag' : 'Sold out'}
        </button>
      </div>

      <p role="status" className="mt-2 text-xs text-muted">
        {added !== null && (
          <>
            Added {added} to your bag.{' '}
            <a href="/cart" className="text-ink underline underline-offset-4">View bag</a>
          </>
        )}
      </p>
    </div>
  );
}
