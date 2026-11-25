'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { getClientAuth } from '@/lib/firebase/client';
import { authErrorMessage, safeNext } from '@/lib/auth/messages';
import { Button } from '@/components/ui/Button';

const input =
  'w-full rounded-button border border-rose-border bg-card px-4 py-3 text-sm focus:border-rose focus:outline-none';

function Field({ id, label, error, children }: { id: string; label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm text-ink">{label}</label>
      {children}
      {error && <p role="alert" className="mt-1 text-xs text-red-700">{error}</p>}
    </div>
  );
}

const ErrorBanner = ({ message }: { message: string | null }) =>
  message ? <p role="alert" className="rounded-button bg-blush px-4 py-3 text-sm text-ink">{message}</p> : null;

/** Exchanges a Firebase ID token for our httpOnly session cookie. */
async function startSession(idToken: string): Promise<boolean> {
  const res = await fetch('/api/auth/session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken }),
  });
  return res.ok;
}

// ---------- Login ----------
const loginSchema = z.object({
  email: z.string().trim().email('Enter a valid email address.'),
  password: z.string().min(1, 'Enter your password.'),
});
type LoginValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [serverError, setServerError] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (v: LoginValues) => {
    setServerError(null);
    const auth = getClientAuth();
    if (!auth) return setServerError('Accounts are not available yet.');
    try {
      const cred = await signInWithEmailAndPassword(auth, v.email, v.password);
      const ok = await startSession(await cred.user.getIdToken());
      if (!ok) return setServerError('Could not start your session. Please try again.');
      router.replace(safeNext(params.get('next')));
      router.refresh();
    } catch (err) {
      setServerError(authErrorMessage(err));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <ErrorBanner message={serverError} />
      <Field id="email" label="Email" error={errors.email?.message}>
        <input id="email" type="email" autoComplete="email" className={input} {...register('email')} />
      </Field>
      <Field id="password" label="Password" error={errors.password?.message}>
        <input id="password" type="password" autoComplete="current-password" className={input} {...register('password')} />
      </Field>
      <Button type="submit" disabled={isSubmitting} className="w-full">Sign in</Button>
      <div className="flex justify-between text-sm">
        <Link href="/forgot-password" className="underline-offset-4 hover:underline">Forgot password?</Link>
        <Link href="/register" className="underline-offset-4 hover:underline">Create account</Link>
      </div>
    </form>
  );
}

// ---------- Register ----------
const registerSchema = z
  .object({
    name: z.string().trim().min(2, 'Enter your name.').max(80),
    email: z.string().trim().email('Enter a valid email address.'),
    password: z.string().min(8, 'Use at least 8 characters.').max(128),
    confirm: z.string(),
  })
  .refine((d) => d.password === d.confirm, { message: 'Passwords do not match.', path: ['confirm'] });
type RegisterValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (v: RegisterValues) => {
    setServerError(null);
    const auth = getClientAuth();
    if (!auth) return setServerError('Accounts are not available yet.');
    try {
      const cred = await createUserWithEmailAndPassword(auth, v.email, v.password);
      await updateProfile(cred.user, { displayName: v.name });
      const ok = await startSession(await cred.user.getIdToken());
      if (!ok) return setServerError('Account created, but the session could not start. Please sign in.');
      router.replace('/account');
      router.refresh();
    } catch (err) {
      setServerError(authErrorMessage(err));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <ErrorBanner message={serverError} />
      <Field id="name" label="Full name" error={errors.name?.message}>
        <input id="name" autoComplete="name" className={input} {...register('name')} />
      </Field>
      <Field id="email" label="Email" error={errors.email?.message}>
        <input id="email" type="email" autoComplete="email" className={input} {...register('email')} />
      </Field>
      <Field id="password" label="Password" error={errors.password?.message}>
        <input id="password" type="password" autoComplete="new-password" className={input} {...register('password')} />
      </Field>
      <Field id="confirm" label="Confirm password" error={errors.confirm?.message}>
        <input id="confirm" type="password" autoComplete="new-password" className={input} {...register('confirm')} />
      </Field>
      <Button type="submit" disabled={isSubmitting} className="w-full">Create account</Button>
      <p className="text-center text-sm">
        Already have an account? <Link href="/login" className="underline-offset-4 hover:underline">Sign in</Link>
      </p>
    </form>
  );
}

// ---------- Forgot password ----------
const forgotSchema = z.object({ email: z.string().trim().email('Enter a valid email address.') });
type ForgotValues = z.infer<typeof forgotSchema>;

export function ForgotPasswordForm() {
  const [done, setDone] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ForgotValues>({
    resolver: zodResolver(forgotSchema),
  });

  const onSubmit = async (v: ForgotValues) => {
    setServerError(null);
    const auth = getClientAuth();
    if (!auth) return setServerError('Accounts are not available yet.');
    try {
      await sendPasswordResetEmail(auth, v.email);
    } catch (err) {
      // Only network problems are shown. Other outcomes get the same message to avoid revealing which emails exist.
      if ((err as { code?: string })?.code === 'auth/network-request-failed') {
        return setServerError(authErrorMessage(err));
      }
    }
    setDone(true);
  };

  if (done) {
    return (
      <p role="status" className="rounded-button bg-blush px-4 py-3 text-sm">
        If an account exists for that email, we have sent password reset instructions.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <ErrorBanner message={serverError} />
      <Field id="email" label="Email" error={errors.email?.message}>
        <input id="email" type="email" autoComplete="email" className={input} {...register('email')} />
      </Field>
      <Button type="submit" disabled={isSubmitting} className="w-full">Send reset link</Button>
    </form>
  );
}
