import { Suspense } from 'react';
import SuperadminIntegrationsOverviewScreen from './components/SuperadminIntegrationsOverviewScreen';

export default function SuperadminIntegrationsOverviewPage() {
  return (
    <div className="min-w-0" data-feature-module="superadmin_integrations" data-feature-route="integrations_overview">
      <Suspense fallback={<div className="rounded-xl border border-border bg-card p-6 text-neutral-400">Loading integrations hub...</div>}>
        <SuperadminIntegrationsOverviewScreen />
      </Suspense>
    </div>
  );
}
