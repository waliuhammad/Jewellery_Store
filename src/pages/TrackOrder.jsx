import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, CheckCircle2, Circle, Clock, Package, Truck, ExternalLink, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { BRAND } from '../config/brand';
import { api } from '../services/api';

export default function TrackOrder() {
  const [searchParams] = useSearchParams();
  const initialId = searchParams.get('id') || '';

  const { orders } = useAuth();
  const [orderIdInput, setOrderIdInput] = useState(initialId);
  const [phoneInput, setPhoneInput] = useState('');
  const [trackedOrder, setTrackedOrder] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (initialId) {
      handleLookup(initialId, '');
    }
  }, [initialId]);

  const handleLookup = async (id, contact) => {
    setIsLoading(true);
    setHasSearched(true);

    // First attempt live backend API
    try {
      const res = await api.trackOrder(id, contact || 'fatima@example.com');
      if (res?.data) {
        setTrackedOrder(res.data);
        setIsLoading(false);
        return;
      }
    } catch {
      // Fallback to local state
    }

    const cleanedId = (id || '').trim().toLowerCase();
    const found = orders.find(
      (o) =>
        o.orderId.toLowerCase() === cleanedId ||
        (contact && o.shippingAddress?.phone?.replace(/\s+/g, '').includes(contact.replace(/\s+/g, '')))
    );
    setTrackedOrder(found || null);
    setIsLoading(false);
  };

  const handleTrackSubmit = (e) => {
    e.preventDefault();
    handleLookup(orderIdInput, phoneInput);
  };

  return (
    <div className="pt-24 lg:pt-32 pb-24 bg-ivory min-h-screen">
      {/* Narrow centered layout (max 520px per Design.md Section 5.5) */}
      <div className="max-w-[520px] mx-auto px-6">
        <div className="text-center mb-10">
          <span className="text-xs uppercase tracking-label text-moss block mb-1">
            Dispatch Status
          </span>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl text-forest font-normal">
            Track Your <span className="italic">Order</span>
          </h1>
          <p className="text-sm text-moss mt-3 font-light">
            Enter your order reference code (e.g. AJ-261108-1042) or mobile number below to see live transit updates.
          </p>
        </div>

        {/* Tracking Lookup Form */}
        <div className="bg-cream p-6 sm:p-8 border border-hairline mb-10">
          <form onSubmit={handleTrackSubmit} className="space-y-4 text-xs font-sans">
            <div>
              <label className="block text-moss uppercase tracking-label mb-1">
                Order ID Reference *
              </label>
              <input
                type="text"
                required
                value={orderIdInput}
                onChange={(e) => setOrderIdInput(e.target.value)}
                placeholder="e.g. AJ-261108-1042"
                className="input-luxe uppercase"
              />
            </div>
            <div>
              <label className="block text-moss uppercase tracking-label mb-1">
                Mobile Number or Email
              </label>
              <input
                type="text"
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
                placeholder="e.g. 0300 1234567 or email"
                className="input-luxe"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full relative overflow-hidden bg-forest text-ivory py-4 uppercase tracking-label font-medium group transition-colors flex items-center justify-center gap-2"
            >
              <span className="absolute inset-0 -translate-x-full bg-gold transition-transform duration-300 ease-luxe group-hover:translate-x-0" />
              <span className="relative z-10 transition-colors duration-300 group-hover:text-ink flex items-center gap-2">
                <Search className="w-4 h-4" />
                <span>{isLoading ? 'Searching Transit Logs...' : 'Track Parcel'}</span>
              </span>
            </button>
          </form>

          {/* Quick Demo Helper */}
          <div className="mt-4 pt-4 border-t border-hairline/60 text-[11px] text-moss text-center">
            <span>Try sample order: </span>
            <button
              type="button"
              onClick={() => {
                setOrderIdInput('AJ-261108-1042');
                handleLookup('AJ-261108-1042', '');
              }}
              className="text-forest underline ml-1 hover:text-emerald"
            >
              AJ-261108-1042 (Shipped)
            </button>
          </div>
        </div>

        {/* Tracking Timeline Result per Design.md Section 5.5 */}
        {hasSearched && trackedOrder ? (
          <div className="bg-ivory p-6 sm:p-8 border border-hairline shadow-soft space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-hairline gap-2">
              <div>
                <span className="text-[10px] uppercase tracking-label text-moss">Order ID</span>
                <h3 className="font-display text-2xl text-forest font-semibold">{trackedOrder.orderId}</h3>
              </div>
              <div className="text-left sm:text-right">
                <span className="text-[10px] uppercase tracking-label text-moss block">Destination</span>
                <span className="text-sm font-medium text-forest font-sans">
                  {trackedOrder.shippingAddress?.city}, Pakistan
                </span>
              </div>
            </div>

            {/* Courier Details */}
            {trackedOrder.courier && (
              <div className="flex items-center justify-between p-4 bg-cream border border-hairline text-xs font-sans">
                <div>
                  <p className="font-medium text-forest">{trackedOrder.courier}</p>
                  <p className="text-moss">Tracking No: {trackedOrder.trackingNumber}</p>
                </div>
                {trackedOrder.trackingUrl && (
                  <a
                    href={trackedOrder.trackingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-forest hover:text-emerald underline font-medium"
                  >
                    <span>Courier Portal</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            )}

            {/* Vertical Timeline: 1px hairline with 12px circles; completed steps filled Forest with a gold ring on current step per Design.md 5.5 */}
            <div className="relative pl-6 space-y-8 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[1px] before:bg-hairline">
              {trackedOrder.timeline?.map((step, idx) => {
                const isCurrent = step.done && (!trackedOrder.timeline[idx + 1] || !trackedOrder.timeline[idx + 1].done);
                return (
                  <div key={idx} className="relative flex items-start gap-4">
                    {/* 12px circle */}
                    <span
                      className={`absolute -left-6 mt-1 w-3 h-3 rounded-full transition-colors ${
                        step.done
                          ? isCurrent
                            ? 'bg-forest ring-2 ring-gold ring-offset-2 ring-offset-ivory'
                            : 'bg-forest'
                          : 'bg-cream border border-hairline'
                      }`}
                    />
                    <div>
                      <h4
                        className={`text-sm font-medium ${
                          step.done ? 'text-forest' : 'text-moss/60'
                        }`}
                      >
                        {step.label}
                      </h4>
                      <p className="text-xs text-moss mt-0.5 font-sans">{step.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Parcel Contents */}
            <div className="pt-6 border-t border-hairline">
              <span className="text-xs uppercase tracking-label text-moss block mb-3">
                Parcel Contents
              </span>
              <div className="space-y-3 font-sans">
                {trackedOrder.items?.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs">
                    <span className="text-forest font-medium">{item.name} &times; {item.quantity}</span>
                    <span className="text-moss">{BRAND.currency.format(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : hasSearched && !trackedOrder && !isLoading ? (
          <div className="text-center p-10 bg-ivory border border-dashed border-hairline">
            <AlertCircle className="w-8 h-8 text-moss mx-auto mb-3" />
            <p className="font-display text-2xl text-forest mb-1">No matching order found</p>
            <p className="text-xs text-moss max-w-sm mx-auto mb-6 font-light">
              Please double-check your Order Reference ID. If you placed the order recently, it may take a few moments to sync across courier dispatch servers.
            </p>
            <a
              href={`https://wa.me/${BRAND.contact.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs uppercase tracking-label text-forest underline underline-offset-4 hover:text-emerald"
            >
              Contact Client Concierge on WhatsApp &rarr;
            </a>
          </div>
        ) : null}
      </div>
    </div>
  );
}
