import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Instagram, Facebook, ArrowRight, Check } from 'lucide-react';
import { BRAND } from '../config/brand';
import { api } from '../services/api';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [couponCode, setCouponCode] = useState('');

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (email.trim()) {
      try {
        const res = await api.subscribeNewsletter(email.trim());
        setCouponCode(res?.data?.couponCode || 'WELCOME10');
      } catch {
        setCouponCode('WELCOME10');
      }
      setIsSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-deep text-ivory pt-20 lg:pt-24 pb-12 border-t border-hairline/20 relative">
      <div className="max-w-page mx-auto px-6 lg:px-12">
        {/* Newsletter Subscription Row (Design.md Section 4.2) */}
        <div className="pb-16 mb-16 border-b border-champagne/15 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="max-w-md">
            <span className="text-[11px] uppercase tracking-label text-champagne block mb-1">
              Private Dispatch
            </span>
            <h3 className="font-display text-2xl md:text-3xl text-ivory">
              New arrivals, first. <span className="italic font-normal">No noise.</span>
            </h3>
            <p className="text-sm text-ivory/70 mt-1 font-sans">
              Curated previews, private archive sales, and jewelry care insights delivered with calm intention.
            </p>
          </div>

          <div className="w-full md:w-auto md:min-w-[380px]">
            {isSubscribed ? (
              <div className="flex items-center gap-2.5 text-champagne bg-champagne/10 border border-champagne/20 px-5 py-3 text-sm">
                <Check className="w-4 h-4 text-champagne flex-shrink-0" />
                <span>Welcome to {BRAND.name}. Use voucher <strong>{couponCode}</strong> for 10% off.</span>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-2 w-full">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  required
                  className="bg-transparent border-b border-champagne/30 text-ivory placeholder:text-ivory/40 text-sm py-3 px-1 focus:outline-none focus:border-champagne flex-1 transition-colors"
                />
                <button
                  type="submit"
                  className="relative overflow-hidden bg-ivory text-ink px-6 py-3 text-xs uppercase tracking-label font-medium hover:bg-champagne transition-colors flex items-center justify-center gap-1.5 flex-shrink-0"
                >
                  <span>Join</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Four Column Grid per Design.md Section 4.2: grid-cols-[1.4fr_1fr_1fr_1.4fr] */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.4fr] gap-12 lg:gap-8 pb-16">
          {/* Col 1: Brand */}
          <div className="space-y-4">
            <Link to="/" className="inline-block" aria-label={BRAND.name}>
              <img
                src={BRAND.logoWhite}
                alt={BRAND.name}
                className="h-[72px] w-auto object-contain"
              />
            </Link>
            <p className="text-sm text-ivory/75 max-w-xs leading-relaxed font-sans">
              Handcrafted fine and fashion jewelry reflecting the wearer's own story. Sunlit warmth, tactile luster, and thoughtful details.
            </p>
            <div className="flex items-center gap-4 pt-2 text-champagne">
              <a
                href={BRAND.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-champagne/30 flex items-center justify-center hover:border-champagne hover:bg-champagne/10 transition-colors"
                aria-label="Instagram profile"
              >
                <Instagram className="w-4 h-4" strokeWidth={1.4} />
              </a>
              <a
                href={BRAND.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-champagne/30 flex items-center justify-center hover:border-champagne hover:bg-champagne/10 transition-colors"
                aria-label="Facebook page"
              >
                <Facebook className="w-4 h-4" strokeWidth={1.4} />
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="font-display text-lg text-ivory mb-5 font-semibold">
              Quick Links
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/" className="text-ivory/75 hover:text-ivory transition-colors relative group inline-block">
                  Home
                  <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-gold transition-all duration-300 group-hover:w-full" />
                </Link>
              </li>
              <li>
                <Link to="/shop" className="text-ivory/75 hover:text-ivory transition-colors relative group inline-block">
                  Shop Collection
                  <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-gold transition-all duration-300 group-hover:w-full" />
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-ivory/75 hover:text-ivory transition-colors relative group inline-block">
                  About Us
                  <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-gold transition-all duration-300 group-hover:w-full" />
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-ivory/75 hover:text-ivory transition-colors relative group inline-block">
                  Contact Concierge
                  <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-gold transition-all duration-300 group-hover:w-full" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Support */}
          <div>
            <h4 className="font-display text-lg text-ivory mb-5 font-semibold">
              Support
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/track-order" className="text-ivory/75 hover:text-ivory transition-colors relative group inline-block">
                  Track Order
                  <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-gold transition-all duration-300 group-hover:w-full" />
                </Link>
              </li>
              <li>
                <Link to="/faqs" className="text-ivory/75 hover:text-ivory transition-colors relative group inline-block">
                  FAQs &amp; Shipping
                  <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-gold transition-all duration-300 group-hover:w-full" />
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-ivory/75 hover:text-ivory transition-colors relative group inline-block">
                  Privacy Policy
                  <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-gold transition-all duration-300 group-hover:w-full" />
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-ivory/75 hover:text-ivory transition-colors relative group inline-block">
                  Terms of Service
                  <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-gold transition-all duration-300 group-hover:w-full" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact Info */}
          <div>
            <h4 className="font-display text-lg text-ivory mb-5 font-semibold">
              Contact Info
            </h4>
            <ul className="space-y-3 text-sm text-ivory/75">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-champagne flex-shrink-0 mt-0.5" strokeWidth={1.4} />
                <span>{BRAND.contact.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-champagne flex-shrink-0" strokeWidth={1.4} />
                <a href={`tel:${BRAND.contact.phone}`} className="hover:text-champagne transition-colors">
                  {BRAND.contact.displayPhone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-champagne flex-shrink-0" strokeWidth={1.4} />
                <a href={`mailto:${BRAND.contact.email}`} className="hover:text-champagne transition-colors">
                  {BRAND.contact.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar per Design.md Section 4.2 */}
        <div className="pt-8 border-t border-[rgba(234,220,180,0.18)] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-ivory/60 font-sans">
          <p>© {new Date().getFullYear()} {BRAND.name}. All rights reserved.</p>
          <p className="tracking-wide">Complimentary Delivery Across Pakistan on Orders Over PKR {BRAND.shipping.freeThreshold.toLocaleString()}</p>
        </div>
      </div>
    </footer>
  );
}
