import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';
import { PRODUCTS } from '../data/products';

const WishlistContext = createContext(null);

const STORAGE_KEY = 'aurelle_wishlist_items';

export function WishlistProvider({ children }) {
  const [wishlistIds, setWishlistIds] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const { showToast } = useToast();

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlistIds));
    } catch (e) {
      console.error('Failed to save wishlist', e);
    }
  }, [wishlistIds]);

  const isInWishlist = (productId) => wishlistIds.includes(productId);

  const toggleWishlist = (productId) => {
    const product = PRODUCTS.find((p) => p.id === productId);
    const title = product ? product.name : 'Piece';

    setWishlistIds((prev) => {
      if (prev.includes(productId)) {
        showToast(`Removed "${title}" from your wishlist.`, 'info');
        return prev.filter((id) => id !== productId);
      } else {
        showToast(`Saved "${title}" to your wishlist.`, 'success');
        return [...prev, productId];
      }
    });
  };

  const removeFromWishlist = (productId) => {
    setWishlistIds((prev) => prev.filter((id) => id !== productId));
  };

  const clearWishlist = () => setWishlistIds([]);

  const wishlistProducts = wishlistIds
    .map((id) => PRODUCTS.find((p) => p.id === id))
    .filter(Boolean);

  return (
    <WishlistContext.Provider
      value={{
        wishlistIds,
        wishlistProducts,
        wishlistCount: wishlistIds.length,
        isInWishlist,
        toggleWishlist,
        removeFromWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}

