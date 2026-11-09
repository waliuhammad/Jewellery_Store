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

  return (
    <div
      className="group relative flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 4:5 Image Container */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-cream">
        <Link to={`/product/${product.slug}`} className="block w-full h-full">
          {/* Primary Image */}
          <motion.img
            src={product.images[0]}
            alt={product.name}
            className={`w-full h-full object-cover transition-opacity duration-500 ${
              product.images[1] && isHovered ? 'opacity-0' : 'opacity-100'
            } ${isSoldOut ? 'opacity-50 grayscale-[30%]' : ''}`}
            animate={{ scale: isHovered ? 1.04 : 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            loading="lazy"
          />

          {/* Secondary Hover Image (Crossfade) */}
          {product.images[1] && (
            <motion.img
              src={product.images[1]}
              alt={`${product.name} view 2`}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 pointer-events-none ${
                isHovered ? 'opacity-100' : 'opacity-0'
              } ${isSoldOut ? 'opacity-50' : ''}`}
              animate={{ scale: isHovered ? 1.04 : 1 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              loading="lazy"
            />
          )}
        </Link>

        {/* Badges (Top Left) */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          {isSoldOut ? (
            <span className="px-2 py-0.5 text-[10px] uppercase tracking-label font-medium bg-garnet text-ivory">
              Sold Out
            </span>
          ) : (
            <>
              {product.badge === 'SALE' && (
                <span className="px-2.5 py-0.5 text-[10px] uppercase tracking-label font-medium bg-rose text-ivory">
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
                <span className="px-2.5 py-0.5 text-[10px] uppercase tracking-label font-medium bg-blush text-ink">
                  Only a few left
                </span>
              )}
            </>
          )}
        </div>

        {/* Wishlist Heart Button (Top Right) */}
        <motion.button
          onClick={handleHeartClick}
          aria-label={isSaved ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
          whileTap={{ scale: 1.25 }}
          className={`absolute top-3 right-3 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-colors shadow-sm ${
            isSaved
              ? 'bg-ivory text-rose'
              : 'bg-ivory/85 backdrop-blur-sm text-ink hover:text-rose'
          }`}
        >
          <Heart
            className={`w-4 h-4 transition-transform ${isSaved ? 'fill-rose text-rose' : ''}`}
            strokeWidth={1.5}
          />
        </motion.button>

        {/* Desktop Quick Add bar (slides up on hover) */}
        {!isSoldOut && (
          <div className="hidden lg:block absolute inset-x-0 bottom-0 z-10 overflow-hidden">
            <button
              onClick={handleQuickAdd}
              className={`w-full py-3.5 text-xs uppercase tracking-label font-medium transition-all duration-300 ease-luxe flex items-center justify-center gap-2 ${
                isHovered ? 'translate-y-0' : 'translate-y-full'
              } ${isAdded ? 'bg-sage text-ivory' : 'bg-ink text-ivory hover:bg-gold hover:text-ink'}`}
            >
              {isAdded ? (
                <>
                  <Check className="w-3.5 h-3.5" /> Added to bag
                </>
              ) : (
                'Quick Add'
              )}
            </button>
          </div>
        )}

        {/* Mobile Quick Add round button (bottom right) */}
        {!isSoldOut && (
          <button
            onClick={handleQuickAdd}
            aria-label={`Add ${product.name} to bag`}
            className="lg:hidden absolute bottom-3 right-3 z-10 w-10 h-10 rounded-full bg-ink text-ivory flex items-center justify-center shadow-md active:scale-95 transition-transform"
          >
            {isAdded ? <Check className="w-4 h-4 text-sage" /> : <Plus className="w-4 h-4" strokeWidth={1.5} />}
          </button>
        )}
      </div>

      {/* Product Info */}
      <div className="pt-3.5 flex flex-col">
        <Link to={`/product/${product.slug}`} className="group-hover:text-gold transition-colors">
          <h3 className="font-display text-lg md:text-xl text-ink font-semibold leading-snug line-clamp-1">
            {product.name}
          </h3>
        </Link>

        <p className="text-xs text-taupe mt-0.5 line-clamp-1">
          {product.material.split(',')[0]}
        </p>

        <div className="mt-2 flex items-baseline gap-2.5">
          <span className="font-sans text-sm md:text-base font-medium text-ink">
            {BRAND.currency.format(product.price)}
          </span>
          {product.compareAtPrice && (
            <span className="font-sans text-xs text-taupe line-through">
              {BRAND.currency.format(product.compareAtPrice)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

