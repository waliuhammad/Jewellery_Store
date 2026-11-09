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
    freeShippingRemaining,
    freeShippingProgress,
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
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={closeCart}
            className="absolute inset-0 bg-noir/50 backdrop-blur-sm"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-y-0 right-0 w-full sm:w-[440px] bg-ivory flex flex-col shadow-soft border-l border-hairline z-10"
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-hairline flex items-center justify-between">
              <h2 className="font-display text-2xl md:text-3xl text-ink">
                Your Bag <span className="text-taupe font-sans text-base">({totalItemCount})</span>
              </h2>
              <button
                onClick={closeCart}
                className="p-2 -mr-2 text-taupe hover:text-ink transition-colors"
                aria-label="Close bag drawer"
              >
                <X className="w-5 h-5" strokeWidth={1.5} />
              </button>
            </div>

            {/* Items List */}
            <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-hairline">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-16">
                  <div className="w-16 h-16 rounded-full border border-hairline flex items-center justify-center mb-4 text-taupe">
                    <X className="w-6 h-6 stroke-1" />
                  </div>
                  <h3 className="font-display text-2xl text-ink mb-2">Your bag is empty</h3>
                  <p className="text-sm text-taupe mb-8 max-w-xs">
                    Nothing saved yet. Explore our handcrafted pieces to begin your curation.
                  </p>
                  <button
                    onClick={() => {
                      closeCart();
                      navigate('/shop');
                    }}
                    className="relative overflow-hidden bg-ink text-ivory px-8 py-3.5 text-xs uppercase tracking-label group"
                  >
                    <span className="absolute inset-0 -translate-x-full bg-gold transition-transform duration-300 ease-luxe group-hover:translate-x-0" />
                    <span className="relative transition-colors duration-300 group-hover:text-ink">
                      Explore Collection
                    </span>
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.cartItemId} className="py-4 flex gap-4 items-start">
                    {/* Thumbnail */}
                    <Link
                      to={`/product/${item.product.slug}`}
                      onClick={closeCart}
                      className="w-20 h-24 flex-shrink-0 bg-cream overflow-hidden border border-hairline"
                    >
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </Link>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <Link
                          to={`/product/${item.product.slug}`}
                          onClick={closeCart}
                          className="font-display text-lg text-ink hover:text-gold transition-colors leading-snug line-clamp-1"
                        >
                          {item.product.name}
                        </Link>
                        <button
                          onClick={() => removeFromCart(item.cartItemId)}
                          className="text-taupe hover:text-garnet transition-colors p-1"
                          aria-label={`Remove ${item.product.name} from bag`}
                        >
                          <Trash2 className="w-4 h-4" strokeWidth={1.3} />
                        </button>
                      </div>

                      <p className="text-xs text-taupe mt-0.5">
                        {item.finish} &bull; {item.size}
                      </p>

                      <div className="mt-3 flex items-center justify-between">
                        {/* Quantity Stepper */}
                        <div className="inline-flex items-center border border-hairline bg-white">
                          <button
                            onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                            className="px-2.5 py-1 text-taupe hover:text-ink transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" strokeWidth={1.5} />
                          </button>
                          <span className="px-2 py-1 text-xs font-medium text-ink min-w-[24px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                            className="px-2.5 py-1 text-taupe hover:text-ink transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" strokeWidth={1.5} />
                          </button>
                        </div>

                        {/* Price */}
                        <span className="text-sm font-medium text-ink">
                          {BRAND.currency.format(item.product.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Extras: Gift wrap, Coupon & Notes (only when items present) */}
            {items.length > 0 && (
              <div className="px-6 py-3 border-t border-hairline bg-cream/30 space-y-3 text-xs">
                {/* Gift Wrap option */}
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isGiftWrap}
                    onChange={(e) => setIsGiftWrap(e.target.checked)}
                    className="w-4 h-4 accent-gold rounded-none"
                  />
                  <Gift className="w-3.5 h-3.5 text-gold flex-shrink-0" />
                  <span className="text-ink">Add luxury gift wrap &amp; handwritten card (+PKR 350)</span>
                </label>

                {/* Coupon Code Accordion */}
                <div>
                  {couponCode ? (
                    <div className="flex items-center justify-between bg-white px-3 py-1.5 border border-hairline text-ink">
                      <span className="flex items-center gap-1.5 font-medium text-gold">
                        <Tag className="w-3 h-3" /> {couponCode} (-{BRAND.currency.format(discountAmount)})
                      </span>
                      <button
                        onClick={removeCoupon}
                        className="text-taupe hover:text-garnet text-[11px] underline"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyCoupon} className="flex gap-2">
                      <input
                        type="text"
                        value={inputCoupon}
                        onChange={(e) => setInputCoupon(e.target.value)}
                        placeholder="Coupon code (e.g. AURELLE10)"
                        className="flex-1 bg-white border border-hairline px-3 py-1 text-xs uppercase focus:outline-none focus:border-gold"
                      />
                      <button
                        type="submit"
                        className="bg-ink text-ivory px-3 py-1 text-[11px] uppercase tracking-label hover:bg-gold hover:text-ink transition-colors"
                      >
                        Apply
                      </button>
                    </form>
                  )}
                </div>

                {/* Order Note Toggle */}
                <div>
                  <button
                    onClick={() => setShowNoteInput(!showNoteInput)}
                    className="text-taupe hover:text-ink underline text-[11px]"
                  >
                    {showNoteInput ? 'Close note' : '+ Add special instructions or gift message'}
                  </button>
                  {showNoteInput && (
                    <textarea
                      value={orderNote}
                      onChange={(e) => setOrderNote(e.target.value)}
                      placeholder="Write your note or gift message here..."
                      rows={2}
                      className="w-full mt-2 p-2 bg-white border border-hairline text-xs focus:outline-none focus:border-gold"
                    />
                  )}
                </div>
              </div>
            )}

            {/* Footer with subtotal & CTA */}
            {items.length > 0 && (
              <div className="p-6 border-t border-hairline bg-ivory space-y-4">
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between text-taupe">
                    <span>Subtotal</span>
                    <span>{BRAND.currency.format(subtotal)}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-gold">
                      <span>Discount ({couponCode})</span>
                      <span>-{BRAND.currency.format(discountAmount)}</span>
                    </div>
                  )}
                  {isGiftWrap && (
                    <div className="flex justify-between text-taupe">
                      <span>Gift Packaging</span>
                      <span>PKR 350</span>
                    </div>
                  )}
                  <div className="flex justify-between items-baseline pt-2 border-t border-hairline text-base font-medium text-ink">
                    <span>Estimated Total</span>
                    <span className="font-display text-xl text-ink">
                      {BRAND.currency.format(
                        subtotal - discountAmount + (isGiftWrap ? 350 : 0)
                      )}
                    </span>
                  </div>
                  <p className="text-[11px] text-taupe text-right">
                    Taxes and shipping calculated at checkout
                  </p>
                </div>

                <div className="space-y-2 pt-1">
                  {/* Primary Checkout Button */}
                  <button
                    onClick={handleCheckout}
                    className="w-full relative overflow-hidden bg-ink text-ivory py-4 text-xs uppercase tracking-label group flex items-center justify-center gap-2"
                  >
                    <span className="absolute inset-0 -translate-x-full bg-gold transition-transform duration-300 ease-luxe group-hover:translate-x-0" />
                    <span className="relative transition-colors duration-300 group-hover:text-ink font-medium">
                      Proceed to Checkout
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 relative transition-colors duration-300 group-hover:text-ink" />
                  </button>

                  {/* Secondary View Bag Link */}
                  <div className="text-center">
                    <Link
                      to="/cart"
                      onClick={closeCart}
                      className="text-xs text-taupe hover:text-ink underline underline-offset-4 tracking-label uppercase"
                    >
                      View Full Bag Page
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

