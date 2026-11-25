import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth/session';
import { getProfile } from '@/lib/account/profile';
import { ProfileForm } from '@/components/account/ProfileForm';

export const metadata: Metadata = { title: 'Profile' };
export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
  const user = await getSessionUser();
  if (!user) redirect('/login?next=/account/profile');
  const profile = await getProfile(user.uid);

  return (
    <div>
      <h1 className="font-heading text-4xl">Profile</h1>
      <div className="mt-8">
        <ProfileForm email={profile.email} initialName={profile.name} initialPhone={profile.phone} />
      </div>
    </div>
  );
}
