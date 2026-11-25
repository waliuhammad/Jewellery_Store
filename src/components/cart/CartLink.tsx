'use client';

import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '@/lib/cart/CartContext';

export function CartLink() {
  const { count } = useCart();
  return (
    <Link
      href="/cart"
      aria-label={`Shopping bag, ${count} ${count === 1 ? 'item' : 'items'}`}
      className="relative p-2 text-espresso transition-colors hover:text-gold-deep"
    >
      <ShoppingBag size={19} strokeWidth={1.5} aria-hidden />
      {count > 0 && (
        <span
          aria-hidden
          className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-espresso px-1 text-[10px] leading-none text-white"
        >
          {count}
        </span>
      )}
    </Link>
  );
}
