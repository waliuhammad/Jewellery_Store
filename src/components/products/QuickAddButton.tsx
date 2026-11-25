'use client';

import { useEffect, useState } from 'react';
import { useCart } from '@/lib/cart/CartContext';
import type { ProductImage } from '@/types/catalog';

export function QuickAddButton({
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
  stock: number;
}) {
  const { addItem } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  const inStock = stock > 0;

  useEffect(() => {
    if (!justAdded) return;
    const t = setTimeout(() => setJustAdded(false), 1800);
    return () => clearTimeout(t);
  }, [justAdded]);

  return (
    <button
      type="button"
      disabled={!inStock}
      onClick={() => {
        addItem({ productId, slug, name, image }, 1);
        setJustAdded(true);
      }}
      className="w-full rounded-button border border-espresso px-4 py-2 text-xs uppercase tracking-[0.15em] text-espresso transition hover:bg-espresso hover:text-white disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-espresso"
    >
      {!inStock ? 'Sold out' : justAdded ? 'Added to bag' : 'Quick add'}
    </button>
  );
}
