// data_overview/page.tsx
// Route entry for Superadmin Data Overview sub-module

import { Suspense } from 'react';
import { SuperadminDataOverviewMain } from '@/app/frontend_superadmin/superadmin_data/data_overview/components/SuperadminDataOverviewMain';
import { SuperadminDataOverviewSkeleton } from '@/app/frontend_superadmin/superadmin_data/data_overview/components/SuperadminDataOverviewSkeleton';

export const metadata = {
  title: 'Disaster Recovery & Data Overview | Superadmin',
  description: 'Live RPO/RTO monitoring, automated backup verification, and multi-tenant disaster recovery cockpit',
};

export default function SuperadminDataOverviewPage() {
  return (
    <div className="min-w-0" data-feature-module="superadmin_data" data-feature-submodule="data_overview">
      <Suspense fallback={<SuperadminDataOverviewSkeleton />}>
        <SuperadminDataOverviewMain />
      </Suspense>
    </div>
  );
}
