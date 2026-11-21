import { db } from '../config/firebase.js';
import { BRAND } from '../config/brand.js';
import { sendOrderConfirmationEmail } from './emailService.js';

/**
 * Generate formatted order number: AJ-YYMMDD-XXXX
 */
export function generateOrderNumber() {
  const now = new Date();
  const yy = String(now.getFullYear()).slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `AJ-${yy}${mm}${dd}-${rand}`;
}

/**
 * Validates and calculates prices & stock server-side
 */
export async function validateAndPriceCart(items, couponCode = null, paymentMethod = 'cod', shippingType = 'standard', isGiftWrap = false) {
  if (!items || !Array.isArray(items) || items.length === 0) {
    throw new Error('Cart must contain at least one piece.');
  }

  let subtotal = 0;
  const verifiedItems = [];

  for (const item of items) {
    const productId = item.productId || item.id;
    const docRef = db.collection('products').doc(productId);
    const snap = await docRef.get();

    if (!snap.exists) {
      throw new Error(`Product with ID "${productId}" is no longer in our archive.`);
    }

    const product = snap.data();
    if (!product.isActive) {
      throw new Error(`Piece "${product.name}" is currently unavailable.`);
    }

    const qty = Math.max(1, parseInt(item.quantity, 10) || 1);

    // Stock check
    if (product.stock !== undefined && product.stock < qty) {
      throw new Error(`Insufficient stock for "${product.name}". Only ${product.stock} available.`);
    }

    const itemPrice = Number(product.price);
    subtotal += itemPrice * qty;

    verifiedItems.push({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: itemPrice,
      quantity: qty,
      finish: item.finish || product.finish || 'Standard',
      size: item.size || (product.sizes && product.sizes[0]) || 'One Size',
      image: (product.images && product.images[0]?.url) || (Array.isArray(product.images) && product.images[0]) || '',
    });
  }

  // Validate Coupon
  let discount = 0;
  let appliedCoupon = null;
  if (couponCode) {
    const normalizedCode = couponCode.trim().toUpperCase();
    const couponSnap = await db.collection('coupons').doc(normalizedCode).get();
    if (couponSnap.exists) {
      const coupon = couponSnap.data();
      if (coupon.isActive) {
        discount = Math.round((subtotal * coupon.discountPercent) / 100);
        appliedCoupon = {
          code: coupon.code,
          discountPercent: coupon.discountPercent,
          amount: discount,
        };
      }
    }
  }

  // 5% Prepaid incentive
  let prepaidDiscount = 0;
  const isPrepaid = paymentMethod === 'bank' || paymentMethod === 'wallet' || paymentMethod === 'card';
  if (isPrepaid) {
    prepaidDiscount = Math.round(subtotal * (BRAND.shipping.prepaidDiscountPercentage / 100));
  }

  // Shipping
  const isFreeShipping = subtotal >= BRAND.shipping.freeThreshold;
  const shippingFee = shippingType === 'express' ? BRAND.shipping.expressFee : isFreeShipping ? 0 : BRAND.shipping.standardFee;

  // Gift packaging fee
  const giftWrapFee = isGiftWrap ? 350 : 0;

  const total = Math.max(0, subtotal - discount - prepaidDiscount + shippingFee + giftWrapFee);

  return {
    items: verifiedItems,
    subtotal,
    discount,
    appliedCoupon,
    prepaidDiscount,
    shippingFee,
    giftWrapFee,
    total,
  };
}

/**
 * Creates order inside an atomic transaction (decrements stock)
 */
export async function createOrder({
  userId = null,
  customer,
  shippingAddress,
  items,
  paymentMethod,
  paymentRef = null,
  shippingType = 'standard',
  isGiftWrap = false,
  couponCode = null,
  notes = '',
}) {
  const calculation = await validateAndPriceCart(items, couponCode, paymentMethod, shippingType, isGiftWrap);

  const orderNumber = generateOrderNumber();
  const orderRef = db.collection('orders').doc(orderNumber);

  const initialStatus = paymentMethod === 'cod' ? 'confirmed' : 'payment_pending';

  const orderData = {
    orderNumber,
    userId: userId || null,
    customer: {
      name: customer.name.trim(),
      phone: customer.phone.trim(),
      email: (customer.email || '').trim().toLowerCase(),
    },
    shippingAddress: {
      line1: shippingAddress.address || shippingAddress.line1,
      city: shippingAddress.city,
      province: shippingAddress.province,
      postalCode: shippingAddress.postalCode || '',
    },
    items: calculation.items,
    subtotal: calculation.subtotal,
    discount: calculation.discount + calculation.prepaidDiscount,
    appliedCoupon: calculation.appliedCoupon,
    shippingFee: calculation.shippingFee,
    giftWrapFee: calculation.giftWrapFee,
    total: calculation.total,
    currency: BRAND.currency,
    paymentMethod,
    paymentStatus: paymentMethod === 'cod' ? 'pending_collection' : 'pending_verification',
    paymentRef,
    status: initialStatus,
    statusHistory: [
      {
        status: 'placed',
        at: new Date().toISOString(),
        note: 'Order placed by client.',
      },
      ...(initialStatus === 'confirmed'
        ? [
            {
              status: 'confirmed',
              at: new Date().toISOString(),
              note: 'Cash on Delivery order confirmed for dispatch preparation.',
            },
          ]
        : []),
    ],
    timeline: [
      { status: 'placed', label: 'Order Placed', time: 'Just now', done: true },
      { status: 'confirmed', label: 'Order Confirmed', time: initialStatus === 'confirmed' ? 'Confirmed' : 'Pending payment', done: initialStatus === 'confirmed' },
      { status: 'packed', label: 'Artfully Packed', time: 'Pending', done: false },
      { status: 'shipped', label: 'Handed to Courier', time: 'Pending', done: false },
      { status: 'out_for_delivery', label: 'Out for Delivery', time: 'Pending', done: false },
      { status: 'delivered', label: 'Delivered', time: 'Estimated 2-4 business days', done: false },
    ],
    courier: {
      name: 'Trax Courier',
      trackingNumber: `TRX-${orderNumber.replace(/[^0-9]/g, '')}`,
      trackingUrl: 'https://trax.pk/tracking',
    },
    notes: notes || '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Run transaction to write order and decrement product inventory
  await db.runTransaction(async (transaction) => {
    // Read and verify stock for each item inside transaction
    for (const item of calculation.items) {
      const prodRef = db.collection('products').doc(item.productId);
      const prodSnap = await transaction.get(prodRef);
      if (prodSnap.exists) {
        const prodData = prodSnap.data();
        const currentStock = prodData.stock || 0;
        const newStock = Math.max(0, currentStock - item.quantity);
        transaction.update(prodRef, {
          stock: newStock,
          updatedAt: new Date().toISOString(),
        });
      }
    }

    transaction.set(orderRef, orderData);
  });

  // Trigger non-blocking transactional confirmation email
  sendOrderConfirmationEmail(orderData).catch((err) =>
    console.warn('[OrderService] Email dispatch error:', err.message)
  );

  return orderData;
}

/**
 * Cancel an order and restore inventory in transaction
 */
export async function cancelOrder(orderNumber, reason = 'Cancelled by client') {
  const orderRef = db.collection('orders').doc(orderNumber);
  const snap = await orderRef.get();

  if (!snap.exists) {
    throw new Error(`Order ${orderNumber} does not exist.`);
  }

  const order = snap.data();
  if (['shipped', 'out_for_delivery', 'delivered'].includes(order.status)) {
    throw new Error('This order has already departed our studio and cannot be automatically cancelled.');
  }

  await db.runTransaction(async (transaction) => {
    // Restore inventory
    for (const item of order.items) {
      const prodRef = db.collection('products').doc(item.productId);
      const prodSnap = await transaction.get(prodRef);
      if (prodSnap.exists) {
        const currentStock = prodSnap.data().stock || 0;
        transaction.update(prodRef, {
          stock: currentStock + item.quantity,
          updatedAt: new Date().toISOString(),
        });
      }
    }

    transaction.update(orderRef, {
      status: 'cancelled',
      cancellationReason: reason,
      updatedAt: new Date().toISOString(),
      statusHistory: [
        ...(order.statusHistory || []),
        {
          status: 'cancelled',
          at: new Date().toISOString(),
          note: reason,
        },
      ],
    });
  });

  return { success: true, orderNumber, status: 'cancelled' };
}

