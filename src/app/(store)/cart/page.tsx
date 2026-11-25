import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { CartView } from '@/components/cart/CartView';

export const metadata: Metadata = { title: 'Shopping Bag' };

export default function CartPage() {
  return (
    <Container className="py-12">
      <CartView />
    </Container>
  );
}
