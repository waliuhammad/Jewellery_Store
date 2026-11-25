'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { cloudinaryUrl, formatPrice } from '@/lib/cloudinary/url';
import { QuickAddButton } from '@/components/products/QuickAddButton';
import { ButtonLink } from '@/components/ui/Button';
import type { ProductImage } from '@/types/catalog';

// Must match the key used by WishlistButton.
const STORAGE_KEY = 'wishlist:v1';

type Summary = {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice: number | null;
  currency: string;
  stock: number;
  image: ProductImage | null;
};

function readIds(): string[] {
  try {
    const raw: unknown = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '[]');
    return Array.isArray(raw) ? raw.filter((x): x is string => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

export function WishlistView() {
  const [ids, setIds] = useState<string[] | null>(null);
  const [products, setProducts] = useState<Summary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIds(readIds());
  }, []);

  useEffect(() => {
    if (ids === null) return;
    if (ids.length === 0) {
      setProducts([]);
      return;
    }
    let cancelled = false;
    setLoading(true);
    fetch('/api/catalog/by-ids', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids }),
    })
      .then(async (res) => {
        const body = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(body.error ?? 'Could not load your wishlist.');
        return body.products as Summary[];
      })
      .then((list) => {
        if (!cancelled) {
          setProducts(list);
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
  }, [ids]);

  const remove = (id: string) => {
    const next = (ids ?? []).filter((x) => x !== id);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Storage blocked: the item still leaves the list for this visit.
    }
    setIds(next);
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  if (ids === null) return <p className="text-muted">Loading your wishlist…</p>;

  if (ids.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="font-heading text-2xl">Your wishlist is empty</p>
        <p className="mt-3 text-sm text-muted">Tap the heart on any piece to save it here.</p>
        <div className="mt-8 flex justify-center">
          <ButtonLink href="/shop">Browse the shop</ButtonLink>
        </div>
      </div>
    );
  }

  return (
    <div>
      {error && <p role="alert" className="mb-6 text-sm text-red-700">{error}</p>}
      {loading && products.length === 0 && <p className="text-sm text-muted">Loading…</p>}

      <ul className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
        {products.map((p) => (
          <li key={p.id}>
            <article>
              <Link href={`/products/${p.slug}`} className="block">
                <div className="aspect-[4/5] overflow-hidden rounded-card bg-blush">
                  {p.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={cloudinaryUrl(p.image, { width: 600, aspect: '4:5' })}
                      alt={p.image.alt || p.name}
                      className="h-full w-full object-cover"
                    />
                  ) : null}
                </div>
                <h2 className="mt-3 text-sm font-medium">{p.name}</h2>
              </Link>
              <p className="mt-1 text-sm text-muted">{formatPrice(p.price, p.currency)}</p>
              <div className="mt-3 space-y-2">
                <QuickAddButton productId={p.id} slug={p.slug} name={p.name} image={p.image} stock={p.stock} />
                <button type="button" onClick={() => remove(p.id)} className="w-full text-xs text-muted underline underline-offset-4 hover:text-ink">
                  Remove from wishlist
                </button>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </div>
  );
}
