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
          <span className="text-[11px] uppercase tracking-label text-taupe block mb-2">
            Your Selection
          </span>
          <h1 className="font-display text-4xl text-ink mb-4">Your bag is empty</h1>
          <p className="text-sm text-taupe mb-8 font-light leading-relaxed">
            There is nothing currently waiting in your bag. Explore our collection of fine and fashion jewelry to discover pieces you'll love.
          </p>
          <Link
            to="/shop"
            className="relative inline-block overflow-hidden bg-ink text-ivory px-10 py-4 text-xs uppercase tracking-label font-medium group"
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
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl text-ink font-normal">
            Your Shopping Bag <span className="font-sans text-base text-taupe font-normal">({totalItemCount} items)</span>
          </h1>
          <Link
            to="/shop"
            className="text-xs uppercase tracking-label text-taupe hover:text-ink flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Continue Shopping
          </Link>
        </div>

        {/* 2-Column Grid */}
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
                        className="font-display text-xl text-ink hover:text-gold transition-colors font-semibold"
                      >
                        {item.product.name}
                      </Link>
                      <p className="text-xs text-taupe mt-1">
                        Finish: {item.finish} &bull; Size: {item.size}
                      </p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.cartItemId)}
                      className="text-taupe hover:text-garnet p-1 transition-colors"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" strokeWidth={1.3} />
                    </button>
                  </div>

                  <div className="mt-6 flex items-center justify-between">
                    {/* Stepper */}
                    <div className="flex items-center border border-hairline bg-white">
                      <button
                        onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                        className="px-3 py-1.5 text-taupe hover:text-ink"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 text-xs font-medium text-ink min-w-[28px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                        className="px-3 py-1.5 text-taupe hover:text-ink"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <span className="font-sans font-medium text-ink">
                      {BRAND.currency.format(item.product.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Sticky Summary & Order Options (5 cols) */}
          <div className="lg:col-span-5 lg:sticky lg:top-28 bg-cream p-8 border border-hairline space-y-6">
            <h2 className="font-display text-2xl text-ink pb-4 border-b border-hairline">
              Order Summary
            </h2>

            {/* Gift Wrap option */}
            <label className="flex items-start gap-3 text-xs cursor-pointer select-none pb-4 border-b border-hairline">
              <input
                type="checkbox"
                checked={isGiftWrap}
                onChange={(e) => setIsGiftWrap(e.target.checked)}
                className="w-4 h-4 mt-0.5 accent-gold"
              />
              <div>
                <span className="font-medium text-ink flex items-center gap-1.5">
                  <Gift className="w-3.5 h-3.5 text-gold" /> Add Luxury Velvet Box &amp; Handwritten Gift Card
                </span>
                <span className="text-taupe block mt-0.5">
                  Hand-inscribed calligraphic message (+PKR 350)
                </span>
              </div>
            </label>

            {/* Order Note */}
            <div>
              <label className="block text-xs uppercase tracking-label text-taupe mb-2">
                Order Notes &amp; Special Instructions
              </label>
              <textarea
                value={orderNote}
                onChange={(e) => setOrderNote(e.target.value)}
                placeholder="Write any instructions for packing or courier rider..."
                rows={2}
                className="w-full bg-white border border-hairline p-3 text-xs focus:outline-none focus:border-gold"
              />
            </div>

            {/* Coupon Code Field */}
            <div className="pt-2">
              <label className="block text-xs uppercase tracking-label text-taupe mb-2">
                Promotional Coupon
              </label>
              {couponCode ? (
                <div className="flex items-center justify-between bg-white px-3 py-2 border border-hairline text-xs">
                  <span className="font-medium text-gold flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5" /> {couponCode} (-{BRAND.currency.format(discountAmount)})
                  </span>
                  <button
                    onClick={removeCoupon}
                    className="text-taupe hover:text-garnet underline text-[11px]"
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
                    placeholder="Enter code (e.g. AURELLE10)"
                    className="flex-1 bg-white border border-hairline px-3 py-2 text-xs uppercase focus:outline-none focus:border-gold"
                  />
                  <button
                    type="submit"
                    className="bg-ink text-ivory px-4 py-2 text-xs uppercase tracking-label hover:bg-gold hover:text-ink transition-colors font-medium"
                  >
                    Apply
                  </button>
                </form>
              )}
            </div>

            {/* Calculation rows */}
            <div className="space-y-2.5 text-sm pt-4 border-t border-hairline">
              <div className="flex justify-between text-taupe">
                <span>Subtotal</span>
                <span>{BRAND.currency.format(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-gold">
                  <span>Discount</span>
                  <span>-{BRAND.currency.format(discountAmount)}</span>
                </div>
              )}
              {isGiftWrap && (
                <div className="flex justify-between text-taupe">
                  <span>Gift Box &amp; Card</span>
                  <span>PKR 350</span>
                </div>
              )}
              <div className="flex justify-between text-taupe">
                <span>Estimated Shipping</span>
                <span>
                  {subtotal >= BRAND.shipping.freeThreshold ? (
                    <span className="text-sage font-medium">Free</span>
                  ) : (
                    BRAND.currency.format(BRAND.shipping.standardFee)
                  )}
                </span>
              </div>
              <div className="flex justify-between items-baseline pt-4 border-t border-hairline font-medium text-ink">
                <span>Estimated Total</span>
                <span className="font-display text-2xl text-ink">
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
              className="w-full relative overflow-hidden bg-ink text-ivory py-4 text-xs uppercase tracking-label font-medium group flex items-center justify-center gap-2"
            >
              <span className="absolute inset-0 -translate-x-full bg-gold transition-transform duration-300 ease-luxe group-hover:translate-x-0" />
              <span className="relative transition-colors duration-300 group-hover:text-ink">
                Proceed to Checkout
              </span>
              <ArrowRight className="w-4 h-4 relative transition-colors duration-300 group-hover:text-ink" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

