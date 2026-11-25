export type ProductStatus = 'draft' | 'active' | 'archived';

export type ProductImage = { url: string; publicId?: string; alt: string };

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  categoryId: string;
  images: ProductImage[];
  price: number;
  compareAtPrice?: number | null;
  currency: string;
  sku: string;
  stock: number;
  status: ProductStatus;
  featured: boolean;
  material: string | null;
  /** Units sold. Maintained by the order transaction, never by the admin form. */
  soldCount: number;
  createdAt: number; // epoch ms, converted in the repository
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
  image?: ProductImage | null;
  isActive: boolean;
  sortOrder: number;
};

export type ShopSort = 'newest' | 'price-asc' | 'price-desc' | 'popular';

export type ShopFilters = {
  category?: string;
  q?: string;
  min?: number;
  max?: number;
  sort: ShopSort;
  featured?: boolean;
  material?: string;
  inStock?: boolean;
  page?: number;
};
