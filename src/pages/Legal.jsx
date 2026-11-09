import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { BRAND } from '../config/brand';

export default function Legal() {
  const location = useLocation();
  const isPrivacy = location.pathname.includes('privacy');

  return (
    <div className="pt-24 lg:pt-32 pb-24 bg-ivory min-h-screen">
      <div className="max-w-4xl mx-auto px-6">
        <div className="pb-8 border-b border-hairline mb-10">
          <span className="text-xs uppercase tracking-label text-taupe block mb-1">
            Legal &amp; Policy
          </span>
          <h1 className="font-display text-4xl sm:text-5xl text-ink font-normal">
            {isPrivacy ? 'Privacy & Data Protection' : 'Terms of Service & 7-Day Returns'}
          </h1>
          <p className="text-xs uppercase tracking-label text-taupe mt-3">
            Last Updated &bull; 8 November 2026 &bull; {BRAND.name} Atelier
          </p>
        </div>

        {/* Navigation tabs between policies */}
        <div className="flex gap-6 border-b border-hairline text-xs uppercase tracking-label mb-10">
          <Link
            to="/privacy-policy"
            className={`pb-3 border-b-2 font-medium ${
              isPrivacy ? 'border-ink text-ink' : 'border-transparent text-taupe hover:text-ink'
            }`}
          >
            Privacy Policy
          </Link>
          <Link
            to="/terms"
            className={`pb-3 border-b-2 font-medium ${
              !isPrivacy ? 'border-ink text-ink' : 'border-transparent text-taupe hover:text-ink'
            }`}
          >
            Terms &amp; 7-Day Returns
          </Link>
        </div>

        {/* Content Body */}
        <div className="prose max-w-none text-xs sm:text-sm text-taupe leading-relaxed space-y-8 font-light">
          {isPrivacy ? (
            <>
              <section className="space-y-3">
                <h2 className="font-display text-2xl text-ink font-normal">1. Overview &amp; Data Philosophy</h2>
                <p>
                  At {BRAND.name}, we believe luxury is founded on mutual trust. We collect only the information necessary to fulfill your orders, safely dispatch parcels via tracked couriers in Pakistan, and communicate regarding your jewelry curation.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="font-display text-2xl text-ink font-normal">2. Information We Collect</h2>
                <p>
                  When you visit or purchase from our website, we collect your name, shipping address, contact telephone number (for SMS/WhatsApp courier dispatch updates), and optional email address. If you opt into our private dispatch newsletter, your email address is encrypted in our subscriber list.
                </p>
                <p>
                  We do not sell, rent, or trade your personal information with third-party advertising networks.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="font-display text-2xl text-ink font-normal">3. Payments &amp; Financial Security</h2>
                <p>
                  For Cash on Delivery (COD), no financial credentials are processed online. For bank transfers and mobile wallets (JazzCash, Easypaisa), transactions are concluded through your official banking portal or mobile application; we verify payments using transaction references and bank confirmation statements.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="font-display text-2xl text-ink font-normal">4. Your Inquiries &amp; Rights</h2>
                <p>
                  You may at any time request the deletion of your account or saved address records by contacting our client care team at <a href={`mailto:${BRAND.contact.email}`} className="text-gold underline">{BRAND.contact.email}</a>.
                </p>
              </section>
            </>
          ) : (
            <>
              <section className="space-y-3">
                <h2 className="font-display text-2xl text-ink font-normal">1. 7-Day Hassle-Free Returns &amp; Exchanges</h2>
                <p>
                  We want you to hold and wear our pieces with complete confidence. If a jewelry item does not fit comfortably, or differs in expectations, you may request an exchange or return within <strong>7 days of delivery</strong>.
                </p>
                <p>
                  Items must be in unworn condition, settled inside the original cream presentation box with the suede travel pouch and care card included.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="font-display text-2xl text-ink font-normal">2. Cash on Delivery (COD) Protocol</h2>
                <p>
                  Cash on Delivery is available across all major cities and towns throughout Pakistan. To minimize returned-to-origin shipments, our client team may verify your delivery address via a quick SMS or WhatsApp message prior to studio dispatch.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="font-display text-2xl text-ink font-normal">3. Anti-Tarnish Finish Warranty</h2>
                <p>
                  All our pieces are manufactured with 18k and 22k micron immersion plating and sealed with a transparent anti-tarnish glaze. We guarantee non-tarnish performance under recommended care instructions (keeping away from direct alcohol, bleach, and chlorinated water).
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="font-display text-2xl text-ink font-normal">4. Contact &amp; Concierge</h2>
                <p>
                  For exchange claims or questions, reach out to our client team on WhatsApp at <a href={`https://wa.me/${BRAND.contact.whatsapp}`} className="text-gold underline">{BRAND.contact.displayPhone}</a> or email <a href={`mailto:${BRAND.contact.supportEmail}`} className="text-gold underline">{BRAND.contact.supportEmail}</a>.
                </p>
              </section>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

