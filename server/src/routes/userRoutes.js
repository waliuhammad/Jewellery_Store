import { Router } from 'express';
import {
  getProfile,
  updateProfile,
  getAddresses,
  saveAddress,
  deleteAddress,
} from '../controllers/userController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = Router();

// Profile management
router.get('/', requireAuth, getProfile);
router.put('/', requireAuth, updateProfile);

// Address book management
router.get('/addresses', requireAuth, getAddresses);
router.post('/addresses', requireAuth, saveAddress);
router.delete('/addresses/:id', requireAuth, deleteAddress);

export default router;

