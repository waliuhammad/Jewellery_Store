/**
 * NoAccess — shown when a staff member navigates to a page
 * their role does not have permission to view.
 */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, ArrowLeft } from 'lucide-react';

export default function NoAccess() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      {/* Shield icon in cream circle */}
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
        style={{ backgroundColor: 'var(--color-cream, #F5EDE2)' }}
      >
        <Shield size={36} className="text-taupe" strokeWidth={1.5} />
      </div>

      {/* Heading */}
      <h1 className="font-display text-[32px] lg:text-[40px] font-semibold text-ink mb-3 leading-tight">
        Access Restricted
      </h1>

      {/* Message */}
      <p className="font-sans text-taupe text-base max-w-sm mb-8 leading-relaxed">
        You do not have permission to view this page. If you believe this is a
        mistake, please contact your administrator.
      </p>

      {/* Back button */}
      <button
        onClick={() => navigate('/admin')}
        className="inline-flex items-center gap-2 h-11 px-6 rounded-md bg-ink text-ivory font-sans font-medium text-sm transition-colors hover:bg-gold hover:text-ink focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2"
      >
        <ArrowLeft size={15} />
        Back to Overview
      </button>
    </div>
  );
}
