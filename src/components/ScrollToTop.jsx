import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const { scrollY, scrollYProgress } = useScroll();

  useEffect(() => {
    const unsubscribe = scrollY.on('change', (latest) => {
      setIsVisible(latest > 400);
    });
    return () => unsubscribe();
  }, [scrollY]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          onClick={scrollToTop}
          aria-label="Scroll to top of page"
          className="fixed bottom-8 right-8 z-40 w-14 h-14 rounded-full bg-ink/90 backdrop-blur-sm border border-champagne/30 text-ivory flex items-center justify-center hover:bg-ink transition-colors shadow-soft group"
        >
          {/* SVG Progress Ring */}
          <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 56 56">
            <circle
              cx="28"
              cy="28"
              r="26"
              fill="none"
              stroke="#E4D9CB"
              strokeWidth="1"
              strokeOpacity="0.25"
            />
            <motion.circle
              cx="28"
              cy="28"
              r="26"
              fill="none"
              stroke="#B8924A"
              strokeWidth="1.5"
              style={{ pathLength: scrollYProgress }}
            />
          </svg>
          <ArrowUp className="w-4 h-4 text-ivory group-hover:-translate-y-0.5 transition-transform" strokeWidth={1.5} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

