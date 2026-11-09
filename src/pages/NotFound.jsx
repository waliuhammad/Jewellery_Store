import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <div className="pt-32 pb-24 bg-ivory min-h-screen flex items-center justify-center">
      <div className="max-w-md mx-auto px-6 text-center">
        {/* Animated Gold Ring Line Drawing */}
        <div className="w-24 h-24 mx-auto mb-6 relative">
          <svg className="w-24 h-24" viewBox="0 0 100 100">
            {/* Outer Ring */}
            <motion.circle
              cx="50"
              cy="50"
              r="38"
              fill="none"
              stroke="#B8924A"
              strokeWidth="1.5"
              initial={{ pathLength: 0, rotate: -90 }}
              animate={{ pathLength: 1, rotate: 270 }}
              transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
            />
            {/* Inner Ring facet */}
            <motion.circle
              cx="50"
              cy="50"
              r="30"
              fill="none"
              stroke="#E4D9CB"
              strokeWidth="1"
              strokeDasharray="2 3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            />
            {/* Solitaire diamond outline atop */}
            <motion.polygon
              points="50,14 55,22 45,22"
              fill="none"
              stroke="#B8924A"
              strokeWidth="1.5"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1, duration: 0.4 }}
            />
          </svg>
        </div>

        <h1 className="font-display text-7xl sm:text-8xl text-champagne font-semibold tracking-wider mb-2">
          404
        </h1>
        <h2 className="font-display text-2xl sm:text-3xl text-ink font-normal mb-3">
          This piece has <span className="italic">slipped away</span>.
        </h2>
        <p className="text-xs sm:text-sm text-taupe mb-8 font-light leading-relaxed">
          The page or jewelry piece you are looking for may have been archived or moved. Let's return to the showroom.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/shop"
            className="w-full sm:w-auto relative overflow-hidden bg-ink text-ivory px-8 py-3.5 text-xs uppercase tracking-label font-medium group text-center"
          >
            <span className="absolute inset-0 -translate-x-full bg-gold transition-transform duration-300 ease-luxe group-hover:translate-x-0" />
            <span className="relative transition-colors duration-300 group-hover:text-ink">
              Browse Collection
            </span>
          </Link>
          <Link
            to="/"
            className="w-full sm:w-auto border border-hairline px-8 py-3.5 text-xs uppercase tracking-label font-medium text-ink hover:bg-cream transition-colors text-center"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}

