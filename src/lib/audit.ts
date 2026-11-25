import 'server-only';
import { FieldValue } from 'firebase-admin/firestore';
import { adminDb } from '@/lib/firebase/admin';
import type { SessionUser } from '@/lib/auth/session';

/** Records admin actions. Pass only non-sensitive metadata: never passwords, tokens or full customer data. */
export async function writeAudit(
  actor: SessionUser,
  action: string,
  entity: string,
  meta: Record<string, string | number | boolean> = {},
): Promise<void> {
  await adminDb().collection('adminAuditLogs').add({
    actorUid: actor.uid,
    actorRole: actor.role,
    action,
    entity,
    meta,
    createdAt: FieldValue.serverTimestamp(),
  });
}
