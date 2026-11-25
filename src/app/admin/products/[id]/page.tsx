import { notFound } from 'next/navigation';
import { adminDb } from '@/lib/firebase/admin';
import { getSessionUser } from '@/lib/auth/session';
import { mapProduct } from '@/lib/catalog/repository';
import { ProductForm, type ProductFormValues } from '@/components/admin/ProductForm';
import { DeleteProductButton } from '@/components/admin/DeleteProductButton';

export const dynamic = 'force-dynamic';

const ID = /^[A-Za-z0-9_-]{1,128}$/;

export default async function EditProductPage({ params }: { params: { id: string } }) {
  if (!ID.test(params.id)) notFound();
  const snap = await adminDb().collection('products').doc(params.id).get();
  if (!snap.exists) notFound();
  const user = await getSessionUser();

  const { id, createdAt: _createdAt, ...rest } = mapProduct(snap.id, snap.data()!);
  // Form schema is stricter than the stored type. Cast only after the form re-validates on save.
  const initial = rest as unknown as ProductFormValues;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-heading text-4xl">Edit product</h1>
        {user?.role === 'admin' && <DeleteProductButton productId={id} />}
      </div>
      <div className="mt-8 max-w-3xl">
        <ProductForm productId={id} initial={initial} />
      </div>
    </div>
  );
}
