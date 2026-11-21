import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ChevronDown, MessageCircle, ArrowRight } from 'lucide-react';
import { FAQS, FAQ_CATEGORIES } from '../data/faqs';
import { BRAND } from '../config/brand';

export default function FAQs() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [openQuestion, setOpenQuestion] = useState(FAQS[0]?.question || '');

  const filteredFaqs = FAQS.filter((faq) => {
    if (selectedCategory !== 'all' && faq.category !== selectedCategory) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        faq.question.toLowerCase().includes(q) ||
        faq.answer.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const toggleFaq = (question) => {
    setOpenQuestion(openQuestion === question ? '' : question);
  };

  return (
    <div className="pt-24 lg:pt-32 pb-24 bg-ivory min-h-screen">
      <div className="max-w-page mx-auto px-6 lg:px-12">
        <div className="max-w-2xl mb-12">
          <span className="text-[11px] uppercase tracking-label text-gold font-medium block mb-1">
            Assistance &amp; Clarity
          </span>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-forest font-normal">
            Frequently Asked <span className="italic">Questions</span>
          </h1>
          <p className="text-sm text-moss mt-3 font-light leading-relaxed">
            Everything you need to know regarding delivery timelines, Cash on Delivery, anti-tarnish plating care, and our 7-day exchange promise.
          </p>

          {/* Underline Style Search Field per Design.md Section 5.10 */}
          <div className="mt-8 relative max-w-md">
            <Search className="w-4 h-4 text-moss absolute left-0 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by keyword (e.g. COD, tarnish, ring size)..."
              className="w-full bg-transparent border-b border-hairline py-3 pl-8 pr-4 text-forest placeholder:text-moss/60 focus:outline-none focus:border-forest transition-colors text-xs"
            />
          </div>
        </div>

        {/* 2-Column FAQ Layout per Design.md Section 5.10 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left: Sticky Category Topic List (4 cols) */}
          <aside className="lg:col-span-4 space-y-1 text-xs uppercase tracking-label lg:sticky lg:top-28">
            <h3 className="text-moss mb-3 pb-2 border-b border-hairline font-medium text-[11px]">
              Filter by Topic
            </h3>
            <button
              onClick={() => setSelectedCategory('all')}
              className={`w-full text-left p-3 transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-cream text-forest font-semibold border-l-2 border-gold shadow-xs'
                  : 'text-moss hover:text-forest'
              }`}
            >
              All Inquiries ({FAQS.length})
            </button>
            {FAQ_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`w-full text-left p-3 transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-cream text-forest font-semibold border-l-2 border-gold shadow-xs'
                    : 'text-moss hover:text-forest'
                }`}
              >
                {cat.name}
              </button>
            ))}

            {/* Direct WhatsApp Concierge Card */}
            <div className="pt-8">
              <div className="p-5 bg-cream border border-hairline space-y-3">
                <span className="text-[10px] uppercase tracking-label text-gold font-medium block">
                  Still have questions?
                </span>
                <p className="font-display text-lg text-forest font-semibold leading-snug">
                  Speak directly with our Lahore jewelry concierge.
                </p>
                <div className="space-y-2 pt-1">
                  <a
                    href={`https://wa.me/${BRAND.contact.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-xs uppercase tracking-label text-forest hover:text-emerald font-medium transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-leaf" /> WhatsApp Concierge &rarr;
                  </a>
                  <Link
                    to="/track-order"
                    className="flex items-center gap-2 text-xs uppercase tracking-label text-moss hover:text-forest transition-colors"
                  >
                    <span>Track existing order &rarr;</span>
                  </Link>
                  <Link
                    to="/privacy-policy"
                    className="flex items-center gap-2 text-xs uppercase tracking-label text-moss hover:text-forest transition-colors"
                  >
                    <span>Read return policy &rarr;</span>
                  </Link>
                </div>
              </div>
            </div>
          </aside>

          {/* Right: Expandable Accordions (8 cols) */}
          <main className="lg:col-span-8 divide-y divide-hairline border-y border-hairline">
            {filteredFaqs.length === 0 ? (
              <div className="py-12 text-center text-xs text-moss">
                No questions found matching "{searchQuery}". Please{' '}
                <Link to="/contact" className="text-gold underline hover:text-forest">
                  contact our atelier
                </Link>{' '}
                directly.
              </div>
            ) : (
              filteredFaqs.map((faq, idx) => {
                const isOpen = openQuestion === faq.question;
                return (
                  <div key={idx} className="py-5">
                    <button
                      onClick={() => toggleFaq(faq.question)}
                      className="w-full flex items-center justify-between text-left group"
                    >
                      <h3 className="font-display text-lg sm:text-xl text-forest font-medium group-hover:text-emerald transition-colors pr-4">
                        {faq.question}
                      </h3>
                      <ChevronDown
                        className={`w-4 h-4 text-moss flex-shrink-0 transition-transform duration-300 ${
                          isOpen ? 'rotate-180 text-gold' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="mt-3 text-xs sm:text-sm text-moss font-light leading-relaxed pr-8 space-y-2">
                        <p>{faq.answer}</p>
                        {faq.category === 'shipping' && (
                          <div className="pt-2 flex items-center gap-4 text-xs font-sans">
                            <Link to="/track-order" className="text-gold hover:text-forest underline">
                              Track your parcel &rarr;
                            </Link>
                            <Link to="/terms" className="text-moss hover:text-forest underline">
                              Shipping terms &rarr;
                            </Link>
                          </div>
                        )}
                        {faq.category === 'returns' && (
                          <div className="pt-2 flex items-center gap-4 text-xs font-sans">
                            <Link to="/terms" className="text-gold hover:text-forest underline">
                              7-day return guidelines &rarr;
                            </Link>
                            <Link to="/contact" className="text-moss hover:text-forest underline">
                              Request an exchange &rarr;
                            </Link>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
