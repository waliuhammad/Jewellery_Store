import { Router } from 'express';
import { initiatePayment, handlePaymentWebhook } from '../controllers/paymentController.js';
import { optionalAuth } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/initiate', optionalAuth, initiatePayment);
router.post('/webhook', handlePaymentWebhook);

export default router;

