import React, { useState } from 'react';
import { Save, Plus, Trash2, RotateCcw, Clock, Check } from 'lucide-react';
import PageHeader from '../layouts/PageHeader';
import { Tabs, Toggle, useAdminToast } from '../components/ui';
import { BRAND } from '../../config/brand';
import { useAdminAuth } from '../hooks/useAdminAuth';

export default function SiteContent() {
  const { admin } = useAdminAuth();
  const toast = useAdminToast();
  const [activeTab, setActiveTab] = useState('contact');
  const [isDirty, setIsDirty] = useState(false);
  const [lastSaved, setLastSaved] = useState('Today at 11:30 AM by Minha Admin');

  // Content state
  const [contactData, setContactData] = useState({
    phone: BRAND.contact.phone,
    whatsapp: BRAND.contact.whatsapp,
    email: BRAND.contact.email,
    supportEmail: BRAND.contact.supportEmail,
    address: BRAND.contact.address,
    hours: BRAND.contact.hours,
    tagline: BRAND.tagline,
    announcementText: 'Complimentary delivery across Pakistan on orders above PKR 5,000',
    announcementEnabled: true,
    instagram: BRAND.social.instagram,
    facebook: BRAND.social.facebook,
    tiktok: BRAND.social.tiktok,
  });

  const [faqs, setFaqs] = useState([
    {
      q: 'Are all your pieces genuine 925 sterling silver and 18k gold plated?',
      a: 'Yes, every Minha piece is crafted from hypoallergenic 925 sterling silver and plated with thick 18k gold vermeil or rhodium.',
    },
    {
      q: 'How long does nationwide delivery take?',
      a: 'Standard courier delivery takes 2 to 4 business days across major cities in Pakistan (Lahore, Karachi, Islamabad, etc.).',
    },
    {
      q: 'What is your return and exchange policy?',
      a: 'We offer a 7-day hassle-free exchange policy for unused items in their original suede packaging.',
    },
  ]);

  const [aboutData, setAboutData] = useState({
    heroStatement: 'Pieces you’ll reach for every morning.',
    storyParagraph1: 'Founded in Lahore, Minha Jewellers crafts modern heirlooms that celebrate the poetry of everyday radiance.',
    storyParagraph2: 'Every ring, necklace, and bangle is designed to bridge editorial aesthetics with wearable longevity.',
    values: [
      { title: 'Conscious Craft', desc: 'Recycled precious metals and ethically sourced natural pearls.' },
      { title: 'Artisanal Integrity', desc: 'Hand-finished by master silversmiths in Lahore.' },
      { title: 'Unhurried Luxury', desc: 'Timeless designs made to transcend fleeting fast-fashion cycles.' },
    ],
  });

  const [productTabs, setProductTabs] = useState({
    careGuide: 'Avoid contact with harsh perfumes, chlorine, and chemical lotions. Wipe with our microfiber cloth after each wear.',
    shippingReturns: 'Complimentary express shipping across Pakistan on orders over PKR 5,000. 7-day exchange window.',
    sizeGuide: 'Rings follow standard US sizing (sizes 5 through 9). Bangles measure 2.4 to 2.8 inches in standard diameter.',
  });

  const tabs = [
    { value: 'contact', label: 'Contact & Footer' },
    { value: 'faq', label: 'FAQ Accordion' },
    { value: 'about', label: 'About Page' },
    { value: 'tabs', label: 'Product Tabs Defaults' },
  ];

  const handleSave = () => {
    setIsDirty(false);
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setLastSaved(`Today at ${now} by ${admin?.name || 'Administrator'}`);
    toast?.show('Site content changes published live to storefront', 'success');
  };

  const markDirty = () => {
    if (!isDirty) setIsDirty(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <PageHeader
          title="Content"
          subtitle="Edit the text customers see. Changes go live when you save."
        />
        <div className="flex items-center gap-3 self-start sm:self-auto">
          <span className="text-xs font-sans text-taupe hidden md:inline">
            {lastSaved}
          </span>
          <button
            onClick={handleSave}
            disabled={!isDirty}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs uppercase tracking-wider font-semibold rounded-md transition-colors bg-ink text-ivory hover:bg-gold hover:text-ink disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Save size={15} /> Save Changes
          </button>
        </div>
      </div>

      <Tabs tabs={tabs} active={activeTab} onChange={setActiveTab} />

      {/* Tab 1: Contact and Footer */}
      {activeTab === 'contact' && (
        <div className="bg-paper p-6 rounded-lg border border-hairline space-y-6">
          <h3 className="font-display text-xl font-semibold text-ink">
            Store Contact &amp; Header Strip
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-sans uppercase tracking-wider text-taupe font-medium mb-1">
                Concierge Phone
              </label>
              <input
                type="text"
                value={contactData.phone}
                onChange={(e) => {
                  markDirty();
                  setContactData({ ...contactData, phone: e.target.value });
                }}
                className="w-full px-3 py-2 text-xs font-sans bg-cream border border-hairline rounded text-ink"
              />
            </div>
            <div>
              <label className="block text-xs font-sans uppercase tracking-wider text-taupe font-medium mb-1">
                WhatsApp Number
              </label>
              <input
                type="text"
                value={contactData.whatsapp}
                onChange={(e) => {
                  markDirty();
                  setContactData({ ...contactData, whatsapp: e.target.value });
                }}
                className="w-full px-3 py-2 text-xs font-sans bg-cream border border-hairline rounded text-ink"
              />
            </div>
            <div>
              <label className="block text-xs font-sans uppercase tracking-wider text-taupe font-medium mb-1">
                General Email
              </label>
              <input
                type="email"
                value={contactData.email}
                onChange={(e) => {
                  markDirty();
                  setContactData({ ...contactData, email: e.target.value });
                }}
                className="w-full px-3 py-2 text-xs font-sans bg-cream border border-hairline rounded text-ink"
              />
            </div>
            <div>
              <label className="block text-xs font-sans uppercase tracking-wider text-taupe font-medium mb-1">
                Client Care Email
              </label>
              <input
                type="email"
                value={contactData.supportEmail}
                onChange={(e) => {
                  markDirty();
                  setContactData({ ...contactData, supportEmail: e.target.value });
                }}
                className="w-full px-3 py-2 text-xs font-sans bg-cream border border-hairline rounded text-ink"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-sans uppercase tracking-wider text-taupe font-medium mb-1">
              Studio Address
            </label>
            <input
              type="text"
              value={contactData.address}
              onChange={(e) => {
                markDirty();
                setContactData({ ...contactData, address: e.target.value });
              }}
              className="w-full px-3 py-2 text-xs font-sans bg-cream border border-hairline rounded text-ink"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-sans uppercase tracking-wider text-taupe font-medium mb-1">
                Business Hours
              </label>
              <input
                type="text"
                value={contactData.hours}
                onChange={(e) => {
                  markDirty();
                  setContactData({ ...contactData, hours: e.target.value });
                }}
                className="w-full px-3 py-2 text-xs font-sans bg-cream border border-hairline rounded text-ink"
              />
            </div>
            <div>
              <label className="block text-xs font-sans uppercase tracking-wider text-taupe font-medium mb-1">
                Footer Tagline
              </label>
              <input
                type="text"
                value={contactData.tagline}
                onChange={(e) => {
                  markDirty();
                  setContactData({ ...contactData, tagline: e.target.value });
                }}
                className="w-full px-3 py-2 text-xs font-sans bg-cream border border-hairline rounded text-ink"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-hairline space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-sans text-sm font-semibold text-ink">
                Announcement Bar
              </h4>
              <Toggle
                checked={contactData.announcementEnabled}
                onChange={(val) => {
                  markDirty();
                  setContactData({ ...contactData, announcementEnabled: val });
                }}
                label={contactData.announcementEnabled ? 'Enabled' : 'Hidden'}
              />
            </div>
            <input
              type="text"
              value={contactData.announcementText}
              onChange={(e) => {
                markDirty();
                setContactData({ ...contactData, announcementText: e.target.value });
              }}
              className="w-full px-3 py-2 text-xs font-sans bg-cream border border-hairline rounded text-ink"
            />
          </div>
        </div>
      )}

      {/* Tab 2: FAQ */}
      {activeTab === 'faq' && (
        <div className="bg-paper p-6 rounded-lg border border-hairline space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-xl font-semibold text-ink">Frequently Asked Questions</h3>
            <button
              onClick={() => {
                markDirty();
                setFaqs([...faqs, { q: 'New question title', a: 'Answer text goes here.' }]);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-sans font-medium bg-ink text-ivory rounded hover:bg-gold hover:text-ink transition-colors"
            >
              <Plus size={14} /> Add Item
            </button>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="p-4 bg-cream/40 rounded-lg border border-hairline space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <input
                    type="text"
                    value={faq.q}
                    onChange={(e) => {
                      markDirty();
                      const updated = [...faqs];
                      updated[idx].q = e.target.value;
                      setFaqs(updated);
                    }}
                    className="flex-1 px-3 py-1.5 text-xs font-sans font-semibold bg-paper border border-hairline rounded text-ink"
                  />
                  <button
                    onClick={() => {
                      markDirty();
                      setFaqs(faqs.filter((_, i) => i !== idx));
                    }}
                    className="p-1.5 text-taupe hover:text-garnet hover:bg-[#F3D9D6] rounded transition-colors"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
                <textarea
                  rows={2}
                  value={faq.a}
                  onChange={(e) => {
                    markDirty();
                    const updated = [...faqs];
                    updated[idx].a = e.target.value;
                    setFaqs(updated);
                  }}
                  className="w-full p-2.5 text-xs font-sans bg-paper border border-hairline rounded text-taupe resize-none"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: About Page */}
      {activeTab === 'about' && (
        <div className="bg-paper p-6 rounded-lg border border-hairline space-y-5">
          <h3 className="font-display text-xl font-semibold text-ink">About Page Copy</h3>
          <div>
            <label className="block text-xs font-sans uppercase tracking-wider text-taupe font-medium mb-1">
              Hero Statement
            </label>
            <input
              type="text"
              value={aboutData.heroStatement}
              onChange={(e) => {
                markDirty();
                setAboutData({ ...aboutData, heroStatement: e.target.value });
              }}
              className="w-full px-3 py-2 text-xs font-sans bg-cream border border-hairline rounded text-ink"
            />
          </div>
          <div>
            <label className="block text-xs font-sans uppercase tracking-wider text-taupe font-medium mb-1">
              Story Paragraph 1
            </label>
            <textarea
              rows={3}
              value={aboutData.storyParagraph1}
              onChange={(e) => {
                markDirty();
                setAboutData({ ...aboutData, storyParagraph1: e.target.value });
              }}
              className="w-full p-2.5 text-xs font-sans bg-cream border border-hairline rounded text-ink resize-none"
            />
          </div>
          <div>
            <label className="block text-xs font-sans uppercase tracking-wider text-taupe font-medium mb-1">
              Story Paragraph 2
            </label>
            <textarea
              rows={3}
              value={aboutData.storyParagraph2}
              onChange={(e) => {
                markDirty();
                setAboutData({ ...aboutData, storyParagraph2: e.target.value });
              }}
              className="w-full p-2.5 text-xs font-sans bg-cream border border-hairline rounded text-ink resize-none"
            />
          </div>
        </div>
      )}

      {/* Tab 4: Product Tabs Defaults */}
      {activeTab === 'tabs' && (
        <div className="bg-paper p-6 rounded-lg border border-hairline space-y-5">
          <h3 className="font-display text-xl font-semibold text-ink">
            Product Detail Page Default Tabs
          </h3>
          <div>
            <label className="block text-xs font-sans uppercase tracking-wider text-taupe font-medium mb-1">
              Care Guide Default Text
            </label>
            <textarea
              rows={3}
              value={productTabs.careGuide}
              onChange={(e) => {
                markDirty();
                setProductTabs({ ...productTabs, careGuide: e.target.value });
              }}
              className="w-full p-2.5 text-xs font-sans bg-cream border border-hairline rounded text-ink resize-none"
            />
          </div>
          <div>
            <label className="block text-xs font-sans uppercase tracking-wider text-taupe font-medium mb-1">
              Shipping &amp; Returns Default Text
            </label>
            <textarea
              rows={3}
              value={productTabs.shippingReturns}
              onChange={(e) => {
                markDirty();
                setProductTabs({ ...productTabs, shippingReturns: e.target.value });
              }}
              className="w-full p-2.5 text-xs font-sans bg-cream border border-hairline rounded text-ink resize-none"
            />
          </div>
          <div>
            <label className="block text-xs font-sans uppercase tracking-wider text-taupe font-medium mb-1">
              Size Guide Default Information
            </label>
            <textarea
              rows={3}
              value={productTabs.sizeGuide}
              onChange={(e) => {
                markDirty();
                setProductTabs({ ...productTabs, sizeGuide: e.target.value });
              }}
              className="w-full p-2.5 text-xs font-sans bg-cream border border-hairline rounded text-ink resize-none"
            />
          </div>
        </div>
      )}
    </div>
  );
}
