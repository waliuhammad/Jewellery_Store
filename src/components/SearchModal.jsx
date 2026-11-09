import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { PRODUCTS, CATEGORIES } from '../data/products';
import { BRAND } from '../config/brand';

export default function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setQuery('');
      setResults([]);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Debounced search logic
  useEffect(() => {
    const timer = setTimeout(() => {
      const q = query.trim().toLowerCase();
      if (!q) {
        setResults([]);
        return;
      }
      const matches = PRODUCTS.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.material.toLowerCase().includes(q) ||
          p.tagline.toLowerCase().includes(q) ||
          (p.details && p.details.some((d) => d.toLowerCase().includes(q)))
      );
      setResults(matches);
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  const handleProductClick = (slug) => {
    onClose();
    navigate(`/product/${slug}`);
  };

  const handleCategoryClick = (catSlug) => {
    onClose();
    navigate(`/shop/${catSlug}`);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-start">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="absolute inset-0 bg-noir/60 backdrop-blur-sm"
          />

          {/* Modal Panel */}
          <motion.div
            initial={{ opacity: 0, y: -24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 w-full bg-ivory border-b border-hairline shadow-soft max-h-[85vh] overflow-y-auto"
          >
            <div className="max-w-4xl mx-auto px-6 py-8 md:py-12">
              {/* Header and Input */}
              <div className="flex items-center justify-between border-b border-hairline pb-4 relative">
                <Search className="w-5 h-5 text-taupe mr-3 flex-shrink-0" strokeWidth={1.5} />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search rings, necklaces, pearls, kundan..."
                  className="w-full bg-transparent text-xl md:text-2xl font-display placeholder:font-sans placeholder:text-sm placeholder:text-taupe/60 text-ink focus:outline-none"
                />
                {query && (
                  <button
                    onClick={() => setQuery('')}
                    className="p-1 text-taupe hover:text-ink mr-2"
                    aria-label="Clear search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="p-2 -mr-2 text-taupe hover:text-ink transition-colors"
                  aria-label="Close search dialog"
                >
                  <X className="w-6 h-6" strokeWidth={1.5} />
                </button>
              </div>

              {/* Suggestions / Results */}
              <div className="mt-8">
                {query.trim() === '' ? (
                  <div>
                    <p className="text-[11px] uppercase tracking-label text-taupe mb-4">
                      Popular Categories
                    </p>
                    <div className="flex flex-wrap gap-2.5">
                      {CATEGORIES.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => handleCategoryClick(cat.slug)}
                          className="px-4 py-2 text-xs uppercase tracking-label border border-hairline hover:border-gold hover:bg-cream transition-colors text-ink"
                        >
                          {cat.name}
                        </button>
                      ))}
                    </div>

                    <div className="mt-8 pt-8 border-t border-hairline">
                      <p className="text-[11px] uppercase tracking-label text-taupe mb-4">
                        Curated Highlights
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {PRODUCTS.slice(0, 3).map((item) => (
                          <div
                            key={item.id}
                            onClick={() => handleProductClick(item.slug)}
                            className="group flex items-center gap-3 cursor-pointer p-2 hover:bg-cream/60 transition-colors"
                          >
                            <img
                              src={item.images[0]}
                              alt={item.name}
                              className="w-14 h-16 object-cover flex-shrink-0"
                            />
                            <div className="min-w-0">
                              <h4 className="font-display text-sm text-ink truncate group-hover:text-gold transition-colors">
                                {item.name}
                              </h4>
                              <p className="text-xs text-taupe">{BRAND.currency.format(item.price)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : results.length > 0 ? (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-[11px] uppercase tracking-label text-taupe">
                        {results.length} {results.length === 1 ? 'piece found' : 'pieces found'}
                      </p>
                      <Link
                        to={`/shop?search=${encodeURIComponent(query)}`}
                        onClick={onClose}
                        className="text-xs text-gold hover:underline flex items-center gap-1"
                      >
                        View all in shop <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                      {results.map((product) => (
                        <div
                          key={product.id}
                          onClick={() => handleProductClick(product.slug)}
                          className="group cursor-pointer flex gap-4 items-center p-2.5 border border-transparent hover:border-hairline hover:bg-cream/40 transition-all"
                        >
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-16 h-20 object-cover flex-shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <span className="text-[10px] uppercase tracking-label text-taupe block mb-0.5">
                              {product.category}
                            </span>
                            <h4 className="font-display text-base text-ink leading-tight truncate group-hover:text-gold transition-colors">
                              {product.name}
                            </h4>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs font-medium text-ink">
                                {BRAND.currency.format(product.price)}
                              </span>
                              {product.compareAtPrice && (
                                <span className="text-xs text-taupe line-through">
                                  {BRAND.currency.format(product.compareAtPrice)}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="py-12 text-center">
                    <p className="font-display text-2xl text-ink mb-2">No matching pieces found</p>
                    <p className="text-sm text-taupe max-w-sm mx-auto mb-6">
                      We could not find any jewelry matching "{query}". Try searching for pearls, rings, necklaces, or kundan.
                    </p>
                    <button
                      onClick={() => {
                        setQuery('');
                        inputRef.current?.focus();
                      }}
                      className="text-xs uppercase tracking-label text-gold underline underline-offset-4"
                    >
                      Clear search
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

