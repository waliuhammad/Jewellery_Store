import { DiamondMark } from '@/components/layout/Logo';

/**
 * Editorial photograph with a slow hover zoom. With no image configured it renders a quiet
 * champagne panel with the diamond mark, so layouts hold without stock or borrowed photography.
 */
export function EditorialImage({
  src,
  alt,
  className = '',
  position = 'center',
  priority = false,
  zoom = true,
}: {
  src?: string | null;
  alt: string;
  className?: string;
  position?: string;
  priority?: boolean;
  zoom?: boolean;
}) {
  return (
    <div className={`group/img relative overflow-hidden bg-champagne ${className}`}>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          style={{ objectPosition: position }}
          className={`absolute inset-0 h-full w-full object-cover ${
            zoom ? 'transition-transform duration-[1.6s] ease-luxe group-hover/img:scale-[1.04] motion-reduce:transition-none' : ''
          }`}
        />
      ) : (
        <div aria-hidden className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(ellipse_at_30%_20%,#f6f0e8_0%,#e9ded1_70%)]">
          <DiamondMark className="h-16 w-20 text-antique/40" />
        </div>
      )}
    </div>
  );
}
