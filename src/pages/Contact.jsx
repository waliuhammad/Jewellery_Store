import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, MessageCircle, Send, Check } from 'lucide-react';
import { BRAND } from '../config/brand';
import { useToast } from '../context/ToastContext';

export default function Contact() {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSent(true);
    showToast('Your inquiry has been received by our Lahore studio atelier.', 'success');
  };

  return (
    <div className="pt-24 lg:pt-32 pb-24 bg-ivory min-h-screen">
      <div className="max-w-page mx-auto px-6 lg:px-12">
        <div className="max-w-xl mb-12">
          <span className="text-[11px] uppercase tracking-label text-gold font-medium block mb-1">
            Studio Concierge
          </span>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-forest font-normal">
            Say <span className="italic">hello</span>.
          </h1>
          <p className="text-sm text-moss mt-3 font-light leading-relaxed">
            Have a question about ring sizing, custom bridal sets, or parcel dispatch? Our Lahore studio team responds within a few quiet hours.
          </p>
        </div>

        {/* 2-Column Contact Layout per Design.md Section 5.9 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left: Contact Form (7 cols) */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-10 border border-hairline shadow-soft">
            {isSent ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-leaf/15 text-leaf flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <h3 className="font-display text-2xl text-forest">Message Received</h3>
                <p className="text-xs text-moss max-w-sm mx-auto leading-relaxed">
                  Thank you for reaching out, {formData.name}. Our jewelry concierge will reply to {formData.email} shortly.
                </p>
                <button
                  onClick={() => {
                    setIsSent(false);
                    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
                  }}
                  className="text-xs uppercase tracking-label text-gold underline pt-2 hover:text-forest transition-colors"
                >
                  Send another inquiry &rarr;
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-moss uppercase tracking-label mb-1">Your Name *</label>
                    <input
                      required
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Fatima Raza"
                      className="w-full bg-transparent border-b border-hairline py-2.5 text-forest focus:outline-none focus:border-forest transition-colors text-xs placeholder:text-moss/50"
                    />
                  </div>
                  <div>
                    <label className="block text-moss uppercase tracking-label mb-1">Email Address *</label>
                    <input
                      required
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="fatima@example.com"
                      className="w-full bg-transparent border-b border-hairline py-2.5 text-forest focus:outline-none focus:border-forest transition-colors text-xs placeholder:text-moss/50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-moss uppercase tracking-label mb-1">Mobile / WhatsApp</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="0300 1234567"
                      className="w-full bg-transparent border-b border-hairline py-2.5 text-forest focus:outline-none focus:border-forest transition-colors text-xs placeholder:text-moss/50"
                    />
                  </div>
                  <div>
                    <label className="block text-moss uppercase tracking-label mb-1">Inquiry Subject *</label>
                    <select
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full bg-transparent border-b border-hairline py-2.5 text-forest focus:outline-none focus:border-forest transition-colors text-xs uppercase cursor-pointer"
                    >
                      <option value="">Select a topic</option>
                      <option value="order">Order Tracking &amp; Delivery</option>
                      <option value="sizing">Ring or Bangle Sizing</option>
                      <option value="bridal">Bespoke Bridal / Set Inquiries</option>
                      <option value="exchange">Exchange or Return Request</option>
                      <option value="other">General Feedback</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-moss uppercase tracking-label mb-1">Your Message *</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="How may our atelier assist you today?"
                    className="w-full bg-transparent border-b border-hairline py-2.5 text-forest focus:outline-none focus:border-forest transition-colors text-xs placeholder:text-moss/50 resize-y"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full relative overflow-hidden bg-forest text-ivory py-4 uppercase tracking-label font-medium transition-colors group flex items-center justify-center gap-2"
                >
                  <span className="absolute inset-0 -translate-x-full bg-gold transition-transform duration-300 ease-luxe group-hover:translate-x-0" />
                  <span className="relative flex items-center justify-center gap-2 transition-colors duration-300 group-hover:text-ink">
                    <Send className="w-4 h-4" />
                    <span>Send Dispatch</span>
                  </span>
                </button>
              </form>
            )}
          </div>

          {/* Right: Studio Details Panel (5 cols) on Cream per Design.md Section 5.9 */}
          <div className="lg:col-span-5 bg-cream p-6 sm:p-8 border border-hairline space-y-8">
            <div>
              <span className="text-[11px] uppercase tracking-label text-gold font-medium block mb-1">
                Direct Contact
              </span>
              <h3 className="font-display text-2xl text-forest font-semibold">
                Studio Details
              </h3>
            </div>

            <div className="space-y-5 text-xs text-moss">
              <div className="flex items-start gap-3.5">
                <MapPin className="w-4 h-4 text-gold mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                <div>
                  <span className="font-medium text-forest block">Atelier &amp; Studio</span>
                  <span>{BRAND.contact.address}</span>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <Phone className="w-4 h-4 text-gold mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                <div>
                  <span className="font-medium text-forest block">Telephone</span>
                  <a href={`tel:${BRAND.contact.phone.replace(/\s+/g, '')}`} className="hover:text-forest transition-colors">
                    {BRAND.contact.displayPhone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <Mail className="w-4 h-4 text-gold mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                <div>
                  <span className="font-medium text-forest block">Electronic Mail</span>
                  <a href={`mailto:${BRAND.contact.email}`} className="hover:text-forest transition-colors">
                    {BRAND.contact.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <Clock className="w-4 h-4 text-gold mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                <div>
                  <span className="font-medium text-forest block">Visiting Hours</span>
                  <span>{BRAND.contact.hours}</span>
                </div>
              </div>
            </div>

            {/* WhatsApp Secondary Button with thin line icon */}
            <div className="pt-2">
              <a
                href={`https://wa.me/${BRAND.contact.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full border border-forest py-3.5 text-xs uppercase tracking-label font-medium text-forest hover:bg-forest hover:text-ivory transition-colors flex items-center justify-center gap-2 group"
              >
                <MessageCircle className="w-4 h-4 text-leaf group-hover:text-ivory transition-colors" strokeWidth={1.5} />
                <span>Chat on WhatsApp</span>
              </a>
            </div>

            {/* Studio Location Frame */}
            <div className="pt-4 border-t border-hairline">
              <span className="text-[10px] uppercase tracking-label text-moss block mb-2">
                Lahore Studio Location
              </span>
              <div className="h-44 bg-hairline/60 border border-hairline relative flex items-center justify-center overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=700&auto=format&fit=crop"
                  alt="Studio location map"
                  className="w-full h-full object-cover filter contrast-75 brightness-90 opacity-60"
                />
                <div className="absolute inset-0 bg-cream/50 flex flex-col items-center justify-center text-center p-4">
                  <MapPin className="w-6 h-6 text-forest mb-1" />
                  <span className="font-display text-sm font-semibold text-forest">M.M. Alam Road, Gulberg III</span>
                  <span className="text-[10px] text-moss">Appointments welcomed Mon–Sat</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
