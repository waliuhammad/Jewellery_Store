import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { Container } from '@/components/ui/Container';
import { ButtonLink } from '@/components/ui/Button';

export const metadata: Metadata = { title: 'Order received' };

export default function ConfirmationPage({ searchParams }: { searchParams: { order?: string } }) {
  // Keep only letters and digits so the URL cannot inject anything into the page.
  const reference = (searchParams.order ?? '').replace(/[^A-Za-z0-9]/g, '').slice(0, 40);
  // Reached without an order (typed URL, refresh after clearing params): there is nothing to confirm.
  if (!reference) redirect('/cart');

  return (
    <Container className="py-20 text-center">
      <h1 className="font-heading text-4xl">Thank you</h1>
      <p className="mt-4 text-muted">Your order has been received.</p>
      {reference && (
        <p className="mt-6 text-sm">
          Order reference: <span className="font-medium">{reference}</span>
        </p>
      )}
      <p className="mt-6 text-sm text-muted">
        Payment is not connected yet, so this order is awaiting payment.
      </p>
      <div className="mt-10 flex justify-center">
        <ButtonLink href="/shop">Continue shopping</ButtonLink>
      </div>
    </Container>
  );
}
