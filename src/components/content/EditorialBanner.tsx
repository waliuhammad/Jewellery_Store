import { cloudinaryUrl } from '@/lib/cloudinary/url';
import type { ProductImage } from '@/types/catalog';

/** Full-bleed editorial banner. The text sits over a gradient so it stays readable on any photo. */
export function EditorialBanner({
  image,
  eyebrow,
  title,
  body,
  heightClass = 'h-[60vh] min-h-[360px]',
  titleTag: Tag = 'h1',
}: {
  image: ProductImage | null;
  eyebrow?: string;
  title: string;
  body?: string;
  heightClass?: string;
  titleTag?: 'h1' | 'h2';
}) {
  return (
    <div className={`relative w-full overflow-hidden bg-blush ${heightClass}`}>
      {image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={cloudinaryUrl(image, { width: 2000, aspect: '16:9' })}
          alt={image.alt || ''}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/20 to-transparent" />
      <div className="relative z-10 flex h-full max-w-2xl flex-col justify-end px-6 pb-12 text-white sm:px-10 md:px-16">
        {eyebrow && <p className="text-xs uppercase tracking-[0.3em] text-white/80">{eyebrow}</p>}
        <Tag className="mt-3 font-heading text-4xl leading-tight md:text-6xl">{title}</Tag>
        {body && <p className="mt-4 max-w-md text-sm leading-relaxed text-white/90 md:text-base">{body}</p>}
      </div>
    </div>
  );
}
