import { Router } from 'express';
import {
  handleCreateOrder,
  trackOrder,
  getMyOrders,
  handleCancelOrder,
  handleUploadReceipt,
} from '../controllers/orderController.js';
import { requireAuth, optionalAuth } from '../middleware/authMiddleware.js';
import { orderLimiter } from '../middleware/rateLimiter.js';
import { uploadReceipt } from '../middleware/uploadMiddleware.js';

const router = Router();

// Order creation with rate limiting and optional auth for guest vs logged-in
router.post('/', orderLimiter, optionalAuth, handleCreateOrder);

// Track order by orderNumber + phone/email
router.get('/track', trackOrder);

// List authenticated user's orders
router.get('/me', requireAuth, getMyOrders);

// Cancel order
router.post('/:id/cancel', optionalAuth, handleCancelOrder);

// Upload payment receipt (JPG/PNG/PDF up to 5MB)
router.post('/:id/receipt', uploadReceipt.single('receipt'), handleUploadReceipt);

export default router;

