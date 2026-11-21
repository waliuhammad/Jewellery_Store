import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, Trash2, ArrowRight, Gift, Tag, Lock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { BRAND } from '../config/brand';

export default function CartDrawer() {
  const {
    items,
    totalItemCount,
    isDrawerOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
    subtotal,
    isGiftWrap,
    setIsGiftWrap,
    orderNote,
    setOrderNote,
    couponCode,
    discountAmount,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const [inputCoupon, setInputCoupon] = useState('');
  const [showNoteInput, setShowNoteInput] = useState(!!orderNote);
  const navigate = useNavigate();

  const handleCheckout = () => {
    closeCart();
    if (!isAuthenticated) {
      showToast('Please sign in or register to proceed to checkout.', 'info');
      navigate('/login?redirect=/checkout');
    } else {
      navigate('/checkout');
    }
  };

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (inputCoupon.trim()) {
      applyCoupon(inputCoupon.trim());
      setInputCoupon('');
    }
  };

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop (Deep Forest 45% per Design.md Section 4.6) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={closeCart}
            className="absolute inset-0 bg-deep/45 backdrop-blur-sm"
          />

          {/* Drawer Panel (440px on desktop, full width on mobile) */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-y-0 right-0 w-full sm:w-[440px] bg-ivory flex flex-col shadow-soft border-l border-hairline z-10"
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-hairline flex items-center justify-between">
              <h2 className="font-display text-2xl md:text-3xl text-forest">
                Your Bag <span className="text-moss font-sans text-sm">({totalItemCount})</span>
              </h2>
              <button
                onClick={closeCart}
                className="p-2 -mr-2 text-moss hover:text-ink transition-colors"
                aria-label="Close bag drawer"
              >
                <X className="w-5 h-5" strokeWidth={1.4} />
              </button>
            </div>

            {/* Items List */}
            <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-hairline">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-16">
                  <div className="w-16 h-16 rounded-full border border-hairline flex items-center justify-center mb-4 text-moss">
                    <X className="w-6 h-6 stroke-[1.2]" />
                  </div>
                  <h3 className="font-display text-2xl text-forest mb-2">Your bag is empty</h3>
                  <p className="text-sm text-moss mb-8 max-w-xs">
                    Your bag is empty. Let's fix that. Explore our curated fine and fashion jewelry archives.
                  </p>
                  <button
                    onClick={() => {
                      closeCart();
                      navigate('/shop');
                    }}
                    className="relative overflow-hidden bg-forest text-ivory px-8 py-3.5 text-xs uppercase tracking-label font-medium group"
                  >
                    <span className="absolute inset-0 -translate-x-full bg-gold transition-transform duration-300 ease-luxe group-hover:translate-x-0" />
                    <span className="relative z-10 transition-colors duration-300 group-hover:text-ink">
                      Continue Shopping
                    </span>
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={`${item.id}-${item.finish}-${item.size}`} className="py-4 flex gap-4">
                    {/* 80x100px thumbnail */}
                    <div className="w-20 h-24 bg-cream flex-shrink-0 overflow-hidden border border-hairline">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="font-display text-base text-forest line-clamp-1 font-medium">
                            {item.name}
                          </h4>
                          <button
                            onClick={() => removeFromCart(item.id, item.finish, item.size)}
                            className="text-moss hover:text-maroon transition-colors p-1"
                            aria-label={`Remove ${item.name} from bag`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Variant details */}
                        <p className="text-xs text-moss font-sans mt-0.5">
                          {item.finish} {item.size && item.size !== 'One Size' ? `· ${item.size}` : ''}
                        </p>
                      </div>

                      {/* Stepper & Price Row */}
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center border border-hairline bg-cream">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.finish, item.size, item.quantity - 1)
                            }
                            className="p-1.5 hover:bg-hairline/40 transition-colors text-ink"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center text-xs font-sans font-medium text-ink">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.finish, item.size, item.quantity + 1)
                            }
                            className="p-1.5 hover:bg-hairline/40 transition-colors text-ink"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="text-sm font-medium font-sans text-forest">
                          {BRAND.currency.format(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Sticky Drawer Footer */}
            {items.length > 0 && (
              <div className="p-6 bg-ivory border-t border-hairline space-y-4">
                {/* Coupon & Notes Toggles */}
                <div className="flex items-center justify-between text-xs text-moss border-b border-hairline/60 pb-3">
                  <div className="flex items-center gap-1.5">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={isGiftWrap}
                        onChange={(e) => setIsGiftWrap(e.target.checked)}
                        className="w-3.5 h-3.5 accent-forest rounded-none"
                      />
                      <span>Gift packaging (+PKR 350)</span>
                    </label>
                  </div>
                  <button
                    onClick={() => setShowNoteInput(!showNoteInput)}
                    className="underline hover:text-forest transition-colors"
                  >
                    {showNoteInput ? 'Hide note' : 'Add gift note'}
                  </button>
                </div>

                {/* Optional Note Textarea */}
                {showNoteInput && (
                  <textarea
                    value={orderNote}
                    onChange={(e) => setOrderNote(e.target.value)}
                    placeholder="Write a personal gift card message or delivery instruction..."
                    rows={2}
                    className="w-full p-2.5 text-xs bg-cream border border-hairline text-ink placeholder:text-moss/60 focus:outline-none focus:border-gold transition-colors font-sans resize-none"
                  />
                )}

                {/* Subtotal Calculation */}
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between text-moss">
                    <span>Subtotal</span>
                    <span>{BRAND.currency.format(subtotal)}</span>
                  </div>

                  {couponCode && (
                    <div className="flex justify-between text-leaf">
                      <span>Promo ({couponCode})</span>
                      <span>-{BRAND.currency.format(discountAmount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-base font-medium text-forest pt-2 border-t border-hairline">
                    <span>Estimated Total</span>
                    <span>{BRAND.currency.format(subtotal - discountAmount + (isGiftWrap ? 350 : 0))}</span>
                  </div>
                  <p className="text-[11px] text-moss/80 pt-0.5">
                    Shipping &amp; prepaid incentives calculated at checkout.
                  </p>
                </div>

                {/* Primary Checkout Button (Forest bg with Gold sweep per Design.md Section 4.3) */}
                <button
                  onClick={handleCheckout}
                  className="w-full relative overflow-hidden bg-forest text-ivory py-4 text-xs uppercase tracking-label font-medium flex items-center justify-center gap-2 group shadow-sm"
                >
                  <span className="absolute inset-0 -translate-x-full bg-gold transition-transform duration-300 ease-luxe group-hover:translate-x-0" />
                  <span className="relative z-10 flex items-center justify-center gap-2 transition-colors duration-300 group-hover:text-ink">
                    <Lock className="w-3.5 h-3.5" />
                    <span>Proceed to Checkout</span>
                  </span>
                </button>

                <div className="text-center">
                  <button
                    onClick={() => {
                      closeCart();
                      navigate('/cart');
                    }}
                    className="text-xs uppercase tracking-label text-moss hover:text-forest transition-colors py-1 inline-block"
                  >
                    View Bag Details &rarr;
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
