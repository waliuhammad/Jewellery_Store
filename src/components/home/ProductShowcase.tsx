import { ProductCard } from '@/components/products/ProductCard';
import { ButtonLink } from '@/components/ui/Button';
import { Reveal, Stagger, StaggerItem } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ProductRail } from './ProductRail';
import type { Product } from '@/types/catalog';

type Props = {
  id: string;
  eyebrow: string;
  title: string;
  accent?: string;
  intro?: string;
  products: Product[];
  configured: boolean;
  viewAll: { label: string; href: string };
  layout: 'editorial' | 'rail';
};

/**
 * Product sections fed by the live catalogue. While the store is not connected a short notice
 * stands in; once it is connected an empty section is hidden rather than padded with samples.
 */
export function ProductShowcase({ id, eyebrow, title, accent, intro, products, configured, viewAll, layout }: Props) {
  if (configured && products.length === 0) return null;

  const empty = (
    <p className="border border-dashed border-line px-6 py-14 text-center text-sm text-muted">
      Pieces appear here once the catalogue is connected.
    </p>
  );

  if (layout === 'editorial') {
    return (
      <section aria-labelledby={id} className="bg-white/60 py-20 lg:py-28">
        <div className="mx-auto grid max-w-content gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:gap-10 lg:px-8">
          <Reveal className="lg:sticky lg:top-32 lg:col-span-3 lg:self-start">
            <p className="eyebrow">{eyebrow}</p>
            <h2 id={id} className="text-h2 mt-3">
              {title}
              {accent && <> <span className="accent">{accent}</span></>}
            </h2>
            {intro && <p className="mt-5 text-sm leading-relaxed text-muted">{intro}</p>}
            <ButtonLink href={viewAll.href} variant="outline" size="sm" arrow className="mt-8">
              {viewAll.label}
            </ButtonLink>
          </Reveal>
          <div className="lg:col-span-9">
            {products.length === 0 ? (
              empty
            ) : (
              <Stagger className="grid grid-cols-2 gap-x-4 gap-y-12 sm:gap-x-6 md:grid-cols-3 md:pb-12">
                {products.slice(0, 6).map((p, i) => (
                  // Middle column sits lower for an editorial rhythm
                  <StaggerItem key={p.id} className={i % 3 === 1 ? 'md:translate-y-12' : ''}>
                    <ProductCard product={p} />
                  </StaggerItem>
                ))}
              </Stagger>
            )}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section aria-labelledby={id} className="mx-auto max-w-content px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <SectionHeading id={id} eyebrow={eyebrow} title={title} accent={accent} action={viewAll} />
      {products.length === 0 ? (
        empty
      ) : (
        <ProductRail label={title}>
          {products.slice(0, 12).map((p) => (
            <li key={p.id}>
              <ProductCard product={p} />
            </li>
          ))}
        </ProductRail>
      )}
    </section>
  );
}
