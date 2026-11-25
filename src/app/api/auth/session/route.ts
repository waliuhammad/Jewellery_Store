import { NextResponse } from 'next/server';
import { z } from 'zod';
import { clearSession, createSession } from '@/lib/auth/session';
import { ensureUserProfile } from '@/lib/users';

export const dynamic = 'force-dynamic';

const body = z.object({ idToken: z.string().min(20).max(4096) });

/** Blocks cross-site form posts: an Origin header from another host is refused. */
function sameOrigin(req: Request): boolean {
  const origin = req.headers.get('origin');
  if (!origin) return true;
  try {
    return new URL(origin).host === req.headers.get('host');
  } catch {
    return false;
  }
}

export async function POST(req: Request) {
  if (!sameOrigin(req)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  if (!req.headers.get('content-type')?.includes('application/json')) {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 });
  }
  const parsed = body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Bad request' }, { status: 400 });

  try {
    const { uid, email } = await createSession(parsed.data.idToken);
    await ensureUserProfile(uid, email ?? null);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[session] could not create session', err);
    return NextResponse.json({ error: 'Could not start session' }, { status: 401 });
  }
}

export async function DELETE() {
  clearSession();
  return NextResponse.json({ ok: true });
}
