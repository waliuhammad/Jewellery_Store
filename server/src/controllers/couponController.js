import { db } from '../config/firebase.js';

/**
 * Validate a coupon code and return discount details
 * GET /api/v1/coupons/validate?code=...
 */
export async function validateCoupon(req, res, next) {
  try {
    const { code } = req.query;

    if (!code) {
      return res.status(400).json({
        success: false,
        error: { code: 'MISSING_CODE', message: 'Please provide a coupon code.' },
      });
    }

    const cleanCode = code.trim().toUpperCase();
    const docRef = db.collection('coupons').doc(cleanCode);
    const snap = await docRef.get();

    if (!snap.exists) {
      return res.status(404).json({
        success: false,
        error: { code: 'INVALID_COUPON', message: 'This promotion code is not valid or has expired.' },
      });
    }

    const coupon = snap.data();
    if (!coupon.isActive) {
      return res.status(400).json({
        success: false,
        error: { code: 'COUPON_INACTIVE', message: 'This promotion code is no longer active.' },
      });
    }

    res.json({
      success: true,
      data: {
        code: coupon.code,
        discountPercent: coupon.discountPercent,
        description: coupon.description,
      },
    });
  } catch (error) {
    next(error);
  }
}

