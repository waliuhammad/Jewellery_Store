import 'server-only';
import { Timestamp } from 'firebase-admin/firestore';
import { adminDb } from '@/lib/firebase/admin';
import { siteConfig } from '@/config/site';

const DAY_MS = 24 * 60 * 60 * 1000;
const LOW_STOCK_LEVEL = 5;

export type Dashboard = {
  currency: string;
  revenue30: number;
  orders30: number;
  customers: number;
  activeProducts: number;
  outOfStock: number;
  lowStock: { id: string; name: string; stock: number }[];
  byStatus: Record<string, number>;
  recent: { id: string; total: number; status: string; currency: string; createdAtMs: number }[];
};

function toMs(v: unknown): number {
  return v && typeof v === 'object' && 'toMillis' in v ? (v as { toMillis: () => number }).toMillis() : 0;
}

/** Revenue excludes cancelled orders. Figures assume one currency, which the storefront uses throughout. */
export async function loadDashboard(): Promise<Dashboard> {
  const db = adminDb();
  const since = Timestamp.fromMillis(Date.now() - 30 * DAY_MS);

  const [products, orders, customers, recent] = await Promise.all([
    db.collection('products').select('name', 'status', 'stock').limit(1000).get(),
    db.collection('orders').where('createdAt', '>=', since).limit(1000).get(),
    db.collection('users').count().get(),
    db.collection('orders').orderBy('createdAt', 'desc').limit(5).get(),
  ]);

  let activeProducts = 0;
  let outOfStock = 0;
  const lowStock: Dashboard['lowStock'] = [];
  for (const doc of products.docs) {
    const d = doc.data();
    if (d.status !== 'active') continue;
    activeProducts++;
    const stock = Number(d.stock ?? 0);
    if (stock <= 0) outOfStock++;
    else if (stock <= LOW_STOCK_LEVEL) lowStock.push({ id: doc.id, name: String(d.name ?? ''), stock });
  }
  lowStock.sort((a, b) => a.stock - b.stock);

  let revenue30 = 0;
  let orders30 = 0;
  const byStatus: Record<string, number> = {};
  for (const doc of orders.docs) {
    const d = doc.data();
    const status = String(d.status ?? '');
    orders30++;
    byStatus[status] = (byStatus[status] ?? 0) + 1;
    if (status !== 'cancelled') revenue30 += Number(d.total ?? 0);
  }

  return {
    currency: siteConfig.currency,
    revenue30,
    orders30,
    customers: customers.data().count,
    activeProducts,
    outOfStock,
    lowStock: lowStock.slice(0, 8),
    byStatus,
    recent: recent.docs.map((doc) => {
      const d = doc.data();
      return {
        id: doc.id,
        total: Number(d.total ?? 0),
        status: String(d.status ?? ''),
        currency: String(d.currency ?? 'PKR'),
        createdAtMs: toMs(d.createdAt),
      };
    }),
  };
}
