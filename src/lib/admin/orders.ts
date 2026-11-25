import 'server-only';
import { FieldValue } from 'firebase-admin/firestore';
import { adminDb } from '@/lib/firebase/admin';
import { writeAudit } from '@/lib/audit';
import type { SessionUser } from '@/lib/auth/session';
import { canTransition, labelFor, type OrderStatus } from '@/lib/orders/status';

export type AdminOrderSummary = {
  id: string;
  createdAtMs: number;
  status: string;
  total: number;
  currency: string;
  customerName: string;
  itemCount: number;
};

function toMs(v: unknown): number {
  return v && typeof v === 'object' && 'toMillis' in v ? (v as { toMillis: () => number }).toMillis() : 0;
}

export async function listRecentOrders(statusFilter?: string): Promise<AdminOrderSummary[]> {
  const snap = await adminDb().collection('orders').orderBy('createdAt', 'desc').limit(200).get();
  return snap.docs
    .map((doc) => {
      const d = doc.data();
      const lines: { quantity?: number }[] = Array.isArray(d.lines) ? d.lines : [];
      return {
        id: doc.id,
        createdAtMs: toMs(d.createdAt),
        status: String(d.status ?? ''),
        total: Number(d.total ?? 0),
        currency: String(d.currency ?? 'PKR'),
        customerName: String(d.customer?.fullName ?? ''),
        itemCount: lines.reduce((n, l) => n + Number(l.quantity ?? 0), 0),
      };
    })
    .filter((o) => !statusFilter || o.status === statusFilter);
}

type Outcome = { ok: true; from: string } | { ok: false; status: number; error: string };

/**
 * Moves an order to a new status. Cancelling returns stock and removes the sale from popularity.
 * Reads happen before writes, as Firestore transactions require.
 */
export async function transitionOrder(actor: SessionUser, orderId: string, next: OrderStatus): Promise<Outcome> {
  const db = adminDb();
  const orderRef = db.collection('orders').doc(orderId);

  const result = await db.runTransaction(async (tx): Promise<Outcome> => {
    const snap = await tx.get(orderRef);
    if (!snap.exists) return { ok: false, status: 404, error: 'Order not found.' };

    const d = snap.data()!;
    const current = String(d.status ?? '');
    if (current === next) return { ok: true, from: current };
    if (!canTransition(current, next)) {
      return { ok: false, status: 409, error: `An order cannot move from ${labelFor(current)} to ${labelFor(next)}.` };
    }

    if (next === 'cancelled') {
      const lines: { productId: string; quantity: number }[] = Array.isArray(d.lines) ? d.lines : [];
      const refs = lines.map((l) => db.collection('products').doc(String(l.productId)));
      const productSnaps = refs.length > 0 ? await tx.getAll(...refs) : [];

      for (let i = 0; i < productSnaps.length; i++) {
        const ps = productSnaps[i];
        const ref = refs[i];
        const line = lines[i];
        if (!ps || !ref || !line) continue;
        if (!ps.exists) continue; // product was deleted since the sale
        tx.update(ref, {
          stock: FieldValue.increment(line.quantity),
          soldCount: FieldValue.increment(-line.quantity),
          updatedAt: FieldValue.serverTimestamp(),
        });
      }
    }

    tx.update(orderRef, { status: next, statusUpdatedAt: FieldValue.serverTimestamp() });
    return { ok: true, from: current };
  });

  if (result.ok) {
    await writeAudit(actor, 'order.status', `orders/${orderId}`, { from: result.from, to: next });
  }
  return result;
}

export async function getOrderAdmin(orderId: string) {
  const snap = await adminDb().collection('orders').doc(orderId).get();
  if (!snap.exists) return null;
  const d = snap.data()!;
  return {
    id: snap.id,
    userId: (d.userId as string | null) ?? null,
    createdAtMs: toMs(d.createdAt),
    status: String(d.status ?? ''),
    currency: String(d.currency ?? 'PKR'),
    subtotal: Number(d.subtotal ?? 0),
    shipping: Number(d.shipping ?? 0),
    tax: Number(d.tax ?? 0),
    total: Number(d.total ?? 0),
    lines: (Array.isArray(d.lines) ? d.lines : []) as {
      productId: string; name: string; sku: string; unitPrice: number; quantity: number; lineTotal: number;
    }[],
    customer: (d.customer ?? {}) as Record<string, string>,
  };
}
