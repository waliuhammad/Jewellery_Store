import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ease, dur } from './tokens';

/**
 * Standard Reveal: soft fade + rise, once per element
 */
export function Reveal({ children, delay = 0, y = 24, className = '' }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: reduce ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-8% 0px' }}
      transition={{ duration: dur.base, ease, delay }}
    >
      {children}
    </motion.div>
  );
}

/**
 * MaskLines: headline lines rise from behind an overflow-hidden clip
 */
export function MaskLines({ lines, className = '', lineClassName = '' }) {
  const reduce = useReducedMotion();
  return (
    <h1 className={className}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden">
          <motion.span
            className={`block ${lineClassName}`}
            initial={{ y: reduce ? 0 : '110%' }}
            animate={{ y: 0 }}
            transition={{ duration: dur.hero, ease, delay: 0.15 + i * 0.12 }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </h1>
  );
}

/**
 * ImageReveal: clip-path wipe + inner image scale settle
 */
export function ImageReveal({ src, alt, className = '', imgClassName = '' }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={`overflow-hidden ${className}`}
      initial={{ clipPath: reduce ? 'inset(0)' : 'inset(100% 0 0 0)' }}
      whileInView={{ clipPath: 'inset(0)' }}
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={{ duration: dur.slow, ease }}
    >
      <motion.img
        src={src}
        alt={alt}
        className={`h-full w-full object-cover ${imgClassName}`}
        initial={{ scale: reduce ? 1 : 1.14 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.3, ease }}
        loading="lazy"
      />
    </motion.div>
  );
}

/**
 * FadeIn: simple opacity transition for lightweight components
 */
export function FadeIn({ children, delay = 0, duration = dur.base, className = '' }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration, ease, delay }}
    >
      {children}
    </motion.div>
  );
}

