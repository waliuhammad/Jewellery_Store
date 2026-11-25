import { getAboutContent } from '@/lib/content/about';
import { AboutForm } from '@/components/admin/AboutForm';

export const dynamic = 'force-dynamic';

export default async function BrandContentPage() {
  const content = await getAboutContent();
  return (
    <div>
      <h1 className="font-heading text-4xl">Brand content</h1>
      <p className="mt-3 max-w-2xl text-sm text-muted">
        Edits here update the About page. Bracketed text is a placeholder that still needs your own wording.
      </p>
      <div className="mt-8">
        <AboutForm initial={content} />
      </div>
    </div>
  );
}
