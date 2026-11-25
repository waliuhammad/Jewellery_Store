'use client';

import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { getClientAuth } from '@/lib/firebase/client';

export function LogoutButton({ className = '' }: { className?: string }) {
  const router = useRouter();

  const logout = async () => {
    await fetch('/api/auth/session', { method: 'DELETE' });
    const auth = getClientAuth();
    if (auth) await signOut(auth);
    router.replace('/');
    router.refresh();
  };

  return (
    <button type="button" onClick={logout} className={`text-sm underline-offset-4 hover:underline ${className}`}>
      Sign out
    </button>
  );
}
