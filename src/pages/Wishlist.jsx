import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { BRAND } from '../config/brand';

export default function Wishlist() {
  const { wishlistProducts, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleMoveToBag = (product) => {
    addToCart(product, {}, 1, true);
    removeFromWishlist(product.id);
  };

  if (wishlistProducts.length === 0) {
    return (
      <div className="pt-32 pb-24 bg-ivory min-h-[70vh] flex items-center justify-center">
        <div className="max-w-md mx-auto px-6 text-center">
          <div className="w-16 h-16 rounded-full border border-hairline flex items-center justify-center mx-auto mb-6 text-rose">
            <Heart className="w-6 h-6 stroke-1" />
          </div>
          <span className="text-[11px] uppercase tracking-label text-taupe block mb-2">
            Your Wishlist
          </span>
          <h1 className="font-display text-4xl text-ink mb-4">Nothing saved yet</h1>
          <p className="text-sm text-taupe mb-8 font-light leading-relaxed">
            Tap the heart icon on any jewelry piece you admire while browsing to keep it safe here for later.
          </p>
          <Link
            to="/shop"
            className="relative inline-block overflow-hidden bg-ink text-ivory px-10 py-4 text-xs uppercase tracking-label font-medium group"
          >
            <span className="absolute inset-0 -translate-x-full bg-gold transition-transform duration-300 ease-luxe group-hover:translate-x-0" />
            <span className="relative transition-colors duration-300 group-hover:text-ink">
              Discover Jewelry
            </span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 lg:pt-32 pb-24 bg-ivory min-h-screen">
      <div className="max-w-page mx-auto px-6 lg:px-12">
        <div className="pb-8 border-b border-hairline mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl text-ink font-normal">
              Saved Pieces <span className="font-sans text-base text-taupe font-normal">({wishlistProducts.length})</span>
            </h1>
            <p className="text-xs uppercase tracking-label text-taupe mt-2">
              Your personal curation of fine &amp; fashion jewelry
            </p>
          </div>
          <button
            onClick={clearWishlist}
            className="text-xs uppercase tracking-label text-taupe hover:text-garnet underline self-start sm:self-auto"
          >
            Clear Wishlist
          </button>
        </div>

        {/* Wishlist Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
          {wishlistProducts.map((product) => (
            <div key={product.id} className="group relative flex flex-col">
              <div className="relative aspect-[4/5] bg-cream overflow-hidden border border-hairline">
                <Link to={`/product/${product.slug}`} className="block w-full h-full">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500 ease-luxe"
                  />
                </Link>
                <button
                  onClick={() => removeFromWishlist(product.id)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-ivory/85 text-taupe hover:text-garnet flex items-center justify-center transition-colors shadow-sm"
                  aria-label="Remove from wishlist"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="pt-3.5 flex flex-col flex-1 justify-between">
                <div>
                  <Link to={`/product/${product.slug}`} className="hover:text-gold transition-colors">
                    <h3 className="font-display text-lg text-ink font-semibold leading-snug line-clamp-1">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="text-xs text-taupe mt-0.5 line-clamp-1">{product.material}</p>
                  <p className="font-sans text-sm font-medium text-ink mt-1.5">
                    {BRAND.currency.format(product.price)}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-hairline">
                  <button
                    onClick={() => handleMoveToBag(product)}
                    className="w-full relative overflow-hidden bg-ink text-ivory py-2.5 text-xs uppercase tracking-label font-medium hover:bg-gold hover:text-ink transition-colors flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Move to Bag</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

