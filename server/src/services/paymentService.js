import crypto from 'crypto';
import { db } from '../config/firebase.js';
import { BRAND } from '../config/brand.js';

/**
 * Payment Provider Interface & Local Handler
 */
export class PaymentProvider {
  /**
   * Initiate payment transaction
   */
  async initiate({ orderNumber, amount, method, customer }) {
    if (method === 'cod') {
      return {
        success: true,
        method: 'cod',
        orderNumber,
        requiresAction: false,
        message: 'Order placed with Cash on Delivery. Cash is collected at your doorstep.',
      };
    }

    if (method === 'bank') {
      return {
        success: true,
        method: 'bank',
        orderNumber,
        requiresAction: true,
        bankDetails: BRAND.bankDetails,
        message: 'Please transfer to the Meezan Bank account and upload your payment receipt.',
      };
    }

    if (method === 'wallet') {
      return {
        success: true,
        method: 'wallet',
        orderNumber,
        requiresAction: true,
        wallets: BRAND.wallets,
        message: 'Please transfer via JazzCash or Easypaisa and provide your SMS transaction ID (TID).',
      };
    }

    throw new Error(`Unsupported payment method: ${method}`);
  }

  /**
   * Verify server-to-server webhook signature
   */
  verifyWebhookSignature(payload, signature) {
    const secret = process.env.PAYMENT_WEBHOOK_SECRET || 'aurelle_secret_webhook_key_2026';
    const computedSignature = crypto
      .createHmac('sha256', secret)
      .update(typeof payload === 'string' ? payload : JSON.stringify(payload))
      .digest('hex');

    return computedSignature === signature;
  }

  /**
   * Process payment confirmation webhook
   */
  async handleWebhook(event) {
    const { orderNumber, transactionId, status, amount } = event;

    const orderRef = db.collection('orders').doc(orderNumber);
    const snap = await orderRef.get();

    if (!snap.exists) {
      throw new Error(`Order ${orderNumber} not found.`);
    }

    const order = snap.data();

    if (status === 'PAID' || status === 'COMPLETED' || status === 'SUCCESS') {
      await orderRef.update({
        paymentStatus: 'paid',
        status: order.status === 'payment_pending' ? 'confirmed' : order.status,
        paymentRef: transactionId,
        paidAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        statusHistory: [
          ...(order.statusHistory || []),
          {
            status: 'payment_verified',
            at: new Date().toISOString(),
            note: `Payment verified via gateway. TID: ${transactionId}`,
          },
        ],
      });
      return { success: true, verified: true, orderNumber };
    }

    return { success: true, verified: false, orderNumber };
  }
}

export const paymentService = new PaymentProvider();

