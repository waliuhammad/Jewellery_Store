/**
 * PageHeader — reusable admin page heading.
 *
 * Usage:
 *   <PageHeader
 *     title="Orders"       ← rendered in gold
 *     subtitle="Process and track customer orders"
 *     action={<button>+ New</button>}
 *   />
 *
 * "Store" word is always shown in ink; `title` is the gold accent word.
 */
import React from 'react';

export default function PageHeader({ title = '', subtitle = '', action }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
      {/* Left: heading + subtitle */}
      <div>
        <h1 className="font-display font-semibold text-[32px] lg:text-[44px] leading-tight text-ink">
          Store{' '}
          <span className="text-gold">{title}</span>
        </h1>
        {subtitle && (
          <p className="font-display italic text-[18px] text-taupe mt-1">
            {subtitle}
          </p>
        )}
      </div>

      {/* Right: optional action slot */}
      {action && (
        <div className="flex-shrink-0 self-start sm:self-center">
          {action}
        </div>
      )}
    </div>
  );
}
