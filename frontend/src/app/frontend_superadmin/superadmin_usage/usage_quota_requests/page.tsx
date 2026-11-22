import { Suspense } from 'react';
import { SuperadminUsageQuotaRequestsMain } from './components/SuperadminUsageQuotaRequestsMain';

export default function SuperadminUsageQuotaRequestsPage() {
  return (
    <div
      className="min-w-0"
      data-feature-module="superadmin_usage"
      data-feature-route="usage_quota_requests"
    >
      <Suspense
        fallback={
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 text-xs text-slate-400">
            Loading quota upgrade requests...
          </div>
        }
      >
        <SuperadminUsageQuotaRequestsMain />
      </Suspense>
    </div>
  );
}
