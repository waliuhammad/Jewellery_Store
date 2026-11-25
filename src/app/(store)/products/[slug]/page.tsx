import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { EmptyState } from '@/components/products/EmptyState';
import { ProductCard } from '@/components/products/ProductCard';
import { ProductDetail } from '@/components/products/ProductDetail';
import { getActiveProductBySlug, listActiveProducts } from '@/lib/catalog/repository';

export const dynamic = 'force-dynamic';

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { data } = await getActiveProductBySlug(params.slug);
  return { title: data?.name ?? 'Product' };
}

export default async function ProductPage({ params }: Props) {
  const { configured, data: product } = await getActiveProductBySlug(params.slug);

  if (!configured) {
    return (
      <Container className="py-12">
        <EmptyState title="Store not connected" body="This piece loads once the database is configured." />
      </Container>
    );
  }
  if (!product) notFound();

  const { data: related } = await listActiveProducts({ category: product.categoryId, sort: 'newest' });
  const others = related.filter((p) => p.id !== product.id).slice(0, 4);

  return (
    <>
      <Container className="pt-6">
        <nav aria-label="Breadcrumb" className="text-xs text-muted">
          <ol className="flex flex-wrap gap-2">
            <li><Link href="/shop" className="hover:text-ink">Shop</Link></li>
            <li aria-hidden>/</li>
            <li><Link href={`/categories/${product.categoryId}`} className="hover:text-ink capitalize">{product.categoryId}</Link></li>
            <li aria-hidden>/</li>
            <li aria-current="page" className="text-ink">{product.name}</li>
          </ol>
        </nav>
      </Container>

      <ProductDetail product={product} />

      {others.length > 0 && (
        <section aria-labelledby="related" className="mx-auto max-w-content px-4 py-16 sm:px-6 lg:px-8">
          <h2 id="related" className="font-heading text-3xl">You may also like</h2>
          <ul className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
            {others.map((p) => (
              <li key={p.id}><ProductCard product={p} /></li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}
