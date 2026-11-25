'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { ORDER_STATUS_LABEL, type OrderStatus } from '@/lib/orders/status';

export function OrderStatusControl({ orderId, allowed }: { orderId: string; allowed: OrderStatus[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const move = async (next: OrderStatus) => {
    if (next === 'cancelled' && !window.confirm('Cancel this order? Its items will go back into stock.')) return;
    setBusy(true);
    setError(null);
    const res = await fetch(`/api/admin/orders/${orderId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: next }),
    });
    const body = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) {
      setError(body.error ?? 'Could not update the order.');
      return;
    }
    router.refresh();
  };

  if (allowed.length === 0) return <p className="text-sm text-muted">No further changes are possible for this order.</p>;

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        {allowed.map((s) => (
          <Button key={s} type="button" variant={s === 'cancelled' ? 'ghost' : 'secondary'} disabled={busy} onClick={() => move(s)}>
            {s === 'cancelled' ? 'Cancel order' : `Mark as ${ORDER_STATUS_LABEL[s].toLowerCase()}`}
          </Button>
        ))}
      </div>
      {error && <p role="alert" className="mt-3 text-sm text-red-700">{error}</p>}
    </div>
  );
}
