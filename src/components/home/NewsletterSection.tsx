import { DiamondMark } from '@/components/layout/Logo';
import { NewsletterForm } from '@/components/storefront/NewsletterForm';
import { Reveal } from '@/components/ui/Reveal';

export function NewsletterSection() {
  return (
    <section aria-labelledby="newsletter-heading" className="mx-auto max-w-content px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <Reveal className="relative mx-auto max-w-3xl border border-line bg-white/70 px-6 py-14 text-center sm:px-16">
        <DiamondMark className="mx-auto h-5 w-7 text-antique" />
        <h2 id="newsletter-heading" className="text-h2 mt-6">
          Stay Close to <span className="accent">Beauty.</span>
        </h2>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-muted">New pieces and collection stories, now and then.</p>
        <div className="mt-8">
          <NewsletterForm />
        </div>
      </Reveal>
    </section>
  );
}
