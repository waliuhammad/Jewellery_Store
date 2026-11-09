import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Instagram, Facebook, ArrowRight, Check } from 'lucide-react';
import { BRAND } from '../config/brand';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-noir text-ivory pt-20 lg:pt-24 pb-12 border-t border-hairline/20 relative">
      <div className="max-w-page mx-auto px-6 lg:px-12">
        {/* Newsletter Subscription Row */}
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
                <Check className="w-4 h-4 text-champagne" />
                <span>Thank you. You have been added to our private dispatch.</span>
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

        {/* Four Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.4fr] gap-12 lg:gap-8 pb-16">
          {/* Col 1: Brand */}
          <div className="space-y-4">
            <h2 className="font-display text-2xl uppercase tracking-wordmark font-semibold text-ivory">
              {BRAND.name}
            </h2>
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
              Explore
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  to="/"
                  className="text-ivory/75 hover:text-ivory transition-colors relative group inline-block"
                >
                  Home
                  <span className="block max-w-0 group-hover:max-w-full transition-all duration-300 h-[1px] bg-gold" />
                </Link>
              </li>
              <li>
                <Link
                  to="/shop"
                  className="text-ivory/75 hover:text-ivory transition-colors relative group inline-block"
                >
                  Shop All Pieces
                  <span className="block max-w-0 group-hover:max-w-full transition-all duration-300 h-[1px] bg-gold" />
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-ivory/75 hover:text-ivory transition-colors relative group inline-block"
                >
                  Our Story &amp; Craft
                  <span className="block max-w-0 group-hover:max-w-full transition-all duration-300 h-[1px] bg-gold" />
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-ivory/75 hover:text-ivory transition-colors relative group inline-block"
                >
                  Contact &amp; Studio
                  <span className="block max-w-0 group-hover:max-w-full transition-all duration-300 h-[1px] bg-gold" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Support */}
          <div>
            <h4 className="font-display text-lg text-ivory mb-5 font-semibold">
              Client Care
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  to="/faqs"
                  className="text-ivory/75 hover:text-ivory transition-colors relative group inline-block"
                >
                  FAQs &amp; Help
                  <span className="block max-w-0 group-hover:max-w-full transition-all duration-300 h-[1px] bg-gold" />
                </Link>
              </li>
              <li>
                <Link
                  to="/track-order"
                  className="text-ivory/75 hover:text-ivory transition-colors relative group inline-block"
                >
                  Track Your Order
                  <span className="block max-w-0 group-hover:max-w-full transition-all duration-300 h-[1px] bg-gold" />
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy-policy"
                  className="text-ivory/75 hover:text-ivory transition-colors relative group inline-block"
                >
                  Privacy Policy
                  <span className="block max-w-0 group-hover:max-w-full transition-all duration-300 h-[1px] bg-gold" />
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-ivory/75 hover:text-ivory transition-colors relative group inline-block"
                >
                  Terms &amp; 7-Day Returns
                  <span className="block max-w-0 group-hover:max-w-full transition-all duration-300 h-[1px] bg-gold" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact Info */}
          <div>
            <h4 className="font-display text-lg text-ivory mb-5 font-semibold">
              Studio &amp; Inquiries
            </h4>
            <ul className="space-y-4 text-sm text-ivory/80">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-champagne mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                <span>{BRAND.contact.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-champagne flex-shrink-0" strokeWidth={1.5} />
                <a
                  href={`tel:${BRAND.contact.phone.replace(/\s+/g, '')}`}
                  className="hover:text-champagne transition-colors"
                >
                  {BRAND.contact.displayPhone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-champagne flex-shrink-0" strokeWidth={1.5} />
                <a
                  href={`mailto:${BRAND.contact.email}`}
                  className="hover:text-champagne transition-colors"
                >
                  {BRAND.contact.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-champagne/15 flex flex-col sm:flex-row items-center justify-between text-xs text-ivory/60 gap-4">
          <p className="text-center sm:text-left">
            &copy; 2026 {BRAND.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link to="/privacy-policy" className="hover:text-ivory transition-colors">
              Privacy
            </Link>
            <span>&bull;</span>
            <Link to="/terms" className="hover:text-ivory transition-colors">
              Terms &amp; Returns
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

