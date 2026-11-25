'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { addressSchema, type AddressInput } from '@/lib/validations/account';
import { Button } from '@/components/ui/Button';
import type { SavedAddress } from '@/lib/account/profile';

const input = 'mt-1 w-full rounded-button border border-rose-border bg-card px-4 py-3 text-sm focus:border-rose focus:outline-none';

const fields: { name: keyof AddressInput; label: string; autoComplete?: string; wide?: boolean }[] = [
  { name: 'label', label: 'Label (for example, Home or Office)', wide: true },
  { name: 'fullName', label: 'Full name', autoComplete: 'name', wide: true },
  { name: 'phone', label: 'Phone', autoComplete: 'tel' },
  { name: 'address1', label: 'Address', autoComplete: 'address-line1', wide: true },
  { name: 'address2', label: 'Apartment, suite, etc. (optional)', autoComplete: 'address-line2', wide: true },
  { name: 'city', label: 'City', autoComplete: 'address-level2' },
  { name: 'postalCode', label: 'Postal code (optional)', autoComplete: 'postal-code' },
  { name: 'country', label: 'Country', autoComplete: 'country-name', wide: true },
];

const EMPTY: AddressInput = {
  label: '', fullName: '', phone: '', address1: '', address2: '', city: '', postalCode: '', country: '',
};

export function AddressBook({ addresses }: { addresses: SavedAddress[] }) {
  const router = useRouter();
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<AddressInput>({
    resolver: zodResolver(addressSchema),
    defaultValues: EMPTY,
  });

  const onAdd = async (values: AddressInput) => {
    setError(null);
    const res = await fetch('/api/account/addresses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(body.error ?? 'Could not save the address. Please try again.');
      return;
    }
    reset(EMPTY);
    setAdding(false);
    router.refresh();
  };

  const onRemove = async (id: string) => {
    if (!window.confirm('Remove this address?')) return;
    setError(null);
    const res = await fetch(`/api/account/addresses/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      setError('Could not remove the address. Please try again.');
      return;
    }
    router.refresh();
  };

  return (
    <div className="space-y-8">
      {error && <p role="alert" className="rounded-button bg-blush px-4 py-3 text-sm">{error}</p>}

      {addresses.length === 0 && !adding && (
        <p className="text-sm text-muted">You have no saved addresses yet.</p>
      )}

      <ul className="grid gap-4 md:grid-cols-2">
        {addresses.map((a) => (
          <li key={a.id} className="rounded-card border border-rose-border bg-card p-5 text-sm">
            <p className="font-medium">{a.label}</p>
            <p className="mt-2 text-muted">
              {a.fullName}<br />
              {a.address1}{a.address2 ? `, ${a.address2}` : ''}<br />
              {a.city}{a.postalCode ? ` ${a.postalCode}` : ''}<br />
              {a.country}<br />
              {a.phone}
            </p>
            <button
              type="button"
              onClick={() => onRemove(a.id)}
              className="mt-4 text-muted underline underline-offset-4 hover:text-ink"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>

      {adding ? (
        <form onSubmit={handleSubmit(onAdd)} noValidate className="max-w-2xl space-y-5 rounded-card border border-rose-border p-6">
          <h2 className="font-heading text-2xl">New address</h2>
          <div className="grid gap-5 sm:grid-cols-2">
            {fields.map((f) => {
              const id = `addr-${f.name}`;
              const err = errors[f.name]?.message;
              return (
                <div key={f.name} className={f.wide ? 'sm:col-span-2' : ''}>
                  <label htmlFor={id} className="block text-sm">{f.label}</label>
                  <input id={id} autoComplete={f.autoComplete} className={input} {...register(f.name)} />
                  {err && <p role="alert" className="mt-1 text-xs text-red-700">{err}</p>}
                </div>
              );
            })}
          </div>
          <div className="flex gap-3">
            <Button type="submit" disabled={isSubmitting}>Save address</Button>
            <Button type="button" variant="ghost" onClick={() => { reset(EMPTY); setAdding(false); }}>Cancel</Button>
          </div>
        </form>
      ) : (
        <Button type="button" variant="secondary" onClick={() => setAdding(true)}>Add an address</Button>
      )}
    </div>
  );
}
