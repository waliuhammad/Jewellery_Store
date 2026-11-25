import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { CheckoutView } from '@/components/checkout/CheckoutView';

export const metadata: Metadata = { title: 'Checkout' };

export default function CheckoutPage() {
  return (
    <Container className="py-12">
      <CheckoutView />
    </Container>
  );
}
