import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { siteConfig } from '@/config/site';
import { ButtonLink } from '@/components/ui/Button';
import { EditorialImage } from '@/components/ui/EditorialImage';
import { Reveal } from '@/components/ui/Reveal';
import { priceBandHref } from '@/lib/catalog/priceBands';

/** Gifting band: shop-by-budget shortcuts beside an editorial image. No packaging promise unless configured. */
export function GiftingFeature() {
  const { gifting, editorial } = siteConfig;

  return (
    <section aria-labelledby="gifting-heading" className="bg-espresso text-ivory">
      <div className="mx-auto grid max-w-[1600px] lg:grid-cols-2">
        <EditorialImage src={editorial.gifting.imageUrl} alt={editorial.gifting.imageAlt} className="aspect-[4/3] lg:aspect-auto lg:min-h-[620px]" />

        <Reveal className="flex flex-col justify-center px-6 py-16 sm:px-12 lg:px-20 lg:py-24">
          <p className="eyebrow text-gold">The Gift Edit</p>
          <h2 id="gifting-heading" className="text-h2 mt-4 text-ivory">
            A Little Luxury, <span className="italic text-gold">A Lifetime of Memories.</span>
          </h2>
          {gifting.packaging && <p className="mt-6 max-w-md text-sm leading-relaxed text-ivory/75">{gifting.packaging.body}</p>}

          <p className="mt-10 text-[11px] font-semibold uppercase tracking-[0.22em] text-ivory/60">Shop by budget</p>
          <ul className="mt-4 divide-y divide-ivory/15 border-y border-ivory/15">
            {gifting.priceBands.map((b) => (
              <li key={b.label}>
                <Link href={priceBandHref(b)} className="group flex items-center justify-between py-4 font-heading text-2xl transition-colors hover:text-gold">
                  {b.label}
                  <ArrowRight size={18} aria-hidden className="-translate-x-2 opacity-60 transition duration-500 ease-luxe group-hover:translate-x-0 group-hover:opacity-100" />
                </Link>
              </li>
            ))}
          </ul>

          <ButtonLink href="/gifts" variant="light" arrow className="mt-10 self-start">
            Explore Gifts
          </ButtonLink>
        </Reveal>
      </div>
    </section>
  );
}
