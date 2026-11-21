import { Router } from 'express';
import { submitContact } from '../controllers/contactController.js';
import { formLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.post('/', formLimiter, submitContact);

export default router;

