'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight } from 'lucide-react';
import { newsletterSchema, type NewsletterInput } from '@/lib/validations/newsletter';

/** Compact newsletter field for the dark footer. */
export function FooterNewsletter() {
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
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-6">
      <label htmlFor="footer-email" className="sr-only">
        Email address
      </label>
      <div className="flex border-b border-ivory/40 focus-within:border-gold">
        <input
          id="footer-email"
          type="email"
          autoComplete="email"
          placeholder="Your email address"
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? 'footer-email-error' : notice ? 'footer-email-notice' : undefined}
          className="w-full bg-transparent py-3 text-sm text-ivory placeholder:text-ivory/50 focus:outline-none"
          {...register('email')}
        />
        <button type="submit" disabled={isSubmitting} aria-label="Subscribe" className="group px-2 text-ivory">
          <ArrowRight size={18} aria-hidden className="transition-transform duration-300 group-hover:translate-x-1" />
        </button>
      </div>
      {errors.email && (
        <p id="footer-email-error" role="alert" className="mt-2 text-xs text-[#f3c9bd]">
          {errors.email.message}
        </p>
      )}
      {notice && (
        <p id="footer-email-notice" role="status" className="mt-2 text-xs text-ivory/70">
          {notice}
        </p>
      )}
    </form>
  );
}
