/**
 * Single source of truth for brand configuration in backend.
 * Synced with PRD and frontend specs.
 */
export const BRAND = {
  name: 'Aurelle Jewels',
  shortName: 'Aurelle',
  tagline: 'Pieces you’ll reach for every morning.',
  currency: 'PKR',
  
  shipping: {
    standardFee: 250,
    freeThreshold: 5000,
    expressFee: 450,
    estimatedDays: '2 - 4 business days',
    codAvailable: true,
    prepaidDiscountPercentage: 5, // 5% incentive for prepaid payments
  },

  contact: {
    phone: '+92 300 1234567',
    displayPhone: '+92 (300) 123-4567',
    whatsapp: '+923001234567',
    email: 'hello@aurellejewels.com',
    ordersEmail: 'orders@aurellejewels.com',
    address: 'Studio 14, M.M. Alam Road, Gulberg III, Lahore, Pakistan',
  },

  bankDetails: {
    bankName: 'Meezan Bank Limited',
    accountTitle: 'Aurelle Jewels Pvt Ltd',
    accountNumber: '02010108923412',
    iban: 'PK45MEZN0002010108923412',
    branch: 'Gulberg Main Boulevard Branch, Lahore',
  },

  wallets: {
    jazzcash: {
      title: 'JazzCash',
      accountNumber: '0300 1234567',
      accountTitle: 'Aurelle Jewels',
    },
    easypaisa: {
      title: 'Easypaisa',
      accountNumber: '0300 1234567',
      accountTitle: 'Aurelle Jewels',
    },
  },
};

