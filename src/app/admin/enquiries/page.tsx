import { adminDb, isAdminConfigured } from '@/lib/firebase/admin';
import { EmptyState } from '@/components/products/EmptyState';

export const dynamic = 'force-dynamic';

function formatDate(ms: number): string {
  return ms ? new Date(ms).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' }) : '—';
}

export default async function EnquiriesPage() {
  if (!isAdminConfigured()) {
    return <EmptyState title="Database not connected" body="Set the Firebase Admin environment variables first." />;
  }
  const snap = await adminDb().collection('enquiries').orderBy('createdAt', 'desc').limit(100).get();
  const items = snap.docs.map((d) => {
    const x = d.data();
    const ts = x.createdAt && typeof x.createdAt.toMillis === 'function' ? x.createdAt.toMillis() : 0;
    return {
      id: d.id,
      name: String(x.name ?? ''),
      email: String(x.email ?? ''),
      phone: String(x.phone ?? ''),
      topic: String(x.topic ?? ''),
      message: String(x.message ?? ''),
      createdAtMs: ts,
    };
  });

  return (
    <div>
      <h1 className="font-heading text-4xl">Enquiries</h1>
      <p className="mt-3 text-sm text-muted">The 100 most recent messages from the contact form, newest first.</p>

      {items.length === 0 ? (
        <div className="mt-8"><EmptyState title="No enquiries yet" body="Messages sent from the Contact page appear here." /></div>
      ) : (
        <ul className="mt-8 space-y-4">
          {items.map((e) => (
            <li key={e.id} className="rounded-card border border-rose-border bg-card p-6">
              <div className="flex flex-wrap justify-between gap-2 text-sm">
                <p className="font-medium">{e.name} <span className="font-normal text-muted">· {e.topic}</span></p>
                <p className="text-xs text-muted">{formatDate(e.createdAtMs)}</p>
              </div>
              <p className="mt-2 text-sm">
                <a href={`mailto:${e.email}`} className="underline underline-offset-4">{e.email}</a>
                {e.phone && <span className="text-muted"> · {e.phone}</span>}
              </p>
              <p className="mt-3 whitespace-pre-line text-sm leading-relaxed">{e.message}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
