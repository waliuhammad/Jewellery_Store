import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { PageIntro } from '@/components/ui/PageIntro';
import Link from 'next/link';
import { ContactForm } from '@/components/contact/ContactForm';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = { title: 'Contact Us', description: 'Questions about a piece or an order? Send Jewelora a message.' };

export default function ContactPage() {
  const { contactEmail, phone, social } = siteConfig;
  const hasSocial = Object.values(social).some(Boolean);

  return (
    <>
    <PageIntro crumbs={[{ label: 'Contact' }]} eyebrow="Customer Care" title="We'd Love to" accent="Hear From You." />
    <Container className="py-16 lg:py-24">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
        <section aria-labelledby="contact-heading">
          <h2 id="contact-heading" className="text-h2">Get in touch</h2>
          <p className="mt-4 max-w-md text-muted">
            Questions about a piece, an order, or a bespoke request? Send us a message and we will reply by email.
          </p>

          <dl className="mt-10 space-y-6 text-sm">
            {contactEmail && (
              <div>
                <dt className="text-muted">Email</dt>
                <dd className="mt-1"><a href={`mailto:${contactEmail}`} className="underline underline-offset-4">{contactEmail}</a></dd>
              </div>
            )}
            {phone && (
              <div>
                <dt className="text-muted">Phone</dt>
                <dd className="mt-1"><a href={`tel:${phone}`} className="underline underline-offset-4">{phone}</a></dd>
              </div>
            )}
            {hasSocial && (
              <div>
                <dt className="text-muted">Follow us</dt>
                <dd className="mt-1 flex flex-wrap gap-4">
                  {social.instagram && <a href={social.instagram} rel="noopener noreferrer" className="underline underline-offset-4">Instagram</a>}
                  {social.facebook && <a href={social.facebook} rel="noopener noreferrer" className="underline underline-offset-4">Facebook</a>}
                  {social.pinterest && <a href={social.pinterest} rel="noopener noreferrer" className="underline underline-offset-4">Pinterest</a>}
                </dd>
              </div>
            )}
          </dl>

          <p className="mt-10 border-t border-line pt-6 text-sm text-muted">
            Looking for a quick answer? Try our <Link href="/faq" className="text-espresso underline underline-offset-4">FAQs</Link>.
          </p>
        </section>

        <section aria-label="Send a message">
          <ContactForm />
        </section>
      </div>
    </Container>
    </>
  );
}
