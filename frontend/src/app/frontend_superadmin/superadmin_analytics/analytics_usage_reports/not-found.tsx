// not-found.tsx
// RESPONSIBILITY: 404 handler for Superadmin Usage Reports route segments.

import React from 'react';
import Link from 'next/link';
import { Gauge, ArrowLeft } from 'lucide-react';
import { SUPERADMIN_NAVIGATION_ROUTES } from '@/app/frontend_superadmin/superadmin_navigation/navigation_shell/config/superadmin_navigation_routes';

export default function SuperadminAnalyticsUsageReportsNotFound() {
  return (
    <div className="p-12 text-center rounded-2xl border border-border bg-card/60 flex flex-col items-center justify-center space-y-4">
      <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
        <Gauge size={24} aria-hidden="true" />
      </div>
      <div>
        <h2 className="text-lg font-bold text-foreground">Usage Report Not Found</h2>
        <p className="mt-1 text-xs text-muted-foreground">The requested usage report segment does not exist.</p>
      </div>
      <Link
        href={SUPERADMIN_NAVIGATION_ROUTES.analytics_usage_reports}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-500 text-white hover:bg-emerald-600 motion-safe:transition-all cursor-pointer"
      >
        <ArrowLeft size={14} />
        <span>Return to Usage Reports</span>
      </Link>
    </div>
  );
}
