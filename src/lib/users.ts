import 'server-only';
import { FieldValue } from 'firebase-admin/firestore';
import { adminDb } from '@/lib/firebase/admin';

/** Creates users/{uid} on first sign-in. Never writes a role here: roles live only in custom claims. */
export async function ensureUserProfile(uid: string, email: string | null): Promise<void> {
  const db = adminDb();
  const ref = db.collection('users').doc(uid);
  await db.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    if (snap.exists) return;
    tx.set(ref, {
      uid,
      email,
      name: '',
      phone: '',
      addresses: [],
      accountStatus: 'active',
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
  });
}
