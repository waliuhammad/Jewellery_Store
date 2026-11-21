import { db } from '../config/firebase.js';
import { BRAND } from '../config/brand.js';

/**
 * Get public store settings
 * GET /api/v1/settings
 */
export async function getSettings(req, res, next) {
  try {
    const docRef = db.collection('settings').doc('store');
    const snap = await docRef.get();

    let storeSettings = {
      brand: BRAND.name,
      currency: BRAND.currency,
      shipping: BRAND.shipping,
      contact: BRAND.contact,
      bankDetails: BRAND.bankDetails,
      wallets: BRAND.wallets,
    };

    if (snap.exists) {
      storeSettings = { ...storeSettings, ...snap.data() };
    }

    res.json({
      success: true,
      data: storeSettings,
    });
  } catch (error) {
    next(error);
  }
}

