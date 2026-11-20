import { Suspense } from 'react';
import SuperadminDataOverviewScreen from './components/SuperadminDataOverviewScreen';

export default function SuperadminDataOverviewPage() {
  return (
    <div className="min-w-0" data-feature-module="superadmin_data" data-feature-route="data_overview">
      <Suspense fallback={<div className="rounded-xl border border-border bg-card p-6 text-neutral-400">Loading data & backup tools...</div>}>
        <SuperadminDataOverviewScreen />
      </Suspense>
    </div>
  );
}
