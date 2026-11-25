import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { WishlistView } from '@/components/wishlist/WishlistView';

export const metadata: Metadata = { title: 'Wishlist' };

export default function WishlistPage() {
  return (
    <Container className="py-12">
      <h1 className="font-heading text-4xl sm:text-5xl">Wishlist</h1>
      <p className="mt-3 text-sm text-muted">Pieces you have saved on this device.</p>
      <div className="mt-10">
        <WishlistView />
      </div>
    </Container>
  );
}
