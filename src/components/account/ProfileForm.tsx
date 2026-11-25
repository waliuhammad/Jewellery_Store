'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { profileSchema, type ProfileInput } from '@/lib/validations/account';
import { Button } from '@/components/ui/Button';

const input = 'mt-1 w-full rounded-button border border-rose-border bg-card px-4 py-3 text-sm focus:border-rose focus:outline-none';

export function ProfileForm({ email, initialName, initialPhone }: { email: string | null; initialName: string; initialPhone: string }) {
  const router = useRouter();
  const [message, setMessage] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: initialName, phone: initialPhone },
  });

  const onSubmit = async (values: ProfileInput) => {
    setMessage(null);
    const res = await fetch('/api/account/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    });
    if (!res.ok) {
      setMessage({ kind: 'error', text: 'Could not save your details. Please try again.' });
      return;
    }
    setMessage({ kind: 'ok', text: 'Your details have been saved.' });
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="max-w-lg space-y-5">
      <div>
        <p className="text-sm">Email</p>
        <p className="mt-1 text-sm text-muted">{email ?? 'Not available'}</p>
        <p className="mt-1 text-xs text-muted">To change your email or password, contact us or use the password reset link.</p>
      </div>

      <div>
        <label htmlFor="name" className="block text-sm">Full name</label>
        <input id="name" autoComplete="name" className={input} {...register('name')} />
        {errors.name && <p role="alert" className="mt-1 text-xs text-red-700">{errors.name.message}</p>}
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm">Phone (optional)</label>
        <input id="phone" type="tel" autoComplete="tel" className={input} {...register('phone')} />
        {errors.phone && <p role="alert" className="mt-1 text-xs text-red-700">{errors.phone.message}</p>}
      </div>

      {message && (
        <p role={message.kind === 'error' ? 'alert' : 'status'} className="text-sm">{message.text}</p>
      )}

      <Button type="submit" disabled={isSubmitting}>Save changes</Button>
    </form>
  );
}
