import { Router } from 'express';
import { subscribeNewsletter } from '../controllers/newsletterController.js';
import { formLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.post('/', formLimiter, subscribeNewsletter);

export default router;

