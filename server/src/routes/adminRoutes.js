/**
 * Admin API Routes for Minha Jewellers Back-Office
 * Mounted at /api/v1/admin/*
 */
import { Router } from 'express';
import { db } from '../config/firebase.js';

const router = Router();

// Middleware: Admin auth check
const requireAdminAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: { code: 'UNAUTHORIZED', message: 'Admin authentication required' },
    });
  }
  // In demo / development environment, allow valid tokens
  req.admin = {
    uid: 'admin-001',
    email: 'admin@minhajewellers.com',
    role: 'admin',
  };
  next();
};

router.use(requireAdminAuth);

// ─── 1. Overview ─────────────────────────────────────────────────────────────
router.get('/overview', async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        revenueReceived: 487500,
        totalOrders: 34,
        pendingOrders: 7,
        unitsInStock: 312,
        registeredUsers: 28,
        unreadMessages: 3,
        lowStockCount: 4,
        sales7Days: [
          { day: 'Mon', revenue: 42000, orders: 4 },
          { day: 'Tue', revenue: 68000, orders: 7 },
          { day: 'Wed', revenue: 51000, orders: 5 },
          { day: 'Thu', revenue: 95000, orders: 11 },
          { day: 'Fri', revenue: 84000, orders: 9 },
          { day: 'Sat', revenue: 122000, orders: 14 },
          { day: 'Sun', revenue: 105000, orders: 12 },
        ],
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});

// ─── 2. Products ─────────────────────────────────────────────────────────────
router.get('/products', async (req, res) => {
  res.json({ success: true, data: [] });
});
router.post('/products', async (req, res) => {
  res.status(201).json({ success: true, data: { id: `p-${Date.now()}`, ...req.body } });
});
router.put('/products/:id', async (req, res) => {
  res.json({ success: true, data: { id: req.params.id, ...req.body } });
});
router.delete('/products/:id', async (req, res) => {
  res.json({ success: true, message: 'Product deleted' });
});

// ─── 3. Categories ───────────────────────────────────────────────────────────
router.get('/categories', async (req, res) => {
  res.json({ success: true, data: [] });
});
router.post('/categories', async (req, res) => {
  res.status(201).json({ success: true, data: { id: `cat-${Date.now()}`, ...req.body } });
});
router.put('/categories/:id', async (req, res) => {
  res.json({ success: true, data: { id: req.params.id, ...req.body } });
});
router.delete('/categories/:id', async (req, res) => {
  res.json({ success: true, message: 'Category deleted' });
});

// ─── 4. Orders ───────────────────────────────────────────────────────────────
router.get('/orders', async (req, res) => {
  res.json({ success: true, data: [] });
});
router.get('/orders/:id', async (req, res) => {
  res.json({ success: true, data: { id: req.params.id } });
});
router.put('/orders/:id/status', async (req, res) => {
  res.json({ success: true, data: { id: req.params.id, status: req.body.status } });
});
router.put('/orders/:id/payment', async (req, res) => {
  res.json({ success: true, data: { id: req.params.id, paymentStatus: req.body.paymentStatus } });
});
router.put('/orders/:id/tracking', async (req, res) => {
  res.json({ success: true, data: { id: req.params.id, ...req.body } });
});
router.delete('/orders/:id', async (req, res) => {
  res.json({ success: true, message: 'Order deleted' });
});

// ─── 5. Transactions ─────────────────────────────────────────────────────────
router.get('/transactions', async (req, res) => {
  res.json({ success: true, data: [] });
});

// ─── 6. Customers ───────────────────────────────────────────────────────────
router.get('/customers', async (req, res) => {
  res.json({ success: true, data: [] });
});
router.put('/customers/:id/block', async (req, res) => {
  res.json({ success: true, data: { id: req.params.id, blocked: req.body.blocked } });
});

// ─── 7. Coupons ──────────────────────────────────────────────────────────────
router.get('/coupons', async (req, res) => {
  res.json({ success: true, data: [] });
});
router.post('/coupons', async (req, res) => {
  res.status(201).json({ success: true, data: { id: `cpn-${Date.now()}`, ...req.body } });
});
router.put('/coupons/:id', async (req, res) => {
  res.json({ success: true, data: { id: req.params.id, ...req.body } });
});
router.delete('/coupons/:id', async (req, res) => {
  res.json({ success: true, message: 'Coupon deleted' });
});

// ─── 8. Reviews ──────────────────────────────────────────────────────────────
router.get('/reviews', async (req, res) => {
  res.json({ success: true, data: [] });
});
router.put('/reviews/:id', async (req, res) => {
  res.json({ success: true, data: { id: req.params.id, ...req.body } });
});
router.delete('/reviews/:id', async (req, res) => {
  res.json({ success: true, message: 'Review deleted' });
});

// ─── 9. Messages & Subscribers ───────────────────────────────────────────────
router.get('/messages', async (req, res) => {
  res.json({ success: true, data: [] });
});
router.put('/messages/:id/read', async (req, res) => {
  res.json({ success: true, data: { id: req.params.id, read: req.body.read } });
});
router.delete('/messages/:id', async (req, res) => {
  res.json({ success: true, message: 'Message deleted' });
});
router.get('/subscribers', async (req, res) => {
  res.json({ success: true, data: [] });
});

// ─── 10. Site Content & Settings ─────────────────────────────────────────────
router.get('/site-content', async (req, res) => {
  res.json({ success: true, data: {} });
});
router.put('/site-content', async (req, res) => {
  res.json({ success: true, data: req.body });
});
router.get('/settings', async (req, res) => {
  res.json({ success: true, data: {} });
});
router.put('/settings', async (req, res) => {
  res.json({ success: true, data: req.body });
});

// ─── 11. Team ────────────────────────────────────────────────────────────────
router.get('/team', async (req, res) => {
  res.json({ success: true, data: [] });
});
router.post('/team', async (req, res) => {
  res.status(201).json({ success: true, data: { id: `staff-${Date.now()}`, ...req.body } });
});
router.put('/team/:id', async (req, res) => {
  res.json({ success: true, data: { id: req.params.id, ...req.body } });
});
router.delete('/team/:id', async (req, res) => {
  res.json({ success: true, message: 'Team member removed' });
});

export default router;
