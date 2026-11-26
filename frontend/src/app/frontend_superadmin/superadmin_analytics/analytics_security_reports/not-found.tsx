// not-found.tsx
// RESPONSIBILITY: 404 state for unmatched routes within Superadmin Security Reports.

import React from 'react';
import Link from 'next/link';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export default function SuperadminAnalyticsSecurityReportsNotFound() {
  return (
    <div className="p-8 sm:p-12 text-center rounded-2xl border border-border bg-card space-y-4 max-w-lg mx-auto mt-12">
      <div className="w-12 h-12 mx-auto rounded-2xl bg-input text-secondary flex items-center justify-center border border-border">
        <ShieldAlert size={24} />
      </div>
      <h2 className="text-base font-bold text-primary">Security Report Not Found</h2>
      <p className="text-xs text-secondary leading-relaxed">
        The requested security report slice or configuration could not be located on the platform.
      </p>
      <Link
        href="/superadmin/superadmin_analytics/analytics_security_reports"
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-primary text-on-primary hover:bg-primary-hover motion-safe:transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <ArrowLeft size={14} />
        <span>Return to Security Reports</span>
      </Link>
    </div>
  );
}
