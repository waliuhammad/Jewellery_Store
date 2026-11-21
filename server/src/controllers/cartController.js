import { validateAndPriceCart } from '../services/orderService.js';

/**
 * Validate and compute server-side totals for cart items
 * POST /api/v1/cart/validate
 */
export async function validateCart(req, res, next) {
  try {
    const { items, couponCode, paymentMethod, shippingType, isGiftWrap } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'EMPTY_CART',
          message: 'Your cart is empty. Add at least one jewelry piece to validate.',
        },
      });
    }

    const calculation = await validateAndPriceCart(
      items,
      couponCode,
      paymentMethod || 'cod',
      shippingType || 'standard',
      Boolean(isGiftWrap)
    );

    res.json({
      success: true,
      data: calculation,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: {
        code: 'CART_VALIDATION_FAILED',
        message: error.message || 'Could not validate cart items.',
      },
    });
  }
}

