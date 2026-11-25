import type { Product } from '@/types/catalog';
import { Stagger, StaggerItem } from '@/components/ui/Reveal';
import { ProductCard } from './ProductCard';

export function ProductGrid({ products, columns = 4 }: { products: Product[]; columns?: 3 | 4 }) {
  return (
    <Stagger className={`grid grid-cols-2 gap-x-4 gap-y-12 sm:gap-x-6 md:grid-cols-3 ${columns === 4 ? 'lg:grid-cols-4' : ''}`}>
      {products.map((p) => (
        <StaggerItem key={p.id}>
          <ProductCard product={p} />
        </StaggerItem>
      ))}
    </Stagger>
  );
}
