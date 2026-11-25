import 'server-only';
import { FieldValue } from 'firebase-admin/firestore';
import { adminDb } from '@/lib/firebase/admin';
import { writeAudit } from '@/lib/audit';
import type { SessionUser } from '@/lib/auth/session';

type Outcome = { ok: true } | { ok: false; status: number; error: string };

/** Sets the absolute stock count and records who changed it, from what, to what, and why. */
export async function setStock(actor: SessionUser, productId: string, stock: number, reason: string): Promise<Outcome> {
  const db = adminDb();
  const ref = db.collection('products').doc(productId);

  const result = await db.runTransaction(async (tx): Promise<Outcome & { from?: number }> => {
    const snap = await tx.get(ref);
    if (!snap.exists) return { ok: false, status: 404, error: 'Product not found.' };
    const from = Number(snap.data()?.stock ?? 0);
    tx.update(ref, { stock, updatedAt: FieldValue.serverTimestamp() });
    return { ok: true, from };
  });

  if (result.ok) {
    await writeAudit(actor, 'inventory.adjust', `products/${productId}`, {
      from: result.from ?? 0,
      to: stock,
      reason: reason.slice(0, 120),
    });
    return { ok: true };
  }
  return result;
}
