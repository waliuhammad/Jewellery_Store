import { db } from '../config/firebase.js';
import { createOrder, cancelOrder } from '../services/orderService.js';

/**
 * Place a new order
 * POST /api/v1/orders
 */
export async function handleCreateOrder(req, res, next) {
  try {
    const {
      items,
      customer,
      shippingAddress,
      paymentMethod = 'cod',
      shippingType = 'standard',
      isGiftWrap = false,
      couponCode = null,
      notes = '',
    } = req.body;

    // Attach authenticated user ID if present
    const userId = req.user?.uid || null;

    const order = await createOrder({
      items,
      customer,
      shippingAddress,
      paymentMethod,
      shippingType,
      isGiftWrap,
      couponCode,
      notes,
      userId,
    });

    res.status(201).json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: {
        code: 'ORDER_CREATION_FAILED',
        message: error.message || 'Unable to place order at this time.',
      },
    });
  }
}

/**
 * Track an order by order number + email or phone
 * GET /api/v1/orders/track?orderNumber=...&contact=...
 */
export async function trackOrder(req, res, next) {
  try {
    const { orderNumber, contact } = req.query;

    if (!orderNumber || !contact) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'MISSING_PARAMETERS',
          message: 'Please provide both your order number and contact email or phone number.',
        },
      });
    }

    const cleanNumber = orderNumber.trim().toUpperCase();
    const cleanContact = contact.trim().toLowerCase().replace(/[\s-]/g, '');

    const docRef = db.collection('orders').doc(cleanNumber);
    const snap = await docRef.get();

    if (!snap.exists) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'ORDER_NOT_FOUND',
          message: `No order found with reference "${orderNumber}". Please double-check your order confirmation.`,
        },
      });
    }

    const order = snap.data();

    // Verify ownership via email or phone
    const orderEmail = (order.customer?.email || '').toLowerCase().trim();
    const orderPhone = (order.customer?.phone || '').replace(/[\s-]/g, '');
    const shippingPhone = (order.shippingAddress?.phone || '').replace(/[\s-]/g, '');

    const matchesContact =
      orderEmail === cleanContact ||
      orderPhone.includes(cleanContact) ||
      cleanContact.includes(orderPhone) ||
      shippingPhone.includes(cleanContact) ||
      cleanContact.includes(shippingPhone);

    if (!matchesContact) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'CONTACT_MISMATCH',
          message: 'The email or phone number provided does not match our records for this order.',
        },
      });
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * List orders for authenticated user
 * GET /api/v1/orders/me
 */
export async function getMyOrders(req, res, next) {
  try {
    const uid = req.user?.uid;
    const email = req.user?.email;

    if (!uid) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Please sign in to view your orders archive.',
        },
      });
    }

    const orders = [];
    const snapshot = await db.collection('orders').get();

    snapshot.forEach((doc) => {
      const order = doc.data();
      if (
        order.userId === uid ||
        (email && order.customer?.email?.toLowerCase() === email.toLowerCase())
      ) {
        orders.push({ id: doc.id, ...order });
      }
    });

    // Sort newest first
    orders.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

    res.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Cancel an order
 * POST /api/v1/orders/:id/cancel
 */
export async function handleCancelOrder(req, res, next) {
  try {
    const { id } = req.params;
    const { reason = 'Cancelled by client' } = req.body;

    const result = await cancelOrder(id.toUpperCase().trim(), reason);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: {
        code: 'ORDER_CANCEL_FAILED',
        message: error.message || 'Unable to cancel this order.',
      },
    });
  }
}

/**
 * Attach bank payment transfer receipt
 * POST /api/v1/orders/:id/receipt
 */
export async function handleUploadReceipt(req, res, next) {
  try {
    const { id } = req.params;
    const orderNumber = id.toUpperCase().trim();

    const orderRef = db.collection('orders').doc(orderNumber);
    const snap = await orderRef.get();

    if (!snap.exists) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'ORDER_NOT_FOUND',
          message: `Order ${orderNumber} not found.`,
        },
      });
    }

    let receiptUrl = '';

    if (req.file) {
      // Receipt uploaded via multipart
      receiptUrl = `/uploads/receipts/${req.file.filename}`;
    } else if (req.body.receiptUrl) {
      receiptUrl = req.body.receiptUrl;
    } else if (req.body.transactionId) {
      // TID provided
      receiptUrl = `TID: ${req.body.transactionId}`;
    } else {
      return res.status(400).json({
        success: false,
        error: {
          code: 'MISSING_RECEIPT',
          message: 'Please attach a payment receipt file or provide a transaction reference ID.',
        },
      });
    }

    await orderRef.update({
      receiptUrl,
      paymentStatus: 'receipt_uploaded',
      statusHistory: [
        ...(snap.data().statusHistory || []),
        {
          status: 'receipt_uploaded',
          at: new Date().toISOString(),
          note: `Bank transfer receipt submitted: ${receiptUrl}`,
        },
      ],
      updatedAt: new Date().toISOString(),
    });

    res.json({
      success: true,
      data: {
        orderNumber,
        receiptUrl,
        message: 'Your payment receipt has been received and is queued for verification.',
      },
    });
  } catch (error) {
    next(error);
  }
}

