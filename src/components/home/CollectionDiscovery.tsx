import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { siteConfig } from '@/config/site';
import { cloudinaryUrl } from '@/lib/cloudinary/url';
import { EditorialImage } from '@/components/ui/EditorialImage';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Stagger, StaggerItem } from '@/components/ui/Reveal';
import type { Category } from '@/types/catalog';

/**
 * Asymmetric category discovery: one tall lead tile and a staggered grid beside it on desktop,
 * a swipeable row on mobile. Images come from the category records in Firestore.
 */
export function CollectionDiscovery({ categories }: { categories: Category[] }) {
  const bySlug = new Map(categories.map((c) => [c.slug, c]));
  const tiles = siteConfig.categories.map((c) => {
    const record = bySlug.get(c.slug);
    return {
      ...c,
      image: record?.image ? cloudinaryUrl(record.image, { width: 900, aspect: '4:5' }) : null,
      alt: record?.image?.alt ?? '',
    };
  });

  return (
    <section aria-labelledby="discover-heading" className="mx-auto max-w-content px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <SectionHeading id="discover-heading" eyebrow="Discover" title="Find Your" accent="Piece." action={{ label: 'Shop all jewellery', href: '/shop' }} />

      <Stagger className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:-mx-6 sm:px-6 lg:mx-0 lg:grid lg:grid-cols-12 lg:grid-rows-2 lg:gap-6 lg:overflow-visible lg:px-0">
        {tiles.map((t, i) => {
          const lead = i === 0;
          return (
            <StaggerItem
              key={t.slug}
              className={`w-[70vw] shrink-0 snap-start sm:w-[42vw] lg:w-auto ${
                lead ? 'lg:col-span-5 lg:row-span-2' : i % 3 === 1 ? 'lg:col-span-4' : 'lg:col-span-3'
              }`}
            >
              <Link href={`/categories/${t.slug}`} className="group relative block h-full">
                <EditorialImage
                  src={t.image}
                  alt={t.alt || t.name}
                  className={`aspect-[4/5] ${lead ? 'lg:aspect-auto lg:h-full lg:min-h-[640px]' : 'lg:aspect-auto lg:h-[308px]'}`}
                />
                {/* Photos get a soft scrim for legible ivory type; empty panels use espresso type instead */}
                {t.image && <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-espresso/50 via-espresso/0 to-transparent" />}
                <span className={`absolute inset-x-5 bottom-5 flex items-end justify-between gap-4 ${t.image ? 'text-ivory' : 'text-espresso'}`}>
                  <span>
                    <span className="block text-[10px] font-semibold tracking-[0.28em] opacity-80">{String(i + 1).padStart(2, '0')}</span>
                    <span className={`mt-1 block font-heading leading-none ${lead ? 'text-4xl lg:text-5xl' : 'text-3xl'}`}>{t.name}</span>
                  </span>
                  <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-current transition-colors duration-500 ${t.image ? 'group-hover:bg-ivory group-hover:text-espresso' : 'group-hover:bg-espresso group-hover:text-ivory'}`}>
                    <ArrowUpRight size={16} aria-hidden />
                  </span>
                </span>
              </Link>
            </StaggerItem>
          );
        })}
      </Stagger>
    </section>
  );
}
