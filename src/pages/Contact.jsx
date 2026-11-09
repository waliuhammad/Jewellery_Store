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
    showToast('Your message has been received by our studio team.', 'success');
  };

  return (
    <div className="pt-24 lg:pt-32 pb-24 bg-ivory min-h-screen">
      <div className="max-w-page mx-auto px-6 lg:px-12">
        <div className="max-w-xl mb-12">
          <span className="text-xs uppercase tracking-label text-taupe block mb-1">
            Studio Concierge
          </span>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-ink font-normal">
            Say <span className="italic">hello</span>.
          </h1>
          <p className="text-sm text-taupe mt-3 font-light leading-relaxed">
            Have a question about ring sizing, custom bridal sets, or parcel dispatch? Our Lahore studio team responds within a few quiet hours.
          </p>
        </div>

        {/* 2-Column Contact Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left: Contact Form (7 cols) */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-10 border border-hairline shadow-soft">
            {isSent ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-sage/20 text-sage flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <h3 className="font-display text-2xl text-ink">Message Received</h3>
                <p className="text-xs text-taupe max-w-sm mx-auto leading-relaxed">
                  Thank you for reaching out, {formData.name}. Our jewelry concierge will reply to {formData.email} shortly.
                </p>
                <button
                  onClick={() => {
                    setIsSent(false);
                    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
                  }}
                  className="text-xs uppercase tracking-label text-gold underline pt-2"
                >
                  Send another inquiry &rarr;
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-taupe uppercase tracking-label mb-1">Your Name *</label>
                    <input
                      required
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Fatima Raza"
                      className="input-luxe"
                    />
                  </div>
                  <div>
                    <label className="block text-taupe uppercase tracking-label mb-1">Email Address *</label>
                    <input
                      required
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="fatima@example.com"
                      className="input-luxe"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-taupe uppercase tracking-label mb-1">Mobile / WhatsApp</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="0300 1234567"
                      className="input-luxe"
                    />
                  </div>
                  <div>
                    <label className="block text-taupe uppercase tracking-label mb-1">Inquiry Subject *</label>
                    <select
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="input-luxe uppercase cursor-pointer"
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
                  <label className="block text-taupe uppercase tracking-label mb-1">Your Message *</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="How may our atelier assist you today?"
                    className="input-luxe"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full relative overflow-hidden bg-ink text-ivory py-4 uppercase tracking-label font-medium hover:bg-gold hover:text-ink transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Dispatch</span>
                </button>
              </form>
            )}
          </div>

          {/* Right: Studio Details Panel (5 cols) */}
          <div className="lg:col-span-5 bg-cream p-6 sm:p-8 border border-hairline space-y-8">
            <div>
              <span className="text-[11px] uppercase tracking-label text-gold font-medium block mb-1">
                Direct Contact
              </span>
              <h3 className="font-display text-2xl text-ink font-semibold">
                Studio Details
              </h3>
            </div>

            <div className="space-y-5 text-xs text-taupe">
              <div className="flex items-start gap-3.5">
                <MapPin className="w-4 h-4 text-gold mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                <div>
                  <span className="font-medium text-ink block">Atelier &amp; Office</span>
                  <span>{BRAND.contact.address}</span>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <Phone className="w-4 h-4 text-gold mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                <div>
                  <span className="font-medium text-ink block">Telephone</span>
                  <a href={`tel:${BRAND.contact.phone.replace(/\s+/g, '')}`} className="hover:text-ink">
                    {BRAND.contact.displayPhone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <Mail className="w-4 h-4 text-gold mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                <div>
                  <span className="font-medium text-ink block">Electronic Mail</span>
                  <a href={`mailto:${BRAND.contact.email}`} className="hover:text-ink">
                    {BRAND.contact.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <Clock className="w-4 h-4 text-gold mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                <div>
                  <span className="font-medium text-ink block">Visiting Hours</span>
                  <span>{BRAND.contact.hours}</span>
                </div>
              </div>
            </div>

            {/* Instant WhatsApp Button */}
            <div className="pt-2">
              <a
                href={`https://wa.me/${BRAND.contact.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full border border-ink py-3.5 text-xs uppercase tracking-label font-medium text-ink hover:bg-blush transition-colors flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4 text-sage" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>

            {/* Privacy-friendly Map Mock */}
            <div className="pt-4 border-t border-hairline">
              <span className="text-[10px] uppercase tracking-label text-taupe block mb-2">
                Lahore Studio Location
              </span>
              <div className="h-44 bg-hairline/60 border border-hairline relative flex items-center justify-center overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=700&auto=format&fit=crop"
                  alt="Studio location map"
                  className="w-full h-full object-cover filter contrast-75 brightness-90 opacity-60"
                />
                <div className="absolute inset-0 bg-cream/40 flex flex-col items-center justify-center text-center p-4">
                  <MapPin className="w-6 h-6 text-ink mb-1" />
                  <span className="font-display text-sm font-semibold text-ink">M.M. Alam Road, Gulberg III</span>
                  <span className="text-[10px] text-taupe">Appointments welcomed Mon–Sat</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

