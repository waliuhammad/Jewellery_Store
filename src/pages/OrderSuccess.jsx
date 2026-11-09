import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Package, Clock, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { BRAND } from '../config/brand';

export default function OrderSuccess() {
  const { orderId } = useParams();
  const { orders } = useAuth();

  const order = orders.find((o) => o.orderId === orderId) || orders[0];

  return (
    <div className="pt-32 pb-24 bg-ivory min-h-screen flex items-center justify-center">
      <div className="max-w-xl mx-auto px-6 text-center">
        {/* Animated Drawing Gold Checkmark SVG */}
        <div className="w-20 h-20 mx-auto mb-8 relative flex items-center justify-center">
          <svg className="w-20 h-20" viewBox="0 0 80 80">
            <circle
              cx="40"
              cy="40"
              r="36"
              fill="none"
              stroke="#E4D9CB"
              strokeWidth="1.5"
            />
            <motion.circle
              cx="40"
              cy="40"
              r="36"
              fill="none"
              stroke="#B8924A"
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            />
            <motion.path
              d="M24 40 L35 51 L56 30"
              fill="none"
              stroke="#B8924A"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            />
          </svg>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <span className="text-xs uppercase tracking-label text-gold font-medium block mb-2">
            Order Confirmed
          </span>
          <h1 className="font-display text-4xl sm:text-5xl text-ink font-normal mb-4">
            Thank you. Your piece is being <span className="italic">wrapped with care</span>.
          </h1>
          <p className="text-sm text-taupe max-w-md mx-auto mb-8 font-light leading-relaxed">
            We have received your order. A confirmation receipt has been sent to your email, and our artisans will inspect, polish, and package your jewelry today.
          </p>

          {/* Order Reference Box */}
          <div className="bg-cream border border-hairline p-6 mb-8 text-left space-y-3">
            <div className="flex justify-between items-center pb-3 border-b border-hairline">
              <span className="text-xs uppercase tracking-label text-taupe">Order Reference</span>
              <span className="font-sans font-semibold text-ink tracking-wider">{orderId}</span>
            </div>
            {order && (
              <>
                <div className="flex justify-between items-center text-xs text-taupe">
                  <span>Payment Method:</span>
                  <span className="text-ink font-medium">{order.paymentMethod}</span>
                </div>
                <div className="flex justify-between items-center text-xs text-taupe">
                  <span>Shipping Address:</span>
                  <span className="text-ink font-medium">{order.shippingAddress?.city}, Pakistan</span>
                </div>
                <div className="flex justify-between items-center text-xs text-taupe">
                  <span>Estimated Arrival:</span>
                  <span className="text-sage font-medium">2 - 3 business days</span>
                </div>
              </>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to={`/track-order?id=${orderId}`}
              className="w-full sm:w-auto relative overflow-hidden bg-ink text-ivory px-8 py-4 text-xs uppercase tracking-label font-medium group text-center"
            >
              <span className="absolute inset-0 -translate-x-full bg-gold transition-transform duration-300 ease-luxe group-hover:translate-x-0" />
              <span className="relative transition-colors duration-300 group-hover:text-ink">
                Track Live Order &rarr;
              </span>
            </Link>

            <Link
              to="/shop"
              className="w-full sm:w-auto border border-hairline px-8 py-4 text-xs uppercase tracking-label font-medium text-ink hover:bg-cream transition-colors text-center"
            >
              Continue Browsing
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

