import { db } from '../config/firebase.js';

/**
 * Subscribe to the Aurelle Gazette newsletter
 * POST /api/v1/newsletter
 */
export async function subscribeNewsletter(req, res, next) {
  try {
    const { email } = req.body;

    if (!email || !email.includes('@')) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_EMAIL',
          message: 'Please provide a valid email address.',
        },
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    const docRef = db.collection('newsletter').doc(cleanEmail);
    const snap = await docRef.get();

    if (snap.exists && snap.data()?.isActive !== false) {
      return res.json({
        success: true,
        data: {
          message: 'You are already subscribed to our private gazette. Use code WELCOME10 for 10% off.',
          couponCode: 'WELCOME10',
          isNewSubscriber: false,
        },
      });
    }

    await docRef.set({
      email: cleanEmail,
      isActive: true,
      couponCode: 'WELCOME10',
      subscribedAt: new Date().toISOString(),
    });

    res.json({
      success: true,
      data: {
        message: 'Welcome to Aurelle Jewels. Enjoy 10% off your inaugural order with code WELCOME10.',
        couponCode: 'WELCOME10',
        isNewSubscriber: true,
      },
    });
  } catch (error) {
    next(error);
  }
}

