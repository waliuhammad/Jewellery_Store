import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BRAND } from '../config/brand';

export default function Preloader() {
  const [show, setShow] = useState(() => {
    return !sessionStorage.getItem('aurelle_preloader_seen');
  });

  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        setShow(false);
        sessionStorage.setItem('aurelle_preloader_seen', 'true');
      }, 1100);
      return () => clearTimeout(timer);
    }
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } }}
          className="fixed inset-0 z-[9999] bg-ivory flex flex-col items-center justify-center pointer-events-none select-none"
        >
          <div className="text-center px-6">
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="font-display text-2xl sm:text-3xl tracking-wordmark uppercase text-ink font-semibold"
            >
              {BRAND.name}
            </motion.h1>

            {/* Drawing gold hairline */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.7, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="h-[1px] bg-gold w-32 mx-auto mt-3 origin-left"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

