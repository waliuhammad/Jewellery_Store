import type { Metadata } from 'next';
import Link from 'next/link';
import { Accordion, type AccordionItem } from '@/components/ui/Accordion';
import { ButtonLink } from '@/components/ui/Button';
import { PageIntro } from '@/components/ui/PageIntro';
import { Reveal } from '@/components/ui/Reveal';

export const metadata: Metadata = {
  title: 'FAQs',
  description: 'Answers to common questions about orders, your account, delivery, returns and jewellery care at Jewelora.',
};

/**
 * Answers describe how this website works today. Anything that depends on a business policy
 * points to the policy page, which carries the confirmed wording.
 */
const sections: { id: string; title: string; items: AccordionItem[] }[] = [
  {
    id: 'orders',
    title: 'Orders & Account',
    items: [
      {
        question: 'How do I check the status of my order?',
        answer: (
          <p>
            Sign in and open <Link href="/account/orders">Account › Orders</Link>. Each order shows its current status, from awaiting payment through to
            delivered.
          </p>
        ),
      },
      {
        question: 'Do I need an account to place an order?',
        answer: (
          <p>
            An account lets you see your order history and save delivery addresses. You can <Link href="/register">create one</Link> in a minute, or{' '}
            <Link href="/login">sign in</Link> if you already have one.
          </p>
        ),
      },
      {
        question: 'I have forgotten my password.',
        answer: (
          <p>
            Use <Link href="/forgot-password">Forgot password</Link> and we will email you a link to set a new one.
          </p>
        ),
      },
      {
        question: 'How does the wishlist work?',
        answer: <p>Tap the heart on any piece to save it. Your saved pieces are listed on the <Link href="/wishlist">Wishlist</Link> page.</p>,
      },
    ],
  },
  {
    id: 'delivery',
    title: 'Delivery',
    items: [
      {
        question: 'Where do you deliver, and how long does it take?',
        answer: (
          <p>
            Delivery areas, timeframes and charges are set out in our <Link href="/shipping-delivery">Shipping &amp; Delivery</Link> policy. Any charge
            that applies is shown at checkout before you place your order.
          </p>
        ),
      },
    ],
  },
  {
    id: 'returns',
    title: 'Returns & Refunds',
    items: [
      {
        question: 'Can I return or exchange a piece?',
        answer: (
          <p>
            Please see our <Link href="/returns-refunds">Returns &amp; Refunds</Link> policy for eligibility and how to start a return.
          </p>
        ),
      },
    ],
  },
  {
    id: 'payments',
    title: 'Prices & Payment',
    items: [
      {
        question: 'What currency are prices shown in?',
        answer: <p>All prices are in Pakistani Rupees (PKR). Prices are checked again on our server when you place an order.</p>,
      },
      {
        question: 'Which payment methods do you accept?',
        answer: <p>The payment options available for your order are shown on the checkout page.</p>,
      },
    ],
  },
  {
    id: 'care',
    title: 'Jewellery Care',
    items: [
      {
        question: 'How should I look after my jewellery?',
        answer: (
          <p>
            Our <Link href="/jewellery-care">Jewellery Care</Link> guide covers everyday wear, cleaning and storage.
          </p>
        ),
      },
    ],
  },
];

export default function FaqPage() {
  return (
    <>
      <PageIntro crumbs={[{ label: 'FAQs' }]} eyebrow="Customer Care" title="Questions," accent="Answered." lead="Everything you need to know about shopping with Jewelora." />

      <div className="mx-auto grid max-w-content gap-12 px-4 py-16 sm:px-6 lg:grid-cols-12 lg:px-8 lg:py-24">
        <nav aria-label="FAQ topics" className="lg:sticky lg:top-32 lg:col-span-3 lg:self-start">
          <ul className="flex flex-wrap gap-x-6 gap-y-3 lg:flex-col">
            {sections.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="link-draw text-[11px] font-semibold uppercase tracking-[0.18em] text-espresso">
                  {s.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="space-y-16 lg:col-span-9">
          {sections.map((s) => (
            <Reveal as="section" key={s.id}>
              <h2 id={s.id} className="eyebrow scroll-mt-32">
                {s.title}
              </h2>
              <div className="mt-4">
                <Accordion items={s.items} />
              </div>
            </Reveal>
          ))}

          <div className="bg-champagne/50 px-8 py-12 text-center">
            <p className="text-h3">Still have a question?</p>
            <p className="mt-2 text-sm text-muted">Send us a message and we will reply by email.</p>
            <ButtonLink href="/contact" arrow className="mt-6">
              Contact Us
            </ButtonLink>
          </div>
        </div>
      </div>
    </>
  );
}
