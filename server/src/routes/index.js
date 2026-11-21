import { Router } from 'express';
import productRoutes from './productRoutes.js';
import categoryRoutes from './categoryRoutes.js';
import cartRoutes from './cartRoutes.js';
import orderRoutes from './orderRoutes.js';
import paymentRoutes from './paymentRoutes.js';
import reviewRoutes from './reviewRoutes.js';
import contactRoutes from './contactRoutes.js';
import newsletterRoutes from './newsletterRoutes.js';
import userRoutes from './userRoutes.js';
import couponRoutes from './couponRoutes.js';
import settingsRoutes from './settingsRoutes.js';
import adminRoutes from './adminRoutes.js';
import { searchProducts } from '../controllers/productController.js';

const apiRouter = Router();

// Health check endpoint
apiRouter.get('/health', (req, res) => {
  res.json({
    success: true,
    data: {
      status: 'healthy',
      brand: 'Aurelle Jewels API',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
    },
  });
});

// Search shortcut directly at /api/v1/search?q=
apiRouter.get('/search', searchProducts);

// Resource routers
apiRouter.use('/products', productRoutes);
apiRouter.use('/categories', categoryRoutes);
apiRouter.use('/cart', cartRoutes);
apiRouter.use('/orders', orderRoutes);
apiRouter.use('/payments', paymentRoutes);
apiRouter.use('/reviews', reviewRoutes);
apiRouter.use('/contact', contactRoutes);
apiRouter.use('/newsletter', newsletterRoutes);
apiRouter.use('/me', userRoutes);
apiRouter.use('/coupons', couponRoutes);
apiRouter.use('/settings', settingsRoutes);
apiRouter.use('/admin', adminRoutes);

export default apiRouter;

