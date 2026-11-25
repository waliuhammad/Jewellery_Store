import { siteConfig } from '@/config/site';
import { ButtonLink } from '@/components/ui/Button';
import { EditorialImage } from '@/components/ui/EditorialImage';
import { Reveal, Stagger, StaggerItem } from '@/components/ui/Reveal';
import type { AboutContent } from '@/lib/validations/content';

/** Craftsmanship and quality, written by the business in Admin > Brand content. */
export function Craftsmanship({ about }: { about: AboutContent }) {
  const steps = about.craftsmanship.slice(0, 3);
  const { craft } = siteConfig.editorial;

  return (
    <section aria-labelledby="craft-heading" className="mx-auto max-w-content px-4 py-20 sm:px-6 lg:px-8 lg:py-32">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <Reveal>
            <p className="eyebrow">Craftsmanship</p>
            <h2 id="craft-heading" className="text-h2 mt-3">
              {about.craftsmanshipHeading}
            </h2>
            <p className="text-lead mt-6">{about.philosophyBody}</p>
          </Reveal>
          <Reveal delay={0.1} className="mt-10 hidden lg:block">
            <EditorialImage src={craft.imageUrl} alt={craft.imageAlt} className="aspect-[4/5] w-4/5" />
          </Reveal>
        </div>

        <div className="lg:col-span-7 lg:pt-24">
          <Stagger className="divide-y divide-line border-y border-line">
            {steps.map((s, i) => (
              <StaggerItem key={i} className="grid grid-cols-[3.5rem_1fr] gap-4 py-8 sm:grid-cols-[5rem_1fr] sm:py-10">
                <span className="font-heading text-4xl italic leading-none text-antique sm:text-5xl">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <h3 className="text-h3">{s.title}</h3>
                  <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-muted">{s.body}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
          <div className="mt-10 flex flex-wrap gap-4">
            <ButtonLink href="/about" variant="outline" arrow>
              Our Story
            </ButtonLink>
            <ButtonLink href="/jewellery-care" variant="ghost" arrow className="px-2">
              Jewellery Care
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
