import type { ProductImage } from '@/types/catalog';

export type PricedLine = {
  productId: string;
  slug: string;
  name: string;
  sku: string;
  currency: string;
  image: ProductImage | null;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
  stock: number;
};

export type PricedCart = {
  lines: PricedLine[];
  currency: string;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  /** Problems the customer must resolve before checkout. Empty when the bag is valid. */
  issues: string[];
};

export type PlaceOrderResult = { orderId: string } | { issues: string[] };
