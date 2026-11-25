'use client';

import { useId, useState, type ReactNode } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Plus } from 'lucide-react';

const EASE = [0.22, 1, 0.36, 1] as const;

export type AccordionItem = { question: string; answer: ReactNode };

/** Disclosure list with smooth height animation. Several panels may be open at once. */
export function Accordion({ items }: { items: AccordionItem[] }) {
  const [open, setOpen] = useState<Set<number>>(new Set());
  const reduce = useReducedMotion();
  const uid = useId();

  const toggle = (i: number) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });

  return (
    <ul className="divide-y divide-line border-y border-line">
      {items.map((item, i) => {
        const isOpen = open.has(i);
        const panelId = `${uid}-panel-${i}`;
        return (
          <li key={item.question}>
            <h3>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(i)}
                className="flex w-full items-center justify-between gap-6 py-6 text-left font-heading text-xl text-espresso transition-colors hover:text-gold-deep sm:text-2xl"
              >
                {item.question}
                <Plus size={18} aria-hidden className={`shrink-0 text-antique transition-transform duration-500 ease-luxe ${isOpen ? 'rotate-45' : ''}`} />
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={panelId}
                  role="region"
                  initial={reduce ? false : { height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={reduce ? undefined : { height: 0, opacity: 0 }}
                  transition={{ duration: 0.45, ease: EASE }}
                  className="overflow-hidden"
                >
                  <div className="max-w-2xl pb-7 text-sm leading-relaxed text-muted [&_a]:text-espresso [&_a]:underline [&_a]:underline-offset-4">
                    {item.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        );
      })}
    </ul>
  );
}
