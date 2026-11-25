'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { siteConfig } from '@/config/site';

const EASE = [0.22, 1, 0.36, 1] as const;

/** Customer words, one at a time. Renders nothing until genuine testimonials are added to the config. */
export function Testimonials() {
  const items = siteConfig.testimonials;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (items.length < 2 || reduce || paused) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % items.length), 7000);
    return () => clearInterval(id);
  }, [items.length, reduce, paused]);

  if (items.length === 0) return null;
  const t = items[index]!;

  return (
    <section
      aria-labelledby="testimonials-heading"
      className="border-y border-line bg-champagne/40 py-20 lg:py-28"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
        <h2 id="testimonials-heading" className="eyebrow">
          In Their Words
        </h2>
        <span aria-hidden className="mt-6 block font-heading text-7xl leading-none text-antique/60">“</span>
        <div className="relative min-h-[11rem]" aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            <motion.figure
              key={index}
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -12 }}
              transition={{ duration: 0.6, ease: EASE }}
            >
              <blockquote className="font-heading text-2xl italic leading-snug text-espresso sm:text-3xl">{t.quote}</blockquote>
              <figcaption className="mt-6 text-[11px] font-semibold uppercase tracking-[0.22em] text-muted">
                {t.name}
                {t.location && <span className="font-normal"> · {t.location}</span>}
              </figcaption>
            </motion.figure>
          </AnimatePresence>
        </div>
        {items.length > 1 && (
          <div className="mt-8 flex justify-center gap-2">
            {items.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Show testimonial ${i + 1}`}
                aria-current={i === index}
                className="py-3"
              >
                <span className={`block h-px transition-all duration-500 ${i === index ? 'w-10 bg-espresso' : 'w-5 bg-espresso/30'}`} />
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
