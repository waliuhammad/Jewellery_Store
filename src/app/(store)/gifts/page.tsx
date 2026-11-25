import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Heart } from 'lucide-react';
import { siteConfig } from '@/config/site';
import { cloudinaryUrl, formatPrice } from '@/lib/cloudinary/url';
import { listActiveCollections, type CollectionDoc } from '@/lib/catalog/collections';
import { priceBandHref } from '@/lib/catalog/priceBands';
import { isAdminConfigured } from '@/lib/firebase/admin';
import { ButtonLink } from '@/components/ui/Button';
import { EditorialImage } from '@/components/ui/EditorialImage';
import { PageIntro } from '@/components/ui/PageIntro';
import { Reveal, Stagger, StaggerItem } from '@/components/ui/Reveal';

export const metadata: Metadata = {
  title: 'Gifts',
  description: 'Jewellery gifts for every occasion and budget, thoughtfully chosen.',
};
export const revalidate = 300;

/** Occasions from the config, kept only when their collection exists and is active. */
async function loadOccasions() {
  const { occasions } = siteConfig.gifting;
  if (occasions.length === 0 || !isAdminConfigured()) return [];
  try {
    const collections = await listActiveCollections();
    const bySlug = new Map<string, CollectionDoc>(collections.map((c) => [c.slug, c]));
    return occasions.flatMap((o) => {
      const c = bySlug.get(o.collectionSlug);
      return c ? [{ ...o, collection: c }] : [];
    });
  } catch (err) {
    console.error('[gifts] collections unavailable', err);
    return [];
  }
}

export default async function GiftsPage() {
  const occasions = await loadOccasions();
  const { gifting, categories, editorial } = siteConfig;

  return (
    <>
      <PageIntro
        crumbs={[{ label: 'Gifts' }]}
        eyebrow="The Gift Edit"
        title="Gifts to"
        accent="Remember."
        lead="For the moments that deserve more than words. Browse by occasion, budget or the kind of piece you have in mind."
      />

      {occasions.length > 0 && (
        <section aria-labelledby="occasions-heading" className="mx-auto max-w-content px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <Reveal>
            <p className="eyebrow">By Occasion</p>
            <h2 id="occasions-heading" className="text-h2 mt-3">
              For Every <span className="accent">Moment.</span>
            </h2>
          </Reveal>
          <Stagger className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {occasions.map((o, i) => (
              <StaggerItem key={o.collectionSlug} className={i === 0 ? 'sm:col-span-2 lg:col-span-1 lg:row-span-2' : ''}>
                <Link href={`/collections/${o.collection.slug}`} className="group relative block h-full">
                  <EditorialImage
                    src={o.collection.banner ? cloudinaryUrl(o.collection.banner, { width: 900 }) : null}
                    alt={o.collection.banner?.alt ?? ''}
                    className={`${i === 0 ? 'aspect-[4/5] lg:aspect-auto lg:h-full' : 'aspect-[4/3]'}`}
                  />
                  <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-espresso/55 to-transparent" />
                  <span className="absolute inset-x-6 bottom-6 text-ivory">
                    <span className="flex items-center justify-between font-heading text-3xl">
                      {o.label}
                      <ArrowUpRight size={18} aria-hidden className="transition-transform duration-500 group-hover:-translate-y-1 group-hover:translate-x-1" />
                    </span>
                    {o.description && <span className="mt-2 block text-sm text-ivory/85">{o.description}</span>}
                  </span>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        </section>
      )}

      <section aria-labelledby="budget-heading" className="bg-espresso text-ivory">
        <div className="mx-auto max-w-content px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <Reveal>
            <p className="eyebrow text-gold">By Budget</p>
            <h2 id="budget-heading" className="text-h2 mt-3 text-ivory">
              The Perfect Gift, <span className="italic text-gold">at Any Price.</span>
            </h2>
          </Reveal>
          <Stagger className="mt-12 grid gap-px bg-ivory/15 sm:grid-cols-2 lg:grid-cols-4">
            {gifting.priceBands.map((b) => (
              <StaggerItem key={b.label} className="bg-espresso">
                <Link href={priceBandHref(b)} className="group flex h-full flex-col justify-between gap-10 p-8 transition-colors duration-500 hover:bg-[#3f3029]">
                  <span className="font-heading text-3xl leading-tight">{b.label}</span>
                  <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">
                    Shop gifts <ArrowRight size={14} aria-hidden className="transition-transform duration-500 group-hover:translate-x-1" />
                  </span>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section aria-labelledby="gift-type-heading" className="mx-auto max-w-content px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <EditorialImage src={editorial.gifting.imageUrl} alt={editorial.gifting.imageAlt} className="aspect-[4/5]" />
          </Reveal>
          <Reveal delay={0.1} className="lg:col-span-6 lg:col-start-7 lg:self-center">
            <p className="eyebrow">By Piece</p>
            <h2 id="gift-type-heading" className="text-h2 mt-3">
              Choose What <span className="accent">Suits Them.</span>
            </h2>
            <ul className="mt-10 divide-y divide-line border-y border-line">
              {categories.map((c) => (
                <li key={c.slug}>
                  <Link href={`/categories/${c.slug}`} className="group flex items-center justify-between py-5 font-heading text-2xl text-espresso transition-colors hover:text-gold-deep">
                    {c.name}
                    <ArrowRight size={18} aria-hidden className="-translate-x-2 opacity-50 transition duration-500 group-hover:translate-x-0 group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-content px-4 pb-24 sm:px-6 lg:px-8">
        <div className={`grid gap-6 ${gifting.packaging ? 'lg:grid-cols-2' : ''}`}>
          {gifting.packaging && (
            <Reveal className="border border-line bg-white/60 p-8 sm:p-12">
              <p className="eyebrow">Gift Packaging</p>
              <h2 className="text-h3 mt-3">{gifting.packaging.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted">{gifting.packaging.body}</p>
              <p className="mt-4 text-sm text-espresso">{gifting.packaging.price > 0 ? formatPrice(gifting.packaging.price) : 'Included'}</p>
            </Reveal>
          )}
          <Reveal className="flex flex-col items-start justify-center gap-6 bg-champagne/50 p-8 sm:flex-row sm:items-center sm:justify-between sm:p-12">
            <div className="flex items-start gap-4">
              <Heart size={22} strokeWidth={1.3} aria-hidden className="mt-1 shrink-0 text-antique" />
              <div>
                <h2 className="text-h3">Keep a list of ideas</h2>
                <p className="mt-1 text-sm text-muted">Tap the heart on any piece to save it for later.</p>
              </div>
            </div>
            <ButtonLink href="/wishlist" variant="outline" size="sm" arrow>
              View Wishlist
            </ButtonLink>
          </Reveal>
        </div>
      </section>
    </>
  );
}
