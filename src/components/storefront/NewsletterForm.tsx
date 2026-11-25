'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { newsletterSchema, type NewsletterInput } from '@/lib/validations/newsletter';
import { Button } from '@/components/ui/Button';

export function NewsletterForm() {
  const [notice, setNotice] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<NewsletterInput>({ resolver: zodResolver(newsletterSchema) });

  const onSubmit = async () => {
    // No subscription service is connected yet. Do not claim success.
    setNotice('Newsletter sign-up is not connected yet. Please check back soon.');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row">
      <div className="flex-1">
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
          type="email"
          autoComplete="email"
          placeholder="Email address"
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? 'newsletter-error' : notice ? 'newsletter-notice' : undefined}
          className="w-full rounded-button border border-rose-border bg-card px-4 py-3 text-sm focus:border-rose focus:outline-none"
          {...register('email')}
        />
        {errors.email && (
          <p id="newsletter-error" role="alert" className="mt-1 text-xs text-red-700">
            {errors.email.message}
          </p>
        )}
      </div>
      <Button type="submit" disabled={isSubmitting}>
        Subscribe
      </Button>
      {notice && (
        <p id="newsletter-notice" role="status" className="text-sm text-muted sm:basis-full">
          {notice}
        </p>
      )}
    </form>
  );
}
