import type { Metadata } from 'next';
import { RegisterForm } from '@/components/auth/AuthForms';

export const metadata: Metadata = { title: 'Create account' };

export default function RegisterPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
      <h1 className="font-heading text-4xl">Create your account</h1>
      <div className="mt-8">
        <RegisterForm />
      </div>
    </div>
  );
}
