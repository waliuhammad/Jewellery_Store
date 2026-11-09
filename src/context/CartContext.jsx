import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';
import { BRAND } from '../config/brand';

const CartContext = createContext(null);

const STORAGE_KEY = 'aurelle_cart_items';
const GIFT_WRAP_KEY = 'aurelle_gift_wrap';
const NOTE_KEY = 'aurelle_order_note';

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isGiftWrap, setIsGiftWrap] = useState(() => {
    try {
      return localStorage.getItem(GIFT_WRAP_KEY) === 'true';
    } catch {
      return false;
    }
  });
  const [orderNote, setOrderNote] = useState(() => {
    try {
      return localStorage.getItem(NOTE_KEY) || '';
    } catch {
      return '';
    }
  });
  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);

  const { showToast } = useToast();

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save cart items', e);
    }
  }, [items]);

  useEffect(() => {
    try {
      localStorage.setItem(GIFT_WRAP_KEY, isGiftWrap.toString());
    } catch (e) {
      console.error('Failed to save gift wrap option', e);
    }
  }, [isGiftWrap]);

  useEffect(() => {
    try {
      localStorage.setItem(NOTE_KEY, orderNote);
    } catch (e) {
      console.error('Failed to save note', e);
    }
  }, [orderNote]);

  const openCart = () => setIsDrawerOpen(true);
  const closeCart = () => setIsDrawerOpen(false);

  const addToCart = (product, options = {}, quantity = 1, openDrawer = true) => {
    const finish = options.finish || (product.finishes && product.finishes[0]) || product.finish || 'Standard';
    const size = options.size || (product.sizes && product.sizes[0]) || 'Standard';
    const cartItemId = `${product.id}-${finish}-${size}`;

    setItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.cartItemId === cartItemId);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        };
        return updated;
      } else {
        return [
          ...prev,
          {
            cartItemId,
            product,
            finish,
            size,
            quantity,
          },
        ];
      }
    });

    showToast(`Added "${product.name}" to your bag.`, 'success');

    if (openDrawer) {
      setIsDrawerOpen(true);
    }
  };

  const updateQuantity = (cartItemId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.cartItemId === cartItemId ? { ...item, quantity: newQty } : item
      )
    );
  };

  const removeFromCart = (cartItemId) => {
    const item = items.find((i) => i.cartItemId === cartItemId);
    setItems((prev) => prev.filter((i) => i.cartItemId !== cartItemId));
    if (item) {
      showToast(`Removed "${item.product.name}" from bag.`, 'info');
    }
  };

  const clearCart = () => {
    setItems([]);
  };

  const applyCoupon = (code) => {
    const trimmed = (code || '').trim().toUpperCase();
    if (!trimmed) {
      setDiscountPercent(0);
      setCouponCode('');
      return false;
    }
    if (trimmed === 'AURELLE10' || trimmed === 'WELCOME10') {
      setDiscountPercent(10);
      setCouponCode(trimmed);
      showToast('10% promotional coupon applied.', 'success');
      return true;
    } else if (trimmed === 'GOLD5') {
      setDiscountPercent(5);
      setCouponCode(trimmed);
      showToast('5% seasonal coupon applied.', 'success');
      return true;
    } else {
      showToast('Coupon code is invalid or expired.', 'error');
      return false;
    }
  };

  const removeCoupon = () => {
    setCouponCode('');
    setDiscountPercent(0);
    showToast('Coupon removed.', 'info');
  };

  // Totals calculations
  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const giftWrapFee = isGiftWrap && items.length > 0 ? 350 : 0;
  const isFreeShipping = subtotal >= BRAND.shipping.freeThreshold;
  const shippingFee = items.length === 0 ? 0 : isFreeShipping ? 0 : BRAND.shipping.standardFee;
  const total = Math.max(0, subtotal - discountAmount + shippingFee + giftWrapFee);

  const freeShippingRemaining = Math.max(0, BRAND.shipping.freeThreshold - subtotal);
  const freeShippingProgress = Math.min(100, Math.round((subtotal / BRAND.shipping.freeThreshold) * 100));
  const totalItemCount = items.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        totalItemCount,
        isDrawerOpen,
        openCart,
        closeCart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        isGiftWrap,
        setIsGiftWrap,
        orderNote,
        setOrderNote,
        couponCode,
        discountPercent,
        discountAmount,
        applyCoupon,
        removeCoupon,
        subtotal,
        giftWrapFee,
        shippingFee,
        isFreeShipping,
        freeShippingRemaining,
        freeShippingProgress,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

