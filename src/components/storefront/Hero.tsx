'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { siteConfig } from '@/config/site';
import { ButtonLink } from '@/components/ui/Button';

const EASE = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const reduce = useReducedMotion();
  const { hero } = siteConfig;

  // Last word of the headline is set in italic gold.
  const words = hero.headline.split(' ');
  const accentIndex = words.length - 1;

  const fade = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 14 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.9, ease: EASE, delay },
        };

  return (
    <section aria-labelledby="hero-heading" className="relative overflow-hidden bg-ivory">
      <div className="mx-auto grid max-w-[1600px] lg:min-h-[min(calc(100vh-8.25rem),820px)] lg:grid-cols-12">
        {/* Image: first on mobile, right-hand bleed on desktop */}
        <div className="relative aspect-[4/3] overflow-hidden bg-champagne sm:aspect-[16/10] lg:order-2 lg:col-span-7 lg:aspect-auto">
          {hero.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={hero.imageUrl}
              alt={hero.imageAlt}
              fetchPriority="high"
              className="absolute inset-0 h-full w-full object-cover motion-safe:animate-slow-zoom"
            />
          ) : (
            <div aria-hidden className="absolute inset-0 bg-champagne" />
          )}
          {/* Soft ivory falloff where the photo meets the text column */}
          <div aria-hidden className="absolute inset-y-0 left-0 hidden w-32 bg-gradient-to-r from-ivory to-transparent lg:block" />
        </div>

        {/* Copy */}
        <div className="relative z-10 flex flex-col justify-center px-6 py-14 sm:px-10 lg:order-1 lg:col-span-5 lg:py-20 lg:pl-16 xl:pl-24">
          <motion.p {...fade(0.1)} className="eyebrow flex items-center gap-4">
            {hero.eyebrow}
            <span aria-hidden className="h-px w-12 bg-antique/60" />
          </motion.p>

          <h1 id="hero-heading" className="text-display mt-6 text-espresso">
            {words.map((word, i) => (
              <span key={i} className="inline-block overflow-hidden pb-[0.12em] align-bottom">
                <motion.span
                  className={`inline-block ${i === accentIndex ? 'accent' : ''}`}
                  initial={reduce ? false : { y: '110%' }}
                  animate={{ y: 0 }}
                  transition={{ duration: 1.1, ease: EASE, delay: 0.2 + i * 0.07 }}
                >
                  {word}
                </motion.span>
                {i < words.length - 1 && ' '}
              </span>
            ))}
          </h1>

          <motion.p {...fade(0.75)} className="text-lead mt-6 max-w-md">
            {hero.description}
          </motion.p>

          <motion.div {...fade(0.9)} className="mt-10 flex flex-wrap gap-4">
            <ButtonLink href={hero.primaryCta.href} arrow>
              {hero.primaryCta.label}
            </ButtonLink>
            <ButtonLink href={hero.secondaryCta.href} variant="outline">
              {hero.secondaryCta.label}
            </ButtonLink>
          </motion.div>
        </div>
      </div>

      {/* Highlights strip, shown only when the business has confirmed claims */}
      {hero.highlights.length > 0 && (
        <ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-2 border-y border-line bg-champagne/60 px-4 py-4 text-[11px] font-medium uppercase tracking-[0.2em] text-espresso">
          {hero.highlights.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )}
    </section>
  );
}
