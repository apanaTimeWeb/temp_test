import { Suspense } from 'react';
import SuperadminFeaturesOverviewScreen from './components/SuperadminFeaturesOverviewScreen';

export default function SuperadminFeaturesOverviewPage() {
  return (
    <div className="min-w-0" data-feature-module="superadmin_features" data-feature-route="features_overview">
      <Suspense fallback={<div className="rounded-xl border border-border bg-card p-6 text-neutral-400">Loading feature controls...</div>}>
        <SuperadminFeaturesOverviewScreen />
      </Suspense>
    </div>
  );
}
