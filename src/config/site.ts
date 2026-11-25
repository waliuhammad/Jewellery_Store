export type PersonalizationOption = 'initials' | 'date' | 'text' | 'birthstone';

/**
 * Editable store content. Placeholders until the brand is confirmed.
 * Later this moves to settings/store in Firestore.
 */
export const siteConfig = {
  brandName: 'Jewelora',
  tagline: 'Timeless Beauty. Thoughtfully Chosen.',
  // Rotating announcement messages. Add confirmed offers only (e.g. free delivery once the policy is set).
  announcements: ['Timeless Beauty. Thoughtfully Chosen.', "Discover jewellery for life's most beautiful moments"],
  currency: 'PKR',
  contactEmail: '',
  phone: '',
  social: { instagram: '', facebook: '', pinterest: '' },
  // Primary navigation, split either side of the centred wordmark on desktop.
  // `mega: true` opens the Jewellery mega-menu built from `categories`.
  nav: {
    left: [
      { label: 'New Arrivals', href: '/shop?sort=newest' },
      { label: 'Jewellery', href: '/shop', mega: true },
      { label: 'Collections', href: '/collections' },
    ],
    right: [
      { label: 'Personalized', href: '/personalized' },
      { label: 'Gifts', href: '/gifts' },
      { label: 'Our Story', href: '/about' },
    ],
  },
  categories: [
    { name: 'Rings', slug: 'rings' },
    { name: 'Necklaces', slug: 'necklaces' },
    { name: 'Earrings', slug: 'earrings' },
    { name: 'Bracelets', slug: 'bracelets' },
    { name: 'Jewellery Sets', slug: 'jewellery-sets' },
  ],
  hero: {
    eyebrow: 'The Art of Timeless Beauty',
    // The last word is set in italic gold.
    headline: 'Jewellery That Tells Your Story.',
    description: "Discover thoughtfully chosen pieces that make life's most beautiful moments unforgettable.",
    primaryCta: { label: 'Explore Collection', href: '/shop' },
    secondaryCta: { label: 'Discover Jewelora', href: '/about' },
    imageUrl: '/images/hero.jpg',
    imageAlt: 'Gold necklaces, earrings, rings and bracelets with pearls and crystals arranged on cream linen',
    highlights: [] as string[],
  },
  // Slug of an active collection to show as "Wedding Collection" in the Jewellery menu. Empty hides it.
  weddingCollectionSlug: '',
  // Optional editorial photography (Cloudinary or /public URLs). Empty slots render a plain champagne panel.
  editorial: {
    story: { imageUrl: '', imageAlt: '' },
    personalized: { imageUrl: '', imageAlt: '' },
    gifting: { imageUrl: '', imageAlt: '' },
    craft: { imageUrl: '', imageAlt: '' },
  },
  /**
   * Personalisation. Leave `enabled` false until the business offers it; the homepage section
   * and the preview tool stay hidden and /personalized says so plainly.
   */
  personalization: {
    enabled: false,
    // Which options the preview offers. Only list what the workshop can actually make.
    options: [] as PersonalizationOption[],
    maxCharacters: 12,
    birthstones: [] as { month: string; stone: string; colour: string }[],
  },
  gifting: {
    // Occasion-based browsing. Each occasion points at an existing collection; ones whose collection
    // is missing or inactive are hidden automatically.
    occasions: [] as { label: string; collectionSlug: string; description: string }[],
    // Shop-by-budget shortcuts. These are only price filters, not offers.
    priceBands: [
      { label: 'Under PKR 10,000', max: 10000 },
      { label: 'PKR 10,000 – 25,000', min: 10000, max: 25000 },
      { label: 'PKR 25,000 – 50,000', min: 25000, max: 50000 },
      { label: 'Above PKR 50,000', min: 50000 },
    ] as { label: string; min?: number; max?: number }[],
    // Set once gift packaging is actually offered, e.g. { title: 'Gift wrapping', body: '...', price: 0 }.
    packaging: null as null | { title: string; body: string; price: number },
  },
  // Genuine, attributable customer words only. The section is hidden while this is empty.
  testimonials: [] as { quote: string; name: string; location?: string }[],
  // Material filter options. Placeholder list: edit to match the pieces you sell.
  materials: ['Yellow Gold', 'Rose Gold', 'White Gold', 'Silver', 'Platinum'],
  // Shown on every product page. Replace the bracketed text with the confirmed policy.
  productInfo: {
    shipping: '[Shipping timeframes and costs: to be confirmed by the business]',
    returns: '[Returns policy: to be confirmed by the business]',
    care: '[Care instructions: to be provided by the business]',
  },
  // Checkout rules. Placeholder values until the business confirms shipping and tax.
  checkout: { shippingFee: 0, taxRate: 0 },
  // Only truthful, confirmed claims. Empty until the business supplies them.
  trustPoints: [] as { title: string; body: string }[],
};
