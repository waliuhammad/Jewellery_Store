'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { siteConfig } from '@/config/site';

const INTERVAL = 5000;

export function AnnouncementBar() {
  const messages = siteConfig.announcements;
  const [index, setIndex] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (messages.length < 2 || reduce) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % messages.length), INTERVAL);
    return () => clearInterval(id);
  }, [messages.length, reduce]);

  if (messages.length === 0) return null;

  return (
    <div className="relative h-9 overflow-hidden bg-espresso text-ivory" aria-live="polite">
      <AnimatePresence mode="wait" initial={false}>
        <motion.p
          key={index}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 flex items-center justify-center px-4 text-center text-[11px] font-medium tracking-[0.16em]"
        >
          {messages[index]}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
