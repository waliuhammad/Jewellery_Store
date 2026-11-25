'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { siteConfig } from '@/config/site';

const EASE = [0.22, 1, 0.36, 1] as const;

const discover = [
  { label: 'New Arrivals', href: '/shop?sort=newest' },
  { label: 'Collections', href: '/collections' },
  ...(siteConfig.weddingCollectionSlug ? [{ label: 'Wedding Collection', href: `/collections/${siteConfig.weddingCollectionSlug}` }] : []),
  { label: 'Gifts', href: '/gifts' },
  { label: 'Shop All Jewellery', href: '/shop' },
];

export function MegaMenu({ id, onNavigate }: { id: string; onNavigate: () => void }) {
  const { categories, hero } = siteConfig;
  return (
    <motion.div
      id={id}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35, ease: EASE }}
      className="absolute inset-x-0 top-full border-t border-line bg-ivory shadow-soft"
    >
      <div className="mx-auto grid max-w-content grid-cols-12 gap-10 px-8 py-12">
        <nav aria-label="Jewellery categories" className="col-span-4">
          <p className="eyebrow">Shop by Category</p>
          <ul className="mt-6 space-y-3">
            {categories.map((c, i) => (
              <motion.li
                key={c.slug}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, ease: EASE, delay: 0.05 + i * 0.04 }}
              >
                <Link
                  href={`/categories/${c.slug}`}
                  onClick={onNavigate}
                  className="group inline-flex items-center gap-3 font-heading text-2xl text-espresso transition-colors hover:text-gold-deep"
                >
                  {c.name}
                  <ArrowRight size={16} aria-hidden className="-translate-x-2 opacity-0 transition duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
                </Link>
              </motion.li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Discover" className="col-span-3 border-l border-line pl-10">
          <p className="eyebrow">Discover</p>
          <ul className="mt-6 space-y-4 text-sm">
            {discover.map((d) => (
              <li key={d.href}>
                <Link href={d.href} onClick={onNavigate} className="link-draw text-espresso">
                  {d.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {hero.imageUrl && (
          <Link href="/shop" onClick={onNavigate} className="group relative col-span-5 block aspect-[16/9] overflow-hidden bg-champagne">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={hero.imageUrl} alt="" className="h-full w-full object-cover transition-transform duration-[1.2s] ease-luxe group-hover:scale-105" />
            <span className="absolute inset-0 bg-gradient-to-t from-espresso/55 to-transparent" />
            <span className="absolute bottom-5 left-6 text-ivory">
              <span className="block font-heading text-2xl">The Jewelora Edit</span>
              <span className="mt-1 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em]">
                Shop now <ArrowRight size={13} aria-hidden />
              </span>
            </span>
          </Link>
        )}
      </div>
    </motion.div>
  );
}
