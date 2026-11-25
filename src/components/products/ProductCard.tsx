import Link from 'next/link';
import { cloudinaryUrl, formatPrice } from '@/lib/cloudinary/url';
import { WishlistButton } from './WishlistButton';
import { QuickAddButton } from './QuickAddButton';
import type { Product } from '@/types/catalog';

const LOW_STOCK = 3;

export function ProductCard({ product }: { product: Product }) {
  const [image, alternate] = product.images;
  const onSale = Boolean(product.compareAtPrice && product.compareAtPrice > product.price);
  const outOfStock = product.stock <= 0;
  const lowStock = !outOfStock && product.stock <= LOW_STOCK;

  return (
    <article className="group relative">
      <div className="relative">
        <Link href={`/products/${product.slug}`} className="block focus-visible:ring-2">
          <div className="relative aspect-[4/5] overflow-hidden bg-champagne">
            {image ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={cloudinaryUrl(image, { width: 640, aspect: '4:5' })}
                  alt={image.alt || product.name}
                  loading="lazy"
                  className={`absolute inset-0 h-full w-full object-cover transition-[transform,opacity] duration-[1.2s] ease-luxe group-hover:scale-[1.04] motion-reduce:transition-none ${
                    alternate ? 'group-hover:opacity-0' : ''
                  }`}
                />
                {alternate && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={cloudinaryUrl(alternate, { width: 640, aspect: '4:5' })}
                    alt=""
                    aria-hidden
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-700 ease-luxe group-hover:opacity-100 motion-reduce:transition-none"
                  />
                )}
              </>
            ) : (
              <span className="flex h-full items-center justify-center text-[11px] uppercase tracking-[0.2em] text-muted">Image coming soon</span>
            )}

            {(onSale || outOfStock) && (
              <span className="absolute left-3 top-3 bg-ivory/95 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-espresso">
                {outOfStock ? 'Sold out' : 'Sale'}
              </span>
            )}
          </div>
        </Link>

        <div className="absolute right-2 top-2 z-10">
          <WishlistButton productId={product.id} name={product.name} iconOnly />
        </div>

        {/* Quick add slides up over the photo on hover-capable screens; always visible on touch */}
        <div className="mt-3 lg:absolute lg:inset-x-3 lg:bottom-3 lg:mt-0 lg:translate-y-2 lg:opacity-0 lg:transition lg:duration-500 lg:ease-luxe lg:group-focus-within:translate-y-0 lg:group-focus-within:opacity-100 lg:group-hover:translate-y-0 lg:group-hover:opacity-100 [&_button]:bg-ivory/95 lg:[&_button]:backdrop-blur-sm">
          <QuickAddButton productId={product.id} slug={product.slug} name={product.name} image={image ?? null} stock={product.stock} />
        </div>
      </div>

      <div className="mt-4 text-center">
        <h3 className="font-heading text-lg leading-snug text-espresso">
          <Link href={`/products/${product.slug}`} className="link-draw">
            {product.name}
          </Link>
        </h3>
        {product.material && <p className="mt-0.5 text-[11px] uppercase tracking-[0.16em] text-muted">{product.material}</p>}
        <p className="mt-2 text-sm text-espresso">
          {onSale ? (
            <>
              <span className="sr-only">Sale price </span>
              <span className="font-semibold text-gold-deep">{formatPrice(product.price, product.currency)}</span>
              <span className="sr-only">, was </span>
              <s className="ml-2 text-xs text-muted">{formatPrice(product.compareAtPrice!, product.currency)}</s>
            </>
          ) : (
            formatPrice(product.price, product.currency)
          )}
        </p>
        {lowStock && <p className="mt-1 text-[11px] text-gold-deep">Only {product.stock} left</p>}
      </div>
    </article>
  );
}
