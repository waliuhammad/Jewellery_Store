import 'server-only';
import { adminDb } from '@/lib/firebase/admin';
import type { ProductImage } from '@/types/catalog';

export type OrderSummary = {
  id: string;
  createdAtMs: number;
  status: string;
  total: number;
  currency: string;
  itemCount: number;
};

export type OrderLine = {
  productId: string;
  name: string;
  sku: string;
  image: ProductImage | null;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
};

export type OrderDetail = OrderSummary & {
  lines: OrderLine[];
  subtotal: number;
  shipping: number;
  tax: number;
  customer: { fullName: string; address1: string; address2: string; city: string; postalCode: string; country: string };
};

const ID = /^[A-Za-z0-9_-]{1,128}$/;

function toMs(v: unknown): number {
  return v && typeof v === 'object' && 'toMillis' in v ? (v as { toMillis: () => number }).toMillis() : 0;
}

/** Orders placed while signed in. Guest orders have no userId and never appear here. */
export async function listOrdersForUser(uid: string): Promise<OrderSummary[]> {
  const snap = await adminDb().collection('orders').where('userId', '==', uid).limit(100).get();
  return snap.docs
    .map((doc) => {
      const d = doc.data();
      const lines = Array.isArray(d.lines) ? d.lines : [];
      return {
        id: doc.id,
        createdAtMs: toMs(d.createdAt),
        status: String(d.status ?? ''),
        total: Number(d.total ?? 0),
        currency: String(d.currency ?? 'PKR'),
        itemCount: lines.reduce((n: number, l: { quantity?: number }) => n + Number(l.quantity ?? 0), 0),
      };
    })
    .sort((a, b) => b.createdAtMs - a.createdAtMs);
}

/** Returns null for another customer's order too, so existence is not revealed. */
export async function getOrderForUser(uid: string, id: string): Promise<OrderDetail | null> {
  if (!ID.test(id)) return null;
  const snap = await adminDb().collection('orders').doc(id).get();
  if (!snap.exists) return null;
  const d = snap.data()!;
  if (d.userId !== uid) return null;

  const c = d.customer ?? {};
  return {
    id: snap.id,
    createdAtMs: toMs(d.createdAt),
    status: String(d.status ?? ''),
    total: Number(d.total ?? 0),
    currency: String(d.currency ?? 'PKR'),
    itemCount: (Array.isArray(d.lines) ? d.lines : []).reduce((n: number, l: { quantity?: number }) => n + Number(l.quantity ?? 0), 0),
    lines: Array.isArray(d.lines) ? (d.lines as OrderLine[]) : [],
    subtotal: Number(d.subtotal ?? 0),
    shipping: Number(d.shipping ?? 0),
    tax: Number(d.tax ?? 0),
    customer: {
      fullName: String(c.fullName ?? ''),
      address1: String(c.address1 ?? ''),
      address2: String(c.address2 ?? ''),
      city: String(c.city ?? ''),
      postalCode: String(c.postalCode ?? ''),
      country: String(c.country ?? ''),
    },
  };
}
