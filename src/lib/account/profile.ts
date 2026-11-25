import 'server-only';
import { randomUUID } from 'crypto';
import { FieldValue } from 'firebase-admin/firestore';
import { adminDb } from '@/lib/firebase/admin';
import type { AddressInput, ProfileInput } from '@/lib/validations/account';

export const MAX_ADDRESSES = 5;

export type SavedAddress = AddressInput & { id: string };
export type Profile = { email: string | null; name: string; phone: string; addresses: SavedAddress[] };
type Result = { ok: true } | { ok: false; error: string };

/** Reads only the signed-in customer's own profile document. */
export async function getProfile(uid: string): Promise<Profile> {
  const snap = await adminDb().collection('users').doc(uid).get();
  const d = snap.data() ?? {};
  return {
    email: typeof d.email === 'string' ? d.email : null,
    name: typeof d.name === 'string' ? d.name : '',
    phone: typeof d.phone === 'string' ? d.phone : '',
    addresses: Array.isArray(d.addresses) ? (d.addresses as SavedAddress[]) : [],
  };
}

export async function updateProfile(uid: string, data: ProfileInput): Promise<void> {
  await adminDb()
    .collection('users')
    .doc(uid)
    .set({ name: data.name, phone: data.phone, updatedAt: FieldValue.serverTimestamp() }, { merge: true });
}

export async function addAddress(uid: string, input: AddressInput): Promise<Result> {
  const db = adminDb();
  const ref = db.collection('users').doc(uid);
  return db.runTransaction(async (tx): Promise<Result> => {
    const snap = await tx.get(ref);
    const list = (snap.data()?.addresses ?? []) as SavedAddress[];
    if (list.length >= MAX_ADDRESSES) {
      return { ok: false, error: `You can save up to ${MAX_ADDRESSES} addresses.` };
    }
    tx.set(
      ref,
      { addresses: [...list, { ...input, id: randomUUID() }], updatedAt: FieldValue.serverTimestamp() },
      { merge: true },
    );
    return { ok: true };
  });
}

export async function removeAddress(uid: string, addressId: string): Promise<Result> {
  const db = adminDb();
  const ref = db.collection('users').doc(uid);
  return db.runTransaction(async (tx): Promise<Result> => {
    const snap = await tx.get(ref);
    const list = (snap.data()?.addresses ?? []) as SavedAddress[];
    const next = list.filter((a) => a.id !== addressId);
    if (next.length === list.length) return { ok: false, error: 'Address not found.' };
    tx.update(ref, { addresses: next, updatedAt: FieldValue.serverTimestamp() });
    return { ok: true };
  });
}
