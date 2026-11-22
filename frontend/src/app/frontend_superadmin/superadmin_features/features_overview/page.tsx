// RESPONSIBILITY: Server entry page for SuperAdmin Feature & Module Governance.
import { Suspense } from 'react';
import SuperadminFeaturesOverviewPageClient from '@/app/frontend_superadmin/superadmin_features/features_overview/components/SuperadminFeaturesOverviewPageClient';
import SuperadminFeaturesOverviewListSkeleton from '@/app/frontend_superadmin/superadmin_features/features_overview/components/SuperadminFeaturesOverviewListSkeleton';

export const metadata = {
  title: '07. Feature & Module Control | SuperAdmin Platform',
  description: 'Multi-tenant 3-tier module governance with backend API Guard denial enforcement.',
};

export default function SuperadminFeaturesOverviewPage() {
  return (
    <div
      className="min-w-0 space-y-6"
      data-feature-module="superadmin_features"
      data-feature-route="features_overview"
    >
      <Suspense fallback={<SuperadminFeaturesOverviewListSkeleton />}>
        <SuperadminFeaturesOverviewPageClient />
      </Suspense>
    </div>
  );
}
