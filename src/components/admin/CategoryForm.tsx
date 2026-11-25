'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { categorySchema, type CategoryInput } from '@/lib/validations/admin';
import { Button } from '@/components/ui/Button';

const input = 'w-full rounded-button border border-rose-border bg-card px-3 py-2 text-sm focus:border-rose focus:outline-none';

export function CategoryForm({ slug, initial }: { slug: string; initial: CategoryInput }) {
  const router = useRouter();
  const [message, setMessage] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<CategoryInput>({
    resolver: zodResolver(categorySchema),
    defaultValues: initial,
  });

  const onSubmit = async (values: CategoryInput) => {
    setMessage(null);
    const res = await fetch(`/api/admin/categories/${slug}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    });
    if (!res.ok) {
      setMessage({ kind: 'error', text: 'Could not save the category.' });
      return;
    }
    setMessage({ kind: 'ok', text: 'Category saved.' });
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="max-w-2xl space-y-6">
      <div>
        <label htmlFor="description" className="mb-1 block text-sm">Description</label>
        <textarea id="description" rows={4} className={input} {...register('description')} />
        {errors.description && <p role="alert" className="mt-1 text-xs text-red-700">{errors.description.message}</p>}
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="sortOrder" className="mb-1 block text-sm">Display order (lower shows first)</label>
          <input id="sortOrder" type="number" min={0} className={input} {...register('sortOrder', { valueAsNumber: true })} />
          {errors.sortOrder && <p role="alert" className="mt-1 text-xs text-red-700">{errors.sortOrder.message}</p>}
        </div>
        <label className="flex items-center gap-2 self-end text-sm">
          <input type="checkbox" className="h-4 w-4 accent-espresso" {...register('isActive')} />
          Show this category
        </label>
      </div>
      {message && <p role={message.kind === 'error' ? 'alert' : 'status'} className="text-sm">{message.text}</p>}
      <Button type="submit" disabled={isSubmitting}>Save category</Button>
    </form>
  );
}
