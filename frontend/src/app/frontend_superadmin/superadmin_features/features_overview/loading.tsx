'use client';

// RESPONSIBILITY: Render the route loading state for superadmin_features/features_overview; it does not fetch or mutate business data.
// FLOW: App Router pending state -> loading.tsx -> loading UI -> route content when ready.
import { SuperadminPageLoader } from '@/components/ui/loader/SuperadminLoader';
/** Framework loading boundary delegates to the feature-local skeleton component. */
import SuperadminFeaturesOverviewListSkeleton from '@/app/frontend_superadmin/superadmin_features/features_overview/components/SuperadminFeaturesOverviewListSkeleton';

export default function ModuleLoading() {
  return (
    <SuperadminPageLoader
      size="md"
      icon="layers"
      variant="contra"
      label="Loading Feature Flags Overview..."
    />
  );
}
