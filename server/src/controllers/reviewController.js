import { db } from '../config/firebase.js';

/**
 * Submit a product review (verified buyers)
 * POST /api/v1/reviews
 */
export async function createReview(req, res, next) {
  try {
    const { productId, rating, title, body, images = [] } = req.body;
    const userId = req.user?.uid || 'usr_anonymous';
    const authorName = req.user?.name || req.body.authorName || 'Verified Client';

    if (!productId || !rating || !body) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'MISSING_FIELDS',
          message: 'Product ID, rating (1-5), and review text are required.',
        },
      });
    }

    const numRating = Math.max(1, Math.min(5, Number(rating)));

    // Verify buyer if userId is present
    let isVerifiedPurchase = false;
    if (req.user?.uid) {
      const ordersSnap = await db.collection('orders').get();
      ordersSnap.forEach((doc) => {
        const o = doc.data();
        if (
          (o.userId === req.user.uid || o.customer?.email === req.user.email) &&
          Array.isArray(o.items) &&
          o.items.some((item) => item.productId === productId)
        ) {
          isVerifiedPurchase = true;
        }
      });
    }

    const reviewId = 'rev_' + Date.now();
    const reviewData = {
      id: reviewId,
      productId,
      userId,
      authorName,
      rating: numRating,
      title: title || '',
      body,
      images: Array.isArray(images) ? images : [],
      isVerifiedPurchase,
      status: 'approved', // Auto-approved in catalog
      createdAt: new Date().toISOString(),
    };

    await db.collection('reviews').doc(reviewId).set(reviewData);

    // Update product average rating
    const allReviewsSnap = await db.collection('reviews').get();
    let totalScore = 0;
    let count = 0;

    allReviewsSnap.forEach((doc) => {
      const r = doc.data();
      if (r.productId === productId && r.status === 'approved') {
        totalScore += r.rating;
        count += 1;
      }
    });

    if (count > 0) {
      const newAvg = Number((totalScore / count).toFixed(1));
      const prodRef = db.collection('products').doc(productId);
      const prodSnap = await prodRef.get();
      if (prodSnap.exists) {
        await prodRef.update({
          ratingAverage: newAvg,
          ratingCount: count,
          updatedAt: new Date().toISOString(),
        });
      }
    }

    res.status(201).json({
      success: true,
      data: reviewData,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get approved reviews for a specific product
 * GET /api/v1/reviews/product/:productId
 */
export async function getProductReviews(req, res, next) {
  try {
    const { productId } = req.params;

    const snap = await db.collection('reviews').get();
    const reviews = [];

    snap.forEach((doc) => {
      const r = doc.data();
      if (r.productId === productId && r.status === 'approved') {
        reviews.push({ id: doc.id, ...r });
      }
    });

    // Sort newest first
    reviews.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

    res.json({
      success: true,
      data: reviews,
    });
  } catch (error) {
    next(error);
  }
}

