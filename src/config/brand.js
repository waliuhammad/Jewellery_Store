/**
 * Single source of truth for brand configuration.
 * Brand: Minha Jewellers
 * All brand names, contact information, social links, and store policies are managed here.
 */
export const BRAND = {
  name: 'Minha Jewellers',
  shortName: 'Minha',
  logo: '/logo.png',
  logoWhite: '/logo-white.png',
  tagline: 'Pieces you’ll reach for every morning.',
  description: 'An online boutique of fine and fashion jewelry: warm, editorial, and unhurried. Designed for everyday radiance and festive moments.',

  // Currency and locale
  currency: {
    symbol: 'PKR',
    code: 'PKR',
    format: (amount) => `PKR ${Number(amount).toLocaleString('en-PK')}`,
    format: (amount) => `PKR ${Number(amount || 0).toLocaleString('en-PK')}`,
  },

  // Shipping & Policies
  shipping: {
    standardFee: 250,
    freeThreshold: 5000,
    freeThresholdText: 'PKR 5,000',
    estimatedDays: '2 - 4 business days',
    codAvailable: true,
    prepaidDiscountPercentage: 5, // 5% incentive for prepaid payments
  },

  // Contact Details
  contact: {
    phone: '+92 300 1234567',
    displayPhone: '+92 (300) 123-4567',
    whatsapp: '+923001234567',
    email: 'hello@minhajewellers.com',
    supportEmail: 'care@minhajewellers.com',
    address: 'Studio 14, M.M. Alam Road, Gulberg III, Lahore, Pakistan',
    hours: 'Monday – Saturday, 11:00 AM – 8:00 PM PKT',
  },

  // Social Channels
  social: {
    instagram: 'https://instagram.com/minhajewellers',
    facebook: 'https://facebook.com/minhajewellers',
    pinterest: 'https://pinterest.com/minhajewellers',
    tiktok: 'https://tiktok.com/@minhajewellers',
  },

  // Bank details for manual bank transfer
  bankDetails: {
    bankName: 'Meezan Bank Limited',
    accountTitle: 'Minha Jewellers Pvt Ltd',
    accountNumber: '02010108923412',
    iban: 'PK45MEZN0002010108923412',
    branch: 'Gulberg Main Boulevard Branch, Lahore',
  },

  // Mobile wallets
  wallets: {
    jazzcash: {
      title: 'JazzCash',
      accountNumber: '0300 1234567',
      accountTitle: 'Minha Jewellers',
    },
    easypaisa: {
      title: 'Easypaisa',
      accountNumber: '0300 1234567',
      accountTitle: 'Minha Jewellers',
    },
  },
};
