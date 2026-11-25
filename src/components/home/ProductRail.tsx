'use client';

import { useRef } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import type { ReactNode } from 'react';

/** Horizontally scrolling product row with snap points and previous / next controls. */
export function ProductRail({ label, children }: { label: string; children: ReactNode }) {
  const ref = useRef<HTMLUListElement>(null);
  const scroll = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: reduce ? 'auto' : 'smooth' });
  };
  const btn =
    'flex h-11 w-11 items-center justify-center rounded-full border border-espresso/30 text-espresso transition-colors duration-300 hover:border-espresso hover:bg-espresso hover:text-ivory';

  return (
    <div>
      <ul
        ref={ref}
        aria-label={label}
        className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 [scrollbar-width:none] sm:-mx-6 sm:gap-6 sm:px-6 lg:mx-0 lg:px-0 [&>li]:w-[46vw] [&>li]:shrink-0 [&>li]:snap-start sm:[&>li]:w-[30vw] lg:[&>li]:w-[calc((100%-4.5rem)/4)]"
      >
        {children}
      </ul>
      <div className="mt-6 hidden justify-end gap-3 md:flex">
        <button type="button" onClick={() => scroll(-1)} aria-label="Previous products" className={btn}>
          <ArrowLeft size={16} aria-hidden />
        </button>
        <button type="button" onClick={() => scroll(1)} aria-label="Next products" className={btn}>
          <ArrowRight size={16} aria-hidden />
        </button>
      </div>
    </div>
  );
}
