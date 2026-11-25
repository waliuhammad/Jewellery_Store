import type { Metadata } from 'next';
import { ButtonLink } from '@/components/ui/Button';
import { EditorialImage } from '@/components/ui/EditorialImage';
import { Breadcrumbs } from '@/components/ui/PageIntro';
import { Reveal, Stagger, StaggerItem } from '@/components/ui/Reveal';
import { getAboutContent } from '@/lib/content/about';
import { cloudinaryUrl } from '@/lib/cloudinary/url';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = { title: 'Our Story', description: `The story behind ${siteConfig.brandName}. ${siteConfig.tagline}` };
export const dynamic = 'force-dynamic';

export default async function AboutPage() {
  const c = await getAboutContent();
  const heroImage = c.heroImage ? cloudinaryUrl(c.heroImage, { width: 1600 }) : siteConfig.editorial.story.imageUrl;
  const [lead, ...rest] = c.story;

  return (
    <div>
      {/* Opening: title column beside a tall editorial image */}
      <section aria-labelledby="about-heading" className="bg-[linear-gradient(180deg,#efe6da_0%,#f6f0e8_100%)]">
        <div className="mx-auto grid max-w-content gap-10 px-4 pb-16 pt-8 sm:px-6 lg:grid-cols-12 lg:px-8 lg:pb-24">
          <div className="lg:col-span-5 lg:flex lg:flex-col lg:justify-between">
            <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Our Story' }]} />
            <Reveal className="mt-12 lg:mb-12">
              <p className="eyebrow">Our Story</p>
              <h1 id="about-heading" className="text-display mt-4 text-espresso">
                {c.heroTitle}
              </h1>
              {c.heroIntro && <p className="text-lead mt-6 max-w-md">{c.heroIntro}</p>}
            </Reveal>
          </div>
          <Reveal delay={0.1} className="lg:col-span-6 lg:col-start-7 lg:mt-12">
            <EditorialImage src={heroImage} alt={c.heroImage?.alt || siteConfig.editorial.story.imageAlt} className="aspect-[4/5]" priority />
          </Reveal>
        </div>
      </section>

      {/* Story */}
      <section aria-labelledby="story-heading" className="mx-auto max-w-content px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="grid gap-10 lg:grid-cols-12">
          <Reveal className="lg:col-span-4">
            <h2 id="story-heading" className="text-h2">
              {c.storyHeading}
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="space-y-6 lg:col-span-7 lg:col-start-6">
            {lead && <p className="font-heading text-2xl leading-snug text-espresso first-letter:float-left first-letter:mr-3 first-letter:text-7xl first-letter:leading-[0.8] first-letter:text-antique">{lead}</p>}
            {rest.map((p, i) => (
              <p key={i} className="leading-relaxed text-muted">
                {p}
              </p>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Philosophy */}
      <section aria-labelledby="philosophy-heading" className="bg-espresso text-ivory">
        <Reveal className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6 lg:py-32">
          <h2 id="philosophy-heading" className="eyebrow text-gold">
            {c.philosophyHeading}
          </h2>
          <p className="mt-8 whitespace-pre-line font-heading text-2xl italic leading-snug sm:text-3xl">{c.philosophyBody}</p>
        </Reveal>
      </section>

      {/* Craftsmanship */}
      <section aria-labelledby="craft-heading" className="mx-auto max-w-content px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <Reveal>
          <p className="eyebrow">Craftsmanship</p>
          <h2 id="craft-heading" className="text-h2 mt-3">
            {c.craftsmanshipHeading}
          </h2>
        </Reveal>
        <Stagger className="mt-12 grid gap-px bg-line md:grid-cols-2">
          {c.craftsmanship.map((s, i) => (
            <StaggerItem key={i} className="bg-ivory p-8 lg:p-12">
              <span className="font-heading text-5xl italic leading-none text-antique/70">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="text-h3 mt-6">{s.title}</h3>
              <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-muted">{s.body}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {c.materials.length > 0 && (
        <section aria-labelledby="materials-heading" className="border-t border-line bg-champagne/40">
          <div className="mx-auto max-w-content px-4 py-20 sm:px-6 lg:px-8">
            <h2 id="materials-heading" className="eyebrow">
              Materials
            </h2>
            <dl className="mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {c.materials.map((m, i) => (
                <div key={i} className="border-t border-antique/40 pt-6">
                  <dt className="font-heading text-2xl text-espresso">{m.name}</dt>
                  <dd className="mt-2 text-sm leading-relaxed text-muted">{m.description}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-content px-4 py-20 text-center sm:px-6 lg:px-8">
        <p className="font-heading text-3xl italic text-espresso">{siteConfig.tagline}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <ButtonLink href="/shop" arrow>
            Explore Collection
          </ButtonLink>
          <ButtonLink href="/collections" variant="outline">
            View Collections
          </ButtonLink>
        </div>
      </section>
    </div>
  );
}
