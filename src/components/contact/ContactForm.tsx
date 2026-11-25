'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contactSchema, ENQUIRY_TOPICS, type ContactInput } from '@/lib/validations/contact';
import { Button } from '@/components/ui/Button';

const input = 'mt-1 w-full rounded-button border border-rose-border bg-card px-4 py-3 text-sm focus:border-rose focus:outline-none';

export function ContactForm() {
  const [sent, setSent] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: '', email: '', phone: '', topic: 'General enquiry', message: '', website: '' },
  });

  const onSubmit = async (values: ContactInput) => {
    setServerError(null);
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setServerError(body.error ?? 'We could not send your message. Please try again.');
      return;
    }
    reset();
    setSent(true);
  };

  if (sent) {
    return (
      <div role="status" className="rounded-card border border-rose-border bg-card p-8">
        <p className="font-heading text-2xl">Thank you</p>
        <p className="mt-3 text-sm text-muted">Your message has been received. We will reply to the email address you gave.</p>
        <button type="button" onClick={() => setSent(false)} className="mt-6 text-sm underline underline-offset-4">Send another message</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      {serverError && <p role="alert" className="rounded-button bg-blush px-4 py-3 text-sm">{serverError}</p>}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="block text-sm">Name</label>
          <input id="name" autoComplete="name" className={input} {...register('name')} />
          {errors.name && <p role="alert" className="mt-1 text-xs text-red-700">{errors.name.message}</p>}
        </div>
        <div>
          <label htmlFor="email" className="block text-sm">Email</label>
          <input id="email" type="email" autoComplete="email" className={input} {...register('email')} />
          {errors.email && <p role="alert" className="mt-1 text-xs text-red-700">{errors.email.message}</p>}
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm">Phone (optional)</label>
          <input id="phone" type="tel" autoComplete="tel" className={input} {...register('phone')} />
        </div>
        <div>
          <label htmlFor="topic" className="block text-sm">Topic</label>
          <select id="topic" className={input} {...register('topic')}>
            {ENQUIRY_TOPICS.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="message" className="block text-sm">Message</label>
        <textarea id="message" rows={6} className={input} {...register('message')} />
        {errors.message && <p role="alert" className="mt-1 text-xs text-red-700">{errors.message.message}</p>}
      </div>

      {/* Hidden from people and screen readers. Bots often fill it in. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="website">Leave this field empty</label>
        <input id="website" tabIndex={-1} autoComplete="off" {...register('website')} />
      </div>

      <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Sending…' : 'Send message'}</Button>
    </form>
  );
}
