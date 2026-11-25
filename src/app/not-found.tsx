import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { DiamondMark } from '@/components/layout/Logo';
import { ButtonLink } from '@/components/ui/Button';
import { CartProvider } from '@/lib/cart/CartContext';

export const metadata = { title: 'Page not found' };

/** Branded 404, used for unknown URLs and for notFound() calls (missing products, collections, categories). */
export default function NotFound() {
  return (
    <CartProvider>
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main id="main" className="flex flex-1 items-center justify-center px-4 py-24 text-center">
          <div className="max-w-lg">
            <DiamondMark className="mx-auto h-6 w-8 text-antique" />
            <p className="eyebrow mt-8">Error 404</p>
            <h1 className="text-h1 mt-4">
              This Page Has <span className="accent">Slipped Away.</span>
            </h1>
            <p className="text-lead mt-5">The page you were looking for has moved or no longer exists.</p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <ButtonLink href="/shop" arrow>
                Explore Collection
              </ButtonLink>
              <ButtonLink href="/" variant="outline">
                Back to Home
              </ButtonLink>
            </div>
          </div>
        </main>
        <SiteFooter />
      </div>
    </CartProvider>
  );
}
