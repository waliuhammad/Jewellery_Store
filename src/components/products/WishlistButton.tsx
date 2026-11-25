'use client';

import { useEffect, useState } from 'react';

const STORAGE_KEY = 'wishlist:v1';

function readList(): string[] {
  try {
    const raw: unknown = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '[]');
    return Array.isArray(raw) ? raw.filter((x): x is string => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

export function WishlistButton({
  productId,
  name,
  iconOnly = false,
}: {
  productId: string;
  name: string;
  iconOnly?: boolean;
}) {
  const [saved, setSaved] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setSaved(readList().includes(productId));
    setReady(true);
  }, [productId]);

  const toggle = () => {
    const list = readList();
    const next = saved ? list.filter((id) => id !== productId) : [...list, productId];
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Storage blocked: the heart still toggles for this visit.
    }
    setSaved(!saved);
  };

  const label = saved ? `Remove ${name} from wishlist` : `Add ${name} to wishlist`;
  const icon = (
    <svg viewBox="0 0 24 24" width="18" height="18" fill={saved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />
    </svg>
  );

  if (iconOnly) {
    return (
      <button
        type="button"
        onClick={toggle}
        disabled={!ready}
        aria-pressed={saved}
        aria-label={label}
        title={label}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-card/90 text-ink shadow-sm transition hover:text-rose disabled:opacity-50"
      >
        {icon}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={!ready}
      aria-pressed={saved}
      aria-label={label}
      className="flex items-center gap-2 rounded-button border border-rose-border px-4 py-3 text-sm transition hover:border-rose disabled:opacity-50"
    >
      {icon}
      {saved ? 'Saved to wishlist' : 'Add to wishlist'}
    </button>
  );
}
