import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth/session';
import { AccountNav } from '@/components/account/AccountNav';
import { Container } from '@/components/ui/Container';

export const dynamic = 'force-dynamic';

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();
  if (!user) redirect('/login?next=/account');

  return (
    <Container className="py-12">
      <div className="grid gap-10 md:grid-cols-[200px_1fr]">
        <aside>
          <AccountNav />
        </aside>
        <div className="min-w-0">{children}</div>
      </div>
    </Container>
  );
}
