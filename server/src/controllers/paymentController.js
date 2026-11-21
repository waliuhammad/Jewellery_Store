import { PaymentProvider } from '../services/paymentService.js';
import { db } from '../config/firebase.js';

const paymentProvider = new PaymentProvider();

/**
 * Initiate a payment session or retrieve gateway credentials
 * POST /api/v1/payments/initiate
 */
export async function initiatePayment(req, res, next) {
  try {
    const { orderNumber, amount, method, customer } = req.body;

    if (!orderNumber || !amount || !method) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_PAYMENT_DATA',
          message: 'orderNumber, amount, and method are required.',
        },
      });
    }

    const result = await paymentProvider.initiate({
      orderNumber,
      amount,
      method,
      customer,
    });

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: {
        code: 'PAYMENT_INITIATION_ERROR',
        message: error.message || 'Failed to initiate payment.',
      },
    });
  }
}

/**
 * Gateway Webhook listener with HMAC verification
 * POST /api/v1/payments/webhook
 */
export async function handlePaymentWebhook(req, res, next) {
  try {
    const signature = req.headers['x-signature'] || req.headers['x-webhook-signature'];
    const payload = req.body;

    // Verify signature
    const isValid = paymentProvider.verifyWebhookSignature(payload, signature);
    if (!isValid && process.env.NODE_ENV === 'production') {
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_SIGNATURE',
          message: 'Webhook signature validation failed.',
        },
      });
    }

    const { orderNumber, transactionId, status } = payload;

    if (!orderNumber) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'MISSING_ORDER_NUMBER',
          message: 'Webhook payload missing order reference.',
        },
      });
    }

    const orderRef = db.collection('orders').doc(orderNumber);
    const snap = await orderRef.get();

    if (!snap.exists) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'ORDER_NOT_FOUND',
          message: `Order ${orderNumber} does not exist.`,
        },
      });
    }

    const order = snap.data();
    const isPaid = status === 'success' || status === 'paid';

    await orderRef.update({
      paymentStatus: isPaid ? 'paid' : 'payment_failed',
      paymentRef: transactionId || order.paymentRef,
      status: isPaid ? 'confirmed' : order.status,
      updatedAt: new Date().toISOString(),
      statusHistory: [
        ...(order.statusHistory || []),
        {
          status: isPaid ? 'confirmed' : 'payment_failed',
          at: new Date().toISOString(),
          note: `Payment gateway update: ${status} (Txn: ${transactionId || 'N/A'})`,
        },
      ],
    });

    res.json({
      success: true,
      data: {
        received: true,
        orderNumber,
        status: isPaid ? 'confirmed' : order.status,
      },
    });
  } catch (error) {
    next(error);
  }
}

