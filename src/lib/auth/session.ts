import 'server-only';
import { cookies } from 'next/headers';
import { adminAuth } from '@/lib/firebase/admin';

export const SESSION_COOKIE = '__session';
const SESSION_MS = 5 * 24 * 60 * 60 * 1000;
const RECENT_SIGN_IN_SECONDS = 5 * 60;

export type Role = 'customer' | 'manager' | 'admin';
export type SessionUser = { uid: string; email?: string; role: Role };
const ROLES: Role[] = ['customer', 'manager', 'admin'];

export class AuthError extends Error {
  constructor(public readonly status: 401 | 403) {
    super(status === 401 ? 'Unauthorized' : 'Forbidden');
  }
}

/** Exchanges a freshly issued Firebase ID token for an httpOnly session cookie. */
export async function createSession(idToken: string): Promise<{ uid: string; email?: string }> {
  const auth = adminAuth();
  const decoded = await auth.verifyIdToken(idToken, true);
  if (Date.now() / 1000 - decoded.auth_time > RECENT_SIGN_IN_SECONDS) {
    throw new Error('Recent sign-in required');
  }
  const cookie = await auth.createSessionCookie(idToken, { expiresIn: SESSION_MS });
  cookies().set(SESSION_COOKIE, cookie, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MS / 1000,
  });
  return { uid: decoded.uid, email: decoded.email };
}

export function clearSession(): void {
  cookies().delete(SESSION_COOKIE);
}

/** Verifies the session cookie server-side, including revocation. Returns null when signed out or invalid. */
export async function getSessionUser(): Promise<SessionUser | null> {
  const value = cookies().get(SESSION_COOKIE)?.value;
  if (!value) return null;
  try {
    const decoded = await adminAuth().verifySessionCookie(value, true);
    const claim = decoded.role as Role | undefined;
    return {
      uid: decoded.uid,
      email: decoded.email,
      role: claim && ROLES.includes(claim) ? claim : 'customer',
    };
  } catch {
    return null;
  }
}

/** Use in every privileged route handler and server action. A hidden page is not a security control. */
export async function requireRole(allowed: Role[]): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) throw new AuthError(401);
  if (!allowed.includes(user.role)) throw new AuthError(403);
  return user;
}
