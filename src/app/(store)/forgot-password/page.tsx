import type { Metadata } from 'next';
import { ForgotPasswordForm } from '@/components/auth/AuthForms';

export const metadata: Metadata = { title: 'Reset password' };

export default function ForgotPasswordPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
      <h1 className="font-heading text-4xl">Reset your password</h1>
      <p className="mt-3 text-sm text-muted">Enter your email and we will send you a link to choose a new password.</p>
      <div className="mt-8">
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
