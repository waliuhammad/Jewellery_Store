import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth/session';
import { getProfile } from '@/lib/account/profile';
import { AddressBook } from '@/components/account/AddressBook';

export const metadata: Metadata = { title: 'Addresses' };
export const dynamic = 'force-dynamic';

export default async function AddressesPage() {
  const user = await getSessionUser();
  if (!user) redirect('/login?next=/account/addresses');
  const profile = await getProfile(user.uid);

  return (
    <div>
      <h1 className="font-heading text-4xl">Addresses</h1>
      <div className="mt-8">
        <AddressBook addresses={profile.addresses} />
      </div>
    </div>
  );
}
