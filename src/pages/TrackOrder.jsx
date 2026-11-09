import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, CheckCircle2, Circle, Clock, Package, Truck, ExternalLink, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { BRAND } from '../config/brand';

export default function TrackOrder() {
  const [searchParams] = useSearchParams();
  const initialId = searchParams.get('id') || '';

  const { orders } = useAuth();
  const [orderIdInput, setOrderIdInput] = useState(initialId);
  const [phoneInput, setPhoneInput] = useState('');
  const [trackedOrder, setTrackedOrder] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (initialId) {
      const found = orders.find((o) => o.orderId.toLowerCase() === initialId.toLowerCase());
      if (found) {
        setTrackedOrder(found);
        setHasSearched(true);
      }
    }
  }, [initialId, orders]);

  const handleTrackSubmit = (e) => {
    e.preventDefault();
    setHasSearched(true);
    const cleanedId = orderIdInput.trim().toLowerCase();
    const found = orders.find(
      (o) =>
        o.orderId.toLowerCase() === cleanedId ||
        (phoneInput && o.shippingAddress?.phone?.replace(/\s+/g, '').includes(phoneInput.replace(/\s+/g, '')))
    );
    setTrackedOrder(found || null);
  };

  return (
    <div className="pt-24 lg:pt-32 pb-24 bg-ivory min-h-screen">
      <div className="max-w-2xl mx-auto px-6">
        <div className="text-center mb-10">
          <span className="text-xs uppercase tracking-label text-taupe block mb-1">
            Dispatch Status
          </span>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl text-ink font-normal">
            Track Your <span className="italic">Order</span>
          </h1>
          <p className="text-sm text-taupe mt-3 font-light max-w-md mx-auto">
            Enter your order reference code (e.g. AJ-261108-1042) or mobile number below to see live transit updates.
          </p>
        </div>

        {/* Tracking Lookup Form */}
        <div className="bg-cream p-6 sm:p-8 border border-hairline mb-10">
          <form onSubmit={handleTrackSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-taupe uppercase tracking-label mb-1">
                Order ID Reference
              </label>
              <input
                type="text"
                value={orderIdInput}
                onChange={(e) => setOrderIdInput(e.target.value)}
                placeholder="e.g. AJ-261108-1042"
                className="input-luxe uppercase"
              />
            </div>
            <div>
              <label className="block text-taupe uppercase tracking-label mb-1">
                Mobile Number (optional)
              </label>
              <input
                type="tel"
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
                placeholder="e.g. 0300 8472910"
                className="input-luxe"
              />
            </div>
            <button
              type="submit"
              className="w-full relative overflow-hidden bg-ink text-ivory py-4 uppercase tracking-label font-medium hover:bg-gold hover:text-ink transition-colors flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>Track Parcel</span>
            </button>
          </form>

          {/* Quick Demo Helper */}
          <div className="mt-4 pt-4 border-t border-hairline/60 text-[11px] text-taupe text-center">
            <span>Try sample order: </span>
            <button
              type="button"
              onClick={() => {
                setOrderIdInput('AJ-261108-1042');
                const sample = orders.find((o) => o.orderId === 'AJ-261108-1042');
                setTrackedOrder(sample);
                setHasSearched(true);
              }}
              className="text-gold underline ml-1"
            >
              AJ-261108-1042 (Shipped)
            </button>
          </div>
        </div>

        {/* Tracking Timeline Result */}
        {hasSearched && trackedOrder ? (
          <div className="bg-white p-6 sm:p-8 border border-hairline shadow-soft space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-hairline gap-2">
              <div>
                <span className="text-[10px] uppercase tracking-label text-taupe">Order ID</span>
                <h3 className="font-display text-2xl text-ink font-semibold">{trackedOrder.orderId}</h3>
              </div>
              <div className="text-left sm:text-right">
                <span className="text-[10px] uppercase tracking-label text-taupe block">Destination</span>
                <span className="text-sm font-medium text-ink">
                  {trackedOrder.shippingAddress?.city}, Pakistan
                </span>
              </div>
            </div>

            {/* Courier Details */}
            {trackedOrder.courier && (
              <div className="flex items-center justify-between p-4 bg-cream border border-hairline text-xs">
                <div>
                  <p className="font-medium text-ink">{trackedOrder.courier}</p>
                  <p className="text-taupe">Tracking No: {trackedOrder.trackingNumber}</p>
                </div>
                {trackedOrder.trackingUrl && (
                  <a
                    href={trackedOrder.trackingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-gold hover:underline font-medium"
                  >
                    <span>Courier Portal</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            )}

            {/* Vertical Timeline */}
            <div className="relative pl-6 space-y-8 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-[1.5px] before:bg-hairline">
              {trackedOrder.timeline?.map((step, idx) => (
                <div key={idx} className="relative flex items-start gap-4">
                  {/* Timeline circle node */}
                  <span
                    className={`absolute -left-6 mt-1 w-3.5 h-3.5 rounded-full border-2 transition-colors ${
                      step.done
                        ? 'bg-ink border-gold'
                        : 'bg-ivory border-hairline'
                    }`}
                  />
                  <div>
                    <h4
                      className={`text-sm font-medium ${
                        step.done ? 'text-ink' : 'text-taupe/60'
                      }`}
                    >
                      {step.label}
                    </h4>
                    <p className="text-xs text-taupe mt-0.5">{step.time}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Item summary */}
            <div className="pt-6 border-t border-hairline">
              <span className="text-xs uppercase tracking-label text-taupe block mb-3">
                Parcel Contents
              </span>
              <div className="space-y-3">
                {trackedOrder.items?.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs">
                    <span className="text-ink font-medium">{item.name} &times; {item.quantity}</span>
                    <span className="text-taupe">{BRAND.currency.format(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : hasSearched && !trackedOrder ? (
          <div className="text-center p-10 bg-white border border-dashed border-hairline">
            <AlertCircle className="w-8 h-8 text-taupe mx-auto mb-3" />
            <p className="font-display text-2xl text-ink mb-1">No matching order found</p>
            <p className="text-xs text-taupe max-w-sm mx-auto mb-6">
              Please double-check your Order Reference ID. If you placed the order recently, it may take up to 30 minutes to appear in tracking.
            </p>
            <a
              href={`https://wa.me/${BRAND.contact.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs uppercase tracking-label text-gold underline underline-offset-4"
            >
              Contact Client Support on WhatsApp &rarr;
            </a>
          </div>
        ) : null}
      </div>
    </div>
  );
}

