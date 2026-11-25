import type { AboutContent } from '@/lib/validations/content';

/**
 * Starting copy for the About page. Bracketed text is a placeholder until the business
 * writes its own story. Replace it in Admin > Brand content.
 */
export const DEFAULT_ABOUT: AboutContent = {
  heroTitle: 'Our Story',
  heroIntro: '[A short introduction to the brand. To be written by the business.]',
  heroImage: null,
  storyHeading: 'The brand story',
  story: ['[Brand story. To be written by the business.]'],
  philosophyHeading: 'Design philosophy',
  philosophyBody: '[Design philosophy. To be written by the business.]',
  craftsmanshipHeading: 'Craftsmanship',
  craftsmanship: [
    { title: '[Making process]', body: '[How pieces are made. To be written by the business.]' },
  ],
  materials: [
    { name: '[Material]', description: '[Origin, finish and care. To be written by the business.]' },
  ],
};
