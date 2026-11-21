import { BRAND } from '../config/brand.js';

export const INITIAL_SETTINGS = {
  storeName: BRAND.name,
  currency: BRAND.currency,
  freeShippingThreshold: BRAND.shipping.freeThreshold,
  standardShippingFee: BRAND.shipping.standardFee,
  expressShippingFee: BRAND.shipping.expressFee,
  prepaidDiscountPercent: BRAND.shipping.prepaidDiscountPercentage,
  contactPhone: BRAND.contact.phone,
  contactEmail: BRAND.contact.email,
  contactAddress: BRAND.contact.address,
  bankDetails: BRAND.bankDetails,
  wallets: BRAND.wallets,
  announcementText: 'Complimentary delivery across Pakistan on orders above PKR 5,000',
  isStoreOpen: true,
};

