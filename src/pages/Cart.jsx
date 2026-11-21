import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ArrowRight, Gift, Tag, ArrowLeft, Lock } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { BRAND } from '../config/brand';

export default function Cart() {
  const {
    items,
    totalItemCount,
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
  const navigate = useNavigate();

  const handleProceedToCheckout = () => {
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

  if (items.length === 0) {
    return (
      <div className="pt-32 pb-24 bg-ivory min-h-[70vh] flex items-center justify-center">
        <div className="max-w-md mx-auto px-6 text-center">
          <span className="text-[11px] uppercase tracking-label text-moss block mb-2">
            Your Selection
          </span>
          <h1 className="font-display text-4xl text-forest mb-4">Your bag is empty</h1>
          <p className="text-sm text-moss mb-8 font-light leading-relaxed">
            There is nothing currently waiting in your bag. Explore our collection of fine and fashion jewelry to discover pieces you'll reach for every morning.
          </p>
          <Link
            to="/shop"
            className="relative inline-block overflow-hidden bg-forest text-ivory px-10 py-4 text-xs uppercase tracking-label font-medium group"
          >
            <span className="absolute inset-0 -translate-x-full bg-gold transition-transform duration-300 ease-luxe group-hover:translate-x-0" />
            <span className="relative transition-colors duration-300 group-hover:text-ink">
              Explore Collection
            </span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 lg:pt-32 pb-24 bg-ivory min-h-screen">
      <div className="max-w-page mx-auto px-6 lg:px-12">
        {/* Title */}
        <div className="pb-8 border-b border-hairline mb-10 flex items-baseline justify-between">
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl text-forest font-normal">
            Your Shopping Bag <span className="font-sans text-base text-moss font-normal">({totalItemCount} items)</span>
          </h1>
          <Link
            to="/shop"
            className="text-xs uppercase tracking-label text-moss hover:text-forest flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Continue Shopping
          </Link>
        </div>

        {/* 2-Column Grid per Design.md Section 5.4 (items 65%, summary 35% sticky) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Items List (7 cols) */}
          <div className="lg:col-span-7 divide-y divide-hairline border-y border-hairline">
            {items.map((item) => (
              <div key={item.cartItemId} className="py-6 flex gap-6 items-start">
                <Link
                  to={`/product/${item.product.slug}`}
                  className="w-24 h-30 bg-cream flex-shrink-0 border border-hairline overflow-hidden"
                >
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                </Link>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <Link
                        to={`/product/${item.product.slug}`}
                        className="font-display text-xl text-forest hover:text-emerald transition-colors font-medium"
                      >
                        {item.product.name}
                      </Link>
                      <p className="text-xs text-moss mt-1 font-sans">
                        Finish: {item.finish} &bull; Size: {item.size}
                      </p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.cartItemId)}
                      className="text-moss hover:text-maroon p-1 transition-colors"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" strokeWidth={1.3} />
                    </button>
                  </div>

                  <div className="mt-6 flex items-center justify-between">
                    {/* Stepper */}
                    <div className="flex items-center border border-hairline bg-cream">
                      <button
                        onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                        className="px-3 py-1.5 text-moss hover:text-forest transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 text-xs font-medium text-forest min-w-[28px] text-center font-sans">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                        className="px-3 py-1.5 text-moss hover:text-forest transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <span className="font-sans font-medium text-forest">
                      {BRAND.currency.format(item.product.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Sticky Summary & Order Options (5 cols) */}
          <div className="lg:col-span-5 lg:sticky lg:top-28 bg-cream p-8 border border-hairline space-y-6">
            <h2 className="font-display text-2xl text-forest pb-4 border-b border-hairline font-medium">
              Order Summary
            </h2>

            {/* Gift Wrap option */}
            <label className="flex items-start gap-3 text-xs cursor-pointer select-none pb-4 border-b border-hairline">
              <input
                type="checkbox"
                checked={isGiftWrap}
                onChange={(e) => setIsGiftWrap(e.target.checked)}
                className="w-4 h-4 mt-0.5 accent-forest rounded-none"
              />
              <div>
                <span className="font-medium text-forest flex items-center gap-1.5">
                  <Gift className="w-3.5 h-3.5 text-gold" /> Add Luxury Keepsake Box &amp; Handwritten Gift Card
                </span>
                <span className="text-moss block mt-0.5 font-light">
                  Hand-inscribed calligraphic message (+PKR 350)
                </span>
              </div>
            </label>

            {/* Order Note */}
            <div>
              <label className="block text-xs uppercase tracking-label text-moss mb-2">
                Order Notes &amp; Special Instructions
              </label>
              <textarea
                value={orderNote}
                onChange={(e) => setOrderNote(e.target.value)}
                placeholder="Write any instructions for packing or courier rider..."
                rows={2}
                className="w-full bg-ivory border border-hairline p-3 text-xs text-ink placeholder:text-moss/60 focus:outline-none focus:border-gold font-sans resize-none"
              />
            </div>

            {/* Coupon Code Field */}
            <div className="pt-2">
              <label className="block text-xs uppercase tracking-label text-moss mb-2">
                Promotional Coupon
              </label>
              {couponCode ? (
                <div className="flex items-center justify-between bg-ivory px-3 py-2 border border-hairline text-xs">
                  <span className="font-medium text-leaf flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5" /> {couponCode} (-{BRAND.currency.format(discountAmount)})
                  </span>
                  <button
                    onClick={removeCoupon}
                    className="text-moss hover:text-maroon underline text-[11px] transition-colors"
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
                    placeholder="Enter code (e.g. MINHA10)"
                    className="flex-1 bg-ivory border border-hairline px-3 py-2 text-xs uppercase focus:outline-none focus:border-gold font-sans"
                  />
                  <button
                    type="submit"
                    className="bg-forest text-ivory px-4 py-2 text-xs uppercase tracking-label hover:bg-emerald transition-colors font-medium"
                  >
                    Apply
                  </button>
                </form>
              )}
            </div>

            {/* Calculation rows */}
            <div className="space-y-2.5 text-sm pt-4 border-t border-hairline font-sans">
              <div className="flex justify-between text-moss">
                <span>Subtotal</span>
                <span>{BRAND.currency.format(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-leaf">
                  <span>Discount</span>
                  <span>-{BRAND.currency.format(discountAmount)}</span>
                </div>
              )}
              {isGiftWrap && (
                <div className="flex justify-between text-moss">
                  <span>Gift Box &amp; Card</span>
                  <span>PKR 350</span>
                </div>
              )}
              <div className="flex justify-between text-moss">
                <span>Estimated Shipping</span>
                <span>
                  {subtotal >= BRAND.shipping.freeThreshold ? (
                    <span className="text-leaf font-medium">Complimentary</span>
                  ) : (
                    BRAND.currency.format(BRAND.shipping.standardFee)
                  )}
                </span>
              </div>
              <div className="flex justify-between items-baseline pt-4 border-t border-hairline font-medium text-forest">
                <span>Estimated Total</span>
                <span className="font-display text-2xl text-forest">
                  {BRAND.currency.format(
                    subtotal -
                    discountAmount +
                    (isGiftWrap ? 350 : 0) +
                    (subtotal >= BRAND.shipping.freeThreshold ? 0 : BRAND.shipping.standardFee)
                  )}
                </span>
              </div>
            </div>

            <button
              onClick={handleProceedToCheckout}
              className="w-full relative overflow-hidden bg-forest text-ivory py-4 text-xs uppercase tracking-label font-medium group flex items-center justify-center gap-2"
            >
              <span className="absolute inset-0 -translate-x-full bg-gold transition-transform duration-300 ease-luxe group-hover:translate-x-0" />
              <span className="relative z-10 transition-colors duration-300 group-hover:text-ink flex items-center gap-2">
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
