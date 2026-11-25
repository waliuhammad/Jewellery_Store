'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';

export function StockAdjuster({ productId, current }: { productId: string; current: number }) {
  const router = useRouter();
  const [stock, setStock] = useState(String(current));
  const [reason, setReason] = useState('');
  const [message, setMessage] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  const save = async () => {
    setMessage(null);
    const value = Number(stock);
    if (!Number.isInteger(value) || value < 0) {
      setMessage({ kind: 'error', text: 'Enter a whole number of 0 or more.' });
      return;
    }
    setBusy(true);
    const res = await fetch(`/api/admin/inventory/${productId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stock: value, reason }),
    });
    const body = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) {
      setMessage({ kind: 'error', text: body.error ?? 'Could not save the stock count.' });
      return;
    }
    setReason('');
    setMessage({ kind: 'ok', text: 'Saved.' });
    router.refresh();
  };

  const input = 'rounded-button border border-rose-border bg-card px-2 py-1 text-sm focus:border-rose focus:outline-none';

  return (
    <div className="flex flex-wrap items-center gap-2">
      <label className="sr-only" htmlFor={`stock-${productId}`}>New stock count</label>
      <input id={`stock-${productId}`} type="number" min={0} inputMode="numeric" value={stock} onChange={(e) => setStock(e.target.value)} className={`${input} w-24`} />
      <label className="sr-only" htmlFor={`reason-${productId}`}>Reason for change</label>
      <input id={`reason-${productId}`} placeholder="Reason, e.g. stock count" value={reason} onChange={(e) => setReason(e.target.value)} className={`${input} w-56`} />
      <Button type="button" variant="secondary" disabled={busy || reason.trim().length < 2} onClick={save}>Save</Button>
      {message && (
        <span role={message.kind === 'error' ? 'alert' : 'status'} className={`text-xs ${message.kind === 'error' ? 'text-red-700' : 'text-muted'}`}>
          {message.text}
        </span>
      )}
    </div>
  );
}
