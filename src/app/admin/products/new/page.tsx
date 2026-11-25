import { ProductForm } from '@/components/admin/ProductForm';

export const dynamic = 'force-dynamic';

export default function NewProductPage() {
  return (
    <div>
      <h1 className="font-heading text-4xl">New product</h1>
      <div className="mt-8 max-w-3xl">
        <ProductForm />
      </div>
    </div>
  );
}
