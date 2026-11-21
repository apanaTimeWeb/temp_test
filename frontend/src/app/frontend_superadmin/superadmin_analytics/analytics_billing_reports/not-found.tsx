// not-found.tsx
// RESPONSIBILITY: 404 handler for Superadmin Billing Reports route segments.

import React from 'react';
import Link from 'next/link';
import { Receipt, ArrowLeft } from 'lucide-react';
import { SUPERADMIN_NAVIGATION_ROUTES } from '@/app/frontend_superadmin/superadmin_navigation/navigation_shell/config/superadmin_navigation_routes';

export default function SuperadminAnalyticsBillingReportsNotFound() {
  return (
    <div className="p-12 text-center rounded-2xl border border-border bg-card/60 flex flex-col items-center justify-center space-y-4">
      <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center">
        <Receipt size={24} aria-hidden="true" />
      </div>
      <div>
        <h2 className="text-lg font-bold text-foreground">Billing Report Not Found</h2>
        <p className="mt-1 text-xs text-muted-foreground">The requested financial report segment does not exist.</p>
      </div>
      <Link
        href={SUPERADMIN_NAVIGATION_ROUTES.analytics_billing_reports}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-amber-500 text-white hover:bg-amber-600 transition-all cursor-pointer"
      >
        <ArrowLeft size={14} />
        <span>Return to Billing Reports</span>
      </Link>
    </div>
  );
}
