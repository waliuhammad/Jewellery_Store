import { db } from '../config/firebase.js';

/**
 * List products with filters, sorting, search, and pagination
 * GET /api/v1/products
 */
export async function getProducts(req, res, next) {
  try {
    const {
      category,
      material,
      occasion,
      minPrice,
      maxPrice,
      search,
      sort = 'popular',
      featured,
      bestseller,
      isNew,
      page = 1,
      limit = 12,
    } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 12));

    // Fetch all active products
    const snapshot = await db.collection('products').get();
    let products = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      if (data.isActive !== false) {
        products.push({ id: doc.id, ...data });
      }
    });

    // 1. Category Filter
    if (category && category !== 'all') {
      const catSlug = category.toLowerCase().trim();
      products = products.filter(
        (p) =>
          (p.categoryId && p.categoryId.toLowerCase() === catSlug) ||
          (p.category && p.category.toLowerCase() === catSlug)
      );
    }

    // 2. Material Filter
    if (material && material !== 'all') {
      const mat = material.toLowerCase().trim();
      products = products.filter((p) => {
        if (!p.material) return false;
        const pMat = p.material.toLowerCase();
        if (mat.includes('gold')) return pMat.includes('gold');
        if (mat.includes('silver')) return pMat.includes('silver');
        if (mat.includes('pearl')) return pMat.includes('pearl');
        return pMat.includes(mat);
      });
    }

    // 3. Occasion Filter
    if (occasion && occasion !== 'all') {
      const occ = occasion.toLowerCase().trim();
      products = products.filter(
        (p) =>
          Array.isArray(p.occasion) &&
          p.occasion.some((o) => o.toLowerCase().includes(occ))
      );
    }

    // 4. Price Filter
    if (minPrice !== undefined && !isNaN(Number(minPrice))) {
      products = products.filter((p) => Number(p.price) >= Number(minPrice));
    }
    if (maxPrice !== undefined && !isNaN(Number(maxPrice))) {
      products = products.filter((p) => Number(p.price) <= Number(maxPrice));
    }

    // 5. Flags (Featured, Bestseller, New)
    if (featured === 'true' || featured === true) {
      products = products.filter((p) => p.isFeatured);
    }
    if (bestseller === 'true' || bestseller === true) {
      products = products.filter((p) => p.isBestseller);
    }
    if (isNew === 'true' || isNew === true) {
      products = products.filter((p) => p.isNew);
    }

    // 6. Search Query
    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      products = products.filter((p) => {
        const inName = p.name?.toLowerCase().includes(q);
        const inDesc = p.description?.toLowerCase().includes(q);
        const inCat = p.categoryId?.toLowerCase().includes(q);
        const inTags = Array.isArray(p.tags) && p.tags.some((t) => t.toLowerCase().includes(q));
        const inKeywords =
          Array.isArray(p.searchKeywords) &&
          p.searchKeywords.some((k) => k.toLowerCase().includes(q));
        return inName || inDesc || inCat || inTags || inKeywords;
      });
    }

    // 7. Sort
    switch (sort) {
      case 'price-asc':
        products.sort((a, b) => Number(a.price) - Number(b.price));
        break;
      case 'price-desc':
        products.sort((a, b) => Number(b.price) - Number(a.price));
        break;
      case 'rating':
        products.sort((a, b) => (b.ratingAverage || 0) - (a.ratingAverage || 0));
        break;
      case 'newest':
        products.sort(
          (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
        );
        break;
      case 'popular':
      case 'bestseller':
      default:
        products.sort((a, b) => {
          if (a.isBestseller && !b.isBestseller) return -1;
          if (!a.isBestseller && b.isBestseller) return 1;
          return (b.ratingCount || 0) - (a.ratingCount || 0);
        });
        break;
    }

    const total = products.length;
    const totalPages = Math.ceil(total / limitNum) || 1;
    const startIndex = (pageNum - 1) * limitNum;
    const paginatedProducts = products.slice(startIndex, startIndex + limitNum);

    res.json({
      success: true,
      data: {
        products: paginatedProducts,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages,
          hasNextPage: pageNum < totalPages,
          hasPrevPage: pageNum > 1,
        },
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get single product by slug or ID
 * GET /api/v1/products/:slug
 */
export async function getProductBySlug(req, res, next) {
  try {
    const { slug } = req.params;

    // First attempt to match by ID
    let docRef = db.collection('products').doc(slug);
    let snap = await docRef.get();

    let product = null;

    if (snap.exists) {
      product = { id: snap.id, ...snap.data() };
    } else {
      // Query by slug
      const querySnap = await db
        .collection('products')
        .where('slug', '==', slug)
        .limit(1)
        .get();

      if (!querySnap.empty) {
        const doc = querySnap.docs[0];
        product = { id: doc.id, ...doc.data() };
      }
    }

    if (!product || product.isActive === false) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'PRODUCT_NOT_FOUND',
          message: 'The requested jewelry piece could not be found in our collection.',
        },
      });
    }

    // Fetch related products (same category or material)
    let related = [];
    const relatedSnap = await db
      .collection('products')
      .where('categoryId', '==', product.categoryId)
      .limit(5)
      .get();

    relatedSnap.forEach((doc) => {
      if (doc.id !== product.id) {
        related.push({ id: doc.id, ...doc.data() });
      }
    });

    res.json({
      success: true,
      data: {
        ...product,
        related: related.slice(0, 4),
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Search suggestions & quick results
 * GET /api/v1/search?q=
 */
export async function searchProducts(req, res, next) {
  try {
    const { q = '' } = req.query;
    const query = q.trim().toLowerCase();

    if (!query) {
      return res.json({
        success: true,
        data: {
          suggestions: [],
          products: [],
        },
      });
    }

    const snap = await db.collection('products').get();
    const matches = [];

    snap.forEach((doc) => {
      const p = doc.data();
      if (p.isActive !== false) {
        const inName = p.name?.toLowerCase().includes(query);
        const inCat = p.categoryId?.toLowerCase().includes(query);
        const inTags = Array.isArray(p.tags) && p.tags.some((t) => t.toLowerCase().includes(query));

        if (inName || inCat || inTags) {
          matches.push({
            id: doc.id,
            name: p.name,
            slug: p.slug,
            price: p.price,
            compareAtPrice: p.compareAtPrice,
            image: (p.images && p.images[0]?.url) || (Array.isArray(p.images) && p.images[0]) || '',
            categoryId: p.categoryId,
            material: p.material,
          });
        }
      }
    });

    const suggestions = Array.from(
      new Set(
        matches.map((m) => m.name).slice(0, 5)
      )
    );

    res.json({
      success: true,
      data: {
        suggestions,
        products: matches.slice(0, 8),
      },
    });
  } catch (error) {
    next(error);
  }
}

