import type { Metadata } from 'next';
import Link from 'next/link';
import { ButtonLink } from '@/components/ui/Button';
import { PageIntro } from '@/components/ui/PageIntro';
import { Reveal, Stagger, StaggerItem } from '@/components/ui/Reveal';

export const metadata: Metadata = {
  title: 'Jewellery Care',
  description: 'How to wear, clean and store your jewellery so it stays beautiful for years.',
};

/** General, widely accepted jewellery-care guidance. Piece-specific care lives on each product page. */
const rituals = [
  {
    title: 'Last on, first off',
    body: 'Put jewellery on after perfume, lotion, hairspray and make-up have settled, and take it off before you undress at night.',
  },
  {
    title: 'Keep it away from water and chemicals',
    body: 'Remove pieces before swimming, bathing, cleaning or exercising. Chlorine, salt water, sweat and household cleaners can dull metal and loosen settings.',
  },
  {
    title: 'Clean gently',
    body: 'Wipe with a soft, lint-free cloth after wearing. For a deeper clean, use lukewarm water with a drop of mild soap, then rinse and pat completely dry. Avoid abrasive pastes and brushes.',
  },
  {
    title: 'Store each piece separately',
    body: 'Keep jewellery in a dry, cool place, ideally in individual pouches or a lined box so harder stones cannot scratch softer metals and chains do not tangle.',
  },
  {
    title: 'Handle with care',
    body: 'Hold pieces by the band or chain rather than the setting, and avoid knocks against hard surfaces. Fasten clasps before storing necklaces and bracelets.',
  },
  {
    title: 'Check settings regularly',
    body: 'Every so often, look for loose stones, worn prongs or weak clasps. If something looks wrong, stop wearing the piece until it has been looked at.',
  },
];

export default function JewelleryCarePage() {
  return (
    <>
      <PageIntro
        crumbs={[{ label: 'Jewellery Care' }]}
        eyebrow="Customer Care"
        title="Care for What"
        accent="You Treasure."
        lead="A few simple habits keep jewellery looking its best for years. These are general guidelines; any care notes on a product page come first."
      />

      <section aria-labelledby="rituals-heading" className="mx-auto max-w-content px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <h2 id="rituals-heading" className="sr-only">
          Everyday care
        </h2>
        <Stagger className="grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-3">
          {rituals.map((r, i) => (
            <StaggerItem key={r.title} className="bg-ivory p-8 lg:p-10">
              <span className="font-heading text-5xl italic leading-none text-antique/70">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="text-h3 mt-6">{r.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{r.body}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      <Reveal as="section" className="mx-auto max-w-content px-4 pb-24 sm:px-6 lg:px-8">
        <div className="grid items-center gap-8 border border-line bg-white/60 p-8 sm:p-12 lg:grid-cols-[1fr_auto]">
          <div>
            <h2 className="text-h3">Not sure how to care for a particular piece?</h2>
            <p className="mt-2 text-sm text-muted">
              Check the care notes on its product page, browse our <Link href="/faq" className="underline underline-offset-4">FAQs</Link>, or ask us directly.
            </p>
          </div>
          <ButtonLink href="/contact" arrow>
            Ask Us
          </ButtonLink>
        </div>
      </Reveal>
    </>
  );
}
