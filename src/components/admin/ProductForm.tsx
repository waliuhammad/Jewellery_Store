'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';
import { productSchema } from '@/lib/validations/product';
import { siteConfig } from '@/config/site';
import { Button } from '@/components/ui/Button';
import { ImageUploader } from './ImageUploader';

export type ProductFormValues = z.infer<typeof productSchema>;

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

const input = 'w-full rounded-button border border-rose-border bg-card px-3 py-2 text-sm focus:border-rose focus:outline-none';

function Field({ id, label, error, children }: { id: string; label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm">{label}</label>
      {children}
      {error && <p role="alert" className="mt-1 text-xs text-red-700">{error}</p>}
    </div>
  );
}

export function ProductForm({ productId, initial }: { productId?: string; initial?: ProductFormValues }) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: initial ?? {
      name: '',
      slug: '',
      description: '',
      categoryId: siteConfig.categories[0]?.slug ?? 'rings',
      price: 0,
      compareAtPrice: null,
      currency: 'PKR',
      sku: '',
      stock: 0,
      status: 'draft',
      featured: false,
      images: [],
    },
  });

  const onSubmit = async (values: ProductFormValues) => {
    setServerError(null);
    const res = await fetch(productId ? `/api/admin/products/${productId}` : '/api/admin/products', {
      method: productId ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setServerError(
        res.status === 409 ? 'That slug is already used by another product.'
          : res.status === 403 ? 'You do not have permission to do this.'
          : res.status === 401 ? 'Your session has expired. Please sign in again.'
          : data.error ?? 'Could not save. Please try again.',
      );
      return;
    }
    router.push('/admin/products');
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
      {serverError && <p role="alert" className="rounded-button bg-blush px-4 py-3 text-sm">{serverError}</p>}

      <Field id="name" label="Name" error={errors.name?.message}>
        <input
          id="name"
          className={input}
          {...register('name', {
            onBlur: (e) => {
              if (!productId && !getValues('slug')) setValue('slug', slugify(e.target.value));
            },
          })}
        />
      </Field>

      <Field id="slug" label="URL slug" error={errors.slug?.message}>
        <input id="slug" className={input} {...register('slug')} />
      </Field>

      <Field id="description" label="Description" error={errors.description?.message}>
        <textarea id="description" rows={5} className={input} {...register('description')} />
      </Field>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field id="categoryId" label="Category" error={errors.categoryId?.message}>
          <select id="categoryId" className={input} {...register('categoryId')}>
            {siteConfig.categories.map((c) => (
              <option key={c.slug} value={c.slug}>{c.name}</option>
            ))}
          </select>
        </Field>
        <Field id="material" label="Material (optional)" error={errors.material?.message}>
          <select id="material" className={input} {...register('material', { setValueAs: (v) => (v === '' ? null : v) })}>
            <option value="">Not set</option>
            {siteConfig.materials.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </Field>
        <Field id="status" label="Status" error={errors.status?.message}>
          <select id="status" className={input} {...register('status')}>
            <option value="draft">Draft (hidden from shoppers)</option>
            <option value="active">Active (visible)</option>
            <option value="archived">Archived</option>
          </select>
        </Field>
        <Field id="price" label="Price (PKR)" error={errors.price?.message}>
          <input id="price" type="number" inputMode="numeric" className={input} {...register('price', { valueAsNumber: true })} />
        </Field>
        <Field id="compareAtPrice" label="Compare-at price (optional)" error={errors.compareAtPrice?.message}>
          <input
            id="compareAtPrice"
            type="number"
            inputMode="numeric"
            className={input}
            {...register('compareAtPrice', { setValueAs: (v) => (v === '' || v === null ? null : Number(v)) })}
          />
        </Field>
        <Field id="sku" label="SKU" error={errors.sku?.message}>
          <input id="sku" className={input} {...register('sku')} />
        </Field>
        <Field id="stock" label="Stock" error={errors.stock?.message}>
          <input id="stock" type="number" inputMode="numeric" className={input} {...register('stock', { valueAsNumber: true })} />
        </Field>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" className="h-4 w-4 accent-espresso" {...register('featured')} />
        Feature on the homepage and bestsellers
      </label>

      <input type="hidden" {...register('currency')} />

      <div>
        <h2 className="mb-3 font-heading text-2xl">Images</h2>
        <Controller
          control={control}
          name="images"
          render={({ field }) => <ImageUploader value={field.value} onChange={field.onChange} />}
        />
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={isSubmitting}>{productId ? 'Save changes' : 'Create product'}</Button>
        <Button type="button" variant="ghost" onClick={() => router.push('/admin/products')}>Cancel</Button>
      </div>
    </form>
  );
}
