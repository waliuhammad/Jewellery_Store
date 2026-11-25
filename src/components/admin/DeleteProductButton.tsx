'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';

export function DeleteProductButton({ productId }: { productId: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const remove = async () => {
    if (!window.confirm('Delete this product permanently? Past orders keep their own record.')) return;
    setBusy(true);
    setError(null);
    const res = await fetch(`/api/admin/products/${productId}`, { method: 'DELETE' });
    setBusy(false);
    if (!res.ok) {
      setError(res.status === 403 ? 'Only admins can delete products.' : 'Could not delete the product.');
      return;
    }
    router.push('/admin/products');
    router.refresh();
  };

  return (
    <div>
      <Button type="button" variant="ghost" disabled={busy} onClick={remove}>Delete product</Button>
      {error && <p role="alert" className="mt-2 text-xs text-red-700">{error}</p>}
    </div>
  );
}
