import { db } from '../config/firebase.js';

/**
 * List all active categories ordered by `order`
 * GET /api/v1/categories
 */
export async function getCategories(req, res, next) {
  try {
    const snapshot = await db.collection('categories').get();
    const categories = [];

    snapshot.forEach((doc) => {
      const data = doc.data();
      if (data.isActive !== false) {
        categories.push({ id: doc.id, ...data });
      }
    });

    // Sort by order ascending
    categories.sort((a, b) => (a.order || 0) - (b.order || 0));

    res.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
}

