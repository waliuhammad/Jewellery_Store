import 'server-only';
import { FieldValue, type DocumentSnapshot } from 'firebase-admin/firestore';
import { siteConfig } from '@/config/site';
import { adminDb } from '@/lib/firebase/admin';
import { mapProduct } from '@/lib/catalog/repository';
import type { CustomerInput } from '@/lib/validations/checkout';
import type { PlaceOrderResult, PricedCart, PricedLine } from '@/lib/checkout/types';

type Item = { productId: string; quantity: number };

/**
 * Compares the requested items against the live products in Firestore.
 * Prices always come from the database, never from the browser.
 */
export function evaluateCart(items: Item[], snaps: DocumentSnapshot[]): PricedCart {
  const issues: string[] = [];
  const lines: PricedLine[] = [];

  items.forEach((item, i) => {
    const snap = snaps[i];
    if (!snap || !snap.exists) {
      issues.push('An item in your bag is no longer available.');
      return;
    }
    const p = mapProduct(snap.id, snap.data() ?? {});
    if (p.status !== 'active') {
      issues.push(`${p.name} is no longer available.`);
      return;
    }
    if (p.stock < item.quantity) {
      issues.push(p.stock > 0 ? `${p.name}: only ${p.stock} left in stock.` : `${p.name} is sold out.`);
      return;
    }
    lines.push({
      productId: p.id,
      slug: p.slug,
      name: p.name,
      sku: p.sku,
      currency: p.currency,
      image: p.images[0] ?? null,
      unitPrice: p.price,
      quantity: item.quantity,
      lineTotal: p.price * item.quantity,
      stock: p.stock,
    });
  });

  if (new Set(lines.map((l) => l.currency)).size > 1) {
    issues.push('Items in your bag use different currencies. Please check out separately.');
  }

  const currency = lines[0]?.currency ?? siteConfig.currency;
  const subtotal = lines.reduce((sum, l) => sum + l.lineTotal, 0);
  const shipping = lines.length > 0 ? siteConfig.checkout.shippingFee : 0;
  const tax = Math.round(subtotal * siteConfig.checkout.taxRate);

  return { lines, currency, subtotal, shipping, tax, total: subtotal + shipping + tax, issues };
}

export async function quoteCart(items: Item[]): Promise<PricedCart> {
  const db = adminDb();
  const refs = items.map((i) => db.collection('products').doc(i.productId));
  const snaps = refs.length > 0 ? await db.getAll(...refs) : [];
  return evaluateCart(items, snaps);
}

/**
 * Re-verifies prices and stock inside a transaction, decrements stock and writes the order.
 * Any change since the customer's last view causes the order to be refused, not silently altered.
 */
export async function placeOrder(
  items: Item[],
  customer: CustomerInput,
  userId: string | null,
): Promise<PlaceOrderResult> {
  const db = adminDb();

  return db.runTransaction(async (tx): Promise<PlaceOrderResult> => {
    const refs = items.map((i) => db.collection('products').doc(i.productId));
    const snaps = refs.length > 0 ? await tx.getAll(...refs) : [];
    const priced = evaluateCart(items, snaps);

    if (priced.issues.length > 0 || priced.lines.length === 0) {
      return { issues: priced.issues.length > 0 ? priced.issues : ['Your bag is empty.'] };
    }

    for (const line of priced.lines) {
      tx.update(db.collection('products').doc(line.productId), {
        stock: FieldValue.increment(-line.quantity),
        soldCount: FieldValue.increment(line.quantity),
        updatedAt: FieldValue.serverTimestamp(),
      });
    }

    const orderRef = db.collection('orders').doc();
    tx.set(orderRef, {
      status: 'awaiting_payment',
      paymentProvider: null,
      userId,
      customer,
      lines: priced.lines.map((l) => ({
        productId: l.productId,
        name: l.name,
        sku: l.sku,
        image: l.image,
        unitPrice: l.unitPrice,
        quantity: l.quantity,
        lineTotal: l.lineTotal,
      })),
      currency: priced.currency,
      subtotal: priced.subtotal,
      shipping: priced.shipping,
      tax: priced.tax,
      total: priced.total,
      createdAt: FieldValue.serverTimestamp(),
    });

    return { orderId: orderRef.id };
  });
}
