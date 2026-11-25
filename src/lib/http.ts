import 'server-only';
import { NextResponse } from 'next/server';
import { AuthError, requireRole, type Role, type SessionUser } from '@/lib/auth/session';

type Ctx = { params: Record<string, string> };

/** Wraps a route handler with a role check. Errors never leak internals to the client. */
export function withAuth(
  roles: Role[],
  handler: (req: Request, user: SessionUser, ctx: Ctx) => Promise<Response>,
) {
  return async (req: Request, ctx: Ctx) => {
    try {
      const user = await requireRole(roles);
      return await handler(req, user, ctx);
    } catch (err) {
      if (err instanceof AuthError) {
        return NextResponse.json({ error: err.message }, { status: err.status });
      }
      console.error('[api] unhandled error', err);
      return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
  };
}
