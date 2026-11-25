import { siteConfig } from '@/config/site';
import { cloudinaryUrl } from '@/lib/cloudinary/url';
import { ButtonLink } from '@/components/ui/Button';
import { EditorialImage } from '@/components/ui/EditorialImage';
import { Reveal } from '@/components/ui/Reveal';
import type { AboutContent } from '@/lib/validations/content';

/**
 * Brand storytelling. The words come from Admin > Brand content (settings/about), so the
 * homepage never states history or claims the business has not written itself.
 */
export function BrandStory({ about }: { about: AboutContent }) {
  const { story } = siteConfig.editorial;
  const image = about.heroImage ? cloudinaryUrl(about.heroImage, { width: 1400 }) : story.imageUrl;
  const alt = about.heroImage?.alt || story.imageAlt;

  return (
    <section aria-labelledby="story-heading" className="relative overflow-hidden py-20 lg:py-32">
      <div className="mx-auto grid max-w-content items-center gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
        <Reveal className="relative lg:col-span-7">
          <EditorialImage src={image} alt={alt} className="aspect-[4/5] sm:aspect-[5/4] lg:aspect-[6/7]" />
          {/* Offset hairline frame */}
          <span aria-hidden className="pointer-events-none absolute -bottom-5 -right-5 hidden h-full w-full border border-antique/40 lg:block" />
        </Reveal>

        <Reveal delay={0.15} className="relative lg:col-span-5 lg:-ml-24">
          <div className="bg-ivory p-8 shadow-soft sm:p-12 lg:p-14">
            <p className="eyebrow">Our Story</p>
            <h2 id="story-heading" className="text-h2 mt-4">
              Made to Mean <span className="accent">More.</span>
            </h2>
            <p className="text-lead mt-6">{about.heroIntro}</p>
            <blockquote className="mt-8 border-l border-antique pl-5 font-heading text-xl italic leading-snug text-espresso">
              {siteConfig.tagline}
            </blockquote>
            <ButtonLink href="/about" variant="ghost" arrow className="mt-10">
              Discover Jewelora
            </ButtonLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
