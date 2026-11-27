import { Suspense } from 'react';
import SuperadminUsageOverviewScreen from '@/app/frontend_superadmin/superadmin_usage/usage_overview/components/SuperadminUsageOverviewScreen';

export default function SuperadminUsageOverviewPage() {
  return (
    <div className="min-w-0" data-feature-module="superadmin_usage" data-feature-route="usage_overview">
      <Suspense fallback={<div className="rounded-xl border border-border bg-card p-6 text-neutral-400">Loading usage metrics...</div>}>
        <SuperadminUsageOverviewScreen />
      </Suspense>
    </div>
  );
}
