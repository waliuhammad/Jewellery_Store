import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, ShieldCheck, Lock, ChevronDown, Upload, CreditCard, Wallet, Banknote, ArrowRight, AlertCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { BRAND } from '../config/brand';
import { PAKISTAN_CITIES } from '../data/cities';

export default function Checkout() {
  const {
    items,
    subtotal,
    isGiftWrap,
    orderNote,
    couponCode,
    discountAmount,
    clearCart,
  } = useCart();

  const { user, isAuthenticated, addresses, addOrder } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Redirect to login if user is not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      showToast('Please sign in or register to complete your order.', 'info');
      navigate('/login?redirect=/checkout');
      return;
    }
    if (items.length === 0) {
      navigate('/cart');
    }
  }, [isAuthenticated, items, navigate, showToast]);

  // Collapsible step state: 1 = contact, 2 = shipping, 3 = payment
  const [currentStep, setCurrentStep] = useState(1);

  // Form Fields
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    address: addresses[0]?.address || '',
    city: addresses[0]?.city || 'Lahore',
    province: addresses[0]?.province || 'Punjab',
    notes: orderNote || '',
  });

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
      }));
    }
  }, [user]);

  const [shippingMethod, setShippingMethod] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('cod'); // 'cod' | 'bank' | 'wallet'
  const [walletType, setWalletType] = useState('jazzcash'); // 'jazzcash' | 'easypaisa'
  const [walletTxId, setWalletTxId] = useState('');
  const [receiptUploaded, setReceiptUploaded] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(true);
  const [errors, setErrors] = useState({});

  // Handle City Change
  const handleCityChange = (e) => {
    const cityName = e.target.value;
    const found = PAKISTAN_CITIES.find((c) => c.name === cityName);
    setFormData((prev) => ({
      ...prev,
      city: cityName,
      province: found ? found.province : prev.province,
    }));
  };

  // Select Saved Address
  const handleSelectSavedAddress = (addr) => {
    setFormData((prev) => ({
      ...prev,
      name: addr.name,
      phone: addr.phone,
      address: addr.address,
      city: addr.city,
      province: addr.province,
    }));
  };

  // Calculations
  const isFreeStandard = subtotal >= BRAND.shipping.freeThreshold;
  const shippingFee =
    shippingMethod === 'express'
      ? 450
      : isFreeStandard
      ? 0
      : BRAND.shipping.standardFee;

  // Prepaid 5% incentive
  const isPrepaid = paymentMethod === 'bank' || paymentMethod === 'wallet';
  const prepaidDiscount = isPrepaid ? Math.round(subtotal * 0.05) : 0;
  const giftWrapFee = isGiftWrap ? 350 : 0;

  const finalTotal = Math.max(
    0,
    subtotal - discountAmount - prepaidDiscount + shippingFee + giftWrapFee
  );

  // Validations
  const validateStep1 = () => {
    const err = {};
    if (!formData.name.trim()) err.name = 'Full name is required';
    if (!formData.phone.trim()) {
      err.phone = 'Phone number is required';
    } else if (!/^(03\d{2}[-\s]?\d{7}|\+92\d{10})$/.test(formData.phone.replace(/[\s-]/g, ''))) {
      err.phone = 'Please enter a valid Pakistani mobile number (e.g. 0300 1234567)';
    }
    if (!formData.address.trim()) err.address = 'Street delivery address is required';
    if (!formData.city) err.city = 'Please select your city';

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleProceedToShipping = (e) => {
    e.preventDefault();
    if (validateStep1()) {
      setCurrentStep(2);
    }
  };

  const handleProceedToPayment = () => {
    setCurrentStep(3);
  };

  // Place Final Order
  const handlePlaceOrder = (e) => {
    e.preventDefault();

    if (!validateStep1()) {
      setCurrentStep(1);
      return;
    }

    if (!agreedTerms) {
      showToast('Please agree to the Terms and Returns policy.', 'error');
      return;
    }

    if (paymentMethod === 'wallet' && !walletTxId.trim()) {
      showToast('Please enter your Mobile Wallet Transaction / Ref ID.', 'error');
      return;
    }

    // Generate Order ID format: AJ-YYMMDD-XXXX
    const now = new Date();
    const yy = String(now.getFullYear()).slice(-2);
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const rand = Math.floor(1000 + Math.random() * 9000);
    const orderId = `AJ-${yy}${mm}${dd}-${rand}`;

    const newOrder = {
      orderId,
      date: now.toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' }),
      status: paymentMethod === 'cod' ? 'confirmed' : 'payment_pending',
      paymentMethod:
        paymentMethod === 'cod'
          ? 'Cash on Delivery (COD)'
          : paymentMethod === 'bank'
          ? 'Bank Transfer (Meezan Bank)'
          : `${walletType === 'jazzcash' ? 'JazzCash' : 'Easypaisa'} (${walletTxId})`,
      courier: 'Trax Courier',
      trackingNumber: `TRX-${orderId.replace(/[^0-9]/g, '')}`,
      trackingUrl: 'https://trax.pk/tracking',
      items: items.map((i) => ({
        name: i.product.name,
        finish: i.finish,
        size: i.size,
        price: i.product.price,
        quantity: i.quantity,
        image: i.product.images[0],
      })),
      subtotal,
      shippingFee,
      discount: discountAmount + prepaidDiscount,
      total: finalTotal,
      shippingAddress: {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        city: formData.city,
        province: formData.province,
      },
      timeline: [
        { status: 'placed', label: 'Order Placed', time: 'Just now', done: true },
        { status: 'confirmed', label: 'Order Confirmed', time: paymentMethod === 'cod' ? 'Confirmed' : 'Awaiting payment verification', done: paymentMethod === 'cod' },
        { status: 'packed', label: 'Artfully Packed', time: 'Pending', done: false },
        { status: 'shipped', label: 'Handed to Courier', time: 'Pending', done: false },
        { status: 'out_for_delivery', label: 'Out for Delivery', time: 'Pending', done: false },
        { status: 'delivered', label: 'Delivered', time: 'Estimated 2-3 business days', done: false },
      ],
    };

    addOrder(newOrder);
    clearCart();
    navigate(`/order-success/${orderId}`);
  };

  return (
    <div className="pt-24 lg:pt-32 pb-24 bg-ivory min-h-screen">
      <div className="max-w-page mx-auto px-6 lg:px-12">
        {/* Simplified Checkout Header */}
        <div className="pb-8 border-b border-hairline mb-10 flex items-center justify-between">
          <Link
            to="/"
            className="font-display text-2xl uppercase tracking-wordmark font-semibold text-ink"
          >
            {BRAND.name}
          </Link>
          <div className="flex items-center gap-2 text-xs uppercase tracking-label text-taupe">
            <Lock className="w-3.5 h-3.5 text-gold" />
            <span>Encrypted 256-bit Checkout</span>
          </div>
        </div>

        {/* 2-Column Checkout Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left: 3 Collapsible Steps (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* STEP 1: CONTACT & DELIVERY */}
            <div className="border border-hairline bg-white p-6 sm:p-8">
              <div className="flex items-center justify-between pb-4 border-b border-hairline">
                <div className="flex items-center gap-3">
                  <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium ${
                    currentStep > 1 ? 'bg-sage text-ivory' : 'bg-ink text-ivory'
                  }`}>
                    {currentStep > 1 ? <Check className="w-4 h-4" /> : '1'}
                  </span>
                  <h2 className="font-display text-xl sm:text-2xl text-ink">
                    Contact &amp; Delivery Address
                  </h2>
                </div>
                {currentStep > 1 && (
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="text-xs uppercase tracking-label text-gold underline"
                  >
                    Edit
                  </button>
                )}
              </div>

              {currentStep === 1 ? (
                <form onSubmit={handleProceedToShipping} className="mt-6 space-y-4 text-xs">
                  {/* Saved addresses for logged in user */}
                  {addresses && addresses.length > 0 && (
                    <div className="p-3 bg-cream border border-hairline mb-4">
                      <p className="text-[11px] uppercase tracking-label text-taupe mb-2">Saved Addresses</p>
                      <div className="flex flex-wrap gap-2">
                        {addresses.map((a) => (
                          <button
                            type="button"
                            key={a.id}
                            onClick={() => handleSelectSavedAddress(a)}
                            className="px-3 py-1.5 bg-white border border-hairline hover:border-gold text-ink text-left"
                          >
                            <span className="font-medium block">{a.name}</span>
                            <span className="text-[10px] text-taupe">{a.address}, {a.city}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-taupe uppercase tracking-label mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Mahnoor Tariq"
                        className="input-luxe"
                      />
                      {errors.name && <p className="text-garnet text-[11px] mt-1">{errors.name}</p>}
                    </div>

                    <div>
                      <label className="block text-taupe uppercase tracking-label mb-1">
                        Pakistani Mobile Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="0300 1234567"
                        className="input-luxe"
                      />
                      {errors.phone && <p className="text-garnet text-[11px] mt-1">{errors.phone}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-taupe uppercase tracking-label mb-1">
                      Email Address (for order tracking &amp; invoice)
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. mahnoor@gmail.com"
                      className="input-luxe"
                    />
                  </div>

                  <div>
                    <label className="block text-taupe uppercase tracking-label mb-1">
                      Complete Street Address, House / Apartment *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="e.g. House 42-B, Street 7, Phase 5, DHA"
                      className="input-luxe"
                    />
                    {errors.address && <p className="text-garnet text-[11px] mt-1">{errors.address}</p>}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-taupe uppercase tracking-label mb-1">
                        City *
                      </label>
                      <select
                        value={formData.city}
                        onChange={handleCityChange}
                        className="input-luxe cursor-pointer uppercase text-xs"
                      >
                        {PAKISTAN_CITIES.map((c) => (
                          <option key={c.name} value={c.name}>
                            {c.name} ({c.estimate})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-taupe uppercase tracking-label mb-1">
                        Province
                      </label>
                      <input
                        type="text"
                        readOnly
                        value={formData.province}
                        className="input-luxe text-taupe bg-transparent cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      className="w-full bg-ink text-ivory py-4 uppercase tracking-label font-medium hover:bg-gold hover:text-ink transition-colors"
                    >
                      Continue to Shipping Method &rarr;
                    </button>
                  </div>
                </form>
              ) : (
                <div className="mt-4 text-xs text-taupe space-y-1">
                  <p className="text-ink font-medium">{formData.name} &bull; {formData.phone}</p>
                  <p>{formData.address}, {formData.city}, {formData.province}</p>
                </div>
              )}
            </div>

            {/* STEP 2: SHIPPING METHOD */}
            <div className="border border-hairline bg-white p-6 sm:p-8">
              <div className="flex items-center justify-between pb-4 border-b border-hairline">
                <div className="flex items-center gap-3">
                  <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium ${
                    currentStep > 2 ? 'bg-sage text-ivory' : currentStep === 2 ? 'bg-ink text-ivory' : 'bg-hairline text-taupe'
                  }`}>
                    {currentStep > 2 ? <Check className="w-4 h-4" /> : '2'}
                  </span>
                  <h2 className="font-display text-xl sm:text-2xl text-ink">
                    Shipping Method
                  </h2>
                </div>
                {currentStep > 2 && (
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="text-xs uppercase tracking-label text-gold underline"
                  >
                    Edit
                  </button>
                )}
              </div>

              {currentStep === 2 ? (
                <div className="mt-6 space-y-4 text-xs">
                  {/* Standard Option */}
                  <label
                    onClick={() => setShippingMethod('standard')}
                    className={`flex items-center justify-between p-4 border cursor-pointer transition-colors ${
                      shippingMethod === 'standard' ? 'border-ink bg-cream/40' : 'border-hairline'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="shipping"
                        checked={shippingMethod === 'standard'}
                        onChange={() => setShippingMethod('standard')}
                        className="accent-gold"
                      />
                      <div>
                        <span className="font-medium text-ink block">Standard Tracked Delivery</span>
                        <span className="text-taupe">Estimated 2 to 3 business days via Call Courier / Trax</span>
                      </div>
                    </div>
                    <span className="font-medium text-ink">
                      {isFreeStandard ? 'Complimentary' : 'PKR 250'}
                    </span>
                  </label>

                  {/* Express Option */}
                  <label
                    onClick={() => setShippingMethod('express')}
                    className={`flex items-center justify-between p-4 border cursor-pointer transition-colors ${
                      shippingMethod === 'express' ? 'border-ink bg-cream/40' : 'border-hairline'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="shipping"
                        checked={shippingMethod === 'express'}
                        onChange={() => setShippingMethod('express')}
                        className="accent-gold"
                      />
                      <div>
                        <span className="font-medium text-ink block">Express Priority Courier</span>
                        <span className="text-taupe">Guaranteed 24-48 hours delivery</span>
                      </div>
                    </div>
                    <span className="font-medium text-ink">PKR 450</span>
                  </label>

                  <div className="pt-4">
                    <button
                      type="button"
                      onClick={handleProceedToPayment}
                      className="w-full bg-ink text-ivory py-4 uppercase tracking-label font-medium hover:bg-gold hover:text-ink transition-colors"
                    >
                      Continue to Payment &rarr;
                    </button>
                  </div>
                </div>
              ) : currentStep > 2 ? (
                <div className="mt-4 text-xs text-taupe">
                  <p className="text-ink font-medium">
                    {shippingMethod === 'standard' ? 'Standard Tracked Delivery' : 'Express Priority Courier'}
                  </p>
                </div>
              ) : null}
            </div>

            {/* STEP 3: PAYMENT METHOD */}
            <div className="border border-hairline bg-white p-6 sm:p-8">
              <div className="flex items-center gap-3 pb-4 border-b border-hairline">
                <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium ${
                  currentStep === 3 ? 'bg-ink text-ivory' : 'bg-hairline text-taupe'
                }`}>
                  3
                </span>
                <h2 className="font-display text-xl sm:text-2xl text-ink">
                  Payment Method
                </h2>
              </div>

              {currentStep === 3 && (
                <div className="mt-6 space-y-4 text-xs">
                  {/* Prepaid Incentive Notice */}
                  <div className="p-3 bg-champagne/30 border border-champagne text-ink flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-gold flex-shrink-0" />
                    <span>
                      <strong>Prepaid Incentive:</strong> Save an additional 5% off your subtotal by paying via Bank Transfer or Mobile Wallet!
                    </span>
                  </div>

                  {/* Option 1: Cash on Delivery (COD) */}
                  <label
                    onClick={() => setPaymentMethod('cod')}
                    className={`block p-4 border cursor-pointer transition-colors ${
                      paymentMethod === 'cod' ? 'border-ink bg-cream/40' : 'border-hairline'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === 'cod'}
                          onChange={() => setPaymentMethod('cod')}
                          className="accent-gold"
                        />
                        <div className="flex items-center gap-2 font-medium text-ink">
                          <Banknote className="w-4 h-4 text-gold" />
                          <span>Cash on Delivery (COD)</span>
                        </div>
                      </div>
                      <span className="text-[11px] text-taupe">Default</span>
                    </div>

                    {paymentMethod === 'cod' && (
                      <p className="text-taupe mt-3 pl-7 text-[11px] leading-relaxed">
                        Pay cash directly to the courier rider upon delivery. Our client care team will send a brief WhatsApp / SMS verification message to confirm dispatch.
                      </p>
                    )}
                  </label>

                  {/* Option 2: Direct Bank Transfer */}
                  <label
                    onClick={() => setPaymentMethod('bank')}
                    className={`block p-4 border cursor-pointer transition-colors ${
                      paymentMethod === 'bank' ? 'border-ink bg-cream/40' : 'border-hairline'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === 'bank'}
                          onChange={() => setPaymentMethod('bank')}
                          className="accent-gold"
                        />
                        <div className="flex items-center gap-2 font-medium text-ink">
                          <CreditCard className="w-4 h-4 text-gold" />
                          <span>Online Bank Transfer (5% Off)</span>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 bg-sage text-ivory text-[10px] font-medium">5% Off</span>
                    </div>

                    {paymentMethod === 'bank' && (
                      <div className="mt-4 pl-7 space-y-3 text-taupe text-[11px]">
                        <div className="bg-white p-3 border border-hairline space-y-1">
                          <p><strong className="text-ink">Bank:</strong> {BRAND.bankDetails.bankName}</p>
                          <p><strong className="text-ink">Account Title:</strong> {BRAND.bankDetails.accountTitle}</p>
                          <p><strong className="text-ink">Account No:</strong> {BRAND.bankDetails.accountNumber}</p>
                          <p><strong className="text-ink">IBAN:</strong> {BRAND.bankDetails.iban}</p>
                        </div>
                        <div className="pt-2">
                          <label className="block text-ink uppercase tracking-label font-medium mb-1">
                            Upload Payment Screenshot (Optional for instant dispatch)
                          </label>
                          <div
                            onClick={() => {
                              setReceiptUploaded(true);
                              showToast('Payment receipt attached.', 'success');
                            }}
                            className="border border-dashed border-hairline p-4 text-center cursor-pointer hover:bg-white transition-colors"
                          >
                            <Upload className="w-5 h-5 mx-auto text-gold mb-1" />
                            <span>{receiptUploaded ? '✓ Screenshot attached' : 'Click to attach payment receipt'}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </label>

                  {/* Option 3: Mobile Wallet (JazzCash / Easypaisa) */}
                  <label
                    onClick={() => setPaymentMethod('wallet')}
                    className={`block p-4 border cursor-pointer transition-colors ${
                      paymentMethod === 'wallet' ? 'border-ink bg-cream/40' : 'border-hairline'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === 'wallet'}
                          onChange={() => setPaymentMethod('wallet')}
                          className="accent-gold"
                        />
                        <div className="flex items-center gap-2 font-medium text-ink">
                          <Wallet className="w-4 h-4 text-gold" />
                          <span>Mobile Wallet (JazzCash / Easypaisa - 5% Off)</span>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 bg-sage text-ivory text-[10px] font-medium">5% Off</span>
                    </div>

                    {paymentMethod === 'wallet' && (
                      <div className="mt-4 pl-7 space-y-3 text-taupe text-[11px]">
                        <div className="flex gap-4 mb-2">
                          <label className="flex items-center gap-1.5 cursor-pointer text-ink">
                            <input
                              type="radio"
                              name="walletChoice"
                              checked={walletType === 'jazzcash'}
                              onChange={() => setWalletType('jazzcash')}
                              className="accent-gold"
                            />
                            JazzCash ({BRAND.wallets.jazzcash.accountNumber})
                          </label>
                          <label className="flex items-center gap-1.5 cursor-pointer text-ink">
                            <input
                              type="radio"
                              name="walletChoice"
                              checked={walletType === 'easypaisa'}
                              onChange={() => setWalletType('easypaisa')}
                              className="accent-gold"
                            />
                            Easypaisa ({BRAND.wallets.easypaisa.accountNumber})
                          </label>
                        </div>
                        <div>
                          <label className="block text-ink uppercase tracking-label font-medium mb-1">
                            Transaction / TID Reference Number *
                          </label>
                          <input
                            type="text"
                            value={walletTxId}
                            onChange={(e) => setWalletTxId(e.target.value)}
                            placeholder="Enter 11-digit TID code received via SMS"
                            className="input-luxe text-xs"
                          />
                        </div>
                      </div>
                    )}
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* Right: Sticky Order Summary (5 cols) */}
          <div className="lg:col-span-5 lg:sticky lg:top-28 bg-cream p-6 sm:p-8 border border-hairline space-y-6">
            <h3 className="font-display text-2xl text-ink pb-4 border-b border-hairline">
              Your Order ({items.length} {items.length === 1 ? 'item' : 'items'})
            </h3>

            {/* Line items mini preview */}
            <div className="divide-y divide-hairline max-h-60 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.cartItemId} className="py-3 flex items-center gap-3 text-xs">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-12 h-14 object-cover border border-hairline flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-display text-sm text-ink font-semibold truncate">{item.product.name}</p>
                    <p className="text-[11px] text-taupe">{item.finish} &bull; Qty: {item.quantity}</p>
                  </div>
                  <span className="font-medium text-ink">
                    {BRAND.currency.format(item.product.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Price Breakdown */}
            <div className="space-y-2 text-xs pt-4 border-t border-hairline">
              <div className="flex justify-between text-taupe">
                <span>Subtotal</span>
                <span>{BRAND.currency.format(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-gold">
                  <span>Coupon ({couponCode})</span>
                  <span>-{BRAND.currency.format(discountAmount)}</span>
                </div>
              )}
              {prepaidDiscount > 0 && (
                <div className="flex justify-between text-sage font-medium">
                  <span>Prepaid Discount (5%)</span>
                  <span>-{BRAND.currency.format(prepaidDiscount)}</span>
                </div>
              )}
              {isGiftWrap && (
                <div className="flex justify-between text-taupe">
                  <span>Luxury Gift Wrap</span>
                  <span>PKR 350</span>
                </div>
              )}
              <div className="flex justify-between text-taupe">
                <span>Shipping ({shippingMethod === 'express' ? 'Express' : 'Standard'})</span>
                <span>{shippingFee === 0 ? <span className="text-sage font-medium">Free</span> : BRAND.currency.format(shippingFee)}</span>
              </div>
              <div className="flex justify-between items-baseline pt-4 border-t border-hairline font-medium text-ink">
                <span>Final Payable</span>
                <span className="font-display text-2xl text-ink font-semibold">
                  {BRAND.currency.format(finalTotal)}
                </span>
              </div>
            </div>

            {/* Terms Agreement */}
            <label className="flex items-start gap-2.5 text-xs text-taupe cursor-pointer select-none pt-2">
              <input
                type="checkbox"
                checked={agreedTerms}
                onChange={(e) => setAgreedTerms(e.target.checked)}
                className="w-4 h-4 mt-0.5 accent-gold"
              />
              <span>
                I agree to the <Link to="/terms" className="text-ink underline">Terms of Service</Link> and 7-Day Exchange Policy.
              </span>
            </label>

            {/* Place Order CTA */}
            <button
              onClick={handlePlaceOrder}
              className="w-full relative overflow-hidden bg-ink text-ivory py-4 text-xs uppercase tracking-label font-medium group flex items-center justify-center gap-2"
            >
              <span className="absolute inset-0 -translate-x-full bg-gold transition-transform duration-300 ease-luxe group-hover:translate-x-0" />
              <span className="relative transition-colors duration-300 group-hover:text-ink">
                Place Order &bull; {BRAND.currency.format(finalTotal)}
              </span>
              <ArrowRight className="w-3.5 h-3.5 relative transition-colors duration-300 group-hover:text-ink" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

