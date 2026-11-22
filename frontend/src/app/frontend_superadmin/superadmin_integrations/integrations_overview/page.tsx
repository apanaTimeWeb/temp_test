// src/app/frontend_superadmin/superadmin_integrations/integrations_overview/page.tsx
// RESPONSIBILITY: Route entry file for integrations_overview submodule.
// DATA FLOW: Next.js App Router -> page.tsx -> SuperadminIntegrationsOverviewScreen.
import { Suspense } from 'react';
import { SuperadminIntegrationsOverviewListSkeleton } from './components/SuperadminIntegrationsOverviewListSkeleton';
import SuperadminIntegrationsOverviewScreen from './components/SuperadminIntegrationsOverviewScreen';

export default function SuperadminIntegrationsOverviewPage() {
  return (
    <div className="min-w-0" data-feature-module="superadmin_integrations" data-feature-route="integrations_overview">
      <Suspense fallback={<SuperadminIntegrationsOverviewListSkeleton />}>
        <SuperadminIntegrationsOverviewScreen />
      </Suspense>
    </div>
  );
}
