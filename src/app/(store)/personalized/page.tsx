import type { Metadata } from 'next';
import { siteConfig } from '@/config/site';
import { ButtonLink } from '@/components/ui/Button';
import { EditorialImage } from '@/components/ui/EditorialImage';
import { PageIntro } from '@/components/ui/PageIntro';
import { Reveal } from '@/components/ui/Reveal';
import { EngravingPreview } from '@/components/personalized/EngravingPreview';

export const metadata: Metadata = {
  title: 'Personalized Jewellery',
  description: 'Jewellery made yours with initials, dates and words that matter.',
};

export default function PersonalizedPage() {
  const { enabled, options } = siteConfig.personalization;
  const available = enabled && options.length > 0;
  const { personalized } = siteConfig.editorial;

  return (
    <>
      <PageIntro
        crumbs={[{ label: 'Personalized' }]}
        eyebrow="Personalized"
        title="Made Yours,"
        accent="Thoughtfully."
        lead="Initials, a date, a few words that matter: personal details turn a beautiful piece into your piece."
      />

      {available ? (
        <section aria-labelledby="preview-heading" className="mx-auto max-w-content px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <Reveal className="mb-12 max-w-xl">
            <p className="eyebrow">Preview</p>
            <h2 id="preview-heading" className="text-h2 mt-3">
              See It Before It&apos;s <span className="accent">Yours.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <EngravingPreview />
          </Reveal>
          <div className="mt-16 flex flex-wrap justify-center gap-4">
            <ButtonLink href="/shop" arrow>
              Shop Jewellery
            </ButtonLink>
            <ButtonLink href="/contact" variant="outline">
              Ask About Personalisation
            </ButtonLink>
          </div>
        </section>
      ) : (
        <section className="mx-auto grid max-w-content items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-12 lg:px-8 lg:py-24">
          <Reveal className="lg:col-span-6">
            <EditorialImage src={personalized.imageUrl} alt={personalized.imageAlt} className="aspect-[4/5]" />
          </Reveal>
          <Reveal delay={0.1} className="lg:col-span-5 lg:col-start-8">
            <h2 className="text-h2">
              Personalisation is <span className="accent">not yet available</span> to order online.
            </h2>
            <p className="text-lead mt-6">
              If you have a question about personalising a particular piece, send us a message and we will reply by email.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <ButtonLink href="/contact" arrow>
                Contact Us
              </ButtonLink>
              <ButtonLink href="/shop" variant="outline">
                Shop Jewellery
              </ButtonLink>
            </div>
          </Reveal>
        </section>
      )}
    </>
  );
}
