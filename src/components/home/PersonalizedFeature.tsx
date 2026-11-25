import { siteConfig } from '@/config/site';
import { ButtonLink } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import { EngravingPreview } from '@/components/personalized/EngravingPreview';

/** Homepage personalisation feature. Hidden until personalisation is switched on in the site config. */
export function PersonalizedFeature() {
  const { enabled, options } = siteConfig.personalization;
  if (!enabled || options.length === 0) return null;

  return (
    <section aria-labelledby="personalized-heading" className="bg-champagne/50 py-20 lg:py-28">
      <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto mb-12 max-w-2xl text-center">
          <p className="eyebrow">Personalized</p>
          <h2 id="personalized-heading" className="text-h2 mt-3">
            Made Yours, <span className="accent">Letter by Letter.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <EngravingPreview compact />
        </Reveal>
        <div className="mt-12 flex justify-center">
          <ButtonLink href="/personalized" arrow>
            Explore Personalized
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
