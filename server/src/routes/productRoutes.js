import { Router } from 'express';
import { getProducts, getProductBySlug, searchProducts } from '../controllers/productController.js';

const router = Router();

router.get('/', getProducts);
router.get('/search', searchProducts);
router.get('/:slug', getProductBySlug);

export default router;

