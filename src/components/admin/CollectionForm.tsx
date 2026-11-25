'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { collectionSchema, type CollectionInput } from '@/lib/validations/admin';
import { Button } from '@/components/ui/Button';
import { ImageUploader } from '@/components/admin/ImageUploader';

const input = 'w-full rounded-button border border-rose-border bg-card px-3 py-2 text-sm focus:border-rose focus:outline-none';

export function CollectionForm({
  collectionId,
  initial,
  products,
}: {
  collectionId?: string;
  initial: CollectionInput;
  products: { id: string; name: string; sku: string }[];
}) {
  const router = useRouter();
  const [message, setMessage] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null);
  const { register, handleSubmit, control, setValue, watch, formState: { errors, isSubmitting } } = useForm<CollectionInput>({
    resolver: zodResolver(collectionSchema),
    defaultValues: initial,
  });
  const kind = watch('kind');

  const onSubmit = async (values: CollectionInput) => {
    setMessage(null);
    const res = await fetch(collectionId ? `/api/admin/collections/${collectionId}` : '/api/admin/collections', {
      method: collectionId ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) {
      setMessage({ kind: 'error', text: body.error ?? 'Could not save the collection.' });
      return;
    }
    if (!collectionId) {
      router.push(`/admin/collections/${body.id}`);
      router.refresh();
      return;
    }
    setMessage({ kind: 'ok', text: 'Collection saved.' });
    router.refresh();
  };

  const remove = async () => {
    if (!collectionId || !window.confirm('Delete this collection? Its products stay in the shop.')) return;
    const res = await fetch(`/api/admin/collections/${collectionId}`, { method: 'DELETE' });
    if (!res.ok) {
      setMessage({ kind: 'error', text: 'Could not delete the collection.' });
      return;
    }
    router.push('/admin/collections');
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="max-w-3xl space-y-8">
      <section className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-1 block text-sm">Name</label>
          <input id="name" className={input} {...register('name', {
            onBlur: (e) => {
              if (!collectionId && !initial.slug) {
                setValue('slug', e.target.value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''));
              }
            },
          })} />
          {errors.name && <p role="alert" className="mt-1 text-xs text-red-700">{errors.name.message}</p>}
        </div>
        <div>
          <label htmlFor="slug" className="mb-1 block text-sm">URL slug</label>
          <input id="slug" className={input} {...register('slug')} />
          {errors.slug && <p role="alert" className="mt-1 text-xs text-red-700">{errors.slug.message}</p>}
        </div>
      </section>

      <section className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="kind" className="mb-1 block text-sm">Type</label>
          <select id="kind" className={input} {...register('kind')}>
            <option value="curated">Curated edit</option>
            <option value="seasonal">Seasonal</option>
          </select>
        </div>
        {kind === 'seasonal' && (
          <div>
            <label htmlFor="season" className="mb-1 block text-sm">Season label</label>
            <input id="season" placeholder="e.g. Autumn 2026" className={input} {...register('season')} />
          </div>
        )}
        <div className="sm:col-span-2">
          <label htmlFor="tagline" className="mb-1 block text-sm">Banner tagline</label>
          <input id="tagline" className={input} {...register('tagline')} />
          {errors.tagline && <p role="alert" className="mt-1 text-xs text-red-700">{errors.tagline.message}</p>}
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="description" className="mb-1 block text-sm">Description</label>
          <textarea id="description" rows={3} className={input} {...register('description')} />
        </div>
      </section>

      <section>
        <h2 className="mb-3 font-heading text-2xl">Banner image</h2>
        <Controller
          control={control}
          name="banner"
          render={({ field }) => (
            <ImageUploader
              value={field.value ? [field.value] : []}
              onChange={(imgs) => field.onChange(imgs[imgs.length - 1] ?? null)}
            />
          )}
        />
        {errors.banner && <p role="alert" className="mt-1 text-xs text-red-700">Check the banner image.</p>}
        <p className="mt-2 text-xs text-muted">Use a landscape photo. The last uploaded image is used as the banner.</p>
      </section>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" className="h-4 w-4 accent-espresso" {...register('isActive')} />
        Visible to shoppers
      </label>

      <fieldset>
        <legend className="mb-2 text-sm">Pieces in this collection</legend>
        {products.length === 0 ? (
          <p className="text-sm text-muted">No products yet. Create products first.</p>
        ) : (
          <ul className="grid max-h-80 gap-2 overflow-y-auto rounded-card border border-rose-border bg-card p-4 sm:grid-cols-2">
            {products.map((p) => (
              <li key={p.id}>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" value={p.id} className="h-4 w-4 accent-espresso" {...register('productIds')} />
                  <span>{p.name}</span>
                  {p.sku && <span className="text-xs text-muted">{p.sku}</span>}
                </label>
              </li>
            ))}
          </ul>
        )}
      </fieldset>

      {message && <p role={message.kind === 'error' ? 'alert' : 'status'} className="text-sm">{message.text}</p>}

      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={isSubmitting}>{collectionId ? 'Save changes' : 'Create collection'}</Button>
        {collectionId && <Button type="button" variant="ghost" onClick={remove}>Delete collection</Button>}
      </div>
    </form>
  );
}
