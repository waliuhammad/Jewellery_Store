'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { doc, onSnapshot } from 'firebase/firestore';
import { getClientDb } from '@/lib/firebase/client';
import { cloudinaryUrl, formatPrice } from '@/lib/cloudinary/url';
import { siteConfig } from '@/config/site';
import { AddToBagButton } from '@/components/cart/AddToBagButton';
import { WishlistButton } from '@/components/products/WishlistButton';
import type { Product } from '@/types/catalog';

/** Starts from the server value, then follows Firestore so stock updates without a reload. */
function useLiveStock(productId: string, initialStock: number) {
  const [stock, setStock] = useState(initialStock);

  useEffect(() => {
    const db = getClientDb();
    if (!db) return;
    return onSnapshot(
      doc(db, 'products', productId),
      (snap) => {
        if (snap.exists()) setStock(Number(snap.data().stock ?? 0));
      },
      () => {
        // Listener failed (for example the product was archived). Keep the last known value.
      },
    );
  }, [productId]);

  return stock;
}

/** Hover zoom on desktop. Touch devices get the full image without zoom. */
function ZoomImage({ src, alt }: { src: string; alt: string }) {
  const [zoomed, setZoomed] = useState(false);
  const [origin, setOrigin] = useState('50% 50%');

  return (
    <div
      className="absolute inset-0 cursor-zoom-in overflow-hidden"
      onMouseEnter={() => setZoomed(true)}
      onMouseLeave={() => setZoomed(false)}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        setOrigin(`${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`);
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className="h-full w-full object-cover transition-transform duration-300 motion-reduce:transition-none"
        style={{ transform: zoomed ? 'scale(2)' : 'scale(1)', transformOrigin: origin }}
      />
    </div>
  );
}

export function ProductDetail({ product }: { product: Product }) {
  const [active, setActive] = useState(0);
  const stock = useLiveStock(product.id, product.stock);
  const images = product.images;
  const current = images[active];
  const inStock = stock > 0;
  const onSale = product.compareAtPrice && product.compareAtPrice > product.price;
  const stockMessage =
    stock <= 0 ? 'Currently sold out' : stock <= 3 ? `Only ${stock} left` : 'In stock';

  return (
    <div className="grid md:grid-cols-2">
      {/* Gallery */}
      <div className="bg-blush">
        <div className="relative aspect-[4/5] w-full overflow-hidden md:aspect-auto md:h-full md:min-h-[680px]">
          {current ? (
            <ZoomImage src={cloudinaryUrl(current, { width: 1600, aspect: '4:5' })} alt={current.alt || product.name} />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-sm text-muted">No image</div>
          )}
        </div>

        {images.length > 1 && (
          <ul className="flex gap-3 px-6 py-4 md:px-10">
            {images.map((img, i) => (
              <li key={`${i}-${img.url}`}>
                <button
                  type="button"
                  onClick={() => setActive(i)}
                  aria-label={`Show image ${i + 1}`}
                  aria-pressed={i === active}
                  className={`h-16 w-16 overflow-hidden rounded-card border ${i === active ? 'border-ink' : 'border-transparent'}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={cloudinaryUrl(img, { width: 160, aspect: '1:1' })} alt="" className="h-full w-full object-cover" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Details */}
      <div className="flex flex-col px-6 py-12 md:px-16 md:py-20">
        <p className="text-xs uppercase tracking-[0.2em] text-muted">{product.sku || 'SKU pending'}</p>
        <h1 className="mt-3 font-heading text-3xl leading-tight sm:text-4xl">{product.name}</h1>

        <p className="mt-4 text-lg">
          {formatPrice(product.price, product.currency)}
          {onSale && (
            <s className="ml-3 text-base text-muted">{formatPrice(product.compareAtPrice!, product.currency)}</s>
          )}
        </p>

        <p aria-live="polite" className={`mt-3 text-sm ${inStock ? 'text-ink' : 'text-muted'}`}>
          {stockMessage}
        </p>

        <div className="mt-8">
          <AddToBagButton
            productId={product.id}
            slug={product.slug}
            name={product.name}
            image={product.images[0] ?? null}
            stock={stock}
          />
        </div>

        <div className="mt-3">
          <WishlistButton productId={product.id} name={product.name} />
        </div>

        <p className="mt-6 text-sm text-muted">
          Questions about this piece?{' '}
          <Link href="/contact" className="text-ink underline underline-offset-4">Contact us</Link>
        </p>

        <div className="mt-10 space-y-4 border-t border-rose-border">
          <Accordion title="Description" open>
            <p className="whitespace-pre-line text-sm leading-relaxed text-muted">{product.description}</p>
          </Accordion>

          <Accordion title="Product details">
            <dl className="grid grid-cols-2 gap-3 text-sm">
              <dt className="text-muted">SKU</dt>
              <dd>{product.sku || '—'}</dd>
              <dt className="text-muted">Category</dt>
              <dd className="capitalize">{product.categoryId}</dd>
            </dl>
          </Accordion>

          <Accordion title="Shipping">
            <p className="text-sm leading-relaxed text-muted">{siteConfig.productInfo.shipping}</p>
          </Accordion>

          <Accordion title="Returns">
            <p className="text-sm leading-relaxed text-muted">{siteConfig.productInfo.returns}</p>
          </Accordion>

          <Accordion title="Care">
            <p className="text-sm leading-relaxed text-muted">{siteConfig.productInfo.care}</p>
          </Accordion>
        </div>
      </div>
    </div>
  );
}

function Accordion({ title, open = false, children }: { title: string; open?: boolean; children: React.ReactNode }) {
  return (
    <details open={open} className="group border-t border-rose-border pt-6 first:border-t-0 first:pt-6">
      <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-medium [&::-webkit-details-marker]:hidden">
        {title}
        <span aria-hidden className="text-lg transition-transform group-open:rotate-45">+</span>
      </summary>
      <div className="mt-4">{children}</div>
    </details>
  );
}
