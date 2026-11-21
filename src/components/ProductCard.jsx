import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Plus, Check } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { BRAND } from '../config/brand';

export default function ProductCard({ product, onQuickView }) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const isSaved = isInWishlist(product.id);
  const isSoldOut = product.stock <= 0;

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isSoldOut) return;

    addToCart(product, {}, 1, true);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1400);
  };

  const handleHeartClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const firstImage = (product.images && product.images[0]?.url) || (Array.isArray(product.images) && product.images[0]) || '';
  const secondImage = (product.images && product.images[1]?.url) || (Array.isArray(product.images) && product.images[1]) || firstImage;

  return (
    <div
      className="group relative flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 4:5 Image Container per Design.md Section 4.5 */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-cream">
        <Link to={`/product/${product.slug}`} className="block w-full h-full">
          {/* Primary Image */}
          <motion.img
            src={firstImage}
            alt={product.name}
            className={`w-full h-full object-cover transition-opacity duration-500 ${secondImage !== firstImage && isHovered ? 'opacity-0' : 'opacity-100'
              } ${isSoldOut ? 'opacity-50 grayscale-[30%]' : ''}`}
            animate={{ scale: isHovered ? 1.04 : 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            loading="lazy"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = '/placeholder-product.svg';
            }}
          />

          {/* Secondary Hover Image (Crossfade) */}
          {secondImage !== firstImage && (
            <motion.img
              src={secondImage}
              alt={`${product.name} view 2`}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 pointer-events-none ${isHovered ? 'opacity-100' : 'opacity-0'
                } ${isSoldOut ? 'opacity-50' : ''}`}
              animate={{ scale: isHovered ? 1.04 : 1 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              loading="lazy"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = '/placeholder-product.svg';
              }}
            />
          )}
        </Link>

        {/* Badges per Design.md Section 4.5 (Top Left) */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          {isSoldOut ? (
            <span className="px-2 py-0.5 text-[10px] uppercase tracking-label font-medium bg-alert text-ivory">
              Out of Stock
            </span>
          ) : (
            <>
              {product.badge === 'SALE' && (
                <span className="px-2.5 py-0.5 text-[10px] uppercase tracking-label font-medium bg-maroon text-ivory">
                  Sale
                </span>
              )}
              {product.badge === 'NEW' && (
                <span className="px-2.5 py-0.5 text-[10px] uppercase tracking-label font-medium bg-ivory text-ink border border-hairline">
                  New
                </span>
              )}
              {product.badge === 'BESTSELLER' && (
                <span className="px-2.5 py-0.5 text-[10px] uppercase tracking-label font-medium bg-champagne text-ink">
                  Bestseller
                </span>
              )}
              {product.badge === 'LOW STOCK' && (
                <span className="px-2.5 py-0.5 text-[10px] uppercase tracking-label font-medium bg-mist text-forest">
                  Low Stock
                </span>
              )}
            </>
          )}
        </div>

        {/* Wishlist Heart (Top Right: 36px round, Ivory at 85%, fills Maroon on toggle) */}
        <button
          onClick={handleHeartClick}
          aria-label={isSaved ? 'Remove from wishlist' : 'Save to wishlist'}
          className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-ivory/85 backdrop-blur-sm flex items-center justify-center text-ink hover:text-maroon transition-colors shadow-sm"
        >
          <motion.div
            animate={{ scale: isSaved ? [1, 1.25, 1] : 1 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <Heart
              className={`w-4 h-4 transition-colors ${isSaved ? 'text-maroon fill-maroon' : 'text-ink/80 stroke-[1.4]'
                }`}
            />
          </motion.div>
        </button>

        {/* Desktop Quick Add Bar per Design.md 4.5 (slides up translateY 100% to 0) */}
        {!isSoldOut && (
          <div className="absolute inset-x-0 bottom-0 z-10 hidden sm:block overflow-hidden pointer-events-none">
            <div
              className={`transform transition-transform duration-300 ease-luxe pointer-events-auto ${isHovered ? 'translate-y-0' : 'translate-y-full'
                }`}
            >
              <button
                onClick={handleQuickAdd}
                className="w-full relative overflow-hidden bg-forest text-ivory py-3 text-xs uppercase tracking-label font-medium flex items-center justify-center gap-2 group/btn"
              >
                {/* Gold hover sweep */}
                <span className="absolute inset-0 -translate-x-full bg-gold transition-transform duration-300 ease-luxe group-hover/btn:translate-x-0" />
                <span className="relative z-10 flex items-center gap-1.5 transition-colors duration-300 group-hover/btn:text-ink">
                  {isAdded ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-leaf" /> Added to Bag
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" /> Quick Add
                    </>
                  )}
                </span>
              </button>
            </div>
          </div>
        )}

        {/* Mobile Quick Add Touch Button per Design.md 4.5 (bottom right "+" circle) */}
        {!isSoldOut && (
          <button
            onClick={handleQuickAdd}
            aria-label="Add to bag"
            className="sm:hidden absolute bottom-3 right-3 z-10 w-9 h-9 rounded-full bg-forest text-ivory flex items-center justify-center shadow-md active:scale-95 transition-transform"
          >
            {isAdded ? <Check className="w-4 h-4 text-leaf" /> : <Plus className="w-4 h-4" />}
          </button>
        )}
      </div>

      {/* Product Details Stack */}
      <div className="pt-3 pb-1 flex flex-col flex-grow">
        <Link to={`/product/${product.slug}`} className="block group-hover:text-emerald transition-colors">
          <h3 className="font-display text-base sm:text-lg font-medium text-forest line-clamp-1">
            {product.name}
          </h3>
        </Link>

        {/* Subtitle / Material / Finish */}
        <p className="text-xs text-moss font-sans mt-0.5 line-clamp-1">
          {product.finish || product.material || 'Handcrafted Demi-Fine'}
        </p>

        {/* Pricing per Design.md Section 4.5: Maroon if on sale, compare-at Moss struck through */}
        <div className="flex items-baseline gap-2 mt-2">
          <span className={`text-sm sm:text-base font-medium font-sans ${product.compareAtPrice ? 'text-maroon' : 'text-forest'}`}>
            {BRAND.currency.format(product.price)}
          </span>

          {product.compareAtPrice && (
            <span className="text-xs text-moss line-through font-sans">
              {BRAND.currency.format(product.compareAtPrice)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
